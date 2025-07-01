import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
  boolean,
  uuid,
  unique,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Authentication tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 50 }).unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  primaryWalletAddress: varchar("primary_wallet_address", { length: 42 }).unique(),
  isEmailVerified: boolean("is_email_verified").default(false),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: varchar("two_factor_secret", { length: 32 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  referralCode: varchar("referral_code", { length: 20 }).unique(),
  referredBy: integer("referred_by"),
  loginAttempts: integer("login_attempts").default(0),
  lockoutUntil: timestamp("lockout_until"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at").defaultNow(),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
});

export const passwordResets = pgTable("password_resets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emailVerifications = pgTable("email_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business tables
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
  monthlyAmount: decimal("monthly_amount", { precision: 10, scale: 2 }).notNull(),
  totalInvested: decimal("total_invested", { precision: 10, scale: 2 }).notNull(),
  hktTokens: decimal("hkt_tokens", { precision: 18, scale: 8 }).notNull(),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).notNull(),
  profit: decimal("profit", { precision: 10, scale: 2 }).notNull(),
  roi: decimal("roi", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quarterlyData = pgTable("quarterly_data", {
  id: serial("id").primaryKey(),
  investmentId: integer("investment_id").references(() => investments.id),
  year: integer("year").notNull(),
  quarter: integer("quarter").notNull(),
  hktPrice: decimal("hkt_price", { precision: 10, scale: 8 }).notNull(),
  hktPurchased: decimal("hkt_purchased", { precision: 18, scale: 8 }).notNull(),
  totalHkt: decimal("total_hkt", { precision: 18, scale: 8 }).notNull(),
  portfolioValue: decimal("portfolio_value", { precision: 10, scale: 2 }).notNull(),
  amountInvested: decimal("amount_invested", { precision: 10, scale: 2 }).notNull(),
});

export const hktStats = pgTable("hkt_stats", {
  id: serial("id").primaryKey(),
  currentPrice: decimal("current_price", { precision: 10, scale: 8 }).notNull(),
  priceChange24h: decimal("price_change_24h", { precision: 5, scale: 2 }).notNull(),
  totalSupply: decimal("total_supply", { precision: 18, scale: 8 }).notNull(),
  marketCap: decimal("market_cap", { precision: 15, scale: 2 }).notNull(),
  volume24h: decimal("volume_24h", { precision: 15, scale: 2 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cross-chain wallet verification tables
export const supportedChains = pgTable("supported_chains", {
  id: serial("id").primaryKey(),
  chainId: integer("chain_id").unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  rpcUrl: varchar("rpc_url", { length: 500 }).notNull(),
  blockExplorerUrl: varchar("block_explorer_url", { length: 500 }),
  nativeCurrency: jsonb("native_currency").notNull(), // {name, symbol, decimals}
  isTestnet: boolean("is_testnet").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userWallets = pgTable("user_wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  chainId: integer("chain_id").notNull().references(() => supportedChains.id),
  walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
  walletType: varchar("wallet_type", { length: 50 }).notNull(), // metamask, walletconnect, etc
  isVerified: boolean("is_verified").default(false),
  isPrimary: boolean("is_primary").default(false),
  verificationSignature: text("verification_signature"),
  verificationMessage: text("verification_message"),
  verificationTimestamp: timestamp("verification_timestamp"),
  lastUsed: timestamp("last_used").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueUserChainWallet: unique().on(table.userId, table.chainId, table.walletAddress),
}));

export const walletVerificationChallenges = pgTable("wallet_verification_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
  chainId: integer("chain_id").notNull().references(() => supportedChains.id),
  challenge: text("challenge").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Validation schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isEmailVerified: true,
  twoFactorEnabled: true,
  twoFactorSecret: true,
  profileImageUrl: true,
  loginAttempts: true,
  lockoutUntil: true,
  lastLoginAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  userId: true,
  token: true,
  expiresAt: true,
  userAgent: true,
  ipAddress: true,
});

export const insertPasswordResetSchema = createInsertSchema(passwordResets).pick({
  userId: true,
  token: true,
  expiresAt: true,
});

export const insertEmailVerificationSchema = createInsertSchema(emailVerifications).pick({
  userId: true,
  token: true,
  expiresAt: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).pick({
  userId: true,
  walletAddress: true,
  monthlyAmount: true,
  totalInvested: true,
  hktTokens: true,
  currentValue: true,
  profit: true,
  roi: true,
});

// Booking system tables
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  propertyId: text("property_id").notNull(),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  nights: integer("nights").notNull(),
  totalUsd: decimal("total_usd", { precision: 10, scale: 2 }),
  totalHkt: decimal("total_hkt", { precision: 18, scale: 8 }),
  currency: text("currency").notNull(), // 'USD' or 'HKT'
  cleaningFee: decimal("cleaning_fee", { precision: 10, scale: 2 }).notNull(),
  isFreeWeek: boolean("is_free_week").default(false),
  status: text("status").default("confirmed"), // confirmed, canceled, completed
  stripeSessionId: text("stripe_session_id"),
  transactionHash: text("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const propertyShares = pgTable("property_shares", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  userWallet: text("user_wallet").notNull(),
  propertyId: text("property_id").notNull(),
  sharesOwned: integer("shares_owned").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  totalShares: integer("total_shares").notNull(),
  sharePrice: decimal("share_price", { precision: 10, scale: 2 }).notNull(),
  images: text("images").array(),
  amenities: text("amenities").array(),
  maxGuests: integer("max_guests").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuarterlyDataSchema = createInsertSchema(quarterlyData).pick({
  investmentId: true,
  year: true,
  quarter: true,
  hktPrice: true,
  hktPurchased: true,
  totalHkt: true,
  portfolioValue: true,
  amountInvested: true,
});

export const insertHktStatsSchema = createInsertSchema(hktStats).pick({
  currentPrice: true,
  priceChange24h: true,
  totalSupply: true,
  marketCap: true,
  volume24h: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type PasswordReset = typeof passwordResets.$inferSelect;
export type InsertPasswordReset = z.infer<typeof insertPasswordResetSchema>;
export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = z.infer<typeof insertEmailVerificationSchema>;

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type QuarterlyData = typeof quarterlyData.$inferSelect;
export type InsertQuarterlyData = z.infer<typeof insertQuarterlyDataSchema>;
export type HktStats = typeof hktStats.$inferSelect;
export type InsertHktStats = z.infer<typeof insertHktStatsSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

// Real Estate Agents
export const realEstateAgents = pgTable("real_estate_agents", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  company: varchar("company", { length: 200 }),
  licenseNumber: varchar("license_number", { length: 50 }).notNull(),
  licenseState: varchar("license_state", { length: 50 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  country: varchar("country", { length: 50 }).notNull().default('United States'),
  website: varchar("website", { length: 500 }),
  linkedIn: varchar("linkedin", { length: 500 }),
  bio: text("bio"),
  specializations: text("specializations").array(),
  yearsExperience: integer("years_experience"),
  languagesSpoken: text("languages_spoken").array(),
  profileImage: varchar("profile_image", { length: 500 }),
  referralLink: varchar("referral_link", { length: 500 }).unique(),
  seoBacklinkUrl: varchar("seo_backlink_url", { length: 500 }),
  status: varchar("status", { length: 20 }).notNull().default('pending'), // 'pending', 'approved', 'denied'
  isApproved: boolean("is_approved").default(false), // Keep for backward compatibility
  isActive: boolean("is_active").default(true),
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  commission: decimal("commission", { precision: 5, scale: 2 }).default("2.50"), // Default 2.5%
  totalSales: decimal("total_sales", { precision: 15, scale: 2 }).default("0"),
  totalCommission: decimal("total_commission", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agent-Property assignments
export const agentProperties = pgTable("agent_properties", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull().references(() => realEstateAgents.id),
  propertyId: varchar("property_id", { length: 100 }).notNull(), // References properties
  isPrimaryAgent: boolean("is_primary_agent").default(false),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }),
  assignedAt: timestamp("assigned_at").defaultNow(),
  assignedBy: integer("assigned_by").references(() => users.id),
});

// Cross-chain wallet types
export type SupportedChain = typeof supportedChains.$inferSelect;
export type InsertSupportedChain = typeof supportedChains.$inferInsert;
export type UserWallet = typeof userWallets.$inferSelect;
export type InsertUserWallet = typeof userWallets.$inferInsert;
export type WalletVerificationChallenge = typeof walletVerificationChallenges.$inferSelect;
export type InsertWalletVerificationChallenge = typeof walletVerificationChallenges.$inferInsert;

// Booking system types
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type PropertyShare = typeof propertyShares.$inferSelect;
export type InsertPropertyShare = typeof propertyShares.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// Real Estate Agent types
export type RealEstateAgent = typeof realEstateAgents.$inferSelect;
export type InsertRealEstateAgent = typeof realEstateAgents.$inferInsert;
export type AgentProperty = typeof agentProperties.$inferSelect;
export type InsertAgentProperty = typeof agentProperties.$inferInsert;
export type AgentStatus = 'pending' | 'approved' | 'denied';

// Booking system schemas
export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyShareSchema = createInsertSchema(propertyShares).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  createdAt: true,
});

// Create insert schemas for cross-chain wallet tables  
export const insertSupportedChainSchema = createInsertSchema(supportedChains).pick({
  chainId: true,
  name: true,
  rpcUrl: true,
  blockExplorerUrl: true,
  nativeCurrency: true,
  isTestnet: true,
  isActive: true,
});

export const insertUserWalletSchema = createInsertSchema(userWallets).pick({
  userId: true,
  chainId: true,
  walletAddress: true,
  walletType: true,
  isVerified: true,
  isPrimary: true,
});

export const insertWalletVerificationChallengeSchema = createInsertSchema(walletVerificationChallenges).pick({
  userId: true,
  walletAddress: true,
  chainId: true,
  challenge: true,
  expiresAt: true,
});

// Blog Posts Schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  author: varchar("author", { length: 100 }).default("HomeKrypto Team"),
  status: varchar("status", { length: 20 }).default("draft"), // draft, published, archived
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  featuredImageUrl: varchar("featured_image_url", { length: 500 }),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  author: true,
  status: true,
  publishedAt: true,
  metaTitle: true,
  metaDescription: true,
  featuredImageUrl: true
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;