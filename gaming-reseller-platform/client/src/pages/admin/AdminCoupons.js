import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';

const emptyCoupon = { code: '', description: '', discountType: 'percentage', discountValue: '', minOrderAmount: 0, maxDiscount: 0, usageLimit: 0, isActive: true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [form, setForm] = useState(emptyCoupon);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get('/api/coupons');
      setCoupons(data.coupons || []);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setEditCoupon(null); setForm(emptyCoupon); setShowModal(true); };
  const openEdit = (coupon) => { setEditCoupon(coupon); setForm({ ...coupon }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.code || !form.discountValue) { toast.error('Code and discount value required'); return; }
    setSaving(true);
    try {
      if (editCoupon) {
        await axios.put(`/api/coupons/${editCoupon._id}`, form);
        toast.success('Coupon updated!');
      } else {
        await axios.post('/api/coupons', form);
        toast.success('Coupon created!');
      }
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await axios.delete(`/api/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700 }}>🏷️ Coupons</h2>
        <button onClick={openCreate} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiPlus size={18} /> Add Coupon
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏷️</div>
            <p>No coupons yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-gaming">
              <thead>
                <tr><th>Code</th><th>Type</th><th>Value</th><th>Used</th><th>Limit</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon._id}>
                    <td><span className="font-gaming" style={{ color: 'var(--gold)', fontSize: 14, letterSpacing: 1 }}>{coupon.code}</span></td>
                    <td><span className="badge badge-purple">{coupon.discountType}</span></td>
                    <td style={{ color: 'var(--green)', fontWeight: 700 }}>
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `🪙 ${coupon.discountValue}`}
                    </td>
                    <td>{coupon.usedCount}</td>
                    <td>{coupon.usageLimit === 0 ? '∞' : coupon.usageLimit}</td>
                    <td><span className={`badge ${coupon.isActive ? 'badge-green' : 'badge-red'}`}>{coupon.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(coupon)} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: 'var(--purple-light)', padding: '5px 8px', borderRadius: 6, cursor: 'pointer' }}>
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(coupon._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--red)', padding: '5px 8px', borderRadius: 6, cursor: 'pointer' }}>
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 className="font-gaming" style={{ fontSize: 18 }}>{editCoupon ? 'Edit' : 'New'} Coupon</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Coupon Code *</label>
                <input className="input-gaming" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE20" style={{ textTransform: 'uppercase' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Discount Type</label>
                <select className="input-gaming" value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (Coins)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Discount Value *</label>
                <input className="input-gaming" type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} placeholder="20" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Usage Limit (0=unlimited)</label>
                <input className="input-gaming" type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Min Order Amount</label>
                <input className="input-gaming" type="number" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="0" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Description</label>
                <input className="input-gaming" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Coupon description" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: 'var(--purple)' }} />
                  Active
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 2, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {saving ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : editCoupon ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
