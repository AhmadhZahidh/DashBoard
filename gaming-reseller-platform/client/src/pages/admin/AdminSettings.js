import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSave, FiUpload, FiLink, FiVideo, FiImage, FiGlobe, FiSettings, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { Spinner } from '../../components/LoadingScreen';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/settings/admin');
      setSettings(data.settings || {});
    } catch { toast.error('Failed to load settings'); }
    finally { setLoading(false); }
  };

  const set = (key, value) => setSettings(p => ({ ...p, [key]: value }));
  const setNested = (parent, key, value) => setSettings(p => ({ ...p, [parent]: { ...p[parent], [key]: value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/settings', settings);
      toast.success('✅ Settings saved!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleUpload = async (e, field, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(field);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await axios.post(`/api/upload/${type}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      set(field, data.url);
      toast.success('Uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(''); }
  };

  const handleVideoUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) { toast.error('Video must be under 100MB'); return; }
    setUploading(field);
    try {
      const fd = new FormData();
      fd.append('image', file); // multer handles video too
      const { data } = await axios.post('/api/upload/videos', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      set(field, data.url);
      toast.success('Video uploaded!');
    } catch { toast.error('Video upload failed'); }
    finally { setUploading(''); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
      <Spinner size={40} />
    </div>
  );

  const tabs = [
    { id: 'general', label: '🌐 General', icon: FiGlobe },
    { id: 'images', label: '🖼️ Images', icon: FiImage },
    { id: 'video', label: '🎬 Video', icon: FiVideo },
    { id: 'social', label: '🔗 Social', icon: FiLink },
    { id: 'system', label: '⚙️ System', icon: FiSettings },
  ];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: 860 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="font-gaming" style={{ fontSize: 20, fontWeight: 800 }}>⚙️ Website Settings</h2>
          <p style={{ color: '#505070', fontSize: 12, marginTop: 2 }}>Changes apply to the live website instantly</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '11px 24px' }}>
          {saving ? <><Spinner size={16} color="#fff" /> Saving...</> : <><FiSave size={16} /> Save All</>}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: activeTab === t.id ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'rgba(124,58,237,0.08)',
            color: activeTab === t.id ? '#fff' : '#9090b0',
            fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 13,
            transition: 'all 0.2s',
            boxShadow: activeTab === t.id ? '0 4px 15px rgba(124,58,237,0.3)' : 'none'
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GENERAL ── */}
      {activeTab === 'general' && (
        <Card title="🌐 General Settings">
          <Grid2>
            <Field label="Site Name">
              <input className="input-gaming" value={settings.siteName || ''} onChange={e => set('siteName', e.target.value)} placeholder="GameZone Reseller" />
            </Field>
            <Field label="Site Tagline">
              <input className="input-gaming" value={settings.siteTagline || ''} onChange={e => set('siteTagline', e.target.value)} placeholder="Your Premium Gaming Panel" />
            </Field>
            <Field label="Contact Email">
              <input className="input-gaming" type="email" value={settings.contactEmail || ''} onChange={e => set('contactEmail', e.target.value)} placeholder="contact@example.com" />
            </Field>
            <Field label="Contact Phone / WhatsApp">
              <input className="input-gaming" value={settings.contactPhone || ''} onChange={e => set('contactPhone', e.target.value)} placeholder="+1234567890" />
            </Field>
            <Field label="Coin Rate (1 coin = $?)">
              <input className="input-gaming" type="number" value={settings.coinRate || 1} onChange={e => set('coinRate', parseFloat(e.target.value))} step="0.01" />
            </Field>
            <Field label="Payment Instructions">
              <textarea className="input-gaming" value={settings.paymentInstructions || ''} onChange={e => set('paymentInstructions', e.target.value)} style={{ minHeight: 70, resize: 'vertical' }} placeholder="How users should pay..." />
            </Field>
          </Grid2>
        </Card>
      )}

      {/* ── IMAGES ── */}
      {activeTab === 'images' && (
        <Card title="🖼️ Image Uploads">
          <p style={{ color: '#505070', fontSize: 13, marginBottom: 20 }}>Upload images that appear on the live website. Changes are instant.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Site Logo', field: 'siteLogo', type: 'banners', hint: 'Appears in navbar and sidebar' },
              { label: 'Login Page Background', field: 'loginBackground', type: 'backgrounds', hint: 'Full-screen background on login page' },
              { label: 'Dashboard Banner', field: 'dashboardBanner', type: 'banners', hint: 'Banner shown in user dashboard' },
              { label: 'Landing Hero Banner', field: 'landingHeroBanner', type: 'banners', hint: 'Main hero image on landing page' },
            ].map(item => (
              <div key={item.field} style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#505070' }}>{item.hint}</div>
                  </div>
                  {settings[item.field] && (
                    <img src={settings[item.field]} alt="" style={{ height: 50, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(124,58,237,0.3)' }} />
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input className="input-gaming" value={settings[item.field] || ''} onChange={e => set(item.field, e.target.value)} placeholder="Paste image URL or upload →" style={{ flex: 1, fontSize: 13 }} />
                  <label style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a855f7', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'Space Grotesk,sans-serif' }}>
                    {uploading === item.field ? <Spinner size={14} color="#a855f7" /> : <FiUpload size={14} />}
                    {uploading === item.field ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={e => handleUpload(e, item.field, item.type)} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── VIDEO ── */}
      {activeTab === 'video' && (
        <Card title="🎬 Hero Video">
          <p style={{ color: '#505070', fontSize: 13, marginBottom: 20 }}>
            Upload a video that plays on the landing page hero section. Supports MP4, WebM. Max 100MB.
          </p>

          <div style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: 22, marginBottom: 20 }}>
            <Field label="Hero Video URL or Upload">
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <input className="input-gaming" value={settings.heroVideo || ''} onChange={e => set('heroVideo', e.target.value)} placeholder="Paste video URL or upload below" style={{ flex: 1 }} />
                <label style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a855f7', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'Space Grotesk,sans-serif' }}>
                  {uploading === 'heroVideo' ? <Spinner size={14} color="#a855f7" /> : <FiVideo size={14} />}
                  {uploading === 'heroVideo' ? 'Uploading...' : 'Upload Video'}
                  <input type="file" accept="video/*" onChange={e => handleVideoUpload(e, 'heroVideo')} style={{ display: 'none' }} />
                </label>
              </div>
            </Field>

            {/* Video preview */}
            {settings.heroVideo && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 12, color: '#505070', marginBottom: 8 }}>Preview:</p>
                <video
                  src={settings.heroVideo}
                  controls
                  style={{ width: '100%', maxHeight: 200, borderRadius: 10, border: '1px solid rgba(124,58,237,0.3)' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
              <Toggle label="Autoplay video" checked={settings.heroVideoAutoplay !== false} onChange={v => set('heroVideoAutoplay', v)} />
              <Toggle label="Mute by default" checked={settings.heroVideoMuted !== false} onChange={v => set('heroVideoMuted', v)} />
              <Toggle label="Loop video" checked={settings.heroVideoLoop !== false} onChange={v => set('heroVideoLoop', v)} />
            </div>
          </div>

          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '12px 16px' }}>
            <p style={{ color: '#f59e0b', fontSize: 13 }}>
              💡 <strong>Tip:</strong> For best performance, use MP4 format, 1920×1080 resolution, and keep file size under 20MB. The video will autoplay muted on the landing page hero section.
            </p>
          </div>
        </Card>
      )}

      {/* ── SOCIAL ── */}
      {activeTab === 'social' && (
        <Card title="🔗 Social Media Links">
          <p style={{ color: '#505070', fontSize: 13, marginBottom: 20 }}>These links appear in the footer and contact section of the landing page.</p>
          <Grid2>
            {[
              { key: 'facebook', label: '📘 Facebook', placeholder: 'https://facebook.com/yourpage' },
              { key: 'twitter', label: '🐦 Twitter / X', placeholder: 'https://twitter.com/yourhandle' },
              { key: 'instagram', label: '📸 Instagram', placeholder: 'https://instagram.com/yourpage' },
              { key: 'discord', label: '💬 Discord', placeholder: 'https://discord.gg/yourserver' },
              { key: 'youtube', label: '▶️ YouTube', placeholder: 'https://youtube.com/yourchannel' },
              { key: 'telegram', label: '✈️ Telegram', placeholder: 'https://t.me/yourchannel' },
            ].map(s => (
              <Field key={s.key} label={s.label}>
                <input className="input-gaming" value={settings.socialLinks?.[s.key] || ''} onChange={e => setNested('socialLinks', s.key, e.target.value)} placeholder={s.placeholder} />
              </Field>
            ))}
          </Grid2>
          <div style={{ marginTop: 16 }}>
            <Field label="🟢 WhatsApp Number (with country code, no +)">
              <input className="input-gaming" value={settings.whatsappNumber || ''} onChange={e => set('whatsappNumber', e.target.value)} placeholder="923001234567" />
            </Field>
            <p style={{ color: '#505070', fontSize: 12, marginTop: 6 }}>This is used for the floating WhatsApp button and join section on the landing page.</p>
          </div>
        </Card>
      )}

      {/* ── SYSTEM ── */}
      {activeTab === 'system' && (
        <Card title="⚙️ System Settings">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ToggleRow label="🔧 Maintenance Mode" desc="Blocks all users from accessing the site" checked={settings.maintenanceMode || false} onChange={v => set('maintenanceMode', v)} />
            <ToggleRow label="✅ Registration Enabled" desc="Allow new users to register" checked={settings.registrationEnabled !== false} onChange={v => set('registrationEnabled', v)} />
            <ToggleRow label="📧 Email Verification Required" desc="Users must verify email before login" checked={settings.emailVerificationRequired || false} onChange={v => set('emailVerificationRequired', v)} />
            <ToggleRow label="💬 Live Chat Enabled" desc="Show live chat in user dashboard" checked={settings.features?.chat !== false} onChange={v => setNested('features', 'chat', v)} />
            <ToggleRow label="🔔 Notifications Enabled" desc="Enable push notifications" checked={settings.features?.notifications !== false} onChange={v => setNested('features', 'notifications', v)} />
            <ToggleRow label="⭐ Reviews Enabled" desc="Allow product reviews" checked={settings.features?.reviews !== false} onChange={v => setNested('features', 'reviews', v)} />
            <ToggleRow label="🏷️ Coupons Enabled" desc="Allow coupon codes at checkout" checked={settings.features?.coupons !== false} onChange={v => setNested('features', 'coupons', v)} />
          </div>

          {settings.maintenanceMode && (
            <div style={{ marginTop: 16 }}>
              <Field label="Maintenance Message">
                <textarea className="input-gaming" value={settings.maintenanceMessage || ''} onChange={e => set('maintenanceMessage', e.target.value)} placeholder="We are under maintenance..." style={{ minHeight: 70, resize: 'vertical' }} />
              </Field>
            </div>
          )}
        </Card>
      )}

      {/* Save button bottom */}
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '13px 32px', fontSize: 15 }}>
          {saving ? <><Spinner size={16} color="#fff" /> Saving...</> : <><FiSave size={16} /> Save All Settings</>}
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────
const Card = ({ title, children }) => (
  <div style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: 26, marginBottom: 20 }}>
    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, fontFamily: 'Space Grotesk,sans-serif', color: '#a855f7' }}>{title}</h3>
    {children}
  </div>
);

const Grid2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>{children}</div>
);

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 7, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</label>
    {children}
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#9090b0' }}>
    <div onClick={() => onChange(!checked)} style={{ width: 40, height: 22, borderRadius: 11, background: checked ? 'var(--purple)' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.3s', cursor: 'pointer', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: checked ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </div>
    {label}
  </label>
);

const ToggleRow = ({ label, desc, checked, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 12 }}>
    <div>
      <div style={{ fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#505070' }}>{desc}</div>
    </div>
    <div onClick={() => onChange(!checked)} style={{ width: 46, height: 26, borderRadius: 13, background: checked ? 'linear-gradient(135deg,#7c3aed,#10b981)' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.3s', cursor: 'pointer', flexShrink: 0, boxShadow: checked ? '0 0 12px rgba(124,58,237,0.4)' : 'none' }}>
      <div style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
    </div>
  </div>
);
