import { Router } from 'express';
import { z } from 'zod';
import { eq, and, gte, lte, desc, sum } from 'drizzle-orm';
import { db } from './db';
import { bookings, properties, propertyShares, users, hktStats } from '@shared/schema';
import { requireAuth, type AuthenticatedRequest } from './auth';
import Stripe from 'stripe';

const router = Router();

// Initialize Stripe (use test key for development)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51...', {
  apiVersion: '2024-06-20' as any,
});

// Validation schemas
const createBookingSchema = z.object({
  propertyId: z.string(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  currency: z.enum(['USD', 'HKT']),
  guests: z.number().min(1),
});

const cancelBookingSchema = z.object({
  bookingId: z.number(),
});

// Get available properties
router.get('/properties', async (req, res) => {
  try {
    const availableProperties = await db.select().from(properties).where(eq(properties.isActive, true));
    res.json(availableProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

// Get property details
router.get('/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Failed to fetch property' });
  }
});

// Check user property shares
router.get('/user-shares/:propertyId', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user!.id;
    
    const [shareRecord] = await db
      .select({ totalShares: sum(propertyShares.sharesOwned) })
      .from(propertyShares)
      .where(and(
        eq(propertyShares.userId, userId),
        eq(propertyShares.propertyId, propertyId)
      ));
    
    const totalShares = shareRecord?.totalShares || 0;
    const hasShares = Number(totalShares) > 0;
    
    res.json({ hasShares, totalShares: Number(totalShares) });
  } catch (error) {
    console.error('Error checking user shares:', error);
    res.status(500).json({ message: 'Failed to check property shares' });
  }
});

// Calculate booking price
router.post('/calculate-price', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { propertyId, checkIn, checkOut, currency } = createBookingSchema.parse(req.body);
    
    // Get property details
    const [property] = await db.select().from(properties).where(eq(properties.id, propertyId));
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Calculate nights (minimum 7)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights < 7) {
      return res.status(400).json({ message: 'Minimum 7-night stay required' });
    }
    
    // Check if user has property shares
    const userId = req.user!.id;
    const [shareRecord] = await db
      .select({ totalShares: sum(propertyShares.sharesOwned) })
      .from(propertyShares)
      .where(and(
        eq(propertyShares.userId, userId),
        eq(propertyShares.propertyId, propertyId)
      ));
    
    const hasShares = Number(shareRecord?.totalShares || 0) > 0;
    const isFreeWeek = hasShares && nights >= 7;
    
    // Calculate pricing
    const pricePerNight = Number(property.pricePerNight);
    const cleaningFee = 90; // Fixed $90 cleaning fee
    
    let totalNights = nights;
    let subtotal = pricePerNight * totalNights;
    
    // Apply free week if eligible (first 7 nights free)
    if (isFreeWeek) {
      const freeNights = Math.min(7, nights);
      subtotal = pricePerNight * (nights - freeNights);
    }
    
    const total = subtotal + cleaningFee;
    
    // Convert to HKT if needed
    let totalHkt = 0;
    if (currency === 'HKT') {
      const [hktPrice] = await db.select().from(hktStats).orderBy(desc(hktStats.updatedAt)).limit(1);
      const currentHktPrice = Number(hktPrice?.currentPrice || 0.0001);
      totalHkt = total / currentHktPrice;
    }
    
    res.json({
      nights,
      pricePerNight,
      subtotal,
      cleaningFee,
      total,
      totalHkt,
      isFreeWeek,
      hasShares,
      currency,
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({ message: 'Failed to calculate price' });
  }
});

