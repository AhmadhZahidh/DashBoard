import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { FiShoppingBag, FiCreditCard, FiTrendingUp, FiPackage, FiKey, FiStar, FiArrowRight } from 'react-icons/fi';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const { socket } = useSocket();
  const [announcements, setAnnouncements] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('balance_updated', () => refreshUser());
    socket.on('new_announcement', ann => setAnnouncements(p => [ann, ...p]));
    return () => { socket.off('balance_updated'); socket.off('new_announcement'); };
  }, [socket]);

  const fetchData = async () => {
    try {
      const [a, p] = await Promise.all([
        axios.get('/api/announcements'),
        axios.get('/api/products?hot=true&limit=6')
      ]);
      setAnnouncements(a.data.announcements || []);
      setHotProducts(p.data.products || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const annColor = t => ({ info:'#7c3aed', success:'#10b981', warning:'#f59e0b', error:'#ef4444', update:'#3b82f6' }[t] || '#7c3aed');
  const annIcon  = t => ({ info:'📢', success:'✅', warning:'⚠️', error:'❌', update:'🔄' }[t] || '📢');

  const stats = [
    { icon:'🪙', label:'Coin Balance', value: user?.coinBalance?.toLocaleString() || '0', color:'#f59e0b', border:'rgba(245,158,11,0.35)', bg:'rgba(245,158,11,0.06)' },
    { icon:'📦', label:'Total Orders',  value: user?.totalOrders || '0',    color:'#3b82f6', border:'rgba(59,130,246,0.35)',  bg:'rgba(59,130,246,0.06)' },
    { icon:'🔑', label:'Keys Purchased',value: user?.keysPurchased || '0',  color:'#a855f7', border:'rgba(168,85,247,0.35)', bg:'rgba(168,85,247,0.06)' },
    {
      icon: user?.isBanned ? '🚫' : '⭐',
      label:'Account Status',
      value: user?.isBanned ? 'BANNED' : 'ACTIVE',
      color: user?.isBanned ? '#ef4444' : '#10b981',
      border: user?.isBanned ? 'rgba(239,68,68,0.35)' : 'rgba(16,185,129,0.35)',
      bg: user?.isBanned ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)',
      isStatus: true
    },
  ];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>

      {/* ── Welcome Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(124,58,237,0.18) 0%,rgba(16,185,129,0.08) 100%)',
        border: '1px solid rgba(124,58,237,0.25)', borderRadius: 18, padding: '26px 30px',
        marginBottom: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16, position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative glow */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'radial-gradient(circle,rgba(124,58,237,0.2),transparent)', pointerEvents: 'none' }} />

        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 4 }}>Welcome back,</p>
          <h2 className="font-gaming" style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 4, letterSpacing: 1 }}>
            {user?.username?.toUpperCase()}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Your reseller activity overview</p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/dashboard/store" style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px',
            background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff',
            borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14,
            fontFamily: 'Space Grotesk,sans-serif', boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
            transition: 'all 0.3s ease'
          }}>
            <FiShoppingBag size={16} /> Store
          </Link>
          <Link to="/dashboard/topup" style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px',
            background: 'transparent', color: 'var(--gold)', border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14,
            fontFamily: 'Space Grotesk,sans-serif', transition: 'all 0.3s ease'
          }}>
            <FiCreditCard size={16} /> Top-Up
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: s.bg, border: `1px solid ${s.border}`, borderRadius: 16,
            padding: '22px 20px', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
            cursor: 'default'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${s.border}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: 30, marginBottom: 12 }}>{s.icon}</div>
            {s.isStatus
              ? <div className="font-gaming" style={{ fontSize: 20, fontWeight: 800, color: s.color, marginBottom: 6, letterSpacing: 2 }}>{s.value}</div>
              : <div className="font-gaming" style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{s.value}</div>
            }
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.color},transparent)` }} />
          </div>
        ))}
      </div>

      {/* ── Announcements + Hot Games ── */}
      <div className="grid-2" style={{ gap: 24 }}>

        {/* Announcements */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Grotesk,sans-serif' }}>
              <span style={{ fontSize: 18 }}>📢</span> Announcements
            </h3>
          </div>

          {loading
            ? Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 72, marginBottom: 10, borderRadius: 10 }} />)
            : announcements.length === 0
              ? <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>No announcements yet
                </div>
              : announcements.map((ann, i) => (
                <div key={ann._id || i} style={{
                  background: 'var(--bg-card)', borderRadius: 12, padding: '14px 18px',
                  borderLeft: `3px solid ${annColor(ann.type)}`, marginBottom: 10,
                  transition: 'all 0.2s ease', animation: `fadeInUp 0.4s ease ${i * 0.05}s both`
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15 }}>{annIcon(ann.type)}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#fff', fontFamily: 'Space Grotesk,sans-serif' }}>{ann.title}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11, flexShrink: 0, marginLeft: 8 }}>
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>{ann.message}</p>
                </div>
              ))
          }
        </div>

        {/* Hot Games */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Grotesk,sans-serif' }}>
              <span style={{ fontSize: 18 }}>🔥</span> Hot Games
            </h3>
            <Link to="/dashboard/store" style={{ color: 'var(--purple-light)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              View All <FiArrowRight size={13} />
            </Link>
          </div>

          {loading
            ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 130, borderRadius: 12 }} />)}
              </div>
            : hotProducts.length === 0
              ? <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🎮</div>No hot products yet
                </div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                  {hotProducts.slice(0, 4).map((p, i) => (
                    <Link key={p._id} to="/dashboard/store" style={{ textDecoration: 'none' }}>
                      <div style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
                        overflow: 'hidden', transition: 'all 0.3s ease',
                        animation: `fadeInUp 0.4s ease ${i * 0.08}s both`
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div style={{ height: 90, background: 'linear-gradient(135deg,#1a0a2e,rgba(124,58,237,0.4))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                          {p.image
                            ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: 28 }}>🎮</span>
                          }
                          {p.badge && (
                            <div style={{ position: 'absolute', top: 6, right: 6, background: p.badge === 'HOT' ? '#ef4444' : p.badge === 'NEW' ? '#10b981' : '#f59e0b', color: '#fff', padding: '2px 7px', borderRadius: 4, fontSize: 9, fontWeight: 800, fontFamily: 'Orbitron,monospace' }}>
                              {p.badge}
                            </div>
                          )}
                        </div>
                        <div style={{ padding: '10px 12px' }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Space Grotesk,sans-serif' }}>{p.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>🪙 {p.coinPrice || p.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
          }
        </div>
      </div>
    </div>
  );
}
