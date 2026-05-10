import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import ParticlesBG from '../components/ParticlesBG';
import { FiZap, FiShield, FiStar, FiChevronDown, FiCheck, FiArrowRight, FiPlay, FiUsers, FiPackage, FiAward } from 'react-icons/fi';

// Animated particle canvas background
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 0.5,
      color: Math.random() > 0.5 ? '#7c3aed' : '#10b981',
      opacity: Math.random() * 0.6 + 0.2
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

const features = [
  { icon: FiZap, title: 'Instant Delivery', desc: 'Get your gaming products delivered instantly after purchase.', color: '#f59e0b' },
  { icon: FiShield, title: 'Secure Platform', desc: 'Bank-level security with JWT authentication and encrypted data.', color: '#7c3aed' },
  { icon: FiStar, title: 'Premium Quality', desc: 'Only verified and tested gaming products from trusted sources.', color: '#10b981' },
  { icon: FiUsers, title: 'Active Community', desc: 'Join thousands of gamers in our reseller community.', color: '#ec4899' },
  { icon: FiPackage, title: 'Free Fire Focus', desc: 'Specialized in Free Fire panels, DLLs, and gaming tools.', color: '#3b82f6' },
  { icon: FiAward, title: 'Loyalty Rewards', desc: 'Earn coins and rewards with every purchase you make.', color: '#f59e0b' },
];

const pricingPlans = [
  { name: 'Starter', priceLKR: 500, priceUSD: 1.50, coins: 100, color: '#3b82f6', features: ['100 Coins ($1)', 'Basic Store Access', 'Email Support', '5 Orders/Month'] },
  { name: 'Pro', priceLKR: 1500, priceUSD: 5.00, coins: 500, color: '#7c3aed', featured: true, features: ['500 Coins ($5)', 'Full Store Access', 'Priority Support', 'Unlimited Orders', 'Instant Delivery', 'Exclusive Products'] },
  { name: 'Elite', priceLKR: 5000, priceUSD: 15.00, coins: 2000, color: '#10b981', features: ['2000 Coins ($15)', 'VIP Store Access', '24/7 Support', 'Unlimited Orders', 'Instant Delivery', 'Reseller Discount'] },
];

const faqs = [
  { q: 'How do I purchase products?', a: 'Register an account, top up your coins, then browse our store and purchase any product instantly.' },
  { q: 'What payment methods do you accept?', a: 'We accept manual bank transfers and various online payment methods. Contact admin for details.' },
  { q: 'How fast is delivery?', a: 'Most products are delivered instantly after payment confirmation. Manual orders may take up to 24 hours.' },
  { q: 'Is my account secure?', a: 'Yes! We use JWT authentication, bcrypt password hashing, and SSL encryption to protect your data.' },
  { q: 'Can I get a refund?', a: 'Refunds are handled case-by-case. Contact our support team within 24 hours of purchase.' },
  { q: 'Do you support Free Fire?', a: 'Yes! We specialize in Free Fire products including DLLs, panels, APKs, and VIP subscriptions.' },
];

