import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ParticlesBG from '../components/ParticlesBG';
import {
  FiGrid, FiUsers, FiPackage, FiList, FiDollarSign,
  FiSpeaker, FiMessageSquare, FiSettings, FiTag,
  FiFileText, FiLogOut, FiMenu, FiX, FiZap, FiShield
} from 'react-icons/fi';
import { GiCrystalBall } from 'react-icons/gi';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { divider: true, label: 'MANAGEMENT' },
  { path: '/admin/users', label: 'Users', icon: FiUsers },
  { path: '/admin/products', label: 'Products', icon: FiPackage },
  { path: '/admin/orders', label: 'Orders', icon: FiList },
  { divider: true, label: 'FINANCE' },
  { path: '/admin/wallet', label: 'Coin Manager', icon: FiDollarSign },
  { path: '/admin/coupons', label: 'Coupons', icon: FiTag },
  { divider: true, label: 'COMMUNICATION' },
  { path: '/admin/announcements', label: 'Announcements', icon: FiSpeaker },
  { path: '/admin/chat', label: 'Chat Manager', icon: FiMessageSquare },
  { divider: true, label: 'SYSTEM' },
  { path: '/admin/logs', label: 'Admin Logs', icon: FiFileText },
  { path: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { connected, onlineCount } = useSocket();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <ParticlesBG density={20} opacity={0.15} />
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ borderRight: '1px solid rgba(124,58,237,0.3)' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #ef4444, var(--purple))',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FiShield size={18} color="white" />
            </div>
            <div>
              <div className="font-gaming" style={{ fontSize: 13, fontWeight: 700, color: 'white', letterSpacing: 1 }}>
                ADMIN PANEL
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
            <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 600, fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1 }}>
              SUPER ADMIN
            </span>
          </div>
        </div>

        {/* Online count */}
        <div style={{ padding: '10px 20px', background: 'rgba(16,185,129,0.05)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-glow 1.5s infinite' }} />
            <span style={{ color: 'var(--green)', fontSize: 12, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
              {onlineCount} Users Online
            </span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {adminNavItems.map((item, i) => {
            if (item.divider) return (
              <div key={i} style={{ padding: '12px 20px 4px', color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, fontFamily: 'Rajdhani, sans-serif' }}>
                {item.label}
              </div>
            );

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, var(--purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'white'
            }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{user?.username}</div>
              <div style={{ fontSize: 11, color: '#ef4444', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>ADMIN</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-item"
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', justifyContent: 'center' }}
          >
            <FiLogOut size={16} />
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, fontWeight: 600 }}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content" style={{ flex: 1 }}>
        <header style={{
          height: 'var(--header-height)',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <h1 className="font-gaming" style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>
              Admin Panel
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '6px 12px'
            }}>
              <FiShield size={14} color="#ef4444" />
              <span style={{ fontSize: 12, color: '#ef4444', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                ADMIN MODE
              </span>
            </div>
          </div>
        </header>

        <main style={{ padding: '24px', minHeight: 'calc(100vh - var(--header-height))' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
