import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInvestmentSchema, insertQuarterlyDataSchema, insertSubscriberSchema } from "@shared/schema";
import { getAIAssistance } from "./ai-assistant";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Security middleware
  const helmet = (await import('helmet')).default;
  const cookieParser = (await import('cookie-parser')).default;
  const authRoutes = (await import('./auth-routes')).default;
  
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://replit.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "ws:", "wss:"],
        manifestSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  app.use(cookieParser());

  // Authentication routes
  app.use('/api/auth', authRoutes);
  
  // Booking routes
  const bookingRoutes = (await import('./simple-booking-routes')).default;
  app.use('/api/bookings', bookingRoutes);
  
  // AI Assistant endpoint
  app.post('/api/ai-assistant', async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const aiResponse = await getAIAssistance({
        message,
        context: {
          currentPage: context?.currentPage,
          userId: (req as any).user?.id,
          userInvestments: context?.userInvestments
        }
      });

      res.json(aiResponse);
    } catch (error) {
      console.error('AI Assistant error:', error);
      res.status(500).json({ 
        error: 'AI assistance temporarily unavailable',
        fallback: 'Please contact our support team for immediate help.'
      });
    }
  });
  
  // Email verification route (not under /api/auth)
  const emailVerifyRoutes = (await import('./email-verify')).default;
  app.use(emailVerifyRoutes);
  
  // Cross-chain wallet routes
  const crossChainWalletRoutes = (await import('./cross-chain-wallet')).default;
  app.use('/api/cross-chain-wallet', crossChainWalletRoutes);

  // Swap routes
  const swapRoutes = (await import('./swap-routes')).default;
  app.use('/api/swap', swapRoutes);

  // Blog routes
  const blogRoutes = (await import('./blog-routes')).default;
  app.use('/api/blog', blogRoutes);

  // Investment routes
  app.get("/api/investments/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const investment = await storage.getInvestmentByUserId(userId);
      
      if (!investment) {
        // Return empty investment data if none exists
        return res.json({
          totalInvested: 0,
          currentValue: 0,
          profit: 0,
          roi: 0,
          hktTokens: 0,
          monthlyAmount: 0,
          startDate: null,
          monthsInvested: 0
        });
      }

      // Get latest HKT stats for current calculations
      const hktStats = await storage.getLatestHktStats();
      const currentPrice = parseFloat(hktStats?.currentPrice || '0.152');
      
      // Calculate current value based on tokens owned
      const currentValue = investment.totalTokens * currentPrice;
      const profit = currentValue - investment.totalInvested;
      const roi = investment.totalInvested > 0 ? (profit / investment.totalInvested) * 100 : 0;

      res.json({
        totalInvested: investment.totalInvested,
        currentValue,
        profit,
        roi,
        hktTokens: investment.totalTokens,
        monthlyAmount: investment.monthlyAmount,
        startDate: investment.startDate,
        monthsInvested: investment.monthsInvested
      });
    } catch (error) {
      console.error('Error fetching user investment:', error);
      res.status(500).json({ message: "Failed to fetch investment data" });
    }
  });

  app.post("/api/investments/create", async (req, res) => {
    try {
      const { userId, monthlyAmount, totalInvested, totalTokens, monthsInvested } = req.body;
      
      if (!userId || !monthlyAmount || !totalInvested) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      const investment = await storage.createInvestment({
        userId,
        monthlyAmount,
        totalInvested,
        totalTokens: totalTokens || 0,
        monthsInvested: monthsInvested || 0,
        startDate: new Date(),
        lastUpdated: new Date()
      });

      res.json(investment);
    } catch (error) {
      console.error('Error creating investment:', error);
      res.status(500).json({ message: "Failed to create investment" });
    }
  });

  app.put("/api/investments/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updateData = req.body;
      
      const investment = await storage.updateInvestmentByUserId(userId, {
        ...updateData,
        lastUpdated: new Date()
      });

      if (!investment) {
        return res.status(404).json({ message: "Investment not found" });
      }

      res.json(investment);
    } catch (error) {
      console.error('Error updating investment:', error);
      res.status(500).json({ message: "Failed to update investment" });
    }
  });
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
        return res.status(200).json({ message: "You are already subscribed to our newsletter!" });
      }

      const subscriber = await storage.createSubscriber({ email });
      
      // Send notification email to support
      try {
        const { sendEmail } = await import('./email');
        await sendEmail({
          to: 'support@homekrypto.com',
          subject: 'New Newsletter Subscription - Home Krypto',
          html: `
            <h2>New Newsletter Subscription</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subscribed:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Source:</strong> Footer Newsletter Signup</p>
          `,
          text: `New Newsletter Subscription: ${email} subscribed at ${new Date().toLocaleString()}`
        });

        // Send confirmation email to subscriber
        await sendEmail({
          to: email,
          subject: 'Welcome to Home Krypto Newsletter!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb;">Welcome to Home Krypto!</h1>
              <p>Thank you for subscribing to our newsletter. You'll now receive:</p>
              <ul>
                <li>Latest HKT token updates</li>
                <li>Property investment opportunities</li>
                <li>Platform development news</li>
                <li>Educational content about tokenized real estate</li>
              </ul>
              <p>Stay tuned for exciting updates!</p>
              <p>Best regards,<br>The Home Krypto Team</p>
              <hr>
              <p style="font-size: 12px; color: #666;">
                You received this email because you subscribed to our newsletter at homekrypto.com
              </p>
            </div>
          `,
          text: `Welcome to Home Krypto! Thank you for subscribing to our newsletter. You'll receive updates about HKT tokens, property investments, and platform news.`
        });
      } catch (emailError) {
        console.error('Failed to send subscription emails:', emailError);
      }
      
      res.status(201).json({ 
        message: "Successfully subscribed to our newsletter!",
        subscriber: { id: subscriber.id, email: subscriber.email }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email address", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe. Please try again." });
    }
  });

  // Waitlist signup
  app.post("/api/waitlist", async (req, res) => {
    try {
      const { email, firstName, lastName, interests } = req.body;
      
      if (!email || !email.trim()) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check if already on waitlist
      const existingSubscriber = await storage.getSubscriberByEmail(email);
      if (existingSubscriber) {
        return res.status(409).json({ message: "Email already on waitlist" });
      }

      const subscriber = await storage.createSubscriber({ email });

      // Send notification email to support
      try {
        const { sendEmail } = await import('./email');
        await sendEmail({
          to: 'support@homekrypto.com',
          subject: 'New Waitlist Signup - Home Krypto',
          html: `
            <h2>New Waitlist Signup</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>First Name:</strong> ${firstName || 'Not provided'}</p>
            <p><strong>Last Name:</strong> ${lastName || 'Not provided'}</p>
            <p><strong>Interests:</strong> ${interests || 'Not provided'}</p>
            <p><strong>Signed up:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Source:</strong> Waitlist Page</p>
          `,
          text: `New Waitlist Signup: ${email} (${firstName} ${lastName}) joined the waitlist at ${new Date().toLocaleString()}`
        });

        // Send confirmation email to subscriber
        await sendEmail({
          to: email,
          subject: 'Welcome to the Home Krypto Waitlist!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb;">Welcome to the Home Krypto Waitlist!</h1>
              <p>Hi${firstName ? ` ${firstName}` : ''},</p>
              <p>Thank you for joining our exclusive waitlist! You're now among the first to know about:</p>
              <ul>
                <li>Platform development updates</li>
                <li>Cap Cana pilot property launch</li>
                <li>HKT token news and opportunities</li>
                <li>Early access to new features</li>
              </ul>
              <p>We're working hard to make global real estate investment accessible to everyone, and we can't wait to share this journey with you.</p>
              <p>Best regards,<br>The Home Krypto Team</p>
              <hr>
              <p style="font-size: 12px; color: #666;">
                You received this email because you joined our waitlist at homekrypto.com
              </p>
            </div>
          `,
          text: `Welcome to the Home Krypto Waitlist! Thank you for joining. You'll receive exclusive updates about our platform development, property launches, and early access opportunities.`
        });
      } catch (emailError) {
        console.error('Failed to send waitlist emails:', emailError);
      }

      res.status(201).json({ 
        message: "Successfully joined the waitlist!",
        subscriber: { id: subscriber.id, email: subscriber.email }
      });
    } catch (error) {
      console.error('Waitlist signup error:', error);
      res.status(500).json({ message: "Failed to join waitlist. Please try again." });
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

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, category, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Import sendEmail function
      const { sendEmail } = await import('./email');
      
      // Send email to support
      await sendEmail({
        to: 'support@homekrypto.com',
        subject: `Contact Form: ${subject} [${category || 'General'}]`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Category:</strong> ${category || 'General'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        text: `
          New Contact Form Submission
          
          Name: ${name}
          Email: ${email}
          Category: ${category || 'General'}
          Subject: ${subject}
          
          Message:
          ${message}
        `
      });

      res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: "Failed to send message. Please try again." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
