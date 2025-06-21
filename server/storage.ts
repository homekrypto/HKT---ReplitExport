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
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // Email verification
  createEmailVerificationToken(token: { userId: number; token: string; expiresAt: Date }): Promise<void>;
  getEmailVerificationToken(token: string): Promise<{ userId: number; expiresAt: Date } | undefined>;
  deleteEmailVerificationToken(token: string): Promise<void>;

  // Password reset
  createPasswordResetToken(token: { userId: number; token: string; expiresAt: Date }): Promise<void>;
  getPasswordResetToken(token: string): Promise<{ userId: number; expiresAt: Date; used: boolean } | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<void>;

  // User sessions
  createUserSession(session: { userId: number; refreshToken: string; deviceInfo?: string; ipAddress?: string; expiresAt: Date }): Promise<void>;
  getUserSession(refreshToken: string): Promise<{ userId: number; expiresAt: Date } | undefined>;
  deleteUserSession(refreshToken: string): Promise<void>;

  // Investments
  getInvestment(id: number): Promise<Investment | undefined>;
  getInvestmentByWallet(walletAddress: string): Promise<Investment | undefined>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: number, investment: Partial<Investment>): Promise<Investment | undefined>;
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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, referralCode));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Email verification methods
  async createEmailVerificationToken(token: { userId: number; token: string; expiresAt: Date }): Promise<void> {
    await db.insert(emailVerificationTokens).values(token);
  }

  async getEmailVerificationToken(token: string): Promise<{ userId: number; expiresAt: Date } | undefined> {
    const [tokenData] = await db
      .select({ userId: emailVerificationTokens.userId, expiresAt: emailVerificationTokens.expiresAt })
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token));
    return tokenData;
  }

  async deleteEmailVerificationToken(token: string): Promise<void> {
    await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
  }

  // Password reset methods
  async createPasswordResetToken(token: { userId: number; token: string; expiresAt: Date }): Promise<void> {
    await db.insert(passwordResetTokens).values(token);
  }

  async getPasswordResetToken(token: string): Promise<{ userId: number; expiresAt: Date; used: boolean } | undefined> {
    const [tokenData] = await db
      .select({
        userId: passwordResetTokens.userId,
        expiresAt: passwordResetTokens.expiresAt,
        used: passwordResetTokens.used,
      })
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    return tokenData;
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.token, token));
  }

  // User session methods
  async createUserSession(session: { userId: number; refreshToken: string; deviceInfo?: string; ipAddress?: string; expiresAt: Date }): Promise<void> {
    await db.insert(userSessions).values(session);
  }

  async getUserSession(refreshToken: string): Promise<{ userId: number; expiresAt: Date } | undefined> {
    const [session] = await db
      .select({ userId: userSessions.userId, expiresAt: userSessions.expiresAt })
      .from(userSessions)
      .where(eq(userSessions.refreshToken, refreshToken));
    return session;
  }

  async deleteUserSession(refreshToken: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.refreshToken, refreshToken));
  }

  async getInvestment(id: number): Promise<Investment | undefined> {
    const [investment] = await db.select().from(investments).where(eq(investments.id, id));
    return investment || undefined;
  }

  async getInvestmentByWallet(walletAddress: string): Promise<Investment | undefined> {
    const [investment] = await db.select().from(investments).where(eq(investments.walletAddress, walletAddress));
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
    return await db.select().from(subscribers).where(eq(subscribers.isActive, true));
  }
}

export const storage = new DatabaseStorage();
