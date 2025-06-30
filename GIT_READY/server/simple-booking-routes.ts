import { Router } from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { requireAuth, type AuthenticatedRequest } from './auth';

const router = Router();

// Mock property data matching your pilot property showcase
const properties = [
  {
    id: 'cap-cana-villa',
    name: 'Luxury Villa Cap Cana',
    location: 'Cap Cana, Dominican Republic',
    description: 'Experience the ultimate luxury in this stunning beachfront villa featuring panoramic ocean views, private pool, and world-class amenities.',
    pricePerNight: 285.71, // $2000/week ÷ 7 nights
    totalShares: 52,
    sharePrice: 3750,
    images: ['https://images.unsplash.com/photo-1520637836862-4d197d17c38a?w=800&h=600&fit=crop'],
    amenities: ['Private Pool', 'Ocean View', 'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Beach Access'],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    isActive: true,
  }
];

// In-memory storage for bookings and shares (replace with database in production)
let bookings: any[] = [];
let propertyShares: any[] = [];

// Validation schemas
const createBookingSchema = z.object({
  propertyId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  currency: z.enum(['USD', 'HKT']),
  guests: z.number().min(1),
});

// Get available properties
router.get('/properties', async (req, res) => {
  res.json(properties);
});

// Get property details
router.get('/properties/:id', async (req, res) => {
  const { id } = req.params;
  const property = properties.find(p => p.id === id);
  
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  res.json(property);
});

// Check user property shares
router.get('/user-shares/:propertyId', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;
  
  // Check if user has shares in this property
  const userShares = propertyShares.filter(s => s.userId === userId && s.propertyId === propertyId);
  const totalShares = userShares.reduce((sum, share) => sum + share.sharesOwned, 0);
  const hasShares = totalShares > 0;
  
  res.json({ hasShares, totalShares });
});

// Give user a share for testing (simulate ownership)
router.post('/give-test-share', requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const { propertyId } = req.body;
  
  // Check if user already has shares
  const existingShare = propertyShares.find(s => s.userId === userId && s.propertyId === propertyId);
  
  if (!existingShare) {
    propertyShares.push({
      id: Date.now(),
      userId,
      userWallet: req.user!.primaryWalletAddress || '0x...',
      propertyId: propertyId || 'cap-cana-villa',
      sharesOwned: 1,
      createdAt: new Date(),
    });
  }
  
  res.json({ message: 'Test share granted', hasShares: true, totalShares: 1 });
});

// Calculate booking price
router.post('/calculate-price', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { propertyId, checkIn, checkOut, currency } = createBookingSchema.parse(req.body);
    
    const property = properties.find(p => p.id === propertyId);
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
    const userShares = propertyShares.filter(s => s.userId === userId && s.propertyId === propertyId);
    const hasShares = userShares.length > 0;
    const isFreeWeek = hasShares && nights >= 7;
    
    // Calculate pricing
    const pricePerNight = property.pricePerNight;
    const cleaningFee = 90; // Fixed $90 cleaning fee
    
    let subtotal = pricePerNight * nights;
    
    // Apply free week if eligible (first 7 nights free)
    if (isFreeWeek) {
      const freeNights = Math.min(7, nights);
      subtotal = pricePerNight * (nights - freeNights);
    }
    
    const total = subtotal + cleaningFee;
    
    // Convert to HKT if needed (using current HKT price of $0.0001)
    let totalHkt = 0;
    if (currency === 'HKT') {
      const hktPrice = 0.0001; // Current HKT price
      totalHkt = total / hktPrice;
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

// Create booking (simplified version)
router.post('/create-booking', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { propertyId, checkIn, checkOut, currency, total, nights, isFreeWeek } = req.body;
    const userId = req.user!.id;
    
    // Create booking record
    const booking = {
      id: Date.now(),
      userId,
      propertyId,
      checkIn,
      checkOut,
      nights,
      totalUsd: currency === 'USD' ? total : 0,
      totalHkt: currency === 'HKT' ? total : 0,
      currency,
      cleaningFee: 90,
      isFreeWeek,
      status: 'confirmed',
      createdAt: new Date(),
    };
    
    bookings.push(booking);
    
    res.json({ 
      booking, 
      message: `Booking confirmed! ${isFreeWeek ? 'Your first 7 nights are FREE as a property share owner!' : ''}` 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Get user bookings
router.get('/my-bookings', requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  
  const userBookings = bookings
    .filter(b => b.userId === userId)
    .map(booking => ({
      booking,
      property: properties.find(p => p.id === booking.propertyId)
    }))
    .sort((a, b) => new Date(b.booking.createdAt).getTime() - new Date(a.booking.createdAt).getTime());
  
  res.json(userBookings);
});

// Cancel booking
router.post('/cancel', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user!.id;
    
    const bookingIndex = bookings.findIndex(b => b.id === bookingId && b.userId === userId);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const booking = bookings[bookingIndex];
    
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
      ? booking.totalUsd * 0.5 
      : booking.totalHkt * 0.5;
    
    // Update booking status
    bookings[bookingIndex].status = 'canceled';
    
    res.json({ 
      message: 'Booking canceled successfully',
      refundAmount,
      refundMessage: `50% refund of ${refundAmount.toFixed(booking.currency === 'HKT' ? 8 : 2)} ${booking.currency} will be processed`,
      currency: booking.currency
    });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

// Admin routes
router.get('/admin/all-bookings', requireAuth, async (req: AuthenticatedRequest, res) => {
  // In production, add admin role check
  const allBookings = bookings.map(booking => ({
    booking,
    user: { id: booking.userId, email: `user${booking.userId}@example.com` },
    property: properties.find(p => p.id === booking.propertyId)
  }));
  
  res.json(allBookings);
});

export default router;