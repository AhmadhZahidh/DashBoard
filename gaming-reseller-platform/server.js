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

const io = socketIO(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/build', 'index.html')));
}

require('./socket/socketHandler')(io);
app.use(require('./middleware/errorHandler'));

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gaming_reseller';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ MongoDB Connected:', uri);
  } catch (err) {
    console.log('⚠️  Real MongoDB unavailable, using in-memory MongoDB...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      console.log('✅ In-Memory MongoDB running');
    } catch (e) {
      console.error('❌ DB failed:', e.message);
      process.exit(1);
    }
  }
  await require('./utils/seedAdmin')();
}

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log('');
    console.log('🚀 ================================');
    console.log(`🚀  Server: http://localhost:${PORT}`);
    console.log(`🎮  Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`👤  Admin: admin@gamingreseller.com`);
    console.log(`🔑  Pass:  Admin@123456`);
    console.log('🚀 ================================');
    console.log('');
  });
});
