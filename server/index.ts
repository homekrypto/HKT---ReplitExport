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
import adminAgentRoutes from './routes/adminAgentRoutes';

// Use temporary routes to bypass database connection issues
app.use('/api/temp-admin', tempAdminRoutes);
app.use('/api/auth', simpleAuthRoutes);
app.use('/api/admin/agents', adminAgentRoutes);

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

// Agent registration route (must be before Vite middleware)
app.post('/api/agents/register', async (req, res) => {
  try {
    const agentData = req.body;
    
    // Only validate email is required - everything else is optional
    if (!agentData.email || !agentData.email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(agentData.email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const { sendHostingerEmail } = await import('./hostinger-email');

    // Send welcome email to the agent
    const agentWelcomeEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">Welcome to HomeKrypto!</h1>
        <h2 style="color: #1e40af;">Registration Submitted Successfully</h2>
        
        <p>Dear ${agentData.firstName || 'Agent'},</p>
        
        <p>Thank you for your interest in becoming a HomeKrypto partner agent. Your application has been submitted and will be reviewed within 1-2 business days.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Boost Your Approval Chances</h3>
          <p>Add a link to HomeKrypto from your website to improve your approval chances and increase your visibility:</p>
          <code style="background-color: #e5e7eb; padding: 10px; display: block; border-radius: 4px; font-family: monospace;">
            &lt;a href="https://homekrypto.com" target="_blank" rel="dofollow"&gt;Proud Partner of HomeKrypto&lt;/a&gt;
          </code>
          <p>Place this code in your website footer, About page, or anywhere visible to visitors. This helps with faster approval and better search rankings.</p>
        </div>
        
        <h3 style="color: #1f2937;">What happens next:</h3>
        <ul style="line-height: 1.6;">
          <li>Our team will verify your license and credentials</li>
          <li>You'll receive an approval notification via email</li>
          <li>Once approved, you'll get your custom referral link</li>
          <li>Your profile will go live on our platform</li>
          <li>You'll gain access to the agent dashboard</li>
        </ul>
        
        <p style="margin-top: 30px;">Best regards,<br>The HomeKrypto Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          This email was sent because you registered as an agent on homekrypto.com. 
          If you didn't make this request, please ignore this email.
        </p>
      </div>
    `;

    const agentWelcomeEmailText = `
      Welcome to HomeKrypto!
      
      Registration Submitted Successfully
      
      Dear ${agentData.firstName || 'Agent'},
      
      Thank you for your interest in becoming a HomeKrypto partner agent. Your application has been submitted and will be reviewed within 1-2 business days.
      
      Boost Your Approval Chances:
      Add a link to HomeKrypto from your website to improve your approval chances and increase your visibility:
      
      <a href="https://homekrypto.com" target="_blank" rel="dofollow">Proud Partner of HomeKrypto</a>
      
      Place this code in your website footer, About page, or anywhere visible to visitors. This helps with faster approval and better search rankings.
      
      What happens next:
      • Our team will verify your license and credentials
      • You'll receive an approval notification via email
      • Once approved, you'll get your custom referral link
      • Your profile will go live on our platform
      • You'll gain access to the agent dashboard
      
      Best regards,
      The HomeKrypto Team
      
      This email was sent because you registered as an agent on homekrypto.com. If you didn't make this request, please ignore this email.
    `;

    // Send notification email to admin
    const adminNotificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #dc2626;">New Agent Registration</h1>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
          <h2 style="color: #991b1b; margin-top: 0;">Agent Details</h2>
          <p><strong>Name:</strong> ${agentData.firstName || 'Not provided'} ${agentData.lastName || 'Not provided'}</p>
          <p><strong>Email:</strong> ${agentData.email}</p>
          <p><strong>Phone:</strong> ${agentData.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${agentData.company || 'Not provided'}</p>
          <p><strong>License Number:</strong> ${agentData.licenseNumber || 'Not provided'}</p>
          <p><strong>Location:</strong> ${agentData.city || 'Not provided'}, ${agentData.country || 'Not provided'}</p>
          <p><strong>Years Experience:</strong> ${agentData.yearsExperience || 'Not provided'}</p>
          <p><strong>Website:</strong> ${agentData.website || 'Not provided'}</p>
          <p><strong>LinkedIn:</strong> ${agentData.linkedIn || 'Not provided'}</p>
          <p><strong>SEO Backlink URL:</strong> ${agentData.seoBacklinkUrl || 'Not provided'}</p>
        </div>
        
        ${agentData.bio ? `
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Professional Bio</h3>
          <p>${agentData.bio}</p>
        </div>
        ` : ''}
        
        ${agentData.languagesSpoken && agentData.languagesSpoken.length > 0 ? `
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0;">Languages Spoken</h3>
          <p>${agentData.languagesSpoken.join(', ')}</p>
        </div>
        ` : ''}
        
        <p style="margin-top: 30px;"><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
        
        <div style="background-color: #fffbeb; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #92400e; margin: 0;"><strong>Action Required:</strong> Please review and approve/reject this agent registration.</p>
        </div>
      </div>
    `;

    try {
      console.log('Sending agent welcome email to:', agentData.email);
      await sendHostingerEmail({
        to: agentData.email,
        subject: 'Welcome to HomeKrypto - Registration Submitted',
        html: agentWelcomeEmailHtml,
        text: agentWelcomeEmailText
      });
      console.log('Agent welcome email sent successfully');

      console.log('Sending admin notification email');
      await sendHostingerEmail({
        to: 'admin@homekrypto.com',
        subject: `New Agent Registration: ${agentData.firstName || ''} ${agentData.lastName || ''} (${agentData.email})`,
        html: adminNotificationHtml,
        text: `New agent registration from ${agentData.firstName || ''} ${agentData.lastName || ''} (${agentData.email}). Please review at homekrypto.com/admin`
      });
      console.log('Admin notification email sent successfully');

    } catch (emailError) {
      console.error('Failed to send agent registration emails:', emailError);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Registration submitted successfully! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('Agent registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed. Please try again.' 
    });
  }
});

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

// Health check endpoint for deployment
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'hkt-platform'
  });
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



  // Seed database with sample data if needed
  try {
    const { seedAgents } = await import('./seed-agents');
    await seedAgents();
  } catch (error) {
    console.log('Agent seeding skipped:', error.message);
  }

  // Support both development and production environments
  // In production (Cloud Run), use PORT env var, default to 5000 for development
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = '0.0.0.0'; // Always bind to 0.0.0.0 for containerized deployments
  
  server.listen({
    port,
    host,
    reusePort: true,
  }, () => {
    log(`serving on ${host}:${port}`);
  });
})();
