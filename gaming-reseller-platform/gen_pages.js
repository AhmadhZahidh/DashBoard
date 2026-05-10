/**
 * Page generator script - run with: node gen_pages.js
 * Writes all static pages for the gaming reseller platform
 */
const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, 'client/src/pages');

const CE = 'ahmadhzahidh215@gmail.com';
const WA = '94742560815';

// ── Shared nav/footer template strings ──────────────────────
const navImports = `import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import ParticlesBG from '../components/ParticlesBG';
`;

const navComponent = `
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
      <p style={{ color: '#505070', fontSize: 12 }}>© 2026 {siteName || 'GameZone Reseller'}. All rights reserved. | ${CE}</p>
    </footer>
  );
}
`;

// ── ABOUT PAGE ───────────────────────────────────────────────
const aboutPage = navImports + navComponent + `
export default function AboutPage() {
  const { settings } = useSettings();
  return (
    <div style={{ minHeight: '100vh', background: '#05050d', position: 'relative' }}>
      <ParticlesBG density={40} opacity={0.2} fixed />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageNav siteName={settings.siteName} />
        <div style={{ padding: '60px 5% 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎮</div>
          <h1 className="font-gaming gradient-text" style={{ fontSize: 'clamp(24px,4vw,42px)', fontWeight: 800, marginBottom: 12 }}>About PRRX Gaming</h1>
          <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg,#7c3aed,#10b981)', borderRadius: 2, margin: '0 auto 16px' }} />
          <p style={{ color: '#9090b0', fontSize: 15, maxWidth: 600, margin: '0 auto' }}>Sri Lanka's Premier Gaming Reseller Platform</p>
        </div>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 5% 80px' }}>
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: '28px 32px', marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#a855f7', marginBottom: 12, fontFamily: 'Space Grotesk,sans-serif' }}>Our Mission</h2>
            <p style={{ color: '#9090b0', lineHeight: 1.8, fontSize: 15 }}>
              PRRX Gaming Reseller Panel is Sri Lanka's premier gaming reseller platform, dedicated to providing gamers with instant access to Free Fire products, gaming panels, APKs, VIP subscriptions, and digital keys at the best prices in LKR. We believe every gamer deserves premium tools without breaking the bank.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
            {[['10,000+','Active Users','👥'],['500+','Products','🎮'],['50,000+','Orders','📦'],['99.9%','Uptime','⚡']].map(([v,l,ic],i) => (
              <div key={i} style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{ic}</div>
                <div className="font-gaming" style={{ fontSize: 22, fontWeight: 800, color: i%2===0?'#a855f7':'#10b981', marginBottom: 4 }}>{v}</div>
                <div style={{ color: '#505070', fontSize: 12 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { icon: '🛡️', title: 'Security First', desc: 'Your data and transactions are always protected with JWT and bcrypt.', color: '#7c3aed' },
              { icon: '⚡', title: 'Instant Delivery', desc: 'Products delivered the moment payment is confirmed.', color: '#f59e0b' },
              { icon: '⭐', title: 'Premium Quality', desc: 'Only verified, tested products from trusted sources.', color: '#10b981' },
              { icon: '👥', title: 'Community', desc: 'Building a strong gaming community in Sri Lanka.', color: '#3b82f6' },
            ].map((v, i) => (
              <div key={i} style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 14, padding: '20px' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{v.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6, fontFamily: 'Space Grotesk,sans-serif' }}>{v.title}</h3>
                <p style={{ color: '#505070', fontSize: 13, lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(16,185,129,0.06))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 16, padding: '28px', textAlign: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Get In Touch</h3>
            <p style={{ color: '#9090b0', marginBottom: 16, fontSize: 14 }}>Have questions? We are here to help 24/7.</p>
            <a href="mailto:${CE}" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14, fontFamily: 'Space Grotesk,sans-serif' }}>
              📧 ${CE}
            </a>
          </div>
        </div>
        <PageFooter siteName={settings.siteName} />
      </div>
    </div>
  );
}
`;

