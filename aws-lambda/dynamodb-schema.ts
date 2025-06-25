// DynamoDB Table Schema for HKT Platform
import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const TABLE_NAME = 'hkt-platform-data';

export const createTableSchema = {
  TableName: TABLE_NAME,
  BillingMode: 'PAY_PER_REQUEST', // On-demand pricing
  AttributeDefinitions: [
    { AttributeName: 'PK', AttributeType: 'S' },
    { AttributeName: 'SK', AttributeType: 'S' },
    { AttributeName: 'GSI1PK', AttributeType: 'S' },
    { AttributeName: 'GSI1SK', AttributeType: 'S' },
    { AttributeName: 'GSI2PK', AttributeType: 'S' },
    { AttributeName: 'GSI2SK', AttributeType: 'S' },
    { AttributeName: 'GSI3PK', AttributeType: 'S' },
    { AttributeName: 'GSI3SK', AttributeType: 'S' },
    { AttributeName: 'GSI4PK', AttributeType: 'S' },
    { AttributeName: 'GSI4SK', AttributeType: 'S' },
  ],
  KeySchema: [
    { AttributeName: 'PK', KeyType: 'HASH' },
    { AttributeName: 'SK', KeyType: 'RANGE' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'EmailIndex',
      KeySchema: [
        { AttributeName: 'GSI1PK', KeyType: 'HASH' },
        { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
    {
      IndexName: 'WalletIndex',
      KeySchema: [
        { AttributeName: 'GSI2PK', KeyType: 'HASH' },
        { AttributeName: 'GSI2SK', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
    {
      IndexName: 'InvestmentIndex',
      KeySchema: [
        { AttributeName: 'GSI3PK', KeyType: 'HASH' },
        { AttributeName: 'GSI3SK', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
    {
      IndexName: 'BlogIndex',
      KeySchema: [
        { AttributeName: 'GSI4PK', KeyType: 'HASH' },
        { AttributeName: 'GSI4SK', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
    },
  ],
  StreamSpecification: {
    StreamEnabled: true,
    StreamViewType: 'NEW_AND_OLD_IMAGES',
  },
  PointInTimeRecoverySpecification: {
    PointInTimeRecoveryEnabled: true,
  },
  Tags: [
    { Key: 'Project', Value: 'HKT-Platform' },
    { Key: 'Environment', Value: 'Production' },
  ],
};

// DynamoDB Entity Types
export enum EntityType {
  USER_PROFILE = 'USER_PROFILE',
  USER_SESSION = 'USER_SESSION',
  USER_WALLET = 'USER_WALLET',
  USER_INVESTMENT = 'USER_INVESTMENT',
  QUARTERLY_DATA = 'QUARTERLY_DATA',
  HKT_STATS = 'HKT_STATS',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  BLOG_POST = 'BLOG_POST',
  SUBSCRIBER = 'SUBSCRIBER',
  SUPPORTED_CHAIN = 'SUPPORTED_CHAIN',
  WALLET_CHALLENGE = 'WALLET_CHALLENGE',
}

// Key Generators
export const KeyGenerator = {
  // User-related keys
  userProfile: (userId: string) => ({
    PK: `USER#${userId}`,
    SK: 'PROFILE',
  }),
  
  userSession: (userId: string, sessionId: string) => ({
    PK: `USER#${userId}`,
    SK: `SESSION#${sessionId}`,
  }),
  
  userWallet: (userId: string, walletId: string) => ({
    PK: `USER#${userId}`,
    SK: `WALLET#${walletId}`,
  }),
  
  userInvestment: (userId: string, investmentId: string) => ({
    PK: `USER#${userId}`,
    SK: `INVESTMENT#${investmentId}`,
  }),
  
  quarterlyData: (userId: string, date: string) => ({
    PK: `USER#${userId}`,
    SK: `QUARTERLY#${date}`,
  }),
  
  // Global data keys
  hktStats: (timestamp: string) => ({
    PK: 'GLOBAL',
    SK: `HKT_STATS#${timestamp}`,
  }),
  
  // Email-related keys
  emailVerification: (email: string, token: string) => ({
    PK: `EMAIL#${email}`,
    SK: `VERIFICATION#${token}`,
  }),
  
  passwordReset: (email: string, token: string) => ({
    PK: `EMAIL#${email}`,
    SK: `PASSWORD_RESET#${token}`,
  }),
  
  // Blog keys
  blogPost: (postId: string) => ({
    PK: `BLOG#${postId}`,
    SK: 'METADATA',
  }),
  
  blogContent: (slug: string) => ({
    PK: `BLOG#${slug}`,
    SK: 'CONTENT',
  }),
  
  // Subscriber keys
  subscriber: (email: string) => ({
    PK: `SUBSCRIBER#${email}`,
    SK: 'PROFILE',
  }),
  
  // Chain configuration
  supportedChain: (chainId: string) => ({
    PK: `CHAIN#${chainId}`,
    SK: 'CONFIG',
  }),
  
  // Wallet verification
  walletChallenge: (walletAddress: string, token: string) => ({
    PK: `WALLET#${walletAddress}`,
    SK: `CHALLENGE#${token}`,
  }),
};

// DynamoDB Item Types
export interface UserProfile {
  PK: string;
  SK: string;
  EntityType: EntityType.USER_PROFILE;
  userId: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  primaryWalletAddress?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  phoneNumber?: string;
  referralCode?: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
  GSI1PK: string; // email
  GSI1SK: string; // USER#{userId}
}

export interface UserSession {
  PK: string;
  SK: string;
  EntityType: EntityType.USER_SESSION;
  sessionId: string;
  userId: string;
  token: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  expiresAt: string;
}

export interface UserWallet {
  PK: string;
  SK: string;
  EntityType: EntityType.USER_WALLET;
  walletId: string;
  userId: string;
  walletAddress: string;
  chainId: string;
  isPrimary: boolean;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
  GSI2PK: string; // walletAddress
  GSI2SK: string; // USER#{userId}
}

export interface UserInvestment {
  PK: string;
  SK: string;
  EntityType: EntityType.USER_INVESTMENT;
  investmentId: string;
  userId: string;
  walletAddress: string;
  monthlyAmount: number;
  totalInvested: number;
  currentValue: number;
  hktBalance: number;
  propertyShares: number;
  startDate: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
  GSI3PK: string; // investmentType
  GSI3SK: string; // createdAt
}

export interface QuarterlyData {
  PK: string;
  SK: string;
  EntityType: EntityType.QUARTERLY_DATA;
  userId: string;
  investmentId: string;
  quarter: string;
  year: number;
  hktPrice: number;
  tokensAccumulated: number;
  totalValue: number;
  performancePercent: number;
  recordedAt: string;
}

export interface HktStats {
  PK: string;
  SK: string;
  EntityType: EntityType.HKT_STATS;
  price: number;
  priceChange24h: number;
  marketCap?: number;
  volume24h?: number;
  totalSupply?: number;
  lastUpdated: string;
  dataSource: string;
}

export interface BlogPost {
  PK: string;
  SK: string;
  EntityType: EntityType.BLOG_POST;
  postId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  GSI4PK: string; // status
  GSI4SK: string; // publishedAt
}

export interface Subscriber {
  PK: string;
  SK: string;
  EntityType: EntityType.SUBSCRIBER;
  email: string;
  subscriptionType: 'newsletter' | 'waitlist';
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

// Create table function
export async function createTable(client: DynamoDBClient) {
  try {
    const command = new CreateTableCommand(createTableSchema);
    const response = await client.send(command);
    console.log('Table created successfully:', response.TableDescription?.TableName);
    return response;
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}