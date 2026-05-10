/**
 * Firebase Configuration - Production Ready
 * Database: https://dashboardchat-9878f-default-rtdb.firebaseio.com/
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  onValue,
  off,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
  set,
  update,
  remove,
  onDisconnect
} from 'firebase/database';

// Firebase config — only databaseURL needed for Realtime Database
const firebaseConfig = {
  databaseURL: 'https://dashboardchat-9878f-default-rtdb.firebaseio.com/'
};

// Initialize Firebase (prevent duplicate initialization)
const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const db = getDatabase(firebaseApp);

// ─── GLOBAL CHAT ──────────────────────────────────────────────

/**
 * Send a message to the global chat room
 * Returns the new message key
 */
export const sendGlobalMessage = async (userId, username, role, message, avatar) => {
  const msgRef = ref(db, 'globalChat/messages');
  const result = await push(msgRef, {
    userId,
    username,
    role,
    message,
    avatar: avatar || '',
    timestamp: serverTimestamp(),
    clientTime: Date.now(), // fallback for ordering before server timestamp
    deleted: false
  });
  return result.key;
};

/**
 * Listen to global chat messages — returns unsubscribe function
 * FIXED: Proper handler reference for cleanup
 */
export const listenGlobalMessages = (callback) => {
  const q = query(
    ref(db, 'globalChat/messages'),
    orderByChild('timestamp'),
    limitToLast(100)
  );

  const handler = (snap) => {
    const msgs = [];
    snap.forEach((child) => {
      const val = child.val();
      if (val) msgs.push({ id: child.key, ...val });
    });
    // Sort by clientTime as fallback when serverTimestamp hasn't resolved
    msgs.sort((a, b) => {
      const ta = (typeof a.timestamp === 'number' ? a.timestamp : a.clientTime) || 0;
      const tb = (typeof b.timestamp === 'number' ? b.timestamp : b.clientTime) || 0;
      return ta - tb;
    });
    callback(msgs);
  };

  onValue(q, handler);
  // Return proper cleanup
  return () => off(q, 'value', handler);
};

export const deleteGlobalMessage = (msgId) =>
  update(ref(db, `globalChat/messages/${msgId}`), {
    deleted: true,
    message: '[Message deleted by admin]'
  });

// ─── TYPING INDICATOR ─────────────────────────────────────────

export const setTyping = (userId, username, isTyping) => {
  const r = ref(db, `globalChat/typing/${userId}`);
  if (isTyping) {
    return set(r, { username, timestamp: Date.now() });
  }
  return remove(r).catch(() => {});
};

export const listenTyping = (currentUserId, callback) => {
  const r = ref(db, 'globalChat/typing');
  const handler = (snap) => {
    const typers = [];
    const now = Date.now();
    snap.forEach((child) => {
      if (child.key !== currentUserId) {
        const v = child.val();
        if (v && (now - v.timestamp) < 5000) {
          typers.push(v.username);
        }
      }
    });
    callback(typers);
  };
  onValue(r, handler);
  return () => off(r, 'value', handler);
};

// ─── ONLINE PRESENCE ──────────────────────────────────────────

export const setOnline = async (userId, username, role, avatar) => {
  const r = ref(db, `presence/${userId}`);
  await set(r, {
    userId,
    username,
    role,
    avatar: avatar || '',
    online: true,
    joinedAt: serverTimestamp()
  });
  // Auto-remove on disconnect
  onDisconnect(r).remove();
};

export const setOffline = (userId) =>
  remove(ref(db, `presence/${userId}`)).catch(() => {});

export const listenOnline = (callback) => {
  const r = ref(db, 'presence');
  const handler = (snap) => {
    const users = [];
    snap.forEach((child) => {
      const val = child.val();
      if (val) users.push({ id: child.key, ...val });
    });
    callback(users);
  };
  onValue(r, handler);
  return () => off(r, 'value', handler);
};

// ─── PRIVATE CHAT (Admin ↔ User) ──────────────────────────────

export const sendPrivateMessage = (roomId, senderId, senderName, senderRole, message) =>
  push(ref(db, `privateChats/${roomId}/messages`), {
    senderId,
    senderName,
    senderRole,
    message,
    timestamp: serverTimestamp(),
    clientTime: Date.now(),
    isRead: false
  });

export const listenPrivateChat = (roomId, callback) => {
  const q = query(
    ref(db, `privateChats/${roomId}/messages`),
    orderByChild('timestamp'),
    limitToLast(100)
  );
  const handler = (snap) => {
    const msgs = [];
    snap.forEach((child) => msgs.push({ id: child.key, ...child.val() }));
    callback(msgs);
  };
  onValue(q, handler);
  return () => off(q, 'value', handler);
};

export const listenAllPrivateRooms = (callback) => {
  const r = ref(db, 'privateChats');
  const handler = (snap) => {
    const rooms = [];
    snap.forEach((child) => rooms.push({ id: child.key, ...child.val() }));
    callback(rooms.sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0)));
  };
  onValue(r, handler);
  return () => off(r, 'value', handler);
};

export const markMessagesRead = (roomId) =>
  update(ref(db, `privateChats/${roomId}`), { adminUnread: 0 }).catch(() => {});

// ─── ANNOUNCEMENTS ────────────────────────────────────────────

export const pushAnnouncement = (data) =>
  push(ref(db, 'announcements'), { ...data, timestamp: serverTimestamp() });

export const listenAnnouncements = (callback) => {
  const q = query(
    ref(db, 'announcements'),
    orderByChild('timestamp'),
    limitToLast(20)
  );
  const handler = (snap) => {
    const list = [];
    snap.forEach((child) => list.push({ id: child.key, ...child.val() }));
    callback(list.reverse());
  };
  onValue(q, handler);
  return () => off(q, 'value', handler);
};

// Re-export Firebase utilities
export { ref, push, onValue, off, serverTimestamp, update, set, remove };
