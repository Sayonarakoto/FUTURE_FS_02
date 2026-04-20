// server/server.js — Express Application Entry Point
// Wires together all MVC layers: Routes → Controllers → Model (Prisma)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import sequelize from './db.js';
import Admin from './models/Admin.js';
import Lead from './models/Lead.js';

// Sync logic moved to startServer() below

// Add this log to check if DATABASE_URL is loaded
console.log("DATABASE_URL from .env:", process.env.DATABASE_URL);

// Import route modules
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js'; // Import analytics routes

const app = express();

// ─── Global Middleware ────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add this log to see if requests hit the server middleware stack
app.use((req, res, next) => {
  console.log(`[SERVER_DEBUG] Middleware stack received: ${req.method} ${req.url}`);
  next();
});

// ─── Request Logger (Development) ─────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
  });
}

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CRM Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Mount Routes ─────────────────────────────────────────
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes); // Mount analytics routes

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Something went wrong',
  });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // This is the "Magic Line"
    await sequelize.sync({ alter: true });
    console.log("✅ TiDB Schema is in sync.");

    app.listen(PORT, () => {
      console.log(`
🚀 CRM Backend active on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth API:     http://localhost:${PORT}/api/auth`);
      console.log(`📋 Leads API:    http://localhost:${PORT}/api/leads`);
      console.log(`📊 Analytics API: http://localhost:${PORT}/api/analytics`); // Added log for analytics API
      console.log(`🌍 Environment:  ${process.env.NODE_ENV || 'development'}
`);
    });
  } catch (error) {
    console.error("❌ Unable to sync tables:", error.message);
    // Fallback for TiDB Cloud constraint rules
    if (error.message.includes("constraint")) {
      console.log("⚠️ Executing TiDB safe-sync fallback...");
      await sequelize.sync();
      app.listen(PORT, () => {
        console.log(`🚀 CRM Backend active on port ${PORT} (Safe-Sync)`);
      });
    }
  }
};

startServer();

export default app;
