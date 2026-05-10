const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, profile, avatar } = req.body;
    const updateData = {};

    if (username) {
      const exists = await User.findOne({ username, _id: { $ne: req.user._id } });
      if (exists) return res.status(400).json({ success: false, message: 'Username already taken' });
      updateData.username = username;
    }
    if (profile) updateData.profile = profile;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/users/notifications
router.get('/notifications', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    res.json({ success: true, notifications: user.notifications.sort((a, b) => b.createdAt - a.createdAt) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/users/notifications/read
router.put('/notifications/read', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { 'notifications.$[].isRead': true } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin routes
// @GET /api/users - Admin get all users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, banned } = req.query;
    const query = {};

    if (search) query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    if (role) query.role = role;
    if (banned === 'true') query.isBanned = true;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      success: true,
      users: users.map(u => u.toPublicJSON()),
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/users/:id - Admin get user
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/users/:id/ban - Admin ban user
router.put('/:id/ban', protect, adminOnly, async (req, res) => {
  try {
    const { banReason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true, banReason: banReason || 'Violation of terms' },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const io = req.app.get('io');
    if (io) io.to(`user_${req.params.id}`).emit('account_banned', { message: banReason || 'Your account has been banned.' });

    res.json({ success: true, message: 'User banned', user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/users/:id/unban - Admin unban user
router.put('/:id/unban', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false, banReason: '' },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User unbanned', user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/users/:id/role - Admin change role
router.put('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Role updated', user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @DELETE /api/users/:id - Admin delete user
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/users/:id/notify - Admin send notification to user
router.post('/:id/notify', protect, adminOnly, async (req, res) => {
  try {
    const { message, type = 'info' } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.notifications.push({ message, type });
    await user.save();

    const io = req.app.get('io');
    if (io) io.to(`user_${req.params.id}`).emit('notification', { message, type });

    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
