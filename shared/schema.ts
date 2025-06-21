import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
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

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type QuarterlyData = typeof quarterlyData.$inferSelect;
export type InsertQuarterlyData = z.infer<typeof insertQuarterlyDataSchema>;
export type HktStats = typeof hktStats.$inferSelect;
export type InsertHktStats = z.infer<typeof insertHktStatsSchema>;
