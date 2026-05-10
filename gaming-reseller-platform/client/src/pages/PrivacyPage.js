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

const privacySections = [
  { title: '1. Information We Collect', content: 'We collect information you provide when registering, including username, email address, and payment information. We also collect usage data and device information to improve our services.' },
  { title: '2. How We Use Your Information', content: 'Your information is used to process orders, manage your account, send notifications, provide customer support, and improve our platform. We never sell your personal data to third parties.' },
  { title: '3. Data Security', content: 'We implement industry-standard security measures including JWT authentication, bcrypt password hashing (12 rounds), SSL encryption, and regular security audits to protect your data.' },
  { title: '4. Firebase & Third-Party Services', content: 'We use Firebase Realtime Database for live chat features. Firebase maintains its own privacy policy. Payment processors also maintain their own security standards.' },
  { title: '5. Cookies & Sessions', content: 'We use secure HTTP-only cookies to maintain your session. You can disable cookies in your browser settings, but this may affect platform functionality.' },
  { title: '6. Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. Contact us at ahmadhzahidh215@gmail.com to exercise these rights.' },
  { title: '7. Data Retention', content: 'We retain your data for as long as your account is active. Upon account deletion, your data is permanently removed within 30 days.' },
  { title: '8. Contact Us', content: 'For privacy concerns, contact us at ahmadhzahidh215@gmail.com. We will respond within 48 hours.' },
];

export default function PrivacyPage() {
  const { settings } = useSettings();
  const [open, setOpen] = useState(null);
  return (
    <div style={{ minHeight: '100vh', background: '#05050d', position: 'relative' }}>
      <ParticlesBG density={30} opacity={0.15} fixed />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageNav siteName={settings.siteName} />
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 5% 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h1 className="font-gaming gradient-text" style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
            <p style={{ color: '#505070', fontSize: 13 }}>Last updated: January 2026</p>
          </div>
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: '18px 24px', marginBottom: 28 }}>
            <p style={{ color: '#9090b0', fontSize: 14, lineHeight: 1.7 }}>This Privacy Policy describes how PRRX Gaming Reseller Panel collects, uses, and protects your personal information. By using our platform, you agree to this policy.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {privacySections.map((s, i) => (
              <div key={i} style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Space Grotesk,sans-serif', fontSize: 15, fontWeight: 600, textAlign: 'left' }}>
                  {s.title}
                  <span style={{ color: '#a855f7', transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', fontSize: 18 }}>▾</span>
                </button>
                {open === i && <div style={{ padding: '0 20px 16px', color: '#9090b0', fontSize: 14, lineHeight: 1.7 }}>{s.content}</div>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, textAlign: 'center', color: '#505070', fontSize: 13 }}>
            Questions? Email us at <a href="mailto:ahmadhzahidh215@gmail.com" style={{ color: '#a855f7' }}>ahmadhzahidh215@gmail.com</a>
          </div>
        </div>
        <PageFooter siteName={settings.siteName} />
      </div>
    </div>
  );
}
