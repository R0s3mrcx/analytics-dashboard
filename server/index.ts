// server/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { handleDemo } from "./routes/demo.js";
import { logger } from "./logger.js";

export async function createServer() {
  const app = express();

  // -----------------------
  // CORS restrictivo
  // -----------------------
  const FRONTEND_ORIGINS = (process.env.FRONTEND_URLS || "http://localhost:5173").split(",");

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server
      if (FRONTEND_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed: " + origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));

  // -----------------------
  // Middleware JSON + URL encoded
  // -----------------------
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // -----------------------
  // Rate limiting para /api/events
  // -----------------------
  const eventsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 120,            // máximo 120 requests/min
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/events", eventsLimiter);

  // -----------------------
  // Health & readiness endpoints
  // -----------------------
  app.get("/health", (_req, res) => {
    logger.info("Health check OK");
    res.status(200).send("OK");
  });

  app.get("/ready", (_req, res) => {
    logger.info("Readiness check OK");
    res.status(200).json({ status: "ready" });
  });

  // -----------------------
  // Example API routes
  // -----------------------
  app.get("/api/ping", (_req, res) => {
    logger.info("Ping recibido");
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // -----------------------
  // Auth routes (server-side)
  // -----------------------
  const authModule = await import("./routes/auth.js");
  app.post("/api/auth/login", authModule.handleLogin);
  app.post("/api/auth/logout", authModule.handleLogout);

  // -----------------------
  // Secure events endpoint
  // -----------------------
  const eventsModule = await import("./routes/events.js");
  app.get("/api/events", eventsModule.handleEvents);
  app.post("/api/events", eventsModule.handleEvents);

  return app;
}

// -----------------------
// Run server locally (ESM compatible)
// -----------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 8080;
  createServer()
    .then(app => {
      app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      logger.error("Error starting server:", err);
      process.exit(1);
    });
}

