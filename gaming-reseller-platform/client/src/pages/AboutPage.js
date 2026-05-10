import React from 'react';
import { Link } from 'react-router-dom';
import ParticlesBG from '../components/ParticlesBG';
import { useSettings } from '../context/SettingsContext';
import { FiShield, FiZap, FiStar, FiUsers } from 'react-icons/fi';

export default function AboutPage() {
  const { settings } = useSettings();
  const stats = [
    { icon: '🎮', value: '10K+', label: 'Active Users' },
    { icon: '📦', value: '500+', label: 'Products' },
    { icon: '⚡', value: '50K+', label: 'Orders Delivered' },
    { icon: '⭐', value: '4.9/5', label: 'User Rating' },
  ];
  const team = [
    { name: 'Ahmad H. Zahid', role: 'Founder & CEO', avatar: '👑', color: '#7c3aed' },
    { name: 'Support Team', role: 'Customer Support', avatar: '🛡️', color: '#10b981' },
    { name: 'Dev Team', role: 'Development', avatar: '⚡', color: '#3b82f6' },
  ];
  return (
    <div style={{ background: '#05050d', minHeight: '100vh', position: 'relative' }}>
      <ParticlesBG density={40} opacity={0.5} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '100px 24px 60px' }}>
        <Link to="/" style={{ color: '#a855f7', textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>← Back to Home</Link>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎮</div>
          <h1 className="font-gaming" style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, marginBottom: 16, background: 'linear-gradient(135deg,#a855f7,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            About {settings.siteName || 'PRRX'}
          </h1>
          <p style={{ color: '#9090b0', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
            We are Sri Lanka's premier gaming reseller platform, specializing in Free Fire products, gaming panels, APKs, and digital keys. Founded with a passion for gaming, we deliver premium products at affordable prices.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 60 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'rgba(14,14,31,0.9)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: '24px 20px', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div className="font-gaming" style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{s.value}</div>
              <div style={{ color: '#505070', fontSize: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{ background: 'rgba(14,14,31,0.9)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '36px', marginBottom: 32, backdropFilter: 'blur(20px)' }}>
          <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#a855f7' }}>Our Mission</h2>
          <p style={{ color: '#9090b0', fontSize: 15, lineHeight: 1.8 }}>
            To provide the most reliable, affordable, and instant gaming product delivery service in Sri Lanka and beyond. We believe every gamer deserves access to premium tools without breaking the bank.
          </p>
        </div>

        {/* Team */}
        <div style={{ background: 'rgba(14,14,31,0.9)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '36px', marginBottom: 32, backdropFilter: 'blur(20px)' }}>
          <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#a855f7' }}>Our Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {team.map((m, i) => (
              <div key={i} style={{ background: `${m.color}10`, border: `1px solid ${m.color}30`, borderRadius: 14, padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{m.avatar}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: m.color, fontWeight: 600 }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ background: 'rgba(14,14,31,0.9)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '36px', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
          <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: '#10b981' }}>Get In Touch</h2>
          <p style={{ color: '#9090b0', marginBottom: 20 }}>Have questions? We'd love to hear from you.</p>
          <a href="mailto:ahmadhzahidh215@gmail.com" style={{ color: '#a855f7', fontSize: 16, fontWeight: 700 }}>ahmadhzahidh215@gmail.com</a>
          <div style={{ marginTop: 16 }}>
            <Link to="/contact" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 28px', textDecoration: 'none' }}>Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
