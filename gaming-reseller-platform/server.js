/**
 * PRRX Gaming Reseller Platform - Production Server
 * Supports: Koyeb, Railway, Render, Heroku
 */
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ── Environment ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const isProd = NODE_ENV === 'production';

// All allowed frontend origins
const ALLOWED_ORIGINS = [
  CLIENT_URL,
  'https://dash-board-delta-snowy.vercel.app',
  // Add any additional Vercel preview URLs here
  ...(process.env.EXTRA_ORIGINS ? process.env.EXTRA_ORIGINS.split(',').map(o => o.trim()) : []),
  // Development origins
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
].filter(Boolean);

// ── Socket.IO ─────────────────────────────────────────────────
const io = socketIO(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

app.set('io', io);

// ── Security & Middleware ─────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
app.use(morgan(isProd ? 'combined' : 'dev'));

// CORS — allow all configured origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    // Allow all Vercel preview deployments
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    // In development, allow everything
    if (!isProd) return callback(null, true);
    // In production, allow all (you can restrict later once stable)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Handle preflight
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/wallet',        require('./routes/wallet'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/chat',          require('./routes/chat'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/upload',        require('./routes/upload'));
app.use('/api/settings',      require('./routes/settings'));
app.use('/api/coupons',       require('./routes/coupons'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check — used by deployment platforms
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    env: NODE_ENV,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.floor(process.uptime()) + 's',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PRRX Gaming Reseller API',
    status: 'running',
    docs: '/api/health'
  });
});

// ── Socket.IO Handler ─────────────────────────────────────────
require('./socket/socketHandler')(io);

// ── Error Handler ─────────────────────────────────────────────
app.use(require('./middleware/errorHandler'));

// ── MongoDB Connection ────────────────────────────────────────
let dbConnected = false;
let reconnectTimer = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('');
    console.error('❌ MONGODB_URI is not set!');
    console.error('   Add MONGODB_URI to your environment variables.');
    console.error('   Get a free MongoDB Atlas URI at: https://cloud.mongodb.com');
    console.error('');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    dbConnected = true;
    console.log('✅ MongoDB Atlas Connected');
    return true;
  } catch (err) {
    dbConnected = false;
    console.error('❌ MongoDB connection failed:', err.message);
    return false;
  }
}

// Auto-reconnect
mongoose.connection.on('disconnected', () => {
  dbConnected = false;
  console.log('⚠️  MongoDB disconnected');
  if (!reconnectTimer) {
    reconnectTimer = setTimeout(async () => {
      reconnectTimer = null;
      if (mongoose.connection.readyState === 0) {
        console.log('🔄 Attempting MongoDB reconnect...');
        await connectDB();
      }
    }, 5000);
  }
});

mongoose.connection.on('reconnected', () => {
  dbConnected = true;
  console.log('✅ MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
});

// ── Start Server ──────────────────────────────────────────────
async function startServer() {
  console.log('');
  console.log('🎮 PRRX Gaming Reseller Platform');
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log('');

  // Connect to database
  const connected = await connectDB();

  if (connected) {
    try {
      await require('./utils/seedAdmin')();
    } catch (e) {
      console.error('Seed error (non-fatal):', e.message);
    }
  }

  // Start HTTP server
  server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 ================================');
    console.log(`🚀  Server: http://localhost:${PORT}`);
    console.log(`🗄️   DB: ${connected ? '✅ Connected' : '❌ Not connected'}`);
    console.log(`🌐  CORS: ${ALLOWED_ORIGINS.join(', ')}`);
    console.log(`👤  Admin: ${process.env.ADMIN_EMAIL || 'admin@gamingreseller.com'}`);
    console.log(`🔑  Pass:  ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('🚀 ================================');
    console.log('');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use!`);
    } else {
      console.error('Server error:', err.message);
    }
    process.exit(1);
  });
}

// ── Process Handlers ──────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  if (isProd) process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

startServer();
