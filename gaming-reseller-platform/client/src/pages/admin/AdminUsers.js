import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch, FiUserX, FiUserCheck, FiTrash2, FiBell, FiEdit2, FiX, FiPlus, FiKey, FiCalendar, FiDollarSign, FiUser } from 'react-icons/fi';
import { Spinner, SkeletonCard } from '../../components/LoadingScreen';

const MODAL_TYPES = { BAN:'ban', UNBAN:'unban', NOTIFY:'notify', TOPUP:'topup', EDIT:'edit', CREATE:'create', KEYS:'keys' };

const emptyUser = { username:'', email:'', password:'', role:'user', coinBalance:0, walletBalance:0 };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [modal, setModal] = useState(null); // { type, user }
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const p = new URLSearchParams({ page, limit: 15 });
      if (search) p.append('search', search);
      if (roleFilter) p.append('role', roleFilter);
      const { data } = await axios.get(`/api/users?${p}`);
      setUsers(data.users || []);
      setPagination(data.pagination || {});
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const openModal = (type, user = null) => {
    setModal({ type, user });
    if (type === MODAL_TYPES.EDIT && user) setForm({ ...user });
    else if (type === MODAL_TYPES.CREATE) setForm({ ...emptyUser });
    else if (type === MODAL_TYPES.TOPUP) setForm({ amount: '', currency: 'coins', description: '' });
    else if (type === MODAL_TYPES.NOTIFY) setForm({ message: '', type: 'info' });
    else if (type === MODAL_TYPES.BAN) setForm({ reason: '' });
    else if (type === MODAL_TYPES.KEYS) setForm({ keys: '', expireDays: 30 });
  };

  const closeModal = () => { setModal(null); setForm({}); };

  const handleBan = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/users/${modal.user._id}/ban`, { banReason: form.reason });
      toast.success('User banned'); fetchUsers(); closeModal();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleUnban = async (id) => {
    try { await axios.put(`/api/users/${id}/unban`); toast.success('User unbanned'); fetchUsers(); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try { await axios.delete(`/api/users/${id}`); toast.success('Deleted'); fetchUsers(); }
    catch { toast.error('Failed'); }
  };

  const handleNotify = async () => {
    setSaving(true);
    try {
      await axios.post(`/api/users/${modal.user._id}/notify`, form);
      toast.success('Notification sent'); closeModal();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleTopUp = async () => {
    if (!form.amount || isNaN(form.amount)) { toast.error('Enter valid amount'); return; }
    setSaving(true);
    try {
      await axios.post('/api/wallet/topup', { userId: modal.user._id, amount: parseInt(form.amount), currency: form.currency, description: form.description });
      toast.success(`${form.amount} ${form.currency} added!`); fetchUsers(); closeModal();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password) { toast.error('Fill all required fields'); return; }
    setSaving(true);
    try {
      await axios.post('/api/auth/register', form);
      toast.success('User created!'); fetchUsers(); closeModal();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/users/${modal.user._id}/role`, { role: form.role });
      if (form.coinBalance !== modal.user.coinBalance) {
        const diff = parseInt(form.coinBalance) - modal.user.coinBalance;
        if (diff > 0) await axios.post('/api/wallet/topup', { userId: modal.user._id, amount: diff, currency: 'coins', description: 'Admin edit' });
        else await axios.post('/api/wallet/deduct', { userId: modal.user._id, amount: Math.abs(diff), currency: 'coins', description: 'Admin edit' });
      }
      toast.success('User updated!'); fetchUsers(); closeModal();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const daysAgo = (date) => {
    const d = Math.floor((Date.now() - new Date(date)) / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return '1 day ago';
    if (d < 30) return `${d} days ago`;
    if (d < 365) return `${Math.floor(d/30)}mo ago`;
    return `${Math.floor(d/365)}yr ago`;
  };

  const roleColor = r => ({ admin:'#ef4444', moderator:'#f59e0b', user:'#7c3aed' }[r] || '#7c3aed');

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-gaming" style={{ fontSize: 20, fontWeight: 800 }}>👥 User Management</h2>
          <p style={{ color: '#505070', fontSize: 12, marginTop: 2 }}>{pagination.total || 0} total users</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#505070' }} />
            <input className="input-gaming" placeholder="Search users..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ paddingLeft: 36, width: 220, fontSize: 13 }} />
          </div>
          {/* Role filter */}
          <select className="input-gaming" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ width: 'auto', fontSize: 13 }}>
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
            <option value="moderator">Moderators</option>
          </select>
          <button onClick={() => openModal(MODAL_TYPES.CREATE)} className="btn-primary" style={{ fontSize: 13, padding: '10px 18px' }}>
            <FiPlus size={15} /> Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#0e0e1f', borderRadius: 16, border: '1px solid rgba(124,58,237,0.15)', overflow: 'hidden' }}>
        {loading
          ? <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} height={52} />)}
            </div>
          : users.length === 0
            ? <div style={{ padding: '50px 20px', textAlign: 'center', color: '#505070' }}>
                <FiUser size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p>No users found</p>
              </div>
            : <div style={{ overflowX: 'auto' }}>
                <table className="table-gaming">
                  <thead>
                    <tr>
                      <th>User</th><th>Role</th><th>Coins</th><th>Orders</th>
                      <th>Status</th><th>Joined</th><th>Last Login</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${roleColor(u.role)},#10b981)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                              {u.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{u.username}</p>
                              <p style={{ fontSize: 11, color: '#505070' }}>{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ background: `${roleColor(u.role)}20`, color: roleColor(u.role), border: `1px solid ${roleColor(u.role)}40`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                            {u.role?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13 }}>🪙 {u.coinBalance?.toLocaleString()}</span>
                        </td>
                        <td style={{ color: '#9090b0', fontSize: 13 }}>{u.totalOrders}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: u.isBanned ? '#ef4444' : u.isOnline ? '#10b981' : '#505070' }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: u.isBanned ? '#ef4444' : u.isOnline ? '#10b981' : '#505070' }}>
                              {u.isBanned ? 'Banned' : u.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: 12, color: '#505070' }}>{daysAgo(u.createdAt)}</td>
                        <td style={{ fontSize: 12, color: '#505070' }}>{u.lastLogin ? daysAgo(u.lastLogin) : 'Never'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 5 }}>
                            {/* Edit */}
                            <ActionBtn icon={FiEdit2} color="#7c3aed" title="Edit" onClick={() => openModal(MODAL_TYPES.EDIT, u)} />
                            {/* Add coins */}
                            <ActionBtn icon={FiDollarSign} color="#f59e0b" title="Add Coins" onClick={() => openModal(MODAL_TYPES.TOPUP, u)} />
                            {/* Notify */}
                            <ActionBtn icon={FiBell} color="#3b82f6" title="Notify" onClick={() => openModal(MODAL_TYPES.NOTIFY, u)} />
                            {/* Ban/Unban */}
                            {u.isBanned
                              ? <ActionBtn icon={FiUserCheck} color="#10b981" title="Unban" onClick={() => handleUnban(u._id)} />
                              : <ActionBtn icon={FiUserX} color="#ef4444" title="Ban" onClick={() => openModal(MODAL_TYPES.BAN, u)} />
                            }
                            {/* Delete */}
                            <ActionBtn icon={FiTrash2} color="#ef4444" title="Delete" onClick={() => handleDelete(u._id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        }

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'center', gap: 6, borderTop: '1px solid rgba(124,58,237,0.1)' }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} style={pageBtnStyle(false)}>‹</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={pageBtnStyle(p === page)}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pagination.pages, p+1))} disabled={page === pagination.pages} style={pageBtnStyle(false)}>›</button>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <ModalHeader title={modalTitle(modal.type)} user={modal.user} onClose={closeModal} />

            {modal.type === MODAL_TYPES.BAN && (
              <ModalBody>
                <Field label="Ban Reason">
                  <textarea className="input-gaming" value={form.reason || ''} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Reason for ban..." style={{ minHeight: 80, resize: 'vertical' }} />
                </Field>
                <ModalActions onCancel={closeModal} onConfirm={handleBan} saving={saving} confirmLabel="🚫 Confirm Ban" confirmColor="#ef4444" />
              </ModalBody>
            )}

            {modal.type === MODAL_TYPES.NOTIFY && (
              <ModalBody>
                <Field label="Message">
                  <textarea className="input-gaming" value={form.message || ''} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Notification message..." style={{ minHeight: 80, resize: 'vertical' }} />
                </Field>
                <Field label="Type">
                  <select className="input-gaming" value={form.type || 'info'} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {['info','success','warning','error'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <ModalActions onCancel={closeModal} onConfirm={handleNotify} saving={saving} confirmLabel="🔔 Send" />
              </ModalBody>
            )}

            {modal.type === MODAL_TYPES.TOPUP && (
              <ModalBody>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Field label="Amount" style={{ flex: 1 }}>
                    <input className="input-gaming" type="number" value={form.amount || ''} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" min="1" />
                  </Field>
                  <Field label="Currency">
                    <select className="input-gaming" value={form.currency || 'coins'} onChange={e => setForm({ ...form, currency: e.target.value })}>
                      <option value="coins">🪙 Coins</option>
                      <option value="wallet">💵 Wallet</option>
                    </select>
                  </Field>
                </div>
                <Field label="Description (optional)">
                  <input className="input-gaming" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Reason..." />
                </Field>
                {/* Quick amounts */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  {[50,100,250,500,1000].map(n => (
                    <button key={n} onClick={() => setForm({ ...form, amount: n })} style={{ background: form.amount == n ? 'var(--purple)' : 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: form.amount == n ? '#fff' : '#a855f7', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                      +{n}
                    </button>
                  ))}
                </div>
                <ModalActions onCancel={closeModal} onConfirm={handleTopUp} saving={saving} confirmLabel="🪙 Add Coins" />
              </ModalBody>
            )}

            {modal.type === MODAL_TYPES.EDIT && (
              <ModalBody>
                <div className="grid-2" style={{ gap: 12 }}>
                  <Field label="Username">
                    <input className="input-gaming" value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} />
                  </Field>
                  <Field label="Role">
                    <select className="input-gaming" value={form.role || 'user'} onChange={e => setForm({ ...form, role: e.target.value })}>
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </Field>
                  <Field label="Coin Balance">
                    <input className="input-gaming" type="number" value={form.coinBalance ?? ''} onChange={e => setForm({ ...form, coinBalance: e.target.value })} />
                  </Field>
                  <Field label="Wallet Balance">
                    <input className="input-gaming" type="number" value={form.walletBalance ?? ''} onChange={e => setForm({ ...form, walletBalance: e.target.value })} />
                  </Field>
                </div>
                <ModalActions onCancel={closeModal} onConfirm={handleEdit} saving={saving} confirmLabel="💾 Save Changes" />
              </ModalBody>
            )}

            {modal.type === MODAL_TYPES.CREATE && (
              <ModalBody>
                <div className="grid-2" style={{ gap: 12 }}>
                  <Field label="Username *">
                    <input className="input-gaming" value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="username" />
                  </Field>
                  <Field label="Email *">
                    <input className="input-gaming" type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                  </Field>
                  <Field label="Password *">
                    <input className="input-gaming" type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="min 6 chars" />
                  </Field>
                  <Field label="Role">
                    <select className="input-gaming" value={form.role || 'user'} onChange={e => setForm({ ...form, role: e.target.value })}>
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </Field>
                  <Field label="Starting Coins">
                    <input className="input-gaming" type="number" value={form.coinBalance || 0} onChange={e => setForm({ ...form, coinBalance: e.target.value })} />
                  </Field>
                </div>
                <ModalActions onCancel={closeModal} onConfirm={handleCreate} saving={saving} confirmLabel="✅ Create User" />
              </ModalBody>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────
const ActionBtn = ({ icon: Icon, color, title, onClick }) => (
  <button onClick={onClick} title={title} style={{ background: `${color}15`, border: `1px solid ${color}30`, color, padding: '6px 8px', borderRadius: 7, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
    onMouseEnter={e => { e.currentTarget.style.background = `${color}30`; }}
    onMouseLeave={e => { e.currentTarget.style.background = `${color}15`; }}
  >
    <Icon size={13} />
  </button>
);

const pageBtnStyle = (active) => ({
  width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer',
  background: active ? 'var(--purple)' : 'rgba(124,58,237,0.1)',
  color: active ? '#fff' : '#9090b0', fontWeight: 700, fontSize: 13,
  transition: 'all 0.2s'
});

const modalTitle = (type) => ({
  ban: '🚫 Ban User', notify: '🔔 Send Notification', topup: '🪙 Add Coins',
  edit: '✏️ Edit User', create: '➕ Create User', keys: '🔑 Manage Keys'
}[type] || 'Action');

const ModalHeader = ({ title, user, onClose }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
    <div>
      <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Space Grotesk,sans-serif' }}>{title}</h3>
      {user && <p style={{ color: '#505070', fontSize: 12, marginTop: 2 }}>@{user.username}</p>}
    </div>
    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9090b0', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FiX size={16} />
    </button>
  </div>
);

const ModalBody = ({ children }) => <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>;

const Field = ({ label, children, style }) => (
  <div style={style}>
    <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 7, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</label>
    {children}
  </div>
);

const ModalActions = ({ onCancel, onConfirm, saving, confirmLabel, confirmColor }) => (
  <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
    <button onClick={onCancel} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
    <button onClick={onConfirm} disabled={saving} style={{
      flex: 2, padding: '12px', border: 'none', borderRadius: 10, cursor: saving ? 'not-allowed' : 'pointer',
      background: confirmColor ? `linear-gradient(135deg,${confirmColor},${confirmColor}cc)` : 'linear-gradient(135deg,#7c3aed,#5b21b6)',
      color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'Space Grotesk,sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      opacity: saving ? 0.7 : 1
    }}>
      {saving ? <><Spinner size={16} color="#fff" /> Saving...</> : confirmLabel}
    </button>
  </div>
);
