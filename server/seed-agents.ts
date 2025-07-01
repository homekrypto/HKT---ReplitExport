import { db } from './db';
import { realEstateAgents } from '@shared/schema';
import { count } from 'drizzle-orm';

export async function seedAgents() {
  try {
    // Check if agents already exist
    const [agentCount] = await db.select({ count: count() }).from(realEstateAgents);
    
    if (agentCount.count > 0) {
      console.log(`Database already has ${agentCount.count} agents. Skipping seed.`);
      return;
    }
    
    // Insert sample agents
    const sampleAgents = [
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@realtygroup.com',
        phone: '+1-555-0123',
        company: 'Premium Realty Group',
        licenseNumber: 'RE123456',
        licenseState: 'California',
        city: 'Los Angeles',
        state: 'California',
        zipCode: '90210',
        country: 'United States',
        website: 'https://sarahjohnson-realty.com',
        linkedIn: 'https://linkedin.com/in/sarahjohnson-realtor',
        bio: 'Experienced luxury real estate agent specializing in high-end properties in Los Angeles. 10+ years helping clients buy and sell premium homes.',
        specializations: ['Luxury Properties', 'Commercial Real Estate', 'Investment Properties'],
        yearsExperience: 12,
        languagesSpoken: ['English', 'Spanish'],
        referralLink: 'https://homekrypto.com/agent/sarah-johnson',
        seoBacklinkUrl: 'https://sarahjohnson-realty.com/hkt-partnership',
        status: 'pending',
        isApproved: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Michael',
        lastName: 'Rodriguez',
        email: 'michael.rodriguez@coastalproperties.com',
        phone: '+1-555-0456',
        company: 'Coastal Properties International',
        licenseNumber: 'RE789012',
        licenseState: 'Florida',
        city: 'Miami',
        state: 'Florida',
        zipCode: '33101',
        country: 'United States',
        website: 'https://coastalproperties.com/michael',
        linkedIn: 'https://linkedin.com/in/michael-rodriguez-miami',
        bio: 'Bilingual real estate expert with expertise in waterfront properties and international investments. Serving Miami and surrounding areas.',
        specializations: ['Waterfront Properties', 'International Clients', 'Condominiums'],
        yearsExperience: 8,
        languagesSpoken: ['English', 'Spanish', 'Portuguese'],
        referralLink: 'https://homekrypto.com/agent/michael-rodriguez',
        seoBacklinkUrl: 'https://coastalproperties.com/hkt-token-investments',
        status: 'approved',
        isApproved: true,
        isActive: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(),
      }
    ];
    
    const insertedAgents = await db.insert(realEstateAgents).values(sampleAgents).returning();
    
    console.log(`Successfully seeded ${insertedAgents.length} sample agents:`);
    insertedAgents.forEach(agent => {
      console.log(`- ${agent.firstName} ${agent.lastName} (${agent.status})`);
    });
    
    return insertedAgents;
  } catch (error) {
    console.error('Error seeding agents:', error);
    throw error;
  }
}