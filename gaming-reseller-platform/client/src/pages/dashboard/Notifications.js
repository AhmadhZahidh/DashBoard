import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiBell, FiCheck, FiTrash2 } from 'react-icons/fi';

const typeColors = { info: 'var(--blue)', success: 'var(--green)', warning: 'var(--gold)', error: 'var(--red)' };
const typeIcons = { info: '📢', success: '✅', warning: '⚠️', error: '❌' };

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      setNotifications(data.notifications || []);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (error) {}
  };

  const clearAll = async () => {
    try {
      await axios.delete('/api/notifications/clear');
      setNotifications([]);
      toast.success('Notifications cleared');
    } catch (error) {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700 }}>🔔 Notifications</h2>
          {unreadCount > 0 && (
            <span style={{ background: 'var(--red)', color: 'white', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              {unreadCount} new
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-outline" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiCheck size={14} /> Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} style={{ padding: '8px 16px', fontSize: 13, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--red)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiTrash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 70, borderRadius: 12 }} />)}
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <FiBell size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 16 }}>No notifications</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map((notif, i) => (
            <div key={i} style={{
              background: notif.isRead ? 'var(--bg-card)' : 'rgba(124,58,237,0.08)',
              border: `1px solid ${notif.isRead ? 'var(--border)' : 'rgba(124,58,237,0.3)'}`,
              borderRadius: 12, padding: '16px 20px',
              display: 'flex', alignItems: 'flex-start', gap: 14,
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: `${typeColors[notif.type] || 'var(--purple)'}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
              }}>
                {typeIcons[notif.type] || '📢'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: notif.isRead ? 'var(--text-secondary)' : 'white', lineHeight: 1.5 }}>
                  {notif.message}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              {!notif.isRead && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)', flexShrink: 0, marginTop: 4 }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
