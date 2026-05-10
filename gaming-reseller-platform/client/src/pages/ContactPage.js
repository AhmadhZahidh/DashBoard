import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import ParticlesBG from '../components/ParticlesBG';

function PageNav({ siteName }) {
  return (
    <nav style={{ padding: '0 5%', borderBottom: '1px solid rgba(124,58,237,0.15)', background: 'rgba(5,5,13,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#7c3aed,#10b981)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎮</div>
          <span className="font-gaming" style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: 2 }}>{siteName || 'GAMEZONE'}</span>
        </Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/login" className="btn-outline" style={{ padding: '7px 18px', fontSize: 13 }}>Login</Link>
          <Link to="/register" className="btn-primary" style={{ padding: '7px 18px', fontSize: 13 }}>Register</Link>
        </div>
      </div>
    </nav>
  );
}

function PageFooter({ siteName }) {
  return (
    <footer style={{ background: '#0a0a18', borderTop: '1px solid rgba(124,58,237,0.15)', padding: '28px 5%', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
        {[['/', 'Home'], ['/about', 'About'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/contact', 'Contact']].map(([to, label]) => (
          <Link key={to} to={to} style={{ color: '#505070', fontSize: 13, textDecoration: 'none' }}>{label}</Link>
        ))}
      </div>
      <p style={{ color: '#505070', fontSize: 12 }}>© 2026 {siteName || 'GameZone Reseller'}. All rights reserved. | ahmadhzahidh215@gmail.com</p>
    </footer>
  );
}

export default function ContactPage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent(form.subject || 'Contact from ' + form.name);
    const body = encodeURIComponent('Name: ' + form.name + '\nEmail: ' + form.email + '\n\n' + form.message);
    window.open('mailto:ahmadhzahidh215@gmail.com?subject=' + subject + '&body=' + body, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const waLink = 'https://wa.me/94742560815?text=' + encodeURIComponent('Hello! I need help with PRRX Gaming Reseller Panel.');

  return (
    <div style={{ minHeight: '100vh', background: '#05050d', position: 'relative' }}>
      <ParticlesBG density={35} opacity={0.18} fixed />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageNav siteName={settings.siteName} />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 5% 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <h1 className="font-gaming gradient-text" style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, marginBottom: 8 }}>Contact Us</h1>
            <p style={{ color: '#9090b0', fontSize: 15 }}>We're here to help. Reach out anytime!</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 40 }}>
            {[
              { icon: '📧', title: 'Email', value: 'ahmadhzahidh215@gmail.com', link: 'mailto:ahmadhzahidh215@gmail.com', color: '#7c3aed' },
              { icon: '💬', title: 'WhatsApp', value: '+94742560815', link: waLink, color: '#25D366' },
              { icon: '⏰', title: 'Response Time', value: 'Within 24 hours', link: null, color: '#f59e0b' },
              { icon: '🌍', title: 'Location', value: 'Sri Lanka', link: null, color: '#3b82f6' },
            ].map((c, i) => (
              <div key={i} style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontSize: 12, color: '#505070', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{c.title}</div>
                {c.link
                  ? <a href={c.link} target="_blank" rel="noopener noreferrer" style={{ color: c.color, fontSize: 13, fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}>{c.value}</a>
                  : <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{c.value}</div>
                }
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Contact form */}
            <div style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20, fontFamily: 'Space Grotesk,sans-serif' }}>Send a Message</h2>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <p style={{ color: '#10b981', fontWeight: 600 }}>Email client opened!</p>
                  <p style={{ color: '#505070', fontSize: 13, marginTop: 6 }}>Complete sending in your email app.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[['name','Your Name','text'],['email','Email Address','email'],['subject','Subject (optional)','text']].map(([k,p,t]) => (
                    <div key={k}>
                      <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 7, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>{p}</label>
                      <input className="input-gaming" type={t} placeholder={p} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 7, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Message *</label>
                    <textarea className="input-gaming" placeholder="Your message..." value={form.message} onChange={e => setForm({...form,message:e.target.value})} style={{ minHeight: 100, resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ padding: '13px', justifyContent: 'center', fontSize: 15 }}>
                    📧 Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Quick contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'linear-gradient(135deg,rgba(37,211,102,0.12),rgba(18,140,126,0.06))', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>WhatsApp Support</h3>
                <p style={{ color: '#9090b0', fontSize: 13, marginBottom: 16 }}>Get instant support via WhatsApp. We respond within minutes!</p>
                <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14, fontFamily: 'Space Grotesk,sans-serif' }}>
                  💬 Chat on WhatsApp
                </a>
              </div>
              <div style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '24px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12 }}>FAQ</h3>
                {[
                  ['How do I top up coins?', 'Select a package on the Coin Top-Up page and contact admin via WhatsApp.'],
                  ['How fast is delivery?', 'Most products are delivered instantly. Manual orders within 24 hours.'],
                  ['Can I get a refund?', 'Contact us within 24 hours of purchase with your order ID.'],
                ].map(([q, a], i) => (
                  <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < 2 ? '1px solid rgba(124,58,237,0.08)' : 'none' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#a855f7', marginBottom: 4 }}>{q}</div>
                    <div style={{ fontSize: 12, color: '#505070', lineHeight: 1.5 }}>{a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <PageFooter siteName={settings.siteName} />
      </div>
    </div>
  );
}
