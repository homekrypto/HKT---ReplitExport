import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from './auth';
import { storage } from './storage';
import { z } from 'zod';

const router = Router();

// Admin authorization middleware
async function requireAdmin(req: AuthenticatedRequest, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Allow any authenticated user admin access for now
  const user = await storage.getUser(req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  next();
}

// Property update schema
const updatePropertySchema = z.object({
  pricePerNightUsd: z.number().min(0).optional(),
  maxGuests: z.number().min(1).max(20).optional(),
  hktPriceOverride: z.number().min(0).optional(), // Override HKT price (default 0.10 USD)
  isActive: z.boolean().optional(),
  name: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  description: z.string().optional(),
  bedrooms: z.number().min(1).optional(),
  bathrooms: z.number().min(1).optional(),
  amenities: z.array(z.string()).optional(),
});

// Get all properties for admin management
router.get('/properties', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const properties = await storage.getAllProperties();
    
    // Add booking statistics for each property
    const propertiesWithStats = await Promise.all(
      properties.map(async (property) => {
        const bookings = await storage.getPropertyBookings(property.id);
        const totalBookings = bookings.length;
        const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
        const totalRevenue = bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + b.totalUsd, 0);
        
        return {
          ...property,
          stats: {
            totalBookings,
            activeBookings,
            totalRevenue,
            occupancyRate: totalBookings > 0 ? (activeBookings / totalBookings) * 100 : 0
          }
        };
      })
    );

    res.json(propertiesWithStats);
  } catch (error) {
    console.error('Error fetching properties for admin:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

// Update property settings
router.put('/properties/:propertyId', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { propertyId } = req.params;
    const updates = updatePropertySchema.parse(req.body);

    const property = await storage.getProperty(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updatedProperty = await storage.updateProperty(propertyId, updates);
    
    res.json({
      message: 'Property updated successfully',
      property: updatedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Failed to update property' });
  }
});

// Create new property
router.post('/properties', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const createPropertySchema = z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      location: z.string().min(1),
      description: z.string(),
      pricePerNightUsd: z.number().min(0),
      maxGuests: z.number().min(1).max(20),
      bedrooms: z.number().min(1),
      bathrooms: z.number().min(1),
      amenities: z.array(z.string()),
      images: z.array(z.string()),
      hktPriceOverride: z.number().min(0).default(0.10),
      isActive: z.boolean().default(true),
    });

    const propertyData = createPropertySchema.parse(req.body);
    const property = await storage.createProperty(propertyData);
    
    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Failed to create property' });
  }
});

// Delete property (soft delete - set inactive)
router.delete('/properties/:propertyId', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { propertyId } = req.params;

    const property = await storage.getProperty(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check for active bookings
    const activeBookings = await storage.getActivePropertyBookings(propertyId);
    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete property with active bookings',
        activeBookings: activeBookings.length
      });
    }

    await storage.updateProperty(propertyId, { isActive: false });
    
    res.json({
      message: 'Property deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Failed to delete property' });
  }
});

// Get all bookings for admin oversight
router.get('/bookings', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { status, propertyId, limit = '50', offset = '0' } = req.query;
    
    const filters: any = {};
    if (status) filters.status = status;
    if (propertyId) filters.propertyId = propertyId;

    const bookings = await storage.getAllBookings({
      ...filters,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });

    // Add user and property details
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const user = await storage.getUser(booking.userId);
        const property = await storage.getProperty(booking.propertyId);
        
        return {
          ...booking,
          user: user ? {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          } : null,
          property: property ? {
            id: property.id,
            name: property.name,
            location: property.location
          } : null
        };
      })
    );

    res.json(bookingsWithDetails);
  } catch (error) {
    console.error('Error fetching bookings for admin:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Update HKT price globally
router.put('/hkt-price', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { priceUsd } = z.object({
      priceUsd: z.number().min(0.0001).max(100) // Reasonable HKT price range
    }).parse(req.body);

    await storage.updateGlobalHktPrice(priceUsd);
    
    res.json({
      message: 'HKT price updated successfully',
      newPrice: priceUsd
    });
  } catch (error) {
    console.error('Error updating HKT price:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Failed to update HKT price' });
  }
});

// Get platform statistics
router.get('/stats', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const stats = await storage.getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

export default router;