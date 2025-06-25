// DynamoDB Client and Operations for HKT Platform
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  BatchGetItemCommand,
  BatchWriteItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand as DocQueryCommand,
  UpdateCommand,
  DeleteCommand,
  BatchGetCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  TABLE_NAME,
  KeyGenerator,
  EntityType,
  UserProfile,
  UserSession,
  UserWallet,
  UserInvestment,
  HktStats,
  BlogPost,
  Subscriber,
} from './dynamodb-schema';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: false,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

// Generic DynamoDB operations
export class DynamoDBService {
  // Generic get item
  async getItem(PK: string, SK: string) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK, SK },
    });
    
    const response = await docClient.send(command);
    return response.Item;
  }

  // Generic put item
  async putItem(item: any) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...item,
        updatedAt: new Date().toISOString(),
      },
    });
    
    await docClient.send(command);
    return item;
  }

  // Generic query
  async query(PK: string, SK?: string, indexName?: string) {
    const KeyConditionExpression = SK 
      ? 'PK = :pk AND begins_with(SK, :sk)'
      : 'PK = :pk';
    
    const ExpressionAttributeValues = SK 
      ? { ':pk': PK, ':sk': SK }
      : { ':pk': PK };

    const command = new DocQueryCommand({
      TableName: TABLE_NAME,
      IndexName: indexName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    });
    
    const response = await docClient.send(command);
    return response.Items || [];
  }

  // Generic update item
  async updateItem(PK: string, SK: string, updates: Record<string, any>) {
    const UpdateExpression = 'SET ' + Object.keys(updates)
      .map(key => `#${key} = :${key}`)
      .join(', ') + ', updatedAt = :updatedAt';
    
    const ExpressionAttributeNames = Object.keys(updates)
      .reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
    
    const ExpressionAttributeValues = {
      ...Object.keys(updates).reduce((acc, key) => ({ 
        ...acc, 
        [`:${key}`]: updates[key] 
      }), {}),
      ':updatedAt': new Date().toISOString(),
    };

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK, SK },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });
    
    const response = await docClient.send(command);
    return response.Attributes;
  }

  // Generic delete item
  async deleteItem(PK: string, SK: string) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK, SK },
    });
    
    await docClient.send(command);
  }

  // Batch operations
  async batchGetItems(keys: Array<{ PK: string; SK: string }>) {
    const command = new BatchGetCommand({
      RequestItems: {
        [TABLE_NAME]: {
          Keys: keys,
        },
      },
    });
    
    const response = await docClient.send(command);
    return response.Responses?.[TABLE_NAME] || [];
  }

  async batchWriteItems(items: any[]) {
    const requests = items.map(item => ({
      PutRequest: { Item: item },
    }));
    
    const command = new BatchWriteCommand({
      RequestItems: {
        [TABLE_NAME]: requests,
      },
    });
    
    await docClient.send(command);
  }
}

// Specialized service classes
export class UserService extends DynamoDBService {
  async createUser(userData: Omit<UserProfile, 'PK' | 'SK' | 'EntityType' | 'GSI1PK' | 'GSI1SK'>): Promise<UserProfile> {
    const userId = crypto.randomUUID();
    const keys = KeyGenerator.userProfile(userId);
    
    const user: UserProfile = {
      ...keys,
      EntityType: EntityType.USER_PROFILE,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      GSI1PK: userData.email,
      GSI1SK: `USER#${userId}`,
      ...userData,
    };
    
    await this.putItem(user);
    return user;
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    const keys = KeyGenerator.userProfile(userId);
    const item = await this.getItem(keys.PK, keys.SK);
    return item as UserProfile || null;
  }

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const command = new DocQueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'GSI1PK = :email',
      ExpressionAttributeValues: { ':email': email },
    });
    
    const response = await docClient.send(command);
    const items = response.Items || [];
    return items.length > 0 ? items[0] as UserProfile : null;
  }

  async updateUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const keys = KeyGenerator.userProfile(userId);
    const updated = await this.updateItem(keys.PK, keys.SK, updates);
    return updated as UserProfile || null;
  }
}

