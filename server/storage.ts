import { 
  users, 
  investments, 
  quarterlyData, 
  hktStats,
  type User, 
  type InsertUser, 
  type Investment, 
  type InsertInvestment,
  type QuarterlyData,
  type InsertQuarterlyData,
  type HktStats,
  type InsertHktStats
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private investments: Map<number, Investment>;
  private quarterlyData: Map<number, QuarterlyData>;
  private hktStats: Map<number, HktStats>;
  private currentUserId: number;
  private currentInvestmentId: number;
  private currentQuarterlyId: number;
  private currentStatsId: number;

  constructor() {
    this.users = new Map();
    this.investments = new Map();
    this.quarterlyData = new Map();
    this.hktStats = new Map();
    this.currentUserId = 1;
    this.currentInvestmentId = 1;
    this.currentQuarterlyId = 1;
    this.currentStatsId = 1;

    // Initialize with sample HKT stats
    this.initializeHktStats();
  }

  private initializeHktStats() {
    const stats: HktStats = {
      id: this.currentStatsId++,
      currentPrice: "0.152",
      priceChange24h: "15.00",
      totalSupply: "1000000000",
      marketCap: "152000000",
      volume24h: "2500000",
      updatedAt: new Date(),
    };
    this.hktStats.set(stats.id, stats);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getInvestment(id: number): Promise<Investment | undefined> {
    return this.investments.get(id);
  }

  async getInvestmentByWallet(walletAddress: string): Promise<Investment | undefined> {
    return Array.from(this.investments.values()).find(
      (investment) => investment.walletAddress === walletAddress,
    );
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = this.currentInvestmentId++;
    const investment: Investment = {
      ...insertInvestment,
      id,
      userId: null,
      isActive: true,
      createdAt: new Date(),
    };
    this.investments.set(id, investment);
    return investment;
  }

  async updateInvestment(id: number, updateData: Partial<Investment>): Promise<Investment | undefined> {
    const investment = this.investments.get(id);
    if (!investment) return undefined;
    
    const updated: Investment = { ...investment, ...updateData };
    this.investments.set(id, updated);
    return updated;
  }

  async getAllInvestments(): Promise<Investment[]> {
    return Array.from(this.investments.values());
  }

  async getQuarterlyData(investmentId: number): Promise<QuarterlyData[]> {
    return Array.from(this.quarterlyData.values()).filter(
      (data) => data.investmentId === investmentId,
    );
  }

  async createQuarterlyData(insertData: InsertQuarterlyData): Promise<QuarterlyData> {
    const id = this.currentQuarterlyId++;
    const data: QuarterlyData = { ...insertData, id };
    this.quarterlyData.set(id, data);
    return data;
  }

  async getLatestHktStats(): Promise<HktStats | undefined> {
    const stats = Array.from(this.hktStats.values());
    return stats.length > 0 ? stats[stats.length - 1] : undefined;
  }

  async updateHktStats(insertStats: InsertHktStats): Promise<HktStats> {
    const id = this.currentStatsId++;
    const stats: HktStats = {
      ...insertStats,
      id,
      updatedAt: new Date(),
    };
    this.hktStats.set(id, stats);
    return stats;
  }
}

export const storage = new MemStorage();
