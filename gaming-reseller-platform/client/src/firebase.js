import { initializeApp } from 'firebase/app';
import {
  getDatabase, ref, push, onValue, off, serverTimestamp,
  query, orderByChild, limitToLast, set, update, get, remove, onDisconnect
} from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://dashboardchat-9878f-default-rtdb.firebaseio.com/'
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// ─── GLOBAL CHAT (public room) ────────────────────────────────
export const sendGlobalMessage = (userId, username, role, message, avatar) =>
  push(ref(db, 'globalChat/messages'), {
    userId, username, role, message, avatar: avatar || '',
    timestamp: serverTimestamp(), deleted: false
  });

export const listenGlobalMessages = (callback) => {
  const q = query(ref(db, 'globalChat/messages'), orderByChild('timestamp'), limitToLast(100));
  onValue(q, snap => {
    const msgs = [];
    snap.forEach(c => msgs.push({ id: c.key, ...c.val() }));
    callback(msgs);
  });
  return () => off(q);
};

export const deleteGlobalMessage = (msgId) =>
  update(ref(db, `globalChat/messages/${msgId}`), { deleted: true, message: '[Message deleted]' });

// ─── TYPING INDICATOR ─────────────────────────────────────────
export const setTyping = (userId, username, isTyping) =>
  set(ref(db, `globalChat/typing/${userId}`), isTyping ? { username, timestamp: Date.now() } : null);

export const listenTyping = (currentUserId, callback) => {
  const r = ref(db, 'globalChat/typing');
  onValue(r, snap => {
    const typers = [];
    snap.forEach(c => {
      if (c.key !== currentUserId) {
        const v = c.val();
        if (v && Date.now() - v.timestamp < 4000) typers.push(v.username);
      }
    });
    callback(typers);
  });
  return () => off(r);
};

// ─── ONLINE PRESENCE ──────────────────────────────────────────
export const setOnline = async (userId, username, role, avatar) => {
  const r = ref(db, `presence/${userId}`);
  await set(r, { userId, username, role, avatar: avatar || '', online: true, joinedAt: serverTimestamp() });
  onDisconnect(r).remove();
};

export const setOffline = (userId) => remove(ref(db, `presence/${userId}`));

export const listenOnline = (callback) => {
  const r = ref(db, 'presence');
  onValue(r, snap => {
    const users = [];
    snap.forEach(c => users.push({ id: c.key, ...c.val() }));
    callback(users);
  });
  return () => off(r);
};

// ─── PRIVATE CHAT (admin ↔ user) ──────────────────────────────
export const sendPrivateMessage = (roomId, senderId, senderName, senderRole, message) =>
  push(ref(db, `privateChats/${roomId}/messages`), {
    senderId, senderName, senderRole, message,
    timestamp: serverTimestamp(), isRead: false
  });

export const listenPrivateChat = (roomId, callback) => {
  const q = query(ref(db, `privateChats/${roomId}/messages`), orderByChild('timestamp'), limitToLast(100));
  onValue(q, snap => {
    const msgs = [];
    snap.forEach(c => msgs.push({ id: c.key, ...c.val() }));
    callback(msgs);
  });
  return () => off(q);
};

export const listenAllPrivateRooms = (callback) => {
  const r = ref(db, 'privateChats');
  onValue(r, snap => {
    const rooms = [];
    snap.forEach(c => rooms.push({ id: c.key, ...c.val() }));
    callback(rooms);
  });
  return () => off(r);
};

export const markMessagesRead = (roomId) =>
  update(ref(db, `privateChats/${roomId}`), { adminUnread: 0 });

// ─── ANNOUNCEMENTS ────────────────────────────────────────────
export const pushAnnouncement = (data) =>
  push(ref(db, 'announcements'), { ...data, timestamp: serverTimestamp() });

export const listenAnnouncements = (callback) => {
  const q = query(ref(db, 'announcements'), orderByChild('timestamp'), limitToLast(20));
  onValue(q, snap => {
    const list = [];
    snap.forEach(c => list.push({ id: c.key, ...c.val() }));
    callback(list.reverse());
  });
  return () => off(q);
};

export { ref, push, onValue, off, serverTimestamp, update, set, remove };
