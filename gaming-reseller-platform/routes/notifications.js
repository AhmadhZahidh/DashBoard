const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @GET /api/notifications
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    const notifications = user.notifications
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/notifications/read-all
router.put('/read-all', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { 'notifications.$[].isRead': true }
    });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @DELETE /api/notifications/clear
router.delete('/clear', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { notifications: [] } });
    res.json({ success: true, message: 'Notifications cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
