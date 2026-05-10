import React from 'react';
import { Link } from 'react-router-dom';
import ParticlesBG from '../components/ParticlesBG';
import { useSettings } from '../context/SettingsContext';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#a855f7', marginBottom: 12, fontFamily: 'Space Grotesk,sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 4, height: 18, background: 'linear-gradient(180deg,#7c3aed,#10b981)', borderRadius: 2, display: 'inline-block' }} />
      {title}
    </h2>
    <div style={{ color: '#9090b0', fontSize: 14, lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default function PrivacyPage() {
  const { settings } = useSettings();
  return (
    <div style={{ background: '#05050d', minHeight: '100vh', position: 'relative' }}>
      <ParticlesBG density={30} opacity={0.4} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '100px 24px 60px' }}>
        <Link to="/" style={{ color: '#a855f7', textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>← Back to Home</Link>
        <div style={{ background: 'rgba(14,14,31,0.9)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '40px 36px', backdropFilter: 'blur(20px)' }}>
          <h1 className="font-gaming" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, background: 'linear-gradient(135deg,#a855f7,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Privacy Policy</h1>
          <p style={{ color: '#505070', fontSize: 13, marginBottom: 36 }}>Last updated: January 2026</p>
          <Section title="Information We Collect">
            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your username, email address, and transaction history.
          </Section>
          <Section title="How We Use Your Information">
            We use the information we collect to provide, maintain, and improve our services, process transactions, send notifications, and respond to your comments and questions. Contact: <a href="mailto:ahmadhzahidh215@gmail.com" style={{ color: '#a855f7' }}>ahmadhzahidh215@gmail.com</a>
          </Section>
          <Section title="Data Security">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All passwords are encrypted using bcrypt.
          </Section>
          <Section title="Firebase Data">
            Our live chat system uses Firebase Realtime Database. Messages are stored securely and only accessible to authorized users. Admin can delete messages at any time.
          </Section>
          <Section title="Cookies">
            We use JWT tokens stored in cookies for authentication. These are essential for the service to function and cannot be disabled.
          </Section>
          <Section title="Contact Us">
            If you have questions about this Privacy Policy, please contact us at: <a href="mailto:ahmadhzahidh215@gmail.com" style={{ color: '#a855f7' }}>ahmadhzahidh215@gmail.com</a>
          </Section>
        </div>
      </div>
    </div>
  );
}
