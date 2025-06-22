import { 
  users, 
  investments, 
  quarterlyData, 
  hktStats,
  subscribers,
  type User, 
  type InsertUser, 
  type Investment, 
  type InsertInvestment,
  type QuarterlyData,
  type InsertQuarterlyData,
  type HktStats,
  type InsertHktStats,
  type Subscriber,
  type InsertSubscriber
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Investments
  getInvestment(id: number): Promise<Investment | undefined>;
  getInvestmentByWallet(walletAddress: string): Promise<Investment | undefined>;
  getInvestmentByUserId(userId: number): Promise<Investment | undefined>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: number, investment: Partial<Investment>): Promise<Investment | undefined>;
  updateInvestmentByUserId(userId: number, investment: Partial<Investment>): Promise<Investment | undefined>;
  getAllInvestments(): Promise<Investment[]>;

  // Quarterly Data
  getQuarterlyData(investmentId: number): Promise<QuarterlyData[]>;
  createQuarterlyData(data: InsertQuarterlyData): Promise<QuarterlyData>;

  // HKT Stats
  getLatestHktStats(): Promise<HktStats | undefined>;
  updateHktStats(stats: InsertHktStats): Promise<HktStats>;

  // Subscribers
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  getAllSubscribers(): Promise<Subscriber[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user as User || undefined;
    } catch {
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user as User || undefined;
    } catch {
      return undefined;
    }
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.primaryWalletAddress, walletAddress));
      return user as User || undefined;
    } catch {
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result: any[] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return result[0] as User;
    } catch (error) {
      console.error('Database error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async getInvestment(id: number): Promise<Investment | undefined> {
    const [investment] = await db.select().from(investments).where(eq(investments.id, id));
    return investment || undefined;
  }

  async getInvestmentByWallet(walletAddress: string): Promise<Investment | undefined> {
    const [investment] = await db.select().from(investments).where(eq(investments.walletAddress, walletAddress));
    return investment || undefined;
  }

  async getInvestmentByUserId(userId: number): Promise<Investment | undefined> {
    const [investment] = await db.select().from(investments).where(eq(investments.userId, userId));
    return investment || undefined;
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const [investment] = await db
      .insert(investments)
      .values(insertInvestment)
      .returning();
    return investment;
  }

  async updateInvestment(id: number, updateData: Partial<Investment>): Promise<Investment | undefined> {
    const [investment] = await db
      .update(investments)
      .set(updateData)
      .where(eq(investments.id, id))
      .returning();
    return investment || undefined;
  }

  async updateInvestmentByUserId(userId: number, updateData: Partial<Investment>): Promise<Investment | undefined> {
    const [investment] = await db
      .update(investments)
      .set(updateData)
      .where(eq(investments.userId, userId))
      .returning();
    return investment || undefined;
  }

  async getAllInvestments(): Promise<Investment[]> {
    return await db.select().from(investments);
  }

  async getQuarterlyData(investmentId: number): Promise<QuarterlyData[]> {
    return await db.select().from(quarterlyData).where(eq(quarterlyData.investmentId, investmentId));
  }

  async createQuarterlyData(insertData: InsertQuarterlyData): Promise<QuarterlyData> {
    const [data] = await db
      .insert(quarterlyData)
      .values(insertData)
      .returning();
    return data;
  }

  async getLatestHktStats(): Promise<HktStats | undefined> {
    const [stats] = await db.select().from(hktStats).orderBy(hktStats.id).limit(1);
    return stats || undefined;
  }

  async updateHktStats(insertStats: InsertHktStats): Promise<HktStats> {
    const [stats] = await db
      .insert(hktStats)
      .values(insertStats)
      .returning();
    return stats;
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db
      .insert(subscribers)
      .values(insertSubscriber)
      .returning();
    return subscriber;
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber || undefined;
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers);
  }
}

export const storage = new DatabaseStorage();
