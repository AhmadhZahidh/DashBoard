import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendPrivateMessage, listenPrivateChat, setOnline } from '../../firebase';
import toast from 'react-hot-toast';
import { FiSend, FiMessageSquare, FiCircle } from 'react-icons/fi';
import { Spinner } from '../../components/LoadingScreen';

export default function ChatWithAdmin() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;
    const roomId = user._id;
    const unsub = listenPrivateChat(roomId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return unsub;
  }, [user?._id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      await sendPrivateMessage(user._id, user._id, user.username, user.role, newMsg.trim());
      setNewMsg('');
    } catch {
      toast.error('Failed to send message');
    } finally { setSending(false); }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(typeof ts === 'object' ? ts.seconds * 1000 : ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = new Date(typeof ts === 'object' ? ts.seconds * 1000 : ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return 'Today';
    const y = new Date(now); y.setDate(now.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      <h2 className="font-gaming" style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>💬 Chat with Admin</h2>

      <div style={{ flex: 1, background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(124,58,237,0.04)' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#ef4444,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 15px rgba(124,58,237,0.4)' }}>
            🛡️
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Support Admin</div>
            <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiCircle size={8} fill="#10b981" /> Online • Firebase Realtime
            </div>
          </div>
          <div style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '4px 12px', fontSize: 11, color: '#10b981', fontWeight: 700 }}>
            🔥 LIVE
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.length === 0
            ? <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#505070', paddingTop: 60 }}>
                <FiMessageSquare size={48} style={{ marginBottom: 14, opacity: 0.3 }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: '#9090b0', marginBottom: 6 }}>No messages yet</p>
                <p style={{ fontSize: 13 }}>Send a message to start chatting with admin!</p>
              </div>
            : (() => {
                let lastDate = '';
                return messages.map((msg, i) => {
                  const isUser = msg.senderRole !== 'admin';
                  const msgDate = formatDate(msg.timestamp);
                  const showDate = msgDate !== lastDate;
                  lastDate = msgDate;
                  return (
                    <React.Fragment key={msg.id || i}>
                      {showDate && (
                        <div style={{ textAlign: 'center', margin: '6px 0' }}>
                          <span style={{ background: 'rgba(124,58,237,0.15)', color: '#9090b0', padding: '3px 12px', borderRadius: 20, fontSize: 11 }}>{msgDate}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                        {!isUser && (
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#ef4444,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>🛡️</div>
                        )}
                        <div style={{ maxWidth: '72%' }}>
                          <div style={{
                            background: isUser ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : '#141428',
                            border: isUser ? 'none' : '1px solid rgba(124,58,237,0.15)',
                            borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            padding: '10px 14px', fontSize: 14, lineHeight: 1.5, color: '#fff',
                            boxShadow: isUser ? '0 4px 15px rgba(124,58,237,0.3)' : 'none'
                          }}>
                            {msg.message}
                          </div>
                          <div style={{ fontSize: 10, color: '#505070', marginTop: 3, textAlign: isUser ? 'right' : 'left' }}>
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                });
              })()
          }
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{ padding: '14px 18px', borderTop: '1px solid rgba(124,58,237,0.1)', display: 'flex', gap: 10 }}>
          <input
            className="input-gaming"
            placeholder="Type your message..."
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            style={{ flex: 1, fontSize: 14 }}
          />
          <button type="submit" disabled={sending || !newMsg.trim()} style={{
            background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff',
            border: 'none', borderRadius: 10, padding: '0 20px', cursor: sending || !newMsg.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14,
            opacity: sending || !newMsg.trim() ? 0.6 : 1, transition: 'all 0.2s',
            fontFamily: 'Space Grotesk,sans-serif', minWidth: 90
          }}>
            {sending ? <Spinner size={16} color="#fff" /> : <FiSend size={16} />}
            {sending ? '' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
