import { Router } from 'express';

const router = Router();

// Temporary simple booking data
const tempSimpleBookings: any[] = [];
let simpleBookingIdCounter = 1;

// Cap Cana property data
const capCanaProperty = {
  id: 'cap-cana',
  name: 'Luxury Villa Cap Cana',
  location: 'Cap Cana, Dominican Republic',
  pricePerNight: 400,
  maxGuests: 8,
  bedrooms: 4,
  bathrooms: 3,
  images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'],
  amenities: ['Pool', 'WiFi', 'Kitchen', 'Parking', 'Air Conditioning', 'Ocean View'],
  description: 'Beautiful luxury villa in Cap Cana with stunning ocean views and premium amenities.',
  isActive: true,
  cleaningFee: 75
};

// User shares for simple booking
const tempSimpleUserShares = {
  'cap-cana': {
    hasShares: true,
    totalShares: 2,
    weeklyShares: 1
  }
};

// Calculate price for simple booking
router.post('/calculate-price', (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.body;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights < 7) {
      return res.status(400).json({ error: 'Minimum 7-night stay required' });
    }

    const userShares = tempSimpleUserShares['cap-cana'];
    const weeks = Math.ceil(nights / 7);
    const isFreeWeek = userShares.hasShares && weeks <= userShares.weeklyShares;
    
    const pricePerNight = capCanaProperty.pricePerNight;
    const subtotal = nights * pricePerNight;
    const cleaningFee = capCanaProperty.cleaningFee;
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
    console.error('Simple price calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate price' });
  }
});

// Get user shares for simple booking
router.get('/user-shares', (req, res) => {
  try {
    const userShares = tempSimpleUserShares['cap-cana'];
    res.json(userShares);
  } catch (error) {
    console.error('Error fetching simple user shares:', error);
    res.status(500).json({ error: 'Failed to fetch user shares' });
  }
});

// Create simple booking
router.post('/create-booking', (req, res) => {
  try {
    const bookingData = req.body;
    const booking = {
      id: simpleBookingIdCounter++,
      propertyId: 'cap-cana',
      propertyName: capCanaProperty.name,
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      bookingReference: `HKT-SIMPLE-${Date.now()}-${simpleBookingIdCounter}`
    };
    
    if (bookingData.paymentMethod === 'hkt') {
      booking.transactionHash = `0x${Math.random().toString(16).substring(2)}`;
    }
    
    tempSimpleBookings.push(booking);
    console.log('[TEMP] Simple booking created:', booking.bookingReference);
    
    res.json({
      success: true,
      booking,
      message: `Booking created successfully with ${bookingData.paymentMethod.toUpperCase()} payment`
    });
  } catch (error) {
    console.error('Simple booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get simple bookings
router.get('/my-bookings', (req, res) => {
  try {
    res.json(tempSimpleBookings);
  } catch (error) {
    console.error('Error fetching simple bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Cancel simple booking
router.post('/cancel', (req, res) => {
  try {
    const { bookingId } = req.body;
    const bookingIndex = tempSimpleBookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    tempSimpleBookings[bookingIndex].status = 'cancelled';
    tempSimpleBookings[bookingIndex].cancelledAt = new Date().toISOString();
    
    console.log('[TEMP] Simple booking cancelled:', bookingId);
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Simple booking cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;