import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { storage } from "./storage";
import {
  authenticateToken,
  optionalAuth,
  hashPassword,
  verifyPassword,
  generateJWT,
  generateRefreshToken,
  generateSecureToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
  verifyJWT,
  verifyRefreshToken,
} from './auth';
import {
  registerUserSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '@shared/schema';
import { insertInvestmentSchema, insertQuarterlyDataSchema, insertSubscriberSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5000',
    credentials: true,
  }));

  // Rate limiting
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { message: 'Too many authentication attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/auth', authLimiter);
  app.use('/api', generalLimiter);
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

  // Subscribe to newsletter
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email } = insertSubscriberSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(email);
      if (existingSubscriber) {
        return res.status(400).json({ message: "Email is already subscribed" });
      }

      const subscriber = await storage.createSubscriber({ email });
      res.status(201).json({ 
        message: "Successfully subscribed to HKT updates",
        subscriber: { id: subscriber.id, email: subscriber.email }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email address", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Get all subscribers (admin endpoint)
  app.get("/api/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getAllSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  // Authentication routes
  
  // Register
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Check username if provided
      if (validatedData.username) {
        const existingUsername = await storage.getUserByUsername(validatedData.username);
        if (existingUsername) {
          return res.status(400).json({ message: 'Username already taken' });
        }
      }

      // Hash password
      const passwordHash = await hashPassword(validatedData.password);

      // Generate referral code
      const referralCode = generateSecureToken().substring(0, 8).toUpperCase();

      // Create user
      const user = await storage.createUser({
        email: validatedData.email,
        username: validatedData.username,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        referralCode,
        referredBy: validatedData.referralCode ? await storage.getUserByReferralCode(validatedData.referralCode)?.then(u => u?.id) : undefined,
      });

      // Generate verification token
      const verificationToken = generateSecureToken();
      await storage.createEmailVerificationToken({
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      // Send verification email
      await sendVerificationEmail(user.email, verificationToken);

      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          emailVerified: user.emailVerified,
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, rememberMe } = loginSchema.parse(req.body);

      // Get user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate tokens
      const accessToken = generateJWT(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      // Store refresh token
      await storage.createUserSession({
        userId: user.id,
        refreshToken,
        deviceInfo: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip || 'Unknown',
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
      });

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          walletAddress: user.walletAddress,
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Refresh token
  app.post('/api/auth/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
      }

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // Check if token exists in database
      const session = await storage.getUserSession(refreshToken);
      if (!session || session.expiresAt < new Date()) {
        return res.status(403).json({ message: 'Refresh token expired or invalid' });
      }

      // Generate new access token
      const accessToken = generateJWT(decoded.userId, decoded.email);

      res.json({ accessToken });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ message: 'Token refresh failed' });
    }
  });

  // Logout
  app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (refreshToken) {
        await storage.deleteUserSession(refreshToken);
      }

      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Logout failed' });
    }
  });

  // Verify email
  app.get('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: 'Verification token required' });
      }

      // Find and verify token
      const verificationToken = await storage.getEmailVerificationToken(token);
      if (!verificationToken || verificationToken.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }

      // Update user email verification status
      await storage.updateUser(verificationToken.userId, { emailVerified: true });

      // Delete used token
      await storage.deleteEmailVerificationToken(token);

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ message: 'Email verification failed' });
    }
  });

  // Forgot password
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      }

      // Generate reset token
      const resetToken = generateSecureToken();
      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      });

      // Send reset email
      await sendPasswordResetEmail(user.email, resetToken);

      res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Password reset request failed' });
    }
  });

  // Reset password
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);

      // Find and verify token
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken || resetToken.expiresAt < new Date() || resetToken.used) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      // Hash new password
      const passwordHash = await hashPassword(password);

      // Update user password
      await storage.updateUser(resetToken.userId, { passwordHash });

      // Mark token as used
      await storage.markPasswordResetTokenUsed(token);

      res.json({ message: 'Password reset successful' });
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Password reset failed' });
    }
  });

  // Change password (authenticated)
  app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

      // Verify current password
      if (!user.passwordHash || !(await verifyPassword(currentPassword, user.passwordHash))) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const passwordHash = await hashPassword(newPassword);

      // Update password
      await storage.updateUser(user.id, { passwordHash });

      res.json({ message: 'Password changed successfully' });
    } catch (error: any) {
      console.error('Change password error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Password change failed' });
    }
  });

  // Get current user
  app.get('/api/auth/me', authenticateToken, async (req, res) => {
    const user = (req as any).user;
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      walletAddress: user.walletAddress,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
    });
  });

  // Update profile
  app.put('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const updateData = updateProfileSchema.parse(req.body);

      // Check username uniqueness if provided
      if (updateData.username && updateData.username !== user.username) {
        const existingUser = await storage.getUserByUsername(updateData.username);
        if (existingUser) {
          return res.status(400).json({ message: 'Username already taken' });
        }
      }

      // Update user
      const updatedUser = await storage.updateUser(user.id, updateData);

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        },
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Profile update failed' });
    }
  });

  // Web3 wallet connection
  app.post('/api/auth/connect-wallet', authenticateToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const { walletAddress } = req.body;

      if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return res.status(400).json({ message: 'Invalid wallet address' });
      }

      // Check if wallet is already connected to another account
      const existingWallet = await storage.getUserByWallet(walletAddress);
      if (existingWallet && existingWallet.id !== user.id) {
        return res.status(400).json({ message: 'Wallet already connected to another account' });
      }

      // Update user with wallet address
      await storage.updateUser(user.id, { walletAddress });

      res.json({ message: 'Wallet connected successfully' });
    } catch (error) {
      console.error('Wallet connection error:', error);
      res.status(500).json({ message: 'Wallet connection failed' });
    }
  });

  // Web3 login (sign message with wallet)
  app.post('/api/auth/wallet-login', async (req, res) => {
    try {
      const { walletAddress, signature, message } = req.body;

      if (!walletAddress || !signature || !message) {
        return res.status(400).json({ message: 'Wallet address, signature, and message required' });
      }

      // Here you would verify the signature using ethers.js or web3.js
      // For now, we'll assume the signature is valid
      
      // Find or create user with wallet address
      let user = await storage.getUserByWallet(walletAddress);
      
      if (!user) {
        // Create new user with wallet
        user = await storage.createUser({
          email: `${walletAddress}@wallet.local`, // Placeholder email
          walletAddress,
          emailVerified: true, // Consider wallet connection as verified
        });
      }

      // Generate tokens
      const accessToken = generateJWT(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      // Store refresh token
      await storage.createUserSession({
        userId: user.id,
        refreshToken,
        deviceInfo: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip || 'Unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      res.json({
        message: 'Wallet login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          emailVerified: user.emailVerified,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Wallet login error:', error);
      res.status(500).json({ message: 'Wallet login failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
