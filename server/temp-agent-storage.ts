// Temporary agent storage for when database is offline
interface TempAgent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  licenseNumber: string;
  city: string;
  country: string;
  website?: string;
  linkedIn?: string;
  bio: string;
  yearsExperience: number;
  languagesSpoken: string[];
  seoBacklinkUrl?: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: Date;
  approvedAt?: Date;
  rejectionReason?: string;
  referralLink?: string;
}

let tempAgents: TempAgent[] = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@realestate.com',
    phone: '+1-555-0123',
    company: 'Premium Properties LLC',
    licenseNumber: 'RE123456789',
    city: 'Miami',
    country: 'United States',
    website: 'https://premiumpropertiesmiami.com',
    linkedIn: 'https://linkedin.com/in/sarahjohnson',
    bio: 'Experienced real estate agent specializing in luxury waterfront properties in Miami Beach. 10+ years of experience helping international clients find their dream homes.',
    yearsExperience: 12,
    languagesSpoken: ['English', 'Spanish', 'Portuguese'],
    seoBacklinkUrl: 'https://premiumpropertiesmiami.com/partners',
    isApproved: false,
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    referralLink: 'homekrypto.com/agent/sarah-johnson-miami'
  },
  {
    id: 2,
    firstName: 'Michael',
    lastName: 'Rodriguez',
    email: 'michael@dominicanrealty.com',
    phone: '+1-809-555-0456',
    company: 'Dominican Realty Solutions',
    licenseNumber: 'DR987654321',
    city: 'Punta Cana',
    country: 'Dominican Republic',
    website: 'https://dominicanrealty.com',
    linkedIn: 'https://linkedin.com/in/michaelrodriguez',
    bio: 'Bilingual real estate expert with deep knowledge of the Dominican Republic market. Specializing in vacation rentals and investment properties.',
    yearsExperience: 8,
    languagesSpoken: ['English', 'Spanish'],
    seoBacklinkUrl: 'https://dominicanrealty.com/partners',
    isApproved: false,
    isActive: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    referralLink: 'homekrypto.com/agent/michael-rodriguez-punta-cana'
  }
];
let nextId = 3;

export function addTempAgent(agentData: any): TempAgent {
  const newAgent: TempAgent = {
    id: nextId++,
    firstName: agentData.firstName || '',
    lastName: agentData.lastName || '',
    email: agentData.email,
    phone: agentData.phone || '',
    company: agentData.company || '',
    licenseNumber: agentData.licenseNumber || '',
    city: agentData.city || '',
    country: agentData.country || 'United States',
    website: agentData.website,
    linkedIn: agentData.linkedIn,
    bio: agentData.bio || '',
    yearsExperience: agentData.yearsExperience || 0,
    languagesSpoken: agentData.languagesSpoken || [],
    seoBacklinkUrl: agentData.seoBacklinkUrl,
    isApproved: false,
    isActive: true,
    createdAt: new Date(),
    referralLink: `homekrypto.com/agent/${agentData.firstName || 'agent'}-${agentData.lastName || 'partner'}-${Date.now()}`
  };
  
  tempAgents.push(newAgent);
  return newAgent;
}

export function getTempAgents(): TempAgent[] {
  return tempAgents;
}

export function getPendingTempAgents(): TempAgent[] {
  return tempAgents.filter(agent => !agent.isApproved);
}

export function approveTempAgent(id: number): TempAgent | null {
  const agent = tempAgents.find(a => a.id === id);
  if (agent && !agent.isApproved) {
    agent.isApproved = true;
    agent.approvedAt = new Date();
    return agent;
  }
  return null;
}

export function rejectTempAgent(id: number, reason: string): TempAgent | null {
  const agent = tempAgents.find(a => a.id === id);
  if (agent && !agent.isApproved) {
    agent.isApproved = false;
    agent.rejectionReason = reason;
    return agent;
  }
  return null;
}

// Export the tempAgents array directly for access by other modules
export { tempAgents };