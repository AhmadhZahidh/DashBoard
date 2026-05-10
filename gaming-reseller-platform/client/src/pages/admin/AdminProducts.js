import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';

const emptyProduct = {
  name: '', description: '', shortDescription: '', price: '', coinPrice: '',
  category: 'free-fire', platform: 'android', deliveryType: 'instant',
  duration: '', badge: '', discount: 0, isActive: true, isFeatured: false, isHot: false, image: ''
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products?limit=50');
      setProducts(data.products || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setEditProduct(null); setForm(emptyProduct); setShowModal(true); };
  const openEdit = (product) => { setEditProduct(product); setForm({ ...product }); setShowModal(true); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await axios.post('/api/upload/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(prev => ({ ...prev, image: data.url }));
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      if (editProduct) {
        await axios.put(`/api/products/${editProduct._id}`, form);
        toast.success('Product updated!');
      } else {
        await axios.post('/api/products', form);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700 }}>🎮 Products</h2>
        <button onClick={openCreate} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiPlus size={18} /> Add Product
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
            <p>No products yet. Add your first product!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-gaming">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Coins</th>
                  <th>Sold</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-secondary)', overflow: 'hidden', flexShrink: 0 }}>
                          {product.image ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎮</div>}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 13, color: 'white' }}>{product.name}</p>
                          {product.duration && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{product.duration}</p>}
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-purple">{product.category}</span></td>
                    <td style={{ color: 'var(--green)', fontWeight: 700 }}>${product.price}</td>
                    <td style={{ color: 'var(--gold)', fontWeight: 700 }}>🪙 {product.coinPrice}</td>
                    <td>{product.totalSold}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {product.isActive ? <span className="badge badge-green">Active</span> : <span className="badge badge-red">Inactive</span>}
                        {product.isHot && <span className="badge badge-red">HOT</span>}
                        {product.isFeatured && <span className="badge badge-gold">Featured</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(product)} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: 'var(--purple-light)', padding: '5px 8px', borderRadius: 6, cursor: 'pointer' }}>
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--red)', padding: '5px 8px', borderRadius: 6, cursor: 'pointer' }}>
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

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 className="font-gaming" style={{ fontSize: 18 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Product Name *</label>
                <input className="input-gaming" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Price ($) *</label>
                <input className="input-gaming" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Coin Price</label>
                <input className="input-gaming" type="number" value={form.coinPrice} onChange={e => setForm({ ...form, coinPrice: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Category</label>
                <select className="input-gaming" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="free-fire">Free Fire</option>
                  <option value="gaming-panel">Gaming Panel</option>
                  <option value="apk">APK</option>
                  <option value="vip-subscription">VIP Subscription</option>
                  <option value="digital-key">Digital Key</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Platform</label>
                <select className="input-gaming" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                  <option value="android">Android</option>
                  <option value="ios">iOS</option>
                  <option value="pc">PC</option>
                  <option value="all">All</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Duration</label>
                <input className="input-gaming" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 1 Day, 7 Days" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Badge</label>
                <input className="input-gaming" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="HOT, NEW, SALE" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Discount (%)</label>
                <input className="input-gaming" type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="0" min="0" max="100" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Short Description</label>
                <input className="input-gaming" value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief description" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Description *</label>
                <textarea className="input-gaming" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Full description" style={{ minHeight: 80, resize: 'vertical' }} />
              </div>

              {/* Image upload */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Product Image</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input className="input-gaming" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Image URL or upload below" style={{ flex: 1 }} />
                  <label style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, whiteSpace: 'nowrap' }}>
                    {uploading ? '...' : <><FiUpload size={14} /> Upload</>}
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {form.image && <img src={form.image} alt="" style={{ marginTop: 8, height: 60, borderRadius: 6, objectFit: 'cover' }} />}
              </div>

              {/* Toggles */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { key: 'isActive', label: 'Active' },
                  { key: 'isHot', label: '🔥 Hot' },
                  { key: 'isFeatured', label: '⭐ Featured' }
                ].map(toggle => (
                  <label key={toggle.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={form[toggle.key]} onChange={e => setForm({ ...form, [toggle.key]: e.target.checked })} style={{ accentColor: 'var(--purple)', width: 16, height: 16 }} />
                    {toggle.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 2, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {saving ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : editProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
