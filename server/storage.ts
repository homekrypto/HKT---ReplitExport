import { 
  users, 
  investments, 
  quarterlyData, 
  hktStats,
  subscribers,
  blogPosts,
  type User, 
  type InsertUser, 
  type Investment, 
  type InsertInvestment,
  type QuarterlyData,
  type InsertQuarterlyData,
  type HktStats,
  type InsertHktStats,
  type Subscriber,
  type InsertSubscriber,
  type BlogPost,
  type InsertBlogPost
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike } from "drizzle-orm";

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

  // Blog Posts
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(status?: string, limit?: number, offset?: number): Promise<BlogPost[]>;
  getPublishedBlogPosts(limit?: number, offset?: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  searchBlogPosts(query: string, limit?: number, offset?: number): Promise<BlogPost[]>;

  // Admin - Properties Management
  getAllProperties(): Promise<any[]>;
  getProperty(id: string): Promise<any | undefined>;
  createProperty(property: any): Promise<any>;
  updateProperty(id: string, updates: any): Promise<any>;
  getPropertyBookings(propertyId: string): Promise<any[]>;
  getActivePropertyBookings(propertyId: string): Promise<any[]>;
  
  // Admin - Bookings Management
  getAllBookings(filters?: any): Promise<any[]>;
  
  // Admin - Global Settings
  updateGlobalHktPrice(priceUsd: number): Promise<void>;
  getAdminStats(): Promise<any>;
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

  // Blog Posts
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      return post || undefined;
    } catch (error) {
      console.error('Error getting blog post:', error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
      return post || undefined;
    } catch (error) {
      console.error('Error getting blog post by slug:', error);
      return undefined;
    }
  }

  async getAllBlogPosts(status?: string, limit = 50, offset = 0): Promise<BlogPost[]> {
    try {
      let query = db.select().from(blogPosts);
      
      if (status) {
        query = query.where(eq(blogPosts.status, status));
      }
      
      return await query
        .orderBy(desc(blogPosts.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error('Error getting all blog posts:', error);
      return [];
    }
  }

  async getPublishedBlogPosts(limit = 10, offset = 0): Promise<BlogPost[]> {
    try {
      return await db.select().from(blogPosts)
        .where(eq(blogPosts.status, 'published'))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error('Error getting published blog posts:', error);
      return [];
    }
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    try {
      // Generate slug if not provided
      if (!insertPost.slug) {
        insertPost.slug = insertPost.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      // Set publishedAt if status is published and no publishedAt is set
      if (insertPost.status === 'published' && !insertPost.publishedAt) {
        insertPost.publishedAt = new Date();
      }

      const [post] = await db.insert(blogPosts).values(insertPost).returning();
      return post;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  async updateBlogPost(id: number, updateData: Partial<BlogPost>): Promise<BlogPost | undefined> {
    try {
      // Update the updatedAt timestamp
      updateData.updatedAt = new Date();

      // Set publishedAt if status changed to published and no publishedAt is set
      if (updateData.status === 'published' && !updateData.publishedAt) {
        const currentPost = await this.getBlogPost(id);
        if (currentPost && !currentPost.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }

      const [post] = await db.update(blogPosts)
        .set(updateData)
        .where(eq(blogPosts.id, id))
        .returning();
      
      return post || undefined;
    } catch (error) {
      console.error('Error updating blog post:', error);
      return undefined;
    }
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
  }

  async searchBlogPosts(query: string, limit = 10, offset = 0): Promise<BlogPost[]> {
    try {
      return await db.select().from(blogPosts)
        .where(
          and(
            eq(blogPosts.status, 'published'),
            or(
              ilike(blogPosts.title, `%${query}%`),
              ilike(blogPosts.content, `%${query}%`),
              ilike(blogPosts.excerpt, `%${query}%`)
            )
          )
        )
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error('Error searching blog posts:', error);
      return [];
    }
  }

  // Admin - Properties Management
  async getAllProperties(): Promise<any[]> {
    // Mock data for properties - will be replaced with database implementation
    return [
      {
        id: 'cap-cana-villa',
        name: 'Luxury Beachfront Villa',
        location: 'Cap Cana, Dominican Republic',
        description: 'Stunning oceanfront villa with private pool and beach access',
        pricePerNightUsd: 450,
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        amenities: ['Pool', 'Beach Access', 'WiFi', 'Kitchen', 'Parking'],
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'],
        hktPriceOverride: 0.10,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
  }

  async getProperty(id: string): Promise<any | undefined> {
    const properties = await this.getAllProperties();
    return properties.find(p => p.id === id);
  }

  async createProperty(property: any): Promise<any> {
    // Mock implementation - will be replaced with database
    const newProperty = {
      ...property,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    return newProperty;
  }

  async updateProperty(id: string, updates: any): Promise<any> {
    // Mock implementation - will be replaced with database
    const property = await this.getProperty(id);
    if (!property) throw new Error('Property not found');
    
    return {
      ...property,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }

  async getPropertyBookings(propertyId: string): Promise<any[]> {
    // Mock implementation - will be replaced with database query
    return [];
  }

  async getActivePropertyBookings(propertyId: string): Promise<any[]> {
    const bookings = await this.getPropertyBookings(propertyId);
    return bookings.filter(b => b.status === 'confirmed');
  }

  // Admin - Bookings Management
  async getAllBookings(filters?: any): Promise<any[]> {
    // Mock implementation - will be replaced with database query
    return [];
  }

  // Admin - Global Settings
  async updateGlobalHktPrice(priceUsd: number): Promise<void> {
    // Update HKT stats with new price
    await this.updateHktStats({
      price: priceUsd,
      priceChange24h: 0,
      lastUpdated: new Date().toISOString(),
      dataSource: 'admin_override'
    });
  }

  async getAdminStats(): Promise<any> {
    const users = await db.select().from(users);
    const investments = await this.getAllInvestments();
    const subscribers = await this.getAllSubscribers();
    const blogPosts = await this.getAllBlogPosts();

    return {
      totalUsers: users.length,
      totalInvestments: investments.length,
      totalSubscribers: subscribers.length,
      totalBlogPosts: blogPosts.length,
      totalInvestedAmount: investments.reduce((sum, inv) => sum + parseFloat(inv.totalInvested || '0'), 0),
      activeUsers: users.filter(u => u.emailVerified).length,
      platformStats: {
        totalProperties: 1, // Will be dynamic when database is implemented
        totalBookings: 0,
        totalRevenue: 0
      }
    };
  }
}

export const storage = new DatabaseStorage();
