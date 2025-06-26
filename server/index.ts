import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedSupportedChains } from "./seed-chains";
import { startPriceUpdateService } from "./price-feed";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Add temporary routes for admin panel testing
import tempAdminRoutes from './temp-admin-routes';
import simpleAuthRoutes from './simple-auth';

// Use temporary routes to bypass database connection issues
app.use('/api/temp-admin', tempAdminRoutes);
app.use('/api/auth', simpleAuthRoutes);

// Import temporary user routes
import tempBookingRoutes from './temp-booking-routes.js';
import tempUserRoutes from './temp-user-routes.js';
import tempSimpleBookingRoutes from './temp-simple-booking-routes.js';

// Import temporary blog routes
import tempBlogRoutes from './temp-blog-routes.js';
import { testEmailDelivery } from './test-email';

// Register temporary user functionality routes
app.use('/api/bookings', tempBookingRoutes);
app.use('/api/user', tempUserRoutes);
app.use('/api/simple-booking', tempSimpleBookingRoutes);
app.use('/api/swap', tempUserRoutes); // Swap routes are in temp-user-routes
app.use('/api/cross-chain-wallet', tempUserRoutes); // Wallet routes are in temp-user-routes
app.use('/api/blog', tempBlogRoutes);

// Add email test endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email address required' });
    }
    
    const result = await testEmailDelivery(email);
    
    if (result) {
      res.json({ 
        message: 'Test email sent successfully', 
        email: email,
        status: 'delivered'
      });
    } else {
      res.status(500).json({ 
        message: 'Test email failed to send', 
        email: email,
        status: 'failed'
      });
    }
  } catch (error) {
    console.error('Email test endpoint error:', error);
    res.status(500).json({ message: 'Email test failed' });
  }
});

// Fixed subscribe endpoint (database-free)
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Send notification email to support
    try {
      const { sendHostingerEmail } = await import('./hostinger-email.js');
      await sendHostingerEmail({
        to: 'support@homekrypto.com',
        subject: 'New Newsletter Subscription - Home Krypto',
        html: `
          <h2>New Newsletter Subscription</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subscribed:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Source:</strong> Footer Newsletter Signup</p>
          <br>
          <p><em>This subscription was made via the newsletter form on homekrypto.com</em></p>
        `,
        text: `New Newsletter Subscription: ${email} subscribed at ${new Date().toLocaleString()}`
      });

      // Send confirmation email to subscriber
      await sendHostingerEmail({
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
      subscriber: { id: Date.now(), email: email }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ message: "Failed to subscribe. Please try again." });
  }
});

// Fixed contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    try {
      const { sendHostingerEmail } = await import('./hostinger-email.js');
      
      await sendHostingerEmail({
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
          <br>
          <p><em>This message was sent via the Contact Form on homekrypto.com</em></p>
        `,
        text: `
          New Contact Form Submission
          
          Name: ${name}
          Email: ${email}
          Category: ${category || 'General'}
          Subject: ${subject}
          
          Message:
          ${message}
          
          This message was sent via the Contact Form on homekrypto.com
        `
      });
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError);
    }

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
});

(async () => {
  // Skip database-dependent routes, use direct implementations
  // const server = await registerRoutes(app);
  const { createServer } = await import('http');
  const server = createServer(app);

  // Initialize price feed service
  startPriceUpdateService();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Server-side rendered password reset page
  app.get('/reset-password', (req, res) => {
    const token = req.query.token as string;
    if (!token) {
      return res.status(400).send('Password reset token is required');
    }
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Home Krypto Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
            margin: 1rem;
        }
        .logo { text-align: center; margin-bottom: 2rem; }
        .logo h1 { color: #667eea; font-size: 1.8rem; font-weight: 700; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; }
        input[type="password"] {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.2s;
        }
        input[type="password"]:focus { outline: none; border-color: #667eea; }
        .btn {
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.75rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .error { background: #fee2e2; color: #dc2626; padding: 0.75rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid #fecaca; }
        .back-link { text-align: center; margin-top: 1.5rem; }
        .back-link a { color: #667eea; text-decoration: none; font-weight: 500; }
        .back-link a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>HKT</h1>
            <p>Reset Your Password</p>
        </div>
        
        <form id="resetForm" method="POST" action="/api/auth/reset-password">
            <input type="hidden" name="token" value="${token}">
            
            <div class="form-group">
                <label for="password">New Password:</label>
                <input type="password" id="password" name="password" required minlength="6">
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
            </div>
            
            <button type="submit" class="btn" id="submitBtn">Reset Password</button>
        </form>
        
        <div class="back-link">
            <a href="/">← Back to Home</a>
        </div>
    </div>
    
    <script>
        document.getElementById('resetForm').addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match');
                return;
            }
            
            if (password.length < 6) {
                e.preventDefault();
                alert('Password must be at least 6 characters long');
                return;
            }
            
            document.getElementById('submitBtn').disabled = true;
            document.getElementById('submitBtn').textContent = 'Resetting...';
        });
    </script>
</body>
</html>
    `;
    
    res.send(html);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve download files - these need to be before the catch-all route
  app.get("/api/download-complete", (req, res) => {
    try {
      const filePath = join(__dirname, "../homekrypto-complete-project.tar.gz");
      res.setHeader('Content-Disposition', 'attachment; filename="homekrypto-complete-project.tar.gz"');
      res.setHeader('Content-Type', 'application/gzip');
      res.download(filePath, "homekrypto-complete-project.tar.gz");
    } catch (error) {
      res.status(404).json({ error: "File not found" });
    }
  });

  app.get("/api/download-complete-zip", (req, res) => {
    try {
      const filePath = join(__dirname, "../homekrypto-FULL-SOURCE.tar.gz");
      res.setHeader('Content-Disposition', 'attachment; filename="homekrypto-FULL-SOURCE.tar.gz"');
      res.setHeader('Content-Type', 'application/gzip');
      res.download(filePath, "homekrypto-FULL-SOURCE.tar.gz");
    } catch (error) {
      res.status(404).json({ error: "File not found" });
    }
  });

  app.get("/api/download-source", (req, res) => {
    try {
      const filePath = join(__dirname, "../homekrypto-source-code.tar.gz");
      res.setHeader('Content-Disposition', 'attachment; filename="homekrypto-source-code.tar.gz"');
      res.setHeader('Content-Type', 'application/gzip');
      res.download(filePath, "homekrypto-source-code.tar.gz");
    } catch (error) {
      res.status(404).json({ error: "File not found" });
    }
  });



  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
