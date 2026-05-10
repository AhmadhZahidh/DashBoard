const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/announcements
router.get('/', protect, async (req, res) => {
  try {
    const query = {
      isActive: true,
      $or: [{ targetRole: 'all' }, { targetRole: req.user.role }],
      $or: [{ expiresAt: null }, { expiresAt: { $gt: Date.now() } }]
    };

    const announcements = await Announcement.find({ isActive: true })
      .sort('-isPinned -createdAt')
      .limit(20);

    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/announcements - Admin create
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });

    const io = req.app.get('io');
    if (io) {
      io.emit('new_announcement', announcement);
    }

    res.status(201).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/announcements/:id - Admin update
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @DELETE /api/announcements/:id - Admin delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
