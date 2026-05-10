import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useSettings } from '../context/SettingsContext';
import ParticlesBG from '../components/ParticlesBG';
import {
  FiGrid, FiShoppingBag, FiList, FiDollarSign, FiCreditCard,
  FiUser, FiMessageSquare, FiBell, FiLogOut, FiMenu, FiX, FiShield, FiRadio
} from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiGrid, exact: true },
  { path: '/dashboard/store', label: 'Game Store', icon: FiShoppingBag },
  { path: '/dashboard/orders', label: 'My Orders', icon: FiList },
  { divider: 'FINANCE' },
  { path: '/dashboard/wallet', label: 'Wallet', icon: FiDollarSign },
  { path: '/dashboard/topup', label: 'Coin Top-Up', icon: FiCreditCard },
  { divider: 'COMMUNITY' },
  { path: '/dashboard/live-chat', label: 'Live Chat 🔥', icon: FiRadio },
  { path: '/dashboard/chat', label: 'Chat with Admin', icon: FiMessageSquare },
  { divider: 'ACCOUNT' },
  { path: '/dashboard/profile', label: 'My Profile', icon: FiUser },
  { path: '/dashboard/notifications', label: 'Notifications', icon: FiBell },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <ParticlesBG density={25} opacity={0.2} />

      {/* Mobile overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 99, backdropFilter: 'blur(4px)' }} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--purple),var(--green))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,58,237,0.4)', flexShrink: 0 }}>
              <FiShield size={18} color="#fff" />
            </div>
            <div>
              <div className="font-gaming" style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: 2, lineHeight: 1.2 }}>
                {(settings.siteName || 'GAMEZONE').toUpperCase()}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1, marginTop: 2 }}>RESELLER PANEL</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
            <span style={{ color: 'var(--green)', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, fontFamily: 'Orbitron,monospace' }}>ONLINE</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 0', overflowY: 'auto' }}>
          {navItems.map((item, i) => {
            if (item.divider) return (
              <div key={i} style={{ padding: '14px 22px 5px', color: 'var(--text-muted)', fontSize: 9, fontWeight: 800, letterSpacing: 2, fontFamily: 'Orbitron,monospace' }}>
                {item.divider}
              </div>
            );
            return (
              <NavLink key={item.path} to={item.path} end={item.exact}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <item.icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '10px 12px', background: 'rgba(124,58,237,0.08)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--purple),var(--green))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
              <div style={{ fontSize: 10, color: connected ? 'var(--green)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: connected ? 'var(--green)' : 'var(--text-muted)' }} />
                {connected ? 'Online' : 'Offline'}
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>🪙{user?.coinBalance?.toLocaleString()}</div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '10px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Space Grotesk,sans-serif', fontSize: 13, fontWeight: 600, transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          >
            <FiLogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-content" style={{ flex: 1 }}>
        {/* Header */}
        <header style={{ height: 'var(--header-height)', background: 'rgba(10,10,24,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: 4 }}>
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <h1 className="font-gaming" style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>Dashboard</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Coin balance pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '7px 14px' }}>
              <span style={{ fontSize: 16 }}>🪙</span>
              <span className="font-gaming" style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 800 }}>{user?.coinBalance?.toLocaleString() || 0}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Coins</span>
            </div>

            {/* Avatar */}
            <div onClick={() => navigate('/dashboard/profile')} style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--purple),var(--green))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer', border: '2px solid rgba(124,58,237,0.5)', boxShadow: '0 0 12px rgba(124,58,237,0.3)' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page */}
        <main style={{ padding: '24px', minHeight: 'calc(100vh - var(--header-height))' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