// ── PRIVACY PAGE ─────────────────────────────────────────────
const privacyPage = navImports + navComponent + `
const privacySections = [
  { title: '1. Information We Collect', content: 'We collect information you provide when registering, including username, email address, and payment information. We also collect usage data and device information to improve our services.' },
  { title: '2. How We Use Your Information', content: 'Your information is used to process orders, manage your account, send notifications, provide customer support, and improve our platform. We never sell your personal data to third parties.' },
  { title: '3. Data Security', content: 'We implement industry-standard security measures including JWT authentication, bcrypt password hashing (12 rounds), SSL encryption, and regular security audits to protect your data.' },
  { title: '4. Firebase & Third-Party Services', content: 'We use Firebase Realtime Database for live chat features. Firebase maintains its own privacy policy. Payment processors also maintain their own security standards.' },
  { title: '5. Cookies & Sessions', content: 'We use secure HTTP-only cookies to maintain your session. You can disable cookies in your browser settings, but this may affect platform functionality.' },
  { title: '6. Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. Contact us at ${CE} to exercise these rights.' },
  { title: '7. Data Retention', content: 'We retain your data for as long as your account is active. Upon account deletion, your data is permanently removed within 30 days.' },
  { title: '8. Contact Us', content: 'For privacy concerns, contact us at ${CE}. We will respond within 48 hours.' },
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
            Questions? Email us at <a href="mailto:${CE}" style={{ color: '#a855f7' }}>${CE}</a>
          </div>
        </div>
        <PageFooter siteName={settings.siteName} />
      </div>
    </div>
  );
}
`;

// ── TERMS PAGE ───────────────────────────────────────────────
const termsPage = navImports + navComponent + `
const termsSections = [
  { title: '1. Acceptance of Terms', content: 'By accessing and using PRRX Gaming Reseller Panel, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.' },
  { title: '2. Account Registration', content: 'You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years old to use this platform.' },
  { title: '3. Coin System & Payments', content: 'Coins are the platform currency priced in LKR. All purchases are final unless there is a verified delivery failure. Coins have no cash value and cannot be refunded except in cases of platform error.' },
  { title: '4. Prohibited Activities', content: 'You may not: share account credentials, attempt to hack or exploit the platform, use bots or automated tools, resell products without authorization, or engage in fraudulent activities.' },
  { title: '5. Product Delivery', content: 'Digital products are delivered instantly upon payment confirmation. For manual orders via WhatsApp, delivery may take up to 24 hours. We are not responsible for delays caused by third-party services.' },
  { title: '6. Refund Policy', content: 'Refunds are considered on a case-by-case basis within 24 hours of purchase. Contact ${CE} with your order ID and reason. Approved refunds are processed as coin credits.' },
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
            Questions about our terms? Contact <a href="mailto:${CE}" style={{ color: '#a855f7' }}>${CE}</a>
          </div>
        </div>
        <PageFooter siteName={settings.siteName} />
      </div>
    </div>
  );
}
`;

// ── CONTACT PAGE ─────────────────────────────────────────────
const contactPage = navImports + navComponent + `
export default function ContactPage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent(form.subject || 'Contact from ' + form.name);
    const body = encodeURIComponent('Name: ' + form.name + '\\nEmail: ' + form.email + '\\n\\n' + form.message);
    window.open('mailto:${CE}?subject=' + subject + '&body=' + body, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const waLink = 'https://wa.me/${WA}?text=' + encodeURIComponent('Hello! I need help with PRRX Gaming Reseller Panel.');

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
              { icon: '📧', title: 'Email', value: '${CE}', link: 'mailto:${CE}', color: '#7c3aed' },
              { icon: '💬', title: 'WhatsApp', value: '+${WA}', link: waLink, color: '#25D366' },
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
`;

// Write all files
fs.writeFileSync(path.join(base, 'AboutPage.js'), aboutPage, 'utf8');
fs.writeFileSync(path.join(base, 'PrivacyPage.js'), privacyPage, 'utf8');
fs.writeFileSync(path.join(base, 'TermsPage.js'), termsPage, 'utf8');
fs.writeFileSync(path.join(base, 'ContactPage.js'), contactPage, 'utf8');

console.log('✅ All 4 static pages written successfully!');
