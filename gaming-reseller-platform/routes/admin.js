const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const AdminLog = require('../models/AdminLog');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/admin/dashboard - Dashboard analytics
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      onlineUsers,
      bannedUsers,
      recentOrders,
      recentUsers,
      totalRevenue,
      todayRevenue,
      topProducts
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ isOnline: true }),
      User.countDocuments({ isBanned: true }),
      Order.find().sort('-createdAt').limit(5).populate('user', 'username email'),
      User.find({ role: 'user' }).sort('-createdAt').limit(5),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.productName', count: { $sum: '$items.quantity' }, revenue: { $sum: '$items.price' } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    // Monthly revenue for chart
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        onlineUsers,
        bannedUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0
      },
      recentOrders,
      recentUsers: recentUsers.map(u => u.toPublicJSON()),
      topProducts,
      monthlyRevenue
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/admin/logs
router.get('/logs', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const total = await AdminLog.countDocuments();
    const logs = await AdminLog.find()
      .populate('admin', 'username')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({ success: true, logs, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/admin/broadcast - Broadcast notification to all users
router.post('/broadcast', protect, adminOnly, async (req, res) => {
  try {
    const { message, type = 'info' } = req.body;

    await User.updateMany({ role: 'user' }, {
      $push: { notifications: { message, type, createdAt: new Date() } }
    });

    const io = req.app.get('io');
    if (io) io.emit('broadcast', { message, type });

    res.json({ success: true, message: 'Broadcast sent to all users' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/admin/online-users
router.get('/online-users', protect, adminOnly, async (req, res) => {
  try {
    const onlineUsers = await User.find({ isOnline: true }).select('username email avatar lastSeen role');
    res.json({ success: true, count: onlineUsers.length, users: onlineUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/admin/revenue-stats
router.get('/revenue-stats', protect, adminOnly, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    const stats = await Order.aggregate([
      { $match: { createdAt: { $gte: daysAgo }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
