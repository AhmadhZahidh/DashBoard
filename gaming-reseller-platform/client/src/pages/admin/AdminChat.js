import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendPrivateMessage, listenPrivateChat, listenAllPrivateRooms, markMessagesRead } from '../../firebase';
import toast from 'react-hot-toast';
import { FiSend, FiMessageSquare, FiSearch, FiCircle } from 'react-icons/fi';
import { Spinner } from '../../components/LoadingScreen';

export default function AdminChat() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);
  const unsubMsgsRef = useRef(null);

  // Listen to all private chat rooms
  useEffect(() => {
    const unsub = listenAllPrivateRooms(setChats);
    return unsub;
  }, []);

  // Listen to selected chat messages
  useEffect(() => {
    if (unsubMsgsRef.current) unsubMsgsRef.current();
    if (!selected) return;
    unsubMsgsRef.current = listenPrivateChat(selected.id, (msgs) => {
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    markMessagesRead(selected.id);
    return () => { if (unsubMsgsRef.current) unsubMsgsRef.current(); };
  }, [selected]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      await sendPrivateMessage(selected.id, user._id, user.username, 'admin', reply.trim());
      setReply('');
    } catch (err) {
      toast.error('Failed to send message');
    } finally { setSending(false); }
  };

  const filteredChats = chats.filter(c =>
    !search || c.username?.toLowerCase().includes(search.toLowerCase())
  );

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
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', height: 'calc(100vh - 130px)', display: 'flex', gap: 16 }}>

      {/* ── Chat list ── */}
      <div style={{ width: 290, background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulseGlow 1.5s infinite' }} />
            <h3 className="font-gaming" style={{ fontSize: 14, color: '#fff' }}>LIVE CHAT</h3>
            <span style={{ marginLeft: 'auto', background: 'rgba(124,58,237,0.2)', color: '#a855f7', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
              Firebase
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <FiSearch size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#505070' }} />
            <input className="input-gaming" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 30, fontSize: 12, padding: '8px 8px 8px 30px' }} />
          </div>
        </div>

        {/* Chat list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredChats.length === 0
            ? <div style={{ padding: 24, textAlign: 'center', color: '#505070', fontSize: 13 }}>
                <FiMessageSquare size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                <p>No chats yet</p>
              </div>
            : filteredChats.map(chat => (
              <div key={chat.id} onClick={() => setSelected(chat)} style={{
                padding: '13px 16px', cursor: 'pointer',
                background: selected?.id === chat.id ? 'rgba(124,58,237,0.12)' : 'transparent',
                borderBottom: '1px solid rgba(124,58,237,0.05)',
                borderLeft: selected?.id === chat.id ? '3px solid #7c3aed' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { if (selected?.id !== chat.id) e.currentTarget.style.background = 'rgba(124,58,237,0.06)'; }}
                onMouseLeave={e => { if (selected?.id !== chat.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>
                      {chat.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#10b981', border: '2px solid #0e0e1f' }} />
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{chat.username || chat.id}</span>
                      {chat.adminUnread > 0 && (
                        <span style={{ background: '#ef4444', color: '#fff', width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                          {chat.adminUnread}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: '#505070', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                      {chat.lastMessage || 'No messages'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* ── Chat window ── */}
      <div style={{ flex: 1, background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selected
          ? <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#505070' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <FiMessageSquare size={36} color="#7c3aed" />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#9090b0', marginBottom: 6 }}>Select a conversation</p>
              <p style={{ fontSize: 13 }}>Choose a user from the left to start chatting</p>
            </div>
          : <>
              {/* Chat header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(124,58,237,0.04)' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>
                    {selected.username?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#10b981', border: '2px solid #0e0e1f' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{selected.username}</div>
                  <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiCircle size={8} fill="#10b981" /> Online • Firebase Realtime
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '4px 12px', fontSize: 11, color: '#10b981', fontWeight: 700 }}>
                  🔥 LIVE
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {messages.length === 0
                  ? <div style={{ textAlign: 'center', color: '#505070', marginTop: 40 }}>
                      <p style={{ fontSize: 14 }}>No messages yet. Say hello! 👋</p>
                    </div>
                  : (() => {
                      let lastDate = '';
                      return messages.map((msg, i) => {
                        const isAdmin = msg.senderRole === 'admin';
                        const msgDate = formatDate(msg.timestamp);
                        const showDate = msgDate !== lastDate;
                        lastDate = msgDate;
                        return (
                          <React.Fragment key={msg.id || i}>
                            {showDate && (
                              <div style={{ textAlign: 'center', margin: '8px 0' }}>
                                <span style={{ background: 'rgba(124,58,237,0.15)', color: '#9090b0', padding: '4px 14px', borderRadius: 20, fontSize: 11 }}>{msgDate}</span>
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
                              {!isAdmin && (
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                  {msg.senderName?.[0]?.toUpperCase()}
                                </div>
                              )}
                              <div style={{ maxWidth: '70%' }}>
                                {!isAdmin && <div style={{ fontSize: 11, color: '#505070', marginBottom: 4, marginLeft: 2 }}>{msg.senderName}</div>}
                                <div style={{
                                  background: isAdmin ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : '#141428',
                                  border: isAdmin ? 'none' : '1px solid rgba(124,58,237,0.15)',
                                  borderRadius: isAdmin ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                  padding: '10px 14px', fontSize: 14, lineHeight: 1.5, color: '#fff',
                                  boxShadow: isAdmin ? '0 4px 15px rgba(124,58,237,0.3)' : 'none'
                                }}>
                                  {msg.message}
                                </div>
                                <div style={{ fontSize: 10, color: '#505070', marginTop: 4, textAlign: isAdmin ? 'right' : 'left' }}>
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
              <form onSubmit={handleSend} style={{ padding: '14px 18px', borderTop: '1px solid rgba(124,58,237,0.1)', display: 'flex', gap: 10, background: 'rgba(124,58,237,0.03)' }}>
                <input
                  className="input-gaming"
                  placeholder="Type your reply..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  style={{ flex: 1, fontSize: 14 }}
                />
                <button type="submit" disabled={sending || !reply.trim()} style={{
                  background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '0 20px', cursor: sending || !reply.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14,
                  opacity: sending || !reply.trim() ? 0.6 : 1, transition: 'all 0.2s',
                  fontFamily: 'Space Grotesk,sans-serif', minWidth: 90
                }}>
                  {sending ? <Spinner size={16} color="#fff" /> : <FiSend size={16} />}
                  {sending ? '' : 'Send'}
                </button>
              </form>
            </>
        }
      </div>
    </div>
  );
}
