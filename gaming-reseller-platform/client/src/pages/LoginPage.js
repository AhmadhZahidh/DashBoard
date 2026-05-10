import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiLogIn, FiZap, FiShield } from 'react-icons/fi';
import ParticlesBG from '../components/ParticlesBG';

/* ── Animated canvas background ── */
const AnimatedBG = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.4,
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
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - d / 100)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

export default function LoginPage() {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrUsername: '', password: '', rememberMe: false });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.emailOrUsername || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const user = await login(form.emailOrUsername, form.password, form.rememberMe);
      toast.success(`Welcome back, ${user.username}! 🎮`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05050d', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <ParticlesBG density={40} opacity={0.6} />
      <AnimatedBG />

      {/* Radial glows */}
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '10%', width: 350, height: 350, background: 'radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72, margin: '0 auto 18px',
            background: 'linear-gradient(135deg,var(--purple),var(--green))',
            borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.2)',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <FiShield size={34} color="white" />
          </div>
          <h1 className="font-gaming" style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: 3, marginBottom: 6 }}>
            {settings.siteName || 'GAMEZONE'}
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '4px 14px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)', animation: 'pulseGlow 1.5s infinite' }} />
            <span style={{ color: 'var(--green)', fontSize: 11, fontFamily: 'Orbitron,monospace', fontWeight: 700, letterSpacing: 2 }}>RESELLER PANEL</span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(14,14,31,0.92)', backdropFilter: 'blur(30px)',
          border: '1px solid rgba(124,58,237,0.25)', borderRadius: 24, padding: '36px 32px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, fontFamily: 'Space Grotesk,sans-serif' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 30 }}>Sign in to your gaming account</p>

          <form onSubmit={handleSubmit}>
            {/* Email/Username */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Email or Username
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-gaming"
                  type="text"
                  placeholder="Enter email or username"
                  value={form.emailOrUsername}
                  onChange={e => setForm({ ...form, emailOrUsername: e.target.value })}
                  onFocus={() => setFocused('user')}
                  onBlur={() => setFocused('')}
                  autoComplete="username"
                  style={{
                    paddingLeft: 16,
                    borderColor: focused === 'user' ? 'var(--purple)' : 'rgba(124,58,237,0.2)',
                    boxShadow: focused === 'user' ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-gaming"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('pw')}
                  onBlur={() => setFocused('')}
                  style={{
                    paddingRight: 48,
                    borderColor: focused === 'pw' ? 'var(--purple)' : 'rgba(124,58,237,0.2)',
                    boxShadow: focused === 'pw' ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none'
                  }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={form.rememberMe} onChange={e => setForm({ ...form, rememberMe: e.target.checked })} style={{ accentColor: 'var(--purple)', width: 15, height: 15 }} />
                Remember me
              </label>
              <Link to="/forgot-password" style={{ color: 'var(--purple-light)', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', fontSize: 15, fontWeight: 700,
              background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg,#7c3aed,#5b21b6)',
              color: '#fff', border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.3s ease', fontFamily: 'Space Grotesk,sans-serif',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)'
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading
                ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
                : <><FiLogIn size={18} /> Sign In</>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--purple-light)', textDecoration: 'none', fontWeight: 700 }}>
              Create Account →
            </Link>
          </p>
        </div>

        {/* Admin hint */}
        <div style={{ marginTop: 16, padding: '12px 18px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            <span style={{ color: 'var(--purple-light)', fontWeight: 600 }}>Admin:</span> admin@gamingreseller.com &nbsp;/&nbsp;
            <span style={{ color: 'var(--purple-light)', fontWeight: 600 }}>Pass:</span> Admin@123456
          </p>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, marginTop: 20 }}>
          © 2026 {settings.siteName}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
