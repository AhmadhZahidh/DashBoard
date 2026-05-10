const jwt = require('jsonwebtoken');
const User = require('../models/User');

const onlineUsers = new Map();

module.exports = (io) => {
  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const user = socket.user;
    console.log(`🔌 User connected: ${user.username} (${socket.id})`);

    // Join user's personal room
    socket.join(`user_${user._id}`);

    // Join admin room if admin
    if (user.role === 'admin' || user.role === 'moderator') {
      socket.join('admin_room');
    }

    // Track online users
    onlineUsers.set(user._id.toString(), {
      socketId: socket.id,
      username: user.username,
      role: user.role,
      connectedAt: Date.now()
    });

    // Update user online status
    await User.findByIdAndUpdate(user._id, { isOnline: true, lastSeen: Date.now() });

    // Broadcast online count to admins
    io.to('admin_room').emit('online_count', { count: onlineUsers.size, users: Array.from(onlineUsers.values()) });

    // Send welcome notification
    socket.emit('connected', {
      message: `Welcome back, ${user.username}!`,
      onlineCount: onlineUsers.size
    });

    // Handle chat messages
    socket.on('send_message', async (data) => {
      try {
        const { message, targetUserId } = data;
        if (!message || !message.trim()) return;

        // Emit to target user or admin
        if (user.role === 'admin' && targetUserId) {
          io.to(`user_${targetUserId}`).emit('new_message', {
            sender: user._id,
            senderName: user.username,
            senderRole: 'admin',
            message,
            createdAt: new Date()
          });
        } else {
          io.to('admin_room').emit('new_message', {
            sender: user._id,
            senderName: user.username,
            senderRole: user.role,
            message,
            userId: user._id,
            createdAt: new Date()
          });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      if (user.role === 'admin' && data.targetUserId) {
        io.to(`user_${data.targetUserId}`).emit('admin_typing', { isTyping: data.isTyping });
      } else {
        io.to('admin_room').emit('user_typing', { userId: user._id, username: user.username, isTyping: data.isTyping });
      }
    });

    // Handle ping/heartbeat
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${user.username}`);
      onlineUsers.delete(user._id.toString());

      await User.findByIdAndUpdate(user._id, { isOnline: false, lastSeen: Date.now() });

      io.to('admin_room').emit('online_count', { count: onlineUsers.size, users: Array.from(onlineUsers.values()) });
      io.to('admin_room').emit('user_offline', { userId: user._id, username: user.username });
    });
  });

  // Export online users getter
  io.getOnlineUsers = () => onlineUsers;
};
