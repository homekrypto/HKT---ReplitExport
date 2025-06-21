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
  referredBy: integer("referred_by").references(() => users.id),
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

// Cross-chain wallet types
export type SupportedChain = typeof supportedChains.$inferSelect;
export type InsertSupportedChain = typeof supportedChains.$inferInsert;
export type UserWallet = typeof userWallets.$inferSelect;
export type InsertUserWallet = typeof userWallets.$inferInsert;
export type WalletVerificationChallenge = typeof walletVerificationChallenges.$inferSelect;
export type InsertWalletVerificationChallenge = typeof walletVerificationChallenges.$inferInsert;

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