export default function LandingPage() {
  const { settings } = useSettings();
  const [activeFaq, setActiveFaq] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const waNumber = settings.whatsappNumber || '923001234567';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello! I need help with Gaming Reseller Panel')}`;

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div style={{ background: '#05050d', minHeight: '100vh', position: 'relative' }}>
      <ParticlesBG density={60} opacity={0.8} />
      <ParticleBackground />

      {/* Radial glows */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 50 ? 'rgba(5,5,13,0.96)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(124,58,237,0.2)' : 'none',
        transition: 'all 0.3s ease', padding: '0 5%'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#7c3aed,#10b981)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              <span style={{ fontSize: 18 }}>🎮</span>
            </div>
            <span className="font-gaming" style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: 2 }}>
              {settings.siteName || 'GAMEZONE'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', padding: '7px 14px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk,sans-serif' }}>
              💬 WhatsApp
            </a>
            <Link to="/login" className="btn-outline" style={{ padding: '8px 20px', fontSize: 14 }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 70, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        {settings.heroVideo && (
          <video
            src={settings.heroVideo}
            autoPlay={settings.heroVideoAutoplay !== false}
            muted={settings.heroVideoMuted !== false}
            loop={settings.heroVideoLoop !== false}
            playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, zIndex: 0 }}
          />
        )}
        <div style={{ textAlign: 'center', padding: '0 20px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulseGlow 1.5s infinite' }} />
            <span style={{ color: '#10b981', fontSize: 12, fontFamily: 'Orbitron,monospace', fontWeight: 700, letterSpacing: 2 }}>PREMIUM GAMING RESELLER PANEL</span>
          </div>
          <h1 className="font-gaming" style={{ fontSize: 'clamp(32px,6vw,72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: '#fff' }}>
            THE ULTIMATE<br />
            <span className="gradient-text">GAMING RESELLER</span><br />
            PLATFORM
          </h1>
          <p style={{ color: '#9090b0', fontSize: 18, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Buy and sell Free Fire products, gaming panels, APKs, and digital keys. Instant delivery, secure payments, and premium support.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '14px 36px', fontSize: 16 }}>
              <FiZap size={18} /> Get Started Free
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', fontSize: 16, background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontFamily: 'Space Grotesk,sans-serif', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}>
              💬 Join WhatsApp
            </a>
          </div>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 60, flexWrap: 'wrap' }}>
            {[['10K+','Active Users'],['500+','Products'],['50K+','Orders'],['99.9%','Uptime']].map(([v,l],i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="font-gaming" style={{ fontSize: 28, fontWeight: 700, color: i % 2 === 0 ? '#a855f7' : '#10b981' }}>{v}</div>
                <div style={{ color: '#505070', fontSize: 13 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 className="section-title gradient-text">Why Choose Us?</h2>
          <p className="section-subtitle">Everything you need for a premium gaming reseller experience</p>
          <div className="grid-3" style={{ gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="stat-card">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}20`, border: `1px solid ${f.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: 'Space Grotesk,sans-serif' }}>{f.title}</h3>
                <p style={{ color: '#9090b0', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '100px 5%', position: 'relative', zIndex: 1, background: 'rgba(124,58,237,0.02)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 className="section-title gradient-text">Pricing Plans</h2>
          <p className="section-subtitle">Choose the plan that fits your gaming needs</p>
          <div className="grid-3" style={{ gap: 24 }}>
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                <h3 className="font-gaming" style={{ fontSize: 20, fontWeight: 700, color: plan.color, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#fff', fontFamily: 'Orbitron,monospace' }}>Rs. {plan.priceLKR?.toLocaleString()}</span>
                  <span style={{ color: '#505070', fontSize: 14 }}>/month</span>
                </div>
                <div style={{ color: plan.color, fontSize: 14, marginBottom: 20, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600 }}>🪙 {plan.coins} Coins (${plan.priceUSD?.toFixed(2)} value)</div>
                <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: '#9090b0', fontSize: 14 }}>
                      <FiCheck size={16} color={plan.color} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" style={{ display: 'block', textAlign: 'center', padding: '12px', background: plan.featured ? `linear-gradient(135deg,${plan.color},#10b981)` : 'transparent', border: `1px solid ${plan.color}`, color: plan.featured ? '#fff' : plan.color, borderRadius: 8, textDecoration: 'none', fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 15 }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 className="section-title gradient-text">Frequently Asked Questions</h2>
          <p className="section-subtitle">Got questions? We have answers.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: '#0e0e1f', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{ width: '100%', padding: '18px 20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Space Grotesk,sans-serif', fontSize: 15, fontWeight: 600, textAlign: 'left' }}>
                  {faq.q}
                  <span style={{ color: '#a855f7', transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', fontSize: 18 }}>▾</span>
                </button>
                {activeFaq === i && <div style={{ padding: '0 20px 18px', color: '#9090b0', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section style={{ padding: '80px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(37,211,102,0.12),rgba(18,140,126,0.08))', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 24, padding: '50px 40px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
            <h2 className="font-gaming" style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: '#fff' }}>Join Our WhatsApp</h2>
            <p style={{ color: '#9090b0', fontSize: 16, marginBottom: 28, lineHeight: 1.7 }}>Get instant support, updates, and exclusive deals directly on WhatsApp. Join our gaming community now!</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff', padding: '16px 36px', borderRadius: 50, textDecoration: 'none', fontWeight: 800, fontSize: 17, fontFamily: 'Space Grotesk,sans-serif', boxShadow: '0 8px 30px rgba(37,211,102,0.4)' }}>
              💬 Join WhatsApp Group
            </a>
            <p style={{ color: '#505070', fontSize: 12, marginTop: 16 }}>🔒 Free to join • Instant support • Exclusive deals</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a0a18', borderTop: '1px solid rgba(124,58,237,0.15)', padding: '40px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#7c3aed,#10b981)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 16 }}>🎮</span>
              </div>
              <span className="font-gaming" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{settings.siteName || 'GAMEZONE'}</span>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              {settings.socialLinks?.facebook && <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: 13, textDecoration: 'none' }}>📘 Facebook</a>}
              {settings.socialLinks?.twitter && <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4', fontSize: 13, textDecoration: 'none' }}>🐦 Twitter</a>}
              {settings.socialLinks?.instagram && <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#ec4899', fontSize: 13, textDecoration: 'none' }}>📸 Instagram</a>}
              {settings.socialLinks?.discord && <a href={settings.socialLinks.discord} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontSize: 13, textDecoration: 'none' }}>💬 Discord</a>}
              {settings.socialLinks?.youtube && <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', fontSize: 13, textDecoration: 'none' }}>▶️ YouTube</a>}
              {settings.socialLinks?.telegram && <a href={settings.socialLinks.telegram} target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4', fontSize: 13, textDecoration: 'none' }}>✈️ Telegram</a>}
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontSize: 13, textDecoration: 'none' }}>💬 WhatsApp</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(124,58,237,0.1)', paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: '#505070', fontSize: 13 }}>© 2026 {settings.siteName || 'GameZone Reseller'}. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/login" style={{ color: '#505070', fontSize: 13, textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: '#505070', fontSize: 13, textDecoration: 'none' }}>Register</Link>
              <Link to="/about" style={{ color: '#505070', fontSize: 13, textDecoration: 'none' }}>About</Link>
              <Link to="/contact" style={{ color: '#505070', fontSize: 13, textDecoration: 'none' }}>Contact</Link>
              <Link to="/privacy" style={{ color: '#505070', fontSize: 13, textDecoration: 'none' }}>Privacy</Link>
              <Link to="/terms" style={{ color: '#505070', fontSize: 13, textDecoration: 'none' }}>Terms</Link>
              <a href="mailto:ahmadhzahidh215@gmail.com" style={{ color: '#a855f7', fontSize: 13, textDecoration: 'none' }}>📧 Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
