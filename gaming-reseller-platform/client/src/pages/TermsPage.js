import React from 'react';
import { Link } from 'react-router-dom';
import ParticlesBG from '../components/ParticlesBG';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#a855f7', marginBottom: 12, fontFamily: 'Space Grotesk,sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 4, height: 18, background: 'linear-gradient(180deg,#7c3aed,#10b981)', borderRadius: 2, display: 'inline-block' }} />
      {title}
    </h2>
    <div style={{ color: '#9090b0', fontSize: 14, lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default function TermsPage() {
  return (
    <div style={{ background: '#05050d', minHeight: '100vh', position: 'relative' }}>
      <ParticlesBG density={30} opacity={0.4} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '100px 24px 60px' }}>
        <Link to="/" style={{ color: '#a855f7', textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>← Back to Home</Link>
        <div style={{ background: 'rgba(14,14,31,0.9)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '40px 36px', backdropFilter: 'blur(20px)' }}>
          <h1 className="font-gaming" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, background: 'linear-gradient(135deg,#a855f7,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Terms & Conditions</h1>
          <p style={{ color: '#505070', fontSize: 13, marginBottom: 36 }}>Last updated: January 2026</p>
          <Section title="Acceptance of Terms">By accessing and using this platform, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</Section>
          <Section title="Account Responsibilities">You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account at <a href="mailto:ahmadhzahidh215@gmail.com" style={{ color: '#a855f7' }}>ahmadhzahidh215@gmail.com</a>.</Section>
          <Section title="Purchases and Payments">All purchases are final unless otherwise stated. Coin top-ups are non-refundable once processed. We reserve the right to cancel orders that violate our policies.</Section>
          <Section title="Prohibited Activities">You may not use our platform for any illegal activities, spam, harassment, or distribution of malware. Violation will result in immediate account termination.</Section>
          <Section title="Digital Products">All digital products (keys, panels, APKs) are delivered as-is. We do not guarantee compatibility with all devices. Support is provided via WhatsApp and admin chat.</Section>
          <Section title="Limitation of Liability">We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.</Section>
          <Section title="Changes to Terms">We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the new terms.</Section>
          <Section title="Contact">Questions? Email us: <a href="mailto:ahmadhzahidh215@gmail.com" style={{ color: '#a855f7' }}>ahmadhzahidh215@gmail.com</a></Section>
        </div>
      </div>
    </div>
  );
}
