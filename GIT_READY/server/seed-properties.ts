import { db } from './db';
import { properties, propertyShares } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function seedProperties() {
  try {
    // Check if properties already exist
    const existingProperties = await db.select().from(properties).limit(1);
    if (existingProperties.length > 0) {
      console.log('Properties already seeded');
      return;
    }

    // Seed pilot property
    await db.insert(properties).values({
      id: 'cap-cana-villa',
      name: 'Luxury Villa Cap Cana',
      location: 'Cap Cana, Dominican Republic',
      description: 'Experience the ultimate luxury in this stunning beachfront villa featuring panoramic ocean views, private pool, and world-class amenities. Perfect for families and groups seeking an exclusive Caribbean getaway.',
      pricePerNight: '285.71', // $2000/week ÷ 7 nights
      totalShares: 52, // 52 weeks per year
      sharePrice: '3750.00', // $195,000 ÷ 52 shares
      images: [
        'https://images.unsplash.com/photo-1520637836862-4d197d17c38a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
      ],
      amenities: [
        'Private Pool',
        'Ocean View',
        'WiFi',
        'Air Conditioning',
        'Kitchen',
        'Parking',
        'Beach Access',
        'Security',
        'Housekeeping',
        'Concierge'
      ],
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 3,
      isActive: true,
    });

    // Seed Miami property (coming soon)
    await db.insert(properties).values({
      id: 'miami-penthouse',
      name: 'Downtown Miami Penthouse',
      location: 'Miami, Florida, USA',
      description: 'Ultra-modern penthouse in the heart of downtown Miami with stunning city and bay views. Features high-end finishes, rooftop terrace, and access to building amenities.',
      pricePerNight: '428.57', // $3000/week ÷ 7 nights
      totalShares: 52,
      sharePrice: '5769.23', // $300,000 ÷ 52 shares
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop'
      ],
      amenities: [
        'City View',
        'Rooftop Terrace',
        'Gym Access',
        'Pool Access',
        'WiFi',
        'Air Conditioning',
        'Kitchen',
        'Parking',
        'Concierge',
        'Security'
      ],
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      isActive: false, // Coming soon
    });

    console.log('Properties seeded successfully');
  } catch (error) {
    console.error('Error seeding properties:', error);
  }
}

export async function seedPropertyShares(userId: number, walletAddress: string) {
  try {
    // Check if user already has shares
    const existingShares = await db
      .select()
      .from(propertyShares)
      .where(eq(propertyShares.userId, userId))
      .limit(1);

    if (existingShares.length > 0) {
      console.log('User already has property shares');
      return;
    }

    // Give user 1 share in Cap Cana property for testing
    await db.insert(propertyShares).values({
      userId,
      userWallet: walletAddress,
      propertyId: 'cap-cana-villa',
      sharesOwned: 1,
    });

    console.log('Property shares seeded for user:', userId);
  } catch (error) {
    console.error('Error seeding property shares:', error);
  }
}