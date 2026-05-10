import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiGlobe, FiEdit2, FiSave, FiLock } from 'react-icons/fi';

export default function MyProfile() {
  const { user, updateUser, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || '',
    profile: {
      fullName: user?.profile?.fullName || '',
      phone: user?.profile?.phone || '',
      country: user?.profile?.country || '',
      bio: user?.profile?.bio || ''
    }
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put('/api/users/profile', form);
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      await axios.post('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: 700 }}>
      <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>👤 My Profile</h2>

      {/* Profile card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 20 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--purple), var(--green))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 700, color: 'white',
            border: '3px solid var(--purple)', boxShadow: 'var(--glow-purple)'
          }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-gaming" style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.username}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <span className={`badge ${user?.role === 'admin' ? 'badge-red' : 'badge-purple'}`}>
                {user?.role?.toUpperCase()}
              </span>
              <span className={`badge ${user?.isBanned ? 'badge-red' : 'badge-green'}`}>
                {user?.isBanned ? 'BANNED' : 'ACTIVE'}
              </span>
              {user?.isEmailVerified && <span className="badge badge-green">✓ VERIFIED</span>}
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={editing ? 'btn-outline' : 'btn-primary'}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 14 }}
          >
            <FiEdit2 size={14} />
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { label: 'Coin Balance', value: `🪙 ${user?.coinBalance?.toLocaleString() || 0}`, color: 'var(--gold)' },
            { label: 'Total Orders', value: user?.totalOrders || 0, color: 'var(--blue)' },
            { label: 'Keys Purchased', value: user?.keysPurchased || 0, color: 'var(--purple-light)' },
            { label: 'Total Spent', value: `🪙 ${user?.totalSpent?.toLocaleString() || 0}`, color: 'var(--green)' },
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, minWidth: 100, background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ color: stat.color, fontWeight: 700, fontSize: 18, fontFamily: 'Orbitron, monospace' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Form fields */}
        <div className="grid-2" style={{ gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Username</label>
            <input
              className="input-gaming"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              disabled={!editing}
              style={{ opacity: editing ? 1 : 0.7 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Full Name</label>
            <input
              className="input-gaming"
              value={form.profile.fullName}
              onChange={e => setForm({ ...form, profile: { ...form.profile, fullName: e.target.value } })}
              disabled={!editing}
              style={{ opacity: editing ? 1 : 0.7 }}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Phone</label>
            <input
              className="input-gaming"
              value={form.profile.phone}
              onChange={e => setForm({ ...form, profile: { ...form.profile, phone: e.target.value } })}
              disabled={!editing}
              style={{ opacity: editing ? 1 : 0.7 }}
              placeholder="Phone number"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Country</label>
            <input
              className="input-gaming"
              value={form.profile.country}
              onChange={e => setForm({ ...form, profile: { ...form.profile, country: e.target.value } })}
              disabled={!editing}
              style={{ opacity: editing ? 1 : 0.7 }}
              placeholder="Your country"
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Bio</label>
            <textarea
              className="input-gaming"
              value={form.profile.bio}
              onChange={e => setForm({ ...form, profile: { ...form.profile, bio: e.target.value } })}
              disabled={!editing}
              style={{ opacity: editing ? 1 : 0.7, resize: 'vertical', minHeight: 80 }}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {editing && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px' }}
          >
            {loading ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><FiSave size={16} /> Save Changes</>}
          </button>
        )}
      </div>

      {/* Change password */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showPasswordSection ? 20 : 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiLock size={18} color="var(--purple-light)" /> Change Password
          </h3>
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="btn-outline"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            {showPasswordSection ? 'Cancel' : 'Change'}
          </button>
        </div>

        {showPasswordSection && (
          <form onSubmit={handlePasswordChange}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Current Password</label>
                <input className="input-gaming" type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Current password" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>New Password</label>
                <input className="input-gaming" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="New password" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Confirm New Password</label>
                <input className="input-gaming" type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Confirm new password" />
              </div>
              <button type="submit" disabled={passwordLoading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', width: 'fit-content' }}>
                {passwordLoading ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><FiLock size={16} /> Update Password</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