export class SessionService extends DynamoDBService {
  async createSession(userId: string, sessionData: Omit<UserSession, 'PK' | 'SK' | 'EntityType' | 'sessionId'>): Promise<UserSession> {
    const sessionId = crypto.randomUUID();
    const keys = KeyGenerator.userSession(userId, sessionId);
    
    const session: UserSession = {
      ...keys,
      EntityType: EntityType.USER_SESSION,
      sessionId,
      userId,
      createdAt: new Date().toISOString(),
      ...sessionData,
    };
    
    await this.putItem(session);
    return session;
  }

  async getSession(userId: string, sessionId: string): Promise<UserSession | null> {
    const keys = KeyGenerator.userSession(userId, sessionId);
    const item = await this.getItem(keys.PK, keys.SK);
    return item as UserSession || null;
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    const items = await this.query(`USER#${userId}`, 'SESSION#');
    return items as UserSession[];
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    const keys = KeyGenerator.userSession(userId, sessionId);
    await this.deleteItem(keys.PK, keys.SK);
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    const sessions = await this.getUserSessions(userId);
    for (const session of sessions) {
      await this.deleteItem(session.PK, session.SK);
    }
  }
}

export class InvestmentService extends DynamoDBService {
  async createInvestment(userId: string, investmentData: Omit<UserInvestment, 'PK' | 'SK' | 'EntityType' | 'investmentId' | 'GSI3PK' | 'GSI3SK'>): Promise<UserInvestment> {
    const investmentId = crypto.randomUUID();
    const keys = KeyGenerator.userInvestment(userId, investmentId);
    
    const investment: UserInvestment = {
      ...keys,
      EntityType: EntityType.USER_INVESTMENT,
      investmentId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      GSI3PK: 'INVESTMENT',
      GSI3SK: new Date().toISOString(),
      ...investmentData,
    };
    
    await this.putItem(investment);
    return investment;
  }

  async getUserInvestments(userId: string): Promise<UserInvestment[]> {
    const items = await this.query(`USER#${userId}`, 'INVESTMENT#');
    return items as UserInvestment[];
  }

  async getInvestmentById(userId: string, investmentId: string): Promise<UserInvestment | null> {
    const keys = KeyGenerator.userInvestment(userId, investmentId);
    const item = await this.getItem(keys.PK, keys.SK);
    return item as UserInvestment || null;
  }

  async updateInvestment(userId: string, investmentId: string, updates: Partial<UserInvestment>): Promise<UserInvestment | null> {
    const keys = KeyGenerator.userInvestment(userId, investmentId);
    const updated = await this.updateItem(keys.PK, keys.SK, updates);
    return updated as UserInvestment || null;
  }
}

export class HktStatsService extends DynamoDBService {
  async updateHktStats(statsData: Omit<HktStats, 'PK' | 'SK' | 'EntityType'>): Promise<HktStats> {
    const timestamp = new Date().toISOString();
    const keys = KeyGenerator.hktStats(timestamp);
    
    const stats: HktStats = {
      ...keys,
      EntityType: EntityType.HKT_STATS,
      lastUpdated: timestamp,
      ...statsData,
    };
    
    await this.putItem(stats);
    return stats;
  }

  async getLatestHktStats(): Promise<HktStats | null> {
    const command = new DocQueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: { ':pk': 'GLOBAL' },
      FilterExpression: 'begins_with(SK, :sk)',
      ExpressionAttributeValues: { 
        ':pk': 'GLOBAL',
        ':sk': 'HKT_STATS#',
      },
      ScanIndexForward: false, // Sort descending
      Limit: 1,
    });
    
    const response = await docClient.send(command);
    const items = response.Items || [];
    return items.length > 0 ? items[0] as HktStats : null;
  }
}

// Export service instances
export const userService = new UserService();
export const sessionService = new SessionService();
export const investmentService = new InvestmentService();
export const hktStatsService = new HktStatsService();