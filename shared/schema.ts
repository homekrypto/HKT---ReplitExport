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
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User storage table with authentication
export const users: any = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 50 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  walletAddress: varchar("wallet_address", { length: 42 }).unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  emailVerified: boolean("email_verified").default(false),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  referralCode: varchar("referral_code", { length: 20 }),
  referredBy: integer("referred_by").references((): any => users.id),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Email verification tokens
export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User sessions for JWT refresh tokens
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  refreshToken: varchar("refresh_token", { length: 255 }).unique().notNull(),
  deviceInfo: varchar("device_info", { length: 500 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  walletAddress: text("wallet_address").notNull(),
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
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  passwordHash: true,
  walletAddress: true,
});

// Auth schemas
export const registerUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  walletAddress: z.string().optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
});

export const updateProfileSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  username: z.string().min(3).max(50).optional(),
  profileImageUrl: z.string().url().optional(),
});

export const insertInvestmentSchema = createInsertSchema(investments).pick({
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

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type QuarterlyData = typeof quarterlyData.$inferSelect;
export type InsertQuarterlyData = z.infer<typeof insertQuarterlyDataSchema>;
export type HktStats = typeof hktStats.$inferSelect;
export type InsertHktStats = z.infer<typeof insertHktStatsSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

// Additional auth types for frontend
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
export type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
