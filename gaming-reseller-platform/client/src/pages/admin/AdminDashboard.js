import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import { listenOnline } from '../../firebase';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { FiUsers, FiPackage, FiDollarSign, FiTrendingUp, FiActivity, FiAlertCircle, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { Spinner, SkeletonCard } from '../../components/LoadingScreen';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartOpts = (yLabel = '') => ({
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0e0e1f', borderColor: 'rgba(124,58,237,0.4)', borderWidth: 1,
      titleColor: '#a855f7', bodyColor: '#9090b0', padding: 10
    }
  },
  scales: {
    x: { grid: { color: 'rgba(124,58,237,0.06)' }, ticks: { color: '#505070', font: { size: 11 } } },
    y: { grid: { color: 'rgba(124,58,237,0.06)' }, ticks: { color: '#505070', font: { size: 11 } } }
  }
});

function StatCard({ icon: Icon, label, value, sub, color, border, trend }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: `linear-gradient(135deg,${color}10,${color}04)`,
        border: `1px solid ${border}`,
        borderRadius: 16, padding: '22px 20px',
        transition: 'all 0.3s ease', cursor: 'default',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? `0 12px 40px ${color}30` : 'none',
        position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
        {trend !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 700, color: trend >= 0 ? '#10b981' : '#ef4444', background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '3px 8px', borderRadius: 20 }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="font-gaming" style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{value}</div>
      <div style={{ color: '#9090b0', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
      {sub && <div style={{ color: color, fontSize: 11, marginTop: 4 }}>{sub}</div>}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${color},transparent)` }} />
    </div>
  );
}

export default function AdminDashboard() {
  const { onlineCount } = useSocket();
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fbOnline, setFbOnline] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAll();
    const unsub = listenOnline(setFbOnline);
    return unsub;
  }, []);

  const fetchAll = async () => {
    setRefreshing(true);
    try {
      const [d, r] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/revenue-stats?period=30')
      ]);
      setStats(d.data);
      setRevenue(r.data.stats || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const revenueData = {
    labels: revenue.map(s => s._id),
    datasets: [{
      label: 'Revenue', data: revenue.map(s => s.revenue),
      borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.08)',
      fill: true, tension: 0.4, pointBackgroundColor: '#7c3aed',
      pointBorderColor: '#fff', pointRadius: 4, pointHoverRadius: 6
    }]
  };

  const ordersData = {
    labels: revenue.map(s => s._id),
    datasets: [{
      label: 'Orders', data: revenue.map(s => s.orders),
      backgroundColor: revenue.map((_, i) => i % 2 === 0 ? 'rgba(16,185,129,0.7)' : 'rgba(124,58,237,0.7)'),
      borderRadius: 6, borderSkipped: false
    }]
  };

  const categoryData = {
    labels: ['Free Fire', 'Panels', 'APK', 'VIP', 'Keys', 'Other'],
    datasets: [{
      data: [35, 25, 15, 12, 8, 5],
      backgroundColor: ['#7c3aed','#10b981','#f59e0b','#3b82f6','#ec4899','#06b6d4'],
      borderWidth: 0, hoverOffset: 8
    }]
  };

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
      {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} height={120} />)}
    </div>
  );

  const s = stats?.stats || {};

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>📊 Admin Dashboard</h2>
          <p style={{ color: '#505070', fontSize: 13 }}>Real-time platform overview</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Live online badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '8px 16px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulseGlow 1.5s infinite' }} />
            <span style={{ color: '#10b981', fontSize: 13, fontFamily: 'Orbitron,monospace', fontWeight: 700 }}>
              {fbOnline.length || onlineCount} LIVE
            </span>
          </div>
          <button onClick={fetchAll} disabled={refreshing} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a855f7', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Space Grotesk,sans-serif' }}>
            <FiRefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(175px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon={FiUsers}     label="Total Users"    value={s.totalUsers || 0}   color="#3b82f6" border="rgba(59,130,246,0.3)"  trend={12} />
        <StatCard icon={FiPackage}   label="Total Orders"   value={s.totalOrders || 0}  color="#7c3aed" border="rgba(124,58,237,0.3)" trend={8} />
        <StatCard icon={FiActivity}  label="Products"       value={s.totalProducts || 0} color="#10b981" border="rgba(16,185,129,0.3)" />
        <StatCard icon={FiUsers}     label="Online Now"     value={fbOnline.length || onlineCount} color="#10b981" border="rgba(16,185,129,0.3)" sub="Firebase live" />
        <StatCard icon={FiDollarSign} label="Total Revenue" value={`$${(s.totalRevenue||0).toFixed(0)}`} color="#f59e0b" border="rgba(245,158,11,0.3)" trend={15} />
        <StatCard icon={FiTrendingUp} label="Today Revenue" value={`$${(s.todayRevenue||0).toFixed(0)}`} color="#10b981" border="rgba(16,185,129,0.3)" />
        <StatCard icon={FiAlertCircle} label="Banned Users" value={s.bannedUsers || 0}  color="#ef4444" border="rgba(239,68,68,0.3)" />
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
        <div style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Space Grotesk,sans-serif' }}>📈 Revenue (30 Days)</h3>
            <span style={{ fontSize: 11, color: '#505070' }}>USD</span>
          </div>
          <div style={{ height: 200 }}>
            {revenue.length > 0 ? <Line data={revenueData} options={chartOpts('USD')} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#505070', fontSize: 13 }}>No data yet</div>}
          </div>
        </div>
        <div style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Space Grotesk,sans-serif' }}>📦 Orders (30 Days)</h3>
          </div>
          <div style={{ height: 200 }}>
            {revenue.length > 0 ? <Bar data={ordersData} options={chartOpts()} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#505070', fontSize: 13 }}>No data yet</div>}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: 20 }}>

        {/* Recent orders */}
        <div style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Space Grotesk,sans-serif' }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ color: '#a855f7', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <FiArrowRight size={12} /></Link>
          </div>
          {(stats?.recentOrders || []).length === 0
            ? <div style={{ padding: 24, textAlign: 'center', color: '#505070', fontSize: 13 }}>No orders yet</div>
            : (stats?.recentOrders || []).map(o => (
              <div key={o._id} style={{ padding: '12px 20px', borderBottom: '1px solid rgba(124,58,237,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{o.user?.username}</p>
                  <p style={{ fontSize: 11, color: '#505070' }}>{o.orderId}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13 }}>🪙 {o.totalCoins || o.totalAmount}</p>
                  <p style={{ fontSize: 11, color: o.orderStatus === 'completed' ? '#10b981' : '#f59e0b', textTransform: 'uppercase', fontWeight: 600 }}>{o.orderStatus}</p>
                </div>
              </div>
            ))
          }
        </div>

        {/* Recent users */}
        <div style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Space Grotesk,sans-serif' }}>Recent Users</h3>
            <Link to="/admin/users" style={{ color: '#a855f7', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <FiArrowRight size={12} /></Link>
          </div>
          {(stats?.recentUsers || []).map(u => (
            <div key={u._id} style={{ padding: '12px 20px', borderBottom: '1px solid rgba(124,58,237,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {u.username?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.username}</p>
                <p style={{ fontSize: 11, color: '#505070' }}>{new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>🪙{u.coinBalance}</span>
            </div>
          ))}
        </div>

        {/* Category donut + live users */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: 20, flex: 1 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, fontFamily: 'Space Grotesk,sans-serif' }}>Sales by Category</h3>
            <div style={{ height: 140 }}>
              <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0e0e1f', borderColor: 'rgba(124,58,237,0.4)', borderWidth: 1 } }, cutout: '65%' }} />
            </div>
          </div>

          {/* Live online users */}
          <div style={{ background: '#0e0e1f', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulseGlow 1.5s infinite' }} />
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#10b981', fontFamily: 'Space Grotesk,sans-serif' }}>Live Users ({fbOnline.length})</h3>
            </div>
            <div style={{ maxHeight: 120, overflowY: 'auto' }}>
              {fbOnline.length === 0
                ? <p style={{ color: '#505070', fontSize: 12, textAlign: 'center' }}>No users online</p>
                : fbOnline.slice(0, 6).map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#9090b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.username}</span>
                    <span style={{ fontSize: 10, color: '#505070', marginLeft: 'auto', flexShrink: 0 }}>{u.role}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
