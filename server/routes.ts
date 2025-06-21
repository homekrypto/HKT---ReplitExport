import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInvestmentSchema, insertQuarterlyDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // HKT Stats endpoint
  app.get("/api/hkt-stats", async (req, res) => {
    try {
      const stats = await storage.getLatestHktStats();
      if (!stats) {
        return res.status(404).json({ message: "HKT stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch HKT stats" });
    }
  });

  // Investment calculation endpoint
  app.post("/api/calculate-investment", async (req, res) => {
    try {
      const { monthlyAmount, months } = req.body;
      
      if (!monthlyAmount || !months) {
        return res.status(400).json({ message: "Monthly amount and months are required" });
      }

      const totalInvested = monthlyAmount * months;
      const initialPrice = 0.10;
      const annualGrowth = 0.15;
      const finalPrice = initialPrice * Math.pow(1 + annualGrowth, months / 12);
      
      // Calculate tokens purchased over time
      let totalTokens = 0;
      for (let month = 1; month <= months; month++) {
        const currentPrice = initialPrice * Math.pow(1 + annualGrowth, (month - 1) / 12);
        const tokensThisMonth = monthlyAmount / currentPrice;
        totalTokens += tokensThisMonth;
      }

      const finalValue = totalTokens * finalPrice;
      const profit = finalValue - totalInvested;
      const roi = (profit / totalInvested) * 100;

      res.json({
        totalInvested,
        finalPrice,
        totalTokens,
        finalValue,
        profit,
        roi,
        monthlyAmount,
        months
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate investment" });
    }
  });

  // Create investment endpoint
  app.post("/api/investments", async (req, res) => {
    try {
      const validatedData = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment(validatedData);
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid investment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create investment" });
    }
  });

  // Get investment by wallet
  app.get("/api/investments/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const investment = await storage.getInvestmentByWallet(walletAddress);
      
      if (!investment) {
        return res.status(404).json({ message: "Investment not found" });
      }

      // Get quarterly data
      const quarterlyData = await storage.getQuarterlyData(investment.id);
      
      res.json({
        ...investment,
        quarterlyData
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investment" });
    }
  });

  // Generate quarterly breakdown
  app.post("/api/generate-quarterly-data", async (req, res) => {
    try {
      const { investmentId, monthlyAmount, months } = req.body;
      
      if (!investmentId || !monthlyAmount || !months) {
        return res.status(400).json({ message: "Investment ID, monthly amount, and months are required" });
      }

      const quarters = Math.ceil(months / 3);
      const quarterlyData = [];
      const initialPrice = 0.10;
      const annualGrowth = 0.15;
      let totalHkt = 0;

      for (let i = 0; i < quarters; i++) {
        const year = Math.floor(i / 4) + 1;
        const quarter = (i % 4) + 1;
        const monthsElapsed = i * 3;
        const currentPrice = initialPrice * Math.pow(1 + annualGrowth, monthsElapsed / 12);
        const quarterlyInvestment = monthlyAmount * 3;
        const hktPurchased = quarterlyInvestment / currentPrice;
        totalHkt += hktPurchased;
        const portfolioValue = totalHkt * currentPrice;

        const data = await storage.createQuarterlyData({
          investmentId,
          year,
          quarter,
          hktPrice: currentPrice.toFixed(8),
          hktPurchased: hktPurchased.toFixed(8),
          totalHkt: totalHkt.toFixed(8),
          portfolioValue: portfolioValue.toFixed(2),
          amountInvested: quarterlyInvestment.toFixed(2)
        });

        quarterlyData.push(data);
      }

      res.json(quarterlyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate quarterly data" });
    }
  });

  // Get all investments (admin endpoint)
  app.get("/api/investments", async (req, res) => {
    try {
      const investments = await storage.getAllInvestments();
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
