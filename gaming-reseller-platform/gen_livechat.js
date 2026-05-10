const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'client/src/pages/dashboard/LiveChat.js');

const lines = [];
const a = (s) => lines.push(s);

a("import React, { useState, useEffect, useRef } from 'react';");
a("import { useAuth } from '../../context/AuthContext';");
a("import { sendGlobalMessage, listenGlobalMessages, listenOnline, setOnline, setOffline, setTyping, listenTyping, deleteGlobalMessage } from '../../firebase';");
a("import toast from 'react-hot-toast';");
a('');
a("const getAvatar = (u) => { const e = ['??','??','?','??','??','??','??','??','??','??','??','??','???','??','??','??']; return e[(u?.charCodeAt(0)||0)%e.length]||'??'; };");
a("const getColor = (u) => { const c=['#7c3aed','#10b981','#3b82f6','#f59e0b','#ec4899','#06b6d4','#8b5cf6','#14b8a6']; return c[(u?.charCodeAt(0)||0)%c.length]||'#7c3aed'; };");
a("const playNotif = () => { try { const ctx=new(window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.setValueAtTime(880,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(440,ctx.currentTime+0.1); g.gain.setValueAtTime(0.3,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.3); o.start(ctx.currentTime); o.stop(ctx.currentTime+0.3); } catch(e){} };");
a("const EMOJIS=['??','??','??','??','??','??','??','?','??','??','??','??','??','??','??','??','??','??','??','??','?','??','??','??','??','??','??','??','??','??'];");

a("export default function LiveChat() {");
a("  const { user } = useAuth();");
a("  const [messages, setMessages] = useState([]);");
a("  const [online, setOnlineUsers] = useState([]);");
a("  const [typers, setTypers] = useState([]);");
a("  const [input, setInput] = useState('');");
a("  const [sending, setSending] = useState(false);");
a("  const [connected, setConnected] = useState(false);");
a("  const [showEmoji, setShowEmoji] = useState(false);");
a("  const [showUsers, setShowUsers] = useState(true);");
a("  const [spamCount, setSpamCount] = useState(0);");
a("  const [lastMsgTime, setLastMsgTime] = useState(0);");
a("  const messagesEndRef = useRef(null);");
a("  const typingTimerRef = useRef(null);");
a("  const prevMsgCount = useRef(0);");
a("  const inputRef = useRef(null);");
a('');
