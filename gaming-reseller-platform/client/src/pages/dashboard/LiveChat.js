import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendGlobalMessage, listenGlobalMessages, listenOnline, setOnline, setOffline, setTyping, listenTyping, deleteGlobalMessage } from '../../firebase';
import toast from 'react-hot-toast';

const getAvatar = (u) => {
  const e = ['G','F','Z','D','T','A','R','P','B','X','C','S','K','M','N','L'];
  return e[(u?.charCodeAt(0)||0)%e.length]||'G';
};
const getColor = (u) => {
  const c = ['#7c3aed','#10b981','#3b82f6','#f59e0b','#ec4899','#06b6d4','#8b5cf6','#14b8a6'];
  return c[(u?.charCodeAt(0)||0)%c.length]||'#7c3aed';
};
const playNotif = () => { try { const ctx=new(window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.setValueAtTime(880,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(440,ctx.currentTime+0.1); g.gain.setValueAtTime(0.3,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.3); o.start(ctx.currentTime); o.stop(ctx.currentTime+0.3); } catch(e){} };
const EMOJIS=['😀','😂','🔥','💯','👍','❤️','🎮','⚡','💎','🏆','😎','🤩','💪','🙏','👀','🎯','🚀','💀','😈','🤖','✨','🌟','💫','🎲','👾','🤑','😍','🥳','🎉','🔑'];

export default function LiveChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [online, setOnlineUsers] = useState([]);
  const [typers, setTypers] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showUsers, setShowUsers] = useState(true);
  const [spamCount, setSpamCount] = useState(0);
  const [lastMsgTime, setLastMsgTime] = useState(0);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const prevMsgCount = useRef(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    setConnected(false);
    const avatar = getAvatar(user.username);
    setOnline(user._id, user.username, user.role, avatar).then(() => setConnected(true)).catch(() => setConnected(true));
    const unsubMsgs = listenGlobalMessages((msgs) => {
      // Replace optimistic messages with real Firebase data
      setMessages(msgs);
      if (msgs.length > prevMsgCount.current) {
        const last = msgs[msgs.length-1];
        if (last && last.userId !== user._id) playNotif();
      }
      prevMsgCount.current = msgs.length;
      setTimeout(() => messagesEndRef.current && messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }), 80);
    });
    const unsubOnline = listenOnline(setOnlineUsers);
    const unsubTyping = listenTyping(user._id, setTypers);
    return () => { unsubMsgs(); unsubOnline(); unsubTyping(); setOffline(user._id); setTyping(user._id, user.username, false); };
  }, [user]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setTyping(user._id, user.username, true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => setTyping(user._id, user.username, false), 2000);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const msg = input.trim();
    if (!msg) return;
    if (msg.length > 500) { toast.error('Message too long (max 500 chars)'); return; }
    const now = Date.now();
    if (now - lastMsgTime < 1000) { const nc = spamCount + 1; setSpamCount(nc); if (nc >= 5) { toast.error('Slow down!'); return; } } else { setSpamCount(0); }
    setLastMsgTime(now);

    // ── Optimistic UI: add message immediately so it shows right away ──
    const optimisticMsg = {
      id: 'temp_' + now,
      userId: user._id,
      username: user.username,
      role: user.role,
      message: msg,
      avatar: getAvatar(user.username),
      timestamp: now,
      deleted: false,
      _optimistic: true
    };
    setMessages(prev => [...prev.filter(m => !m._optimistic), optimisticMsg]);
    setTimeout(() => messagesEndRef.current && messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }), 50);

    setSending(true); setInput(''); setShowEmoji(false);
    setTyping(user._id, user.username, false);
    clearTimeout(typingTimerRef.current);
    try {
      await sendGlobalMessage(user._id, user.username, user.role, msg, getAvatar(user.username));
      // Firebase listener will replace optimistic msg with real one
    }
    catch(err) {
      toast.error('Failed to send');
      setInput(msg);
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    }
    finally { setSending(false); if (inputRef.current) inputRef.current.focus(); }
  };

  const handleDelete = async (msgId) => {
    if (!user || user.role !== 'admin') return;
    try { await deleteGlobalMessage(msgId); toast.success('Deleted'); } catch(err) { toast.error('Failed'); }
  };

  const addEmoji = (emoji) => { setInput(function(prev) { return prev + emoji; }); if (inputRef.current) inputRef.current.focus(); };

  const fmtTime = (ts) => {
    if (!ts) return '';
    const d = new Date(typeof ts === 'object' ? ts.seconds * 1000 : ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fmtDate = (ts) => {
    if (!ts) return '';
    const d = new Date(typeof ts === 'object' ? ts.seconds * 1000 : ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return 'Today';
    const y = new Date(now); y.setDate(now.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  let lastDate = '';


  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 className="font-gaming" style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            💬 Live Chat Room
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? '#10b981' : '#f59e0b', display: 'inline-block', boxShadow: connected ? '0 0 8px #10b981' : '0 0 8px #f59e0b', animation: 'pulseGlow 1.5s infinite' }} />
          </h2>
          <p style={{ color: '#505070', fontSize: 12, marginTop: 2 }}>
            {connected ? ("Firebase Realtime - " + online.length + " online") : "Connecting to Firebase..."}
          </p>
        </div>
        <button onClick={() => setShowUsers(p => !p)} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a855f7', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600 }}>
          Online: {online.length}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 16, overflow: 'hidden', minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(14,14,31,0.95)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 18, overflow: 'hidden', backdropFilter: 'blur(20px)', minWidth: 0 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(124,58,237,0.12)', background: 'rgba(124,58,237,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'pulseGlow 1.5s infinite' }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#fff', fontFamily: 'Space Grotesk,sans-serif' }}>Global Chat Room</span>
            <span style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>LIVE</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {!connected && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
                <div style={{ position: 'relative', width: 60, height: 60 }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#7c3aed', borderRightColor: '#7c3aed', animation: 'spin 1s linear infinite' }} />
                  <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '2px solid transparent', borderBottomColor: '#10b981', animation: 'spin 0.7s linear infinite reverse' }} />
                </div>
                <p className="font-gaming" style={{ color: '#7c3aed', fontSize: 13, letterSpacing: 3 }}>CONNECTING...</p>
              </div>
            )}
            {connected && messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#505070', gap: 12 }}>
                <div style={{ fontSize: 48 }}>💬</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#9090b0' }}>No messages yet</p>
                <p style={{ fontSize: 13 }}>Be the first to say something!</p>
              </div>
            )}
            {connected && messages.map((msg, i) => {
              const mine = msg.userId === user?._id;
              const msgDate = fmtDate(msg.timestamp);
              const showDate = msgDate !== lastDate;
              lastDate = msgDate;
              const color = getColor(msg.username);
              return (
                <React.Fragment key={msg.id || i}>
                  {showDate && (
                    <div style={{ textAlign: 'center', margin: '12px 0 8px' }}>
                      <span style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)', color: '#9090b0', padding: '4px 16px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{msgDate}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8, marginBottom: 6, animation: 'fadeInUp 0.3s ease' }}>
                    {!mine && (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: color + "20", border: "2px solid " + color + "50", display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {msg.avatar || getAvatar(msg.username)}
                      </div>
                    )}
                    <div style={{ maxWidth: '72%', minWidth: 80 }}>
                      {!mine && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, marginLeft: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color }}>{msg.username}</span>
                          {msg.role === 'admin' && <span style={{ background: 'linear-gradient(135deg,#ef4444,#7c3aed)', color: '#fff', padding: '1px 7px', borderRadius: 20, fontSize: 9, fontWeight: 800, fontFamily: 'Orbitron,monospace' }}>ADMIN</span>}
                          {msg.role === 'moderator' && <span style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', color: '#fff', padding: '1px 7px', borderRadius: 20, fontSize: 9, fontWeight: 800, fontFamily: 'Orbitron,monospace' }}>MOD</span>}
                        </div>
                      )}
                      <div style={{ position: 'relative' }} className="bubble-wrap">
                        <div style={{ background: mine ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : msg.deleted ? 'rgba(239,68,68,0.08)' : 'rgba(20,20,40,0.9)', border: mine ? 'none' : msg.deleted ? '1px solid rgba(239,68,68,0.2)' : "1px solid " + color + "20", borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '10px 14px', fontSize: 14, lineHeight: 1.55, color: msg.deleted ? '#505070' : '#fff', fontStyle: msg.deleted ? 'italic' : 'normal', boxShadow: mine ? '0 4px 20px rgba(124,58,237,0.35)' : '0 2px 10px rgba(0,0,0,0.3)', wordBreak: 'break-word' }}>
                          {msg.message}
                        </div>
                        {user?.role === 'admin' && !msg.deleted && (
                          <button onClick={() => handleDelete(msg.id)} className="delete-btn" style={{ position: 'absolute', top: -8, right: mine ? 'auto' : -8, left: mine ? -8 : 'auto', background: 'rgba(239,68,68,0.9)', border: 'none', color: '#fff', width: 20, height: 20, borderRadius: '50%', cursor: 'pointer', fontSize: 10, display: 'none', alignItems: 'center', justifyContent: 'center' }}>x</button>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: '#505070', marginTop: 3, textAlign: mine ? 'right' : 'left' }}>
                        {fmtTime(msg.timestamp)}{mine && ' ✓'}
                      </div>
                    </div>
                    {mine && (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {getAvatar(user.username)}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
            {typers.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed', animation: 'float ' + (0.5 + i * 0.15) + 's ease-in-out infinite' }} />)}
                </div>
                <span style={{ fontSize: 12, color: '#9090b0', fontStyle: 'italic' }}>{typers.join(', ')} {typers.length === 1 ? 'is' : 'are'} typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(124,58,237,0.12)', background: 'rgba(124,58,237,0.03)' }}>
            {showEmoji && (
              <div style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 14, padding: 12, marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 140, overflowY: 'auto', animation: 'fadeInUp 0.2s ease' }}>
                {EMOJIS.map(e => <button key={e} onClick={() => addEmoji(e)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: '2px 4px', borderRadius: 6 }}>{e}</button>)}
              </div>
            )}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button type="button" onClick={() => setShowEmoji(p => !p)} style={{ background: showEmoji ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.08)', border: showEmoji ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(124,58,237,0.2)', color: '#a855f7', width: 42, height: 42, borderRadius: 10, cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>😊</button>
              <div style={{ flex: 1, position: 'relative' }}>
                <input ref={inputRef} value={input} onChange={handleInputChange} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type a message... (Enter to send)" maxLength={500} style={{ width: '100%', background: 'rgba(14,14,31,0.9)', border: '1px solid rgba(124,58,237,0.25)', color: '#fff', padding: '11px 16px', borderRadius: 12, fontSize: 14, fontFamily: 'Space Grotesk,sans-serif', outline: 'none' }} onFocus={e => e.target.style.borderColor='rgba(124,58,237,0.6)'} onBlur={e => e.target.style.borderColor='rgba(124,58,237,0.25)'} />
                {input.length > 400 && <span style={{ position: 'absolute', right: 10, bottom: -18, fontSize: 10, color: input.length > 480 ? '#ef4444' : '#505070' }}>{input.length}/500</span>}
              </div>
              <button type="submit" disabled={sending || !input.trim()} style={{ background: (sending || !input.trim()) ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg,#7c3aed,#5b21b6)', border: 'none', color: '#fff', width: 46, height: 42, borderRadius: 12, cursor: (sending || !input.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {sending ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : '➤'}
              </button>
            </form>
          </div>
        </div>

        {showUsers && (
          <div style={{ width: 220, background: 'rgba(14,14,31,0.95)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', backdropFilter: 'blur(20px)', flexShrink: 0, animation: 'slideInLeft 0.3s ease' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(124,58,237,0.12)', background: 'rgba(16,185,129,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulseGlow 1.5s infinite' }} />
                <span style={{ fontWeight: 700, fontSize: 13, color: '#10b981', fontFamily: 'Space Grotesk,sans-serif' }}>Online ({online.length})</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
              {online.length === 0
                ? <div style={{ padding: 16, textAlign: 'center', color: '#505070', fontSize: 12 }}>No users online</div>
                : online.map((u, i) => {
                    const color = getColor(u.username);
                    const isMe = u.id === user?._id;
                    return (
                      <div key={u.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, marginBottom: 4, background: isMe ? 'rgba(124,58,237,0.12)' : 'transparent', border: isMe ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent', transition: 'all 0.2s' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: color + "20", border: "2px solid " + color + "50", display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{u.avatar || getAvatar(u.username)}</div>
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#10b981', border: '2px solid #0e0e1f' }} />
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: isMe ? '#a855f7' : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.username}{isMe ? ' (you)' : ''}</div>
                          <div style={{ fontSize: 10, color: u.role === 'admin' ? '#ef4444' : '#505070', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{u.role}</div>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
            <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(124,58,237,0.12)', background: 'rgba(124,58,237,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{getAvatar(user?.username)}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{user?.username}</div>
                  <div style={{ fontSize: 10, color: '#10b981' }}>Online</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{'.bubble-wrap:hover .delete-btn { display: flex !important; }'}</style>
    </div>
  );
}