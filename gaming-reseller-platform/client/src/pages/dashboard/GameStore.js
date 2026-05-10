import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import toast from 'react-hot-toast';
import { FiSearch, FiX, FiMail, FiMessageSquare, FiShoppingBag } from 'react-icons/fi';
import { Spinner, SkeletonCard } from '../../components/LoadingScreen';
import ParticlesBG from '../../components/ParticlesBG';

const WA_NUMBER = '94742560815';
const COUNTRIES = ['Sri Lanka','India','Pakistan','Bangladesh','Nepal','Maldives','UAE','USA','UK','Australia','Other'];
const CATEGORIES = [
  { value: '', label: 'All Products' },
  { value: 'free-fire', label: 'Free Fire' },
  { value: 'gaming-panel', label: 'Gaming Panels' },
  { value: 'apk', label: 'APK' },
  { value: 'vip-subscription', label: 'VIP Subscription' },
  { value: 'digital-key', label: 'Digital Keys' },
  { value: 'other', label: 'Other' },
];

// ── Checkout Modal ────────────────────────────────────────────
function CheckoutModal({ product, user, onClose }) {
  const [form, setForm] = useState({ whatsapp: '', country: 'Sri Lanka', notes: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form');
  const [orderId, setOrderId] = useState('');
  const [waLink, setWaLink] = useState('');

  const submitOrder = async (method) => {
    if (!form.country) { toast.error('Please select your country'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/orders/whatsapp-gmail', {
        productName: product.name,
        productId: product._id,
        coinsAmount: product.coinPrice || product.price,
        priceLKR: product.priceLKR || product.price,
        description: product.shortDescription || product.description,
        country: form.country,
        whatsappNumber: form.whatsapp,
        notes: form.notes,
        orderMethod: method
      });
      setOrderId(data.orderId);
      setWaLink(data.waLink);
      setStep('success');
      if (method === 'whatsapp') {
        setTimeout(() => window.open(data.waLink, '_blank'), 400);
      } else {
        toast.success('Order saved! Email sent to admin.');
      }
    } catch(err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally { setLoading(false); }
  };

  const priceLKR = product.priceLKR || product.price || 0;
  const coins = product.coinPrice || product.price || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(135deg,rgba(10,10,20,0.99),rgba(14,14,31,0.99))',
        border: '1px solid rgba(124,58,237,0.4)', borderRadius: 24, padding: '32px 28px',
        maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 0 60px rgba(124,58,237,0.3)', animation: 'fadeInUp 0.35s ease',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9090b0', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
          <FiX size={16} />
        </button>

        {step === 'form' ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛒</div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk,sans-serif' }}>Checkout</h2>
                  <p style={{ fontSize: 12, color: '#505070' }}>Complete your order details</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{product.name}</div>
                  <div style={{ fontSize: 12, color: '#9090b0', lineHeight: 1.5 }}>{product.shortDescription || product.description}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981', fontFamily: 'Orbitron,monospace' }}>Rs. {priceLKR.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 2 }}>🪙 {coins} Coins</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 6, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Your Name</label>
                <div style={{ background: 'rgba(14,14,31,0.6)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#9090b0' }}>{user?.username}</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 6, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Email</label>
                <div style={{ background: 'rgba(14,14,31,0.6)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#9090b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 6, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>WhatsApp Number (optional)</label>
              <input className="input-gaming" type="tel" placeholder="+94 7X XXX XXXX" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} style={{ fontSize: 14 }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 6, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Country *</label>
              <select className="input-gaming" value={form.country} onChange={e => setForm({...form, country: e.target.value})} style={{ fontSize: 14 }}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 6, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Notes (optional)</label>
              <textarea className="input-gaming" placeholder="Any special requirements..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{ minHeight: 70, resize: 'vertical', fontSize: 14 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => submitOrder('whatsapp')} disabled={loading} style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: 'Space Grotesk,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 20px rgba(37,211,102,0.4)', opacity: loading ? 0.7 : 1 }}>
                {loading ? <Spinner size={18} color="#fff" /> : <FiMessageSquare size={18} />}
                Order via WhatsApp
              </button>
              <button onClick={() => submitOrder('gmail')} disabled={loading} style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg,#ea4335,#c5221f)', color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: 'Space Grotesk,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 20px rgba(234,67,53,0.3)', opacity: loading ? 0.7 : 1 }}>
                {loading ? <Spinner size={18} color="#fff" /> : <FiMail size={18} />}
                Order via Gmail
              </button>
              <p style={{ textAlign: 'center', fontSize: 11, color: '#505070', marginTop: 4 }}>
                WhatsApp: +{WA_NUMBER} | Email: ahmadhzahidh215@gmail.com
              </p>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36, animation: 'float 2s ease-in-out infinite' }}>
              ✅
            </div>
            <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 800, color: '#10b981', marginBottom: 8 }}>Order Placed!</h2>
            <p style={{ color: '#9090b0', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              Your order has been saved. Complete payment via WhatsApp or check your email.
            </p>
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, textAlign: 'left' }}>
              {[['Order ID', orderId], ['Product', product.name], ['Price', 'Rs. ' + priceLKR.toLocaleString()], ['Coins', coins + ' coins']].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#505070' }}>{k}</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => window.open(waLink, '_blank')} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Space Grotesk,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <FiMessageSquare size={16} /> Open WhatsApp
              </button>
              <button onClick={onClose} style={{ width: '100%', padding: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#9090b0', borderRadius: 12, cursor: 'pointer', fontFamily: 'Space Grotesk,sans-serif', fontSize: 14 }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ── Main GameStore ────────────────────────────────────────────
export default function GameStore() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [checkout, setCheckout] = useState(null);

  useEffect(() => { fetchProducts(); }, [search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      const { data } = await axios.get('/api/products?' + params);
      setProducts(data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', position: 'relative' }}>
      <ParticlesBG density={20} opacity={0.12} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 800 }}>🎮 Game Store</h2>
            <p style={{ color: '#505070', fontSize: 12, marginTop: 2 }}>{products.length} products available</p>
          </div>
          <div style={{ position: 'relative' }}>
            <FiSearch size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#505070' }} />
            <input className="input-gaming" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 220, fontSize: 13 }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)} style={{ padding: '7px 16px', borderRadius: 20, border: category === c.value ? 'none' : '1px solid rgba(124,58,237,0.15)', cursor: 'pointer', background: category === c.value ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'rgba(124,58,237,0.08)', color: category === c.value ? '#fff' : '#9090b0', fontSize: 13, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, transition: 'all 0.2s ease', boxShadow: category === c.value ? '0 4px 15px rgba(124,58,237,0.3)' : 'none' }}>
              {c.label}
            </button>
          ))}
        </div>

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
              <div key={product._id} style={{ background: 'rgba(14,14,31,0.95)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(124,58,237,0.5)'; e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(124,58,237,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(124,58,237,0.15)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div style={{ height: 160, background: 'linear-gradient(135deg,#0a0a1a,rgba(124,58,237,0.3))', position: 'relative', overflow: 'hidden' }}>
                  {product.image
                    ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🎮</div>
                  }
                  {product.badge && <div style={{ position: 'absolute', top: 10, left: 10, background: product.badge === 'HOT' ? '#ef4444' : product.badge === 'NEW' ? '#10b981' : '#f59e0b', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800, fontFamily: 'Orbitron,monospace' }}>{product.badge}</div>}
                  {product.discount > 0 && <div style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>-{product.discount}%</div>}
                </div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: '#fff', fontFamily: 'Space Grotesk,sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h4>
                  <p style={{ color: '#505070', fontSize: 12, marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.shortDescription || product.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <div style={{ color: '#10b981', fontWeight: 800, fontSize: 16, fontFamily: 'Orbitron,monospace' }}>Rs. {(product.priceLKR || product.price || 0).toLocaleString()}</div>
                      <div style={{ color: '#f59e0b', fontSize: 12, marginTop: 2 }}>🪙 {product.coinPrice || product.price} Coins{product.duration ? ' / ' + product.duration : ''}</div>
                    </div>
                    {product.totalSold > 0 && <span style={{ fontSize: 11, color: '#505070' }}>🔥 {product.totalSold} sold</span>}
                  </div>
                  <button onClick={() => setCheckout(product)} style={{ width: '100%', padding: '11px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'Space Grotesk,sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(124,58,237,0.3)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(124,58,237,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 15px rgba(124,58,237,0.3)'; }}
                  >
                    <FiShoppingBag size={15} /> Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {checkout && <CheckoutModal product={checkout} user={user} onClose={() => setCheckout(null)} />}
    </div>
  );
}