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

const termsSections = [
  { title: '1. Acceptance of Terms', content: 'By accessing and using PRRX Gaming Reseller Panel, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.' },
  { title: '2. Account Registration', content: 'You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years old to use this platform.' },
  { title: '3. Coin System & Payments', content: 'Coins are the platform currency priced in LKR. All purchases are final unless there is a verified delivery failure. Coins have no cash value and cannot be refunded except in cases of platform error.' },
  { title: '4. Prohibited Activities', content: 'You may not: share account credentials, attempt to hack or exploit the platform, use bots or automated tools, resell products without authorization, or engage in fraudulent activities.' },
  { title: '5. Product Delivery', content: 'Digital products are delivered instantly upon payment confirmation. For manual orders via WhatsApp, delivery may take up to 24 hours. We are not responsible for delays caused by third-party services.' },
  { title: '6. Refund Policy', content: 'Refunds are considered on a case-by-case basis within 24 hours of purchase. Contact ahmadhzahidh215@gmail.com with your order ID and reason. Approved refunds are processed as coin credits.' },
  { title: '7. Intellectual Property', content: 'All content on this platform, including logos, designs, and code, is the property of PRRX Gaming. You may not copy, reproduce, or distribute our content without written permission.' },
  { title: '8. Limitation of Liability', content: 'PRRX Gaming is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our maximum liability is limited to the amount you paid in the last 30 days.' },
  { title: '9. Termination', content: 'We reserve the right to suspend or terminate accounts that violate these terms. Banned users forfeit their coin balance without refund.' },
  { title: '10. Changes to Terms', content: 'We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.' },
];

export default function TermsPage() {
  const { settings } = useSettings();
  const [open, setOpen] = useState(null);
  return (
    <div style={{ minHeight: '100vh', background: '#05050d', position: 'relative' }}>
      <ParticlesBG density={30} opacity={0.15} fixed />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageNav siteName={settings.siteName} />
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 5% 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <h1 className="font-gaming gradient-text" style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, marginBottom: 8 }}>Terms & Conditions</h1>
            <p style={{ color: '#505070', fontSize: 13 }}>Last updated: January 2026</p>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '18px 24px', marginBottom: 28 }}>
            <p style={{ color: '#9090b0', fontSize: 14, lineHeight: 1.7 }}>⚠️ Please read these Terms and Conditions carefully before using PRRX Gaming Reseller Panel. These terms govern your use of our platform and services.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {termsSections.map((s, i) => (
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
            Questions about our terms? Contact <a href="mailto:ahmadhzahidh215@gmail.com" style={{ color: '#a855f7' }}>ahmadhzahidh215@gmail.com</a>
          </div>
        </div>
        <PageFooter siteName={settings.siteName} />
      </div>
    </div>
  );
}
