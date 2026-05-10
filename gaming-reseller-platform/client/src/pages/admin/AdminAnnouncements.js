import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import { pushAnnouncement } from '../../firebase';

const emptyAnn = { title: '', message: '', type: 'info', icon: '📢', isPinned: false, isActive: true };

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editAnn, setEditAnn] = useState(null);
  const [form, setForm] = useState(emptyAnn);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get('/api/announcements');
      setAnnouncements(data.announcements || []);
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setEditAnn(null); setForm(emptyAnn); setShowModal(true); };
  const openEdit = (ann) => { setEditAnn(ann); setForm({ ...ann }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title || !form.message) { toast.error('Title and message required'); return; }
    setSaving(true);
    try {
      if (editAnn) {
        await axios.put(`/api/announcements/${editAnn._id}`, form);
        toast.success('Announcement updated!');
      } else {
        await axios.post('/api/announcements', form);
        // Also push to Firebase for real-time dashboard updates
        await pushAnnouncement({ title: form.title, message: form.message, type: form.type, icon: form.icon }).catch(() => {});
        toast.success('Announcement created!');
      }
      setShowModal(false);
      fetchAnnouncements();
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await axios.delete(`/api/announcements/${id}`);
      toast.success('Deleted');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const typeColors = { info: 'var(--blue)', success: 'var(--green)', warning: 'var(--gold)', error: 'var(--red)', update: 'var(--purple-light)' };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700 }}>📢 Announcements</h2>
        <button onClick={openCreate} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiPlus size={18} /> New Announcement
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
        </div>
      ) : announcements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📢</div>
          <p>No announcements yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {announcements.map(ann => (
            <div key={ann._id} style={{ background: 'var(--bg-card)', border: `1px solid ${typeColors[ann.type] || 'var(--border)'}40`, borderLeft: `3px solid ${typeColors[ann.type] || 'var(--purple)'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{ann.icon}</span>
                  <h4 style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Rajdhani, sans-serif' }}>{ann.title}</h4>
                  {ann.isPinned && <span className="badge badge-gold">📌 PINNED</span>}
                  {!ann.isActive && <span className="badge badge-red">INACTIVE</span>}
                  <span className={`badge badge-${ann.type === 'success' ? 'green' : ann.type === 'error' ? 'red' : ann.type === 'warning' ? 'gold' : 'purple'}`}>{ann.type}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>{ann.message}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 6 }}>{new Date(ann.createdAt).toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => openEdit(ann)} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: 'var(--purple-light)', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => handleDelete(ann._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--red)', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 className="font-gaming" style={{ fontSize: 18 }}>{editAnn ? 'Edit' : 'New'} Announcement</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Title *</label>
                <input className="input-gaming" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Message *</label>
                <textarea className="input-gaming" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Announcement message" style={{ minHeight: 80, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Type</label>
                  <select className="input-gaming" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="update">Update</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Icon (emoji)</label>
                  <input className="input-gaming" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="📢" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                {[{ key: 'isPinned', label: '📌 Pin' }, { key: 'isActive', label: '✅ Active' }].map(t => (
                  <label key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={form[t.key]} onChange={e => setForm({ ...form, [t.key]: e.target.checked })} style={{ accentColor: 'var(--purple)' }} />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 2, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {saving ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : editAnn ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
