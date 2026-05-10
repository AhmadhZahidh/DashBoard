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
            <a href="mailto:ahmadhzahidh215@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14, fontFamily: 'Space Grotesk,sans-serif' }}>
              📧 ahmadhzahidh215@gmail.com
            </a>
          </div>
        </div>
        <PageFooter siteName={settings.siteName} />
      </div>
    </div>
  );
}