// Create booking with Stripe payment
router.post('/create-stripe-booking', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const bookingData = createBookingSchema.parse(req.body);
    const userId = req.user!.id;
    
    // Calculate pricing
    const priceResponse = await fetch(`${req.protocol}://${req.get('host')}/api/bookings/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    
    if (!priceResponse.ok) {
      return res.status(400).json({ message: 'Failed to calculate price' });
    }
    
    const pricing = await priceResponse.json();
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Property Booking - ${bookingData.propertyId}`,
              description: `${pricing.nights} nights + cleaning fee`,
            },
            unit_amount: Math.round(pricing.total * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/booking-cancel`,
      metadata: {
        userId: userId.toString(),
        propertyId: bookingData.propertyId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        nights: pricing.nights.toString(),
        isFreeWeek: pricing.isFreeWeek.toString(),
      },
    });
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating Stripe booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Stripe webhook to confirm payment
router.post('/stripe-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Create booking record
    const metadata = session.metadata!;
    await db.insert(bookings).values({
      userId: parseInt(metadata.userId),
      propertyId: metadata.propertyId,
      checkIn: metadata.checkIn.split('T')[0], // Convert to date string
      checkOut: metadata.checkOut.split('T')[0], // Convert to date string
      nights: parseInt(metadata.nights),
      totalUsd: (session.amount_total! / 100).toString(),
      totalHkt: '0',
      currency: 'USD',
      cleaningFee: '90',
      isFreeWeek: metadata.isFreeWeek === 'true',
      stripeSessionId: session.id,
      status: 'confirmed',
    });
  }
  
  res.json({ received: true });
});

// Create booking with HKT payment
router.post('/create-hkt-booking', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { propertyId, checkIn, checkOut, transactionHash } = req.body;
    const userId = req.user!.id;
    
    // Verify transaction hash (simplified - in production, verify on blockchain)
    if (!transactionHash || transactionHash.length < 10) {
      return res.status(400).json({ message: 'Invalid transaction hash' });
    }
    
    // Calculate pricing
    const bookingData = { propertyId, checkIn, checkOut, currency: 'HKT' };
    const priceResponse = await fetch(`${req.protocol}://${req.get('host')}/api/bookings/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    
    if (!priceResponse.ok) {
      return res.status(400).json({ message: 'Failed to calculate price' });
    }
    
    const pricing = await priceResponse.json();
    
    // Create booking record
    const [booking] = await db.insert(bookings).values({
      userId,
      propertyId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      nights: pricing.nights,
      totalUsd: pricing.total,
      totalHkt: pricing.totalHkt,
      currency: 'HKT',
      cleaningFee: pricing.cleaningFee,
      isFreeWeek: pricing.isFreeWeek,
      transactionHash,
      status: 'confirmed',
    }).returning();
    
    res.json({ booking, message: 'Booking confirmed with HKT payment' });
  } catch (error) {
    console.error('Error creating HKT booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Get user bookings
router.get('/my-bookings', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    
    const userBookings = await db
      .select({
        booking: bookings,
        property: properties,
      })
      .from(bookings)
      .leftJoin(properties, eq(bookings.propertyId, properties.id))
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
    
    res.json(userBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Cancel booking
router.post('/cancel', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { bookingId } = cancelBookingSchema.parse(req.body);
    const userId = req.user!.id;
    
    // Get booking details
    const [booking] = await db
      .select()
      .from(bookings)
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.userId, userId)
      ));
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'canceled') {
      return res.status(400).json({ message: 'Booking already canceled' });
    }
    
    // Check if cancellation is allowed (before check-in date)
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    
    if (now >= checkInDate) {
      return res.status(400).json({ message: 'Cannot cancel booking after check-in date' });
    }
    
    // Calculate 50% refund
    const refundAmount = booking.currency === 'USD' 
      ? Number(booking.totalUsd) * 0.5 
      : Number(booking.totalHkt) * 0.5;
    
    // Update booking status
    await db
      .update(bookings)
      .set({ 
        status: 'canceled',
        updatedAt: new Date()
      })
      .where(eq(bookings.id, bookingId));
    
    // Process refund (simplified - in production, process actual refund)
    let refundMessage = '';
    if (booking.currency === 'USD' && booking.stripeSessionId) {
      // Process Stripe refund
      refundMessage = `Stripe refund of $${refundAmount.toFixed(2)} will be processed within 5-10 business days`;
    } else if (booking.currency === 'HKT') {
      // Process HKT refund
      refundMessage = `HKT refund of ${refundAmount.toFixed(8)} tokens will be sent to your wallet`;
    }
    
    res.json({ 
      message: 'Booking canceled successfully',
      refundAmount,
      refundMessage,
      currency: booking.currency
    });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

// Admin routes
router.get('/admin/all-bookings', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    // TODO: Add admin role check
    const allBookings = await db
      .select({
        booking: bookings,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        },
        property: properties,
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.userId, users.id))
      .leftJoin(properties, eq(bookings.propertyId, properties.id))
      .orderBy(desc(bookings.createdAt));
    
    res.json(allBookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

export default router;