import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedSupportedChains } from "./seed-chains";
import { startPriceUpdateService } from "./price-feed";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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
import completeAuthRoutes from './complete-auth-routes';

// Use temporary routes to bypass database connection issues
app.use('/api/temp-admin', tempAdminRoutes);
app.use('/api/auth', completeAuthRoutes);

// Import temporary user routes
import tempBookingRoutes from './temp-booking-routes.js';
import tempUserRoutes from './temp-user-routes.js';
import tempSimpleBookingRoutes from './temp-simple-booking-routes.js';

// Import temporary blog routes
import tempBlogRoutes from './temp-blog-routes.js';

// Register temporary user functionality routes
app.use('/api/bookings', tempBookingRoutes);
app.use('/api/user', tempUserRoutes);
app.use('/api/simple-booking', tempSimpleBookingRoutes);
app.use('/api/swap', tempUserRoutes); // Swap routes are in temp-user-routes
app.use('/api/cross-chain-wallet', tempUserRoutes); // Wallet routes are in temp-user-routes
app.use('/api/blog', tempBlogRoutes);

(async () => {
  // Skip database-dependent routes during connection issues
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
