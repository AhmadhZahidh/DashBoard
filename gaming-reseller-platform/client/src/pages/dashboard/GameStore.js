import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import toast from 'react-hot-toast';
import { FiSearch, FiShoppingCart, FiX, FiCheck, FiExternalLink } from 'react-icons/fi';
import { Spinner, SkeletonCard } from '../../components/LoadingScreen';
import ParticlesBG from '../../components/ParticlesBG';

const WHATSAPP_NUMBER = '94742560815';

const categories = [
  { value: '', label: '🎮 All Products' },
  { value: 'free-fire', label: '🔥 Free Fire' },
  { value: 'gaming-panel', label: '🕹️ Gaming Panels' },
  { value: 'apk', label: '📱 APK' },
  { value: 'vip-subscription', label: '⭐ VIP Subscription' },
  { value: 'digital-key', label: '🔑 Digital Keys' },
  { value: 'other', label: '📦 Other' },
];

// Success popup component
function OrderSuccessPopup({ product, user, orderId, onClose, onWhatsApp }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(135deg,rgba(14,14,31,0.98),rgba(20,20,40,0.98))',
        border: '1px solid rgba(16,185,129,0.4)', borderRadius: 24, padding: '40px 36px',
        maxWidth: 440, width: '100%', textAlign: 'center',
        boxShadow: '0 0 60px rgba(16,185,129,0.2)', animation: 'fadeInUp 0.4s ease'
      }}>
        {/* Success icon */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>
          ✅
        </div>
        <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 800, color: '#10b981', marginBottom: 8 }}>Order Placed!</h2>
        <p style={{ color: '#9090b0', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
          Your order for <strong style={{ color: '#fff' }}>{product?.name}</strong> has been saved. Complete your purchase via WhatsApp.
        </p>

        {/* Order details */}
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, textAlign: 'left' }}>
          {[
            ['Order ID', orderId],
            ['Product', product?.name],
            ['Price', `🪙 ${product?.coinPrice || product?.price}`],
            ['User', user?.username],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: '#505070' }}>{k}</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        <button onClick={onWhatsApp} style={{
          width: '100%', padding: '14px', background: 'linear-gradient(135deg,#25D366,#128C7E)',
          color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer',
          fontWeight: 800, fontSize: 16, fontFamily: 'Space Grotesk,sans-serif',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 8px 30px rgba(37,211,102,0.4)', marginBottom: 12
        }}>
          💬 Complete Order on WhatsApp <FiExternalLink size={16} />
        </button>
        <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#9090b0', padding: '10px', borderRadius: 10, cursor: 'pointer', width: '100%', fontFamily: 'Space Grotesk,sans-serif', fontSize: 14 }}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function GameStore() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [ordering, setOrdering] = useState('');

  useEffect(() => { fetchProducts(); }, [search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      const { data } = await axios.get(`/api/products?${params}`);
      setProducts(data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const handleOrder = async (product) => {
    setOrdering(product._id);
    try {
      // Save order to DB
      const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
      await axios.post('/api/orders', {
        items: [{ productId: product._id, quantity: 1 }],
        paymentMethod: 'manual',
        notes: 'WhatsApp order'
      }).catch(() => {}); // Don't block if fails

      setSuccessData({ product, orderId });
    } catch (e) {
      // Still show popup even if order save fails
      const orderId = 'ORD-' + Date.now();
      setSuccessData({ product, orderId });
    } finally {
      setOrdering('');
    }
  };

  const handleWhatsApp = () => {
    if (!successData) return;
    const { product, orderId } = successData;
    const waNumber = settings.whatsappNumber || WHATSAPP_NUMBER;
    const msg = `Hello, I want to order *${product.name}* from the dashboard store.\n\n📦 Order ID: ${orderId}\n👤 Username: ${user?.username}\n💰 Price: ${product.coinPrice || product.price} coins\n\nPlease confirm my order. Thank you!`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    setSuccessData(null);
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', position: 'relative' }}>
      <ParticlesBG density={20} opacity={0.15} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 800 }}>🎮 Game Store</h2>
            <p style={{ color: '#505070', fontSize: 12, marginTop: 2 }}>{products.length} products available</p>
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <FiSearch size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#505070' }} />
            <input className="input-gaming" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 220, fontSize: 13 }} />
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)} style={{
              padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: category === c.value ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'rgba(124,58,237,0.08)',
              color: category === c.value ? '#fff' : '#9090b0',
              fontSize: 13, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600,
              transition: 'all 0.2s ease',
              border: `1px solid ${category === c.value ? 'transparent' : 'rgba(124,58,237,0.15)'}`,
              boxShadow: category === c.value ? '0 4px 15px rgba(124,58,237,0.3)' : 'none'
            }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid-auto">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} height={280} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#505070' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
            <p style={{ fontSize: 16 }}>No products found</p>
          </div>
        ) : (
          <div className="grid-auto">
            {products.map(product => (
              <div key={product._id} style={{
                background: 'rgba(14,14,31,0.95)', border: '1px solid rgba(124,58,237,0.15)',
                borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Image */}
                <div style={{ height: 160, background: 'linear-gradient(135deg,#0a0a1a,rgba(124,58,237,0.3))', position: 'relative', overflow: 'hidden' }}>
                  {product.image
                    ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🎮</div>
                  }
                  {/* Badges */}
                  <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                    {product.badge && <span style={{ background: product.badge === 'HOT' ? '#ef4444' : product.badge === 'NEW' ? '#10b981' : '#f59e0b', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800, fontFamily: 'Orbitron,monospace' }}>{product.badge}</span>}
                    {product.discount > 0 && <span style={{ background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>-{product.discount}%</span>}
                  </div>
                  {/* Platform */}
                  <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#9090b0', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>
                    {product.platform || 'All'}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: '#fff', fontFamily: 'Space Grotesk,sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                  </h4>
                  <p style={{ color: '#505070', fontSize: 12, marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.shortDescription || product.description}
                  </p>

                  {/* Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: 18, fontFamily: 'Orbitron,monospace' }}>
                        🪙 {product.coinPrice || product.price}
                      </span>
                      {product.duration && <span style={{ color: '#505070', fontSize: 11, marginLeft: 6 }}>/ {product.duration}</span>}
                    </div>
                    {product.totalSold > 0 && <span style={{ fontSize: 11, color: '#505070' }}>🔥 {product.totalSold} sold</span>}
                  </div>

                  {/* Order button */}
                  <button
                    onClick={() => handleOrder(product)}
                    disabled={ordering === product._id}
                    style={{
                      width: '100%', padding: '11px', border: 'none', borderRadius: 10,
                      background: 'linear-gradient(135deg,#25D366,#128C7E)',
                      color: '#fff', fontWeight: 700, fontSize: 14,
                      fontFamily: 'Space Grotesk,sans-serif', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
                      opacity: ordering === product._id ? 0.7 : 1
                    }}
                    onMouseEnter={e => { if (ordering !== product._id) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {ordering === product._id ? <Spinner size={16} color="#fff" /> : '💬'}
                    {ordering === product._id ? 'Processing...' : 'Order via WhatsApp'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success popup */}
      {successData && (
        <OrderSuccessPopup
          product={successData.product}
          user={user}
          orderId={successData.orderId}
          onClose={() => setSuccessData(null)}
          onWhatsApp={handleWhatsApp}
        />
      )}
    </div>
  );
}
