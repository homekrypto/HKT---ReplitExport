import { Router } from 'express';

const router = Router();

// Temporary booking data storage
const tempBookings: any[] = [];
let bookingIdCounter = 1;

// Temporary property data
const tempProperties = [
  {
    id: 'cap-cana',
    name: 'Luxury Villa Cap Cana',
    location: 'Cap Cana, Dominican Republic',
    pricePerNight: 400,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    ],
    amenities: ['Pool', 'WiFi', 'Kitchen', 'Parking', 'Air Conditioning', 'Ocean View'],
    description: 'Beautiful luxury villa in Cap Cana with stunning ocean views and premium amenities.',
    isActive: true,
    cleaningFee: 75
  }
];

// User shares data
const tempUserShares: any = {
  'cap-cana': {
    hasShares: true,
    totalShares: 2,
    weeklyShares: 1
  }
};

// Calculate price for booking
router.post('/calculate-price', (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, paymentMethod } = req.body;
    
    const property = tempProperties.find(p => p.id === propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights < 7) {
      return res.status(400).json({ error: 'Minimum 7-night stay required' });
    }

    const userShares = tempUserShares[propertyId] || { hasShares: false, totalShares: 0 };
    const weeks = Math.ceil(nights / 7);
    const isFreeWeek = userShares.hasShares && weeks <= userShares.weeklyShares;
    
    const pricePerNight = property.pricePerNight;
    const subtotal = nights * pricePerNight;
    const cleaningFee = property.cleaningFee;
    const total = isFreeWeek ? cleaningFee : subtotal + cleaningFee;
    
    // HKT calculation (1 HKT = $0.10)
    const hktPrice = 0.10;
    const totalHkt = total / hktPrice;

    res.json({
      nights,
      pricePerNight,
      subtotal,
      cleaningFee,
      total,
      totalHkt,
      isFreeWeek,
      hktPrice,
      weeks
    });
  } catch (error) {
    console.error('Price calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate price' });
  }
});

// Get user shares for property
router.get('/user-shares/:propertyId', (req, res) => {
  try {
    const { propertyId } = req.params;
    const userShares = tempUserShares[propertyId] || { hasShares: false, totalShares: 0 };
    res.json(userShares);
  } catch (error) {
    console.error('Error fetching user shares:', error);
    res.status(500).json({ error: 'Failed to fetch user shares' });
  }
});

// Create Stripe booking
router.post('/create-stripe-booking', (req, res) => {
  try {
    const bookingData = req.body;
    const booking = {
      id: bookingIdCounter++,
      ...bookingData,
      paymentMethod: 'stripe',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      bookingReference: `HKT-${Date.now()}-${bookingIdCounter}`
    };
    
    tempBookings.push(booking);
    console.log('[TEMP] Stripe booking created:', booking.bookingReference);
    
    res.json({
      success: true,
      booking,
      message: 'Booking created successfully with Stripe payment'
    });
  } catch (error) {
    console.error('Stripe booking error:', error);
    res.status(500).json({ error: 'Failed to create Stripe booking' });
  }
});

// Create HKT booking
router.post('/create-hkt-booking', (req, res) => {
  try {
    const bookingData = req.body;
    const booking = {
      id: bookingIdCounter++,
      ...bookingData,
      paymentMethod: 'hkt',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      bookingReference: `HKT-${Date.now()}-${bookingIdCounter}`,
      transactionHash: `0x${Math.random().toString(16).substring(2)}`
    };
    
    tempBookings.push(booking);
    console.log('[TEMP] HKT booking created:', booking.bookingReference);
    
    res.json({
      success: true,
      booking,
      message: 'Booking created successfully with HKT payment'
    });
  } catch (error) {
    console.error('HKT booking error:', error);
    res.status(500).json({ error: 'Failed to create HKT booking' });
  }
});

// Get user bookings
router.get('/my-bookings', (req, res) => {
  try {
    // Return all bookings for demo purposes
    res.json(tempBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Cancel booking
router.post('/cancel', (req, res) => {
  try {
    const { bookingId } = req.body;
    const bookingIndex = tempBookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    tempBookings[bookingIndex].status = 'cancelled';
    tempBookings[bookingIndex].cancelledAt = new Date().toISOString();
    
    console.log('[TEMP] Booking cancelled:', bookingId);
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Get property details
router.get('/property/:propertyId', (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = tempProperties.find(p => p.id === propertyId);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

export default router;