import { Router } from 'express';
import { tempProperties, tempStats, tempUser } from './temp-admin-data';

const router = Router();

// Temporary auth bypass for testing
router.use((req, res, next) => {
  // Mock authenticated user for admin testing
  (req as any).user = tempUser;
  next();
});

// Get all properties
router.get('/properties', (req, res) => {
  res.json(tempProperties);
});

// Update property
router.put('/properties/:propertyId', (req, res) => {
  const { propertyId } = req.params;
  const { updates } = req.body;
  
  const propertyIndex = tempProperties.findIndex(p => p.id === propertyId);
  if (propertyIndex === -1) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  // Update the property
  tempProperties[propertyIndex] = { ...tempProperties[propertyIndex], ...updates };
  
  res.json({ message: 'Property updated successfully', property: tempProperties[propertyIndex] });
});

// Get platform stats
router.get('/stats', (req, res) => {
  res.json(tempStats);
});

// Update global HKT price
router.put('/hkt-price', (req, res) => {
  const { price } = req.body;
  
  // Update all properties with new HKT price
  tempProperties.forEach(property => {
    property.hktPriceOverride = price;
  });
  
  res.json({ message: 'HKT price updated successfully', newPrice: price });
});

export default router;