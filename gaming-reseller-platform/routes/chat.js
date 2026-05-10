const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/chat/my - Get user's chat
router.get('/my', protect, async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = await Chat.create({ user: req.user._id, messages: [] });
    }
    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/chat/send - Send message
router.post('/send', protect, async (req, res) => {
  try {
    const { message, messageType = 'text', fileUrl } = req.body;

    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = await Chat.create({ user: req.user._id, messages: [] });
    }

    const newMessage = {
      sender: req.user._id,
      senderName: req.user.username,
      senderRole: req.user.role,
      message,
      messageType,
      fileUrl
    };

    chat.messages.push(newMessage);
    chat.lastMessage = message;
    chat.lastMessageAt = Date.now();

    if (req.user.role !== 'admin') {
      chat.adminUnreadCount++;
    } else {
      chat.unreadCount = 0;
    }

    await chat.save();

    const io = req.app.get('io');
    if (io) {
      const savedMsg = chat.messages[chat.messages.length - 1];
      io.to(`user_${req.user._id}`).emit('new_message', savedMsg);
      io.to('admin_room').emit('new_message', { ...savedMsg.toObject(), userId: req.user._id, username: req.user.username });
    }

    res.json({ success: true, message: chat.messages[chat.messages.length - 1] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/chat/all - Admin get all chats
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('user', 'username email avatar isOnline')
      .sort('-lastMessageAt')
      .select('-messages');

    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/chat/:userId - Admin get specific user chat
router.get('/:userId', protect, adminOnly, async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.params.userId })
      .populate('user', 'username email avatar');

    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    // Mark admin messages as read
    chat.adminUnreadCount = 0;
    await chat.save();

    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/chat/:userId/reply - Admin reply
router.post('/:userId/reply', protect, adminOnly, async (req, res) => {
  try {
    const { message } = req.body;

    let chat = await Chat.findOne({ user: req.params.userId });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    const newMessage = {
      sender: req.user._id,
      senderName: req.user.username,
      senderRole: 'admin',
      message
    };

    chat.messages.push(newMessage);
    chat.lastMessage = message;
    chat.lastMessageAt = Date.now();
    chat.unreadCount++;
    await chat.save();

    const io = req.app.get('io');
    if (io) {
      const savedMsg = chat.messages[chat.messages.length - 1];
      io.to(`user_${req.params.userId}`).emit('new_message', savedMsg);
    }

    res.json({ success: true, message: chat.messages[chat.messages.length - 1] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
