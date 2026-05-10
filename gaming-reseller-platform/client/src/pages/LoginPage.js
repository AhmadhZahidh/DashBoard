import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiLogIn, FiShield } from 'react-icons/fi';

// ── Animated particle canvas ──────────────────────────────────
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 0.5,
      c: Math.random() > 0.5 ? '#7c3aed' : '#10b981',
      o: Math.random() * 0.6 + 0.2
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + Math.floor(p.o * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = 'rgba(124,58,237,' + (0.07 * (1 - d / 100)) + ')';
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

// ── Animated intro text ───────────────────────────────────────
function IntroText({ onDone }) {
  const [phase, setPhase] = useState(0);
  const text = 'PRRX DASHBOARD';

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => onDone(), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#05050d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: phase === 2 ? 0 : 1, transition: 'opacity 0.8s ease', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, transparent 70%)' }} />
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(28px,6vw,64px)', fontFamily: 'Orbitron,monospace', fontWeight: 900, letterSpacing: 6, background: 'linear-gradient(135deg,#a855f7,#10b981,#a855f7)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradientMove 2s linear infinite', opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          {text}
        </div>
        <div style={{ marginTop: 12, color: '#505070', fontSize: 13, letterSpacing: 4, fontFamily: 'Orbitron,monospace', opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.6s ease 0.3s' }}>
          GAMING RESELLER PANEL
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i % 2 === 0 ? '#7c3aed' : '#10b981', animation: 'float ' + (0.6 + i * 0.15) + 's ease-in-out infinite', boxShadow: '0 0 8px ' + (i % 2 === 0 ? '#7c3aed' : '#10b981') }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrUsername: '', password: '', rememberMe: false });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setTimeout(() => setFormVisible(true), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.emailOrUsername || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const user = await login(form.emailOrUsername, form.password, form.rememberMe);
      toast.success('Welcome back, ' + user.username + '! 🎮');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05050d', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <ParticleCanvas />

      {/* Intro animation */}
      {showIntro && <IntroText onDone={handleIntroComplete} />}

      {/* Radial glows */}
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '10%', width: 350, height: 350, background: 'radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Grid overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(124,58,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,1) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Login form */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, opacity: formVisible ? 1 : 0, transform: formVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18 }}>
            <div style={{ width: 76, height: 76, background: 'linear-gradient(135deg,#7c3aed,#10b981)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.2)', animation: 'float 3s ease-in-out infinite' }}>
              <FiShield size={36} color="white" />
            </div>
            {/* Animated ring */}
            <div style={{ position: 'absolute', inset: -6, borderRadius: 26, border: '2px solid transparent', borderTopColor: '#7c3aed', borderRightColor: '#10b981', animation: 'spin 3s linear infinite' }} />
          </div>
          <h1 className="font-gaming" style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 3, marginBottom: 6 }}>
            {settings.siteName || 'PRRX GAMING'}
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '4px 14px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulseGlow 1.5s infinite' }} />
            <span style={{ color: '#10b981', fontSize: 11, fontFamily: 'Orbitron,monospace', fontWeight: 700, letterSpacing: 2 }}>RESELLER PANEL</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(14,14,31,0.92)', backdropFilter: 'blur(30px)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 24, padding: '36px 32px', boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
          {/* Animated gradient border */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(135deg,rgba(124,58,237,0.1),transparent,rgba(16,185,129,0.05))', pointerEvents: 'none' }} />

          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, fontFamily: 'Space Grotesk,sans-serif', position: 'relative' }}>Welcome Back</h2>
          <p style={{ color: '#505070', fontSize: 14, marginBottom: 30, position: 'relative' }}>Sign in to your gaming account</p>

          <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
            {/* Email/Username */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 8, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Email or Username</label>
              <input
                className="input-gaming"
                type="text"
                placeholder="Enter email or username"
                value={form.emailOrUsername}
                onChange={e => setForm({ ...form, emailOrUsername: e.target.value })}
                onFocus={() => setFocused('user')}
                onBlur={() => setFocused('')}
                autoComplete="username"
                style={{ borderColor: focused === 'user' ? 'rgba(124,58,237,0.7)' : 'rgba(124,58,237,0.2)', boxShadow: focused === 'user' ? '0 0 0 3px rgba(124,58,237,0.12), 0 0 20px rgba(124,58,237,0.1)' : 'none', transition: 'all 0.3s ease' }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#9090b0', marginBottom: 8, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-gaming"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('pw')}
                  onBlur={() => setFocused('')}
                  style={{ paddingRight: 48, borderColor: focused === 'pw' ? 'rgba(124,58,237,0.7)' : 'rgba(124,58,237,0.2)', boxShadow: focused === 'pw' ? '0 0 0 3px rgba(124,58,237,0.12), 0 0 20px rgba(124,58,237,0.1)' : 'none', transition: 'all 0.3s ease' }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#505070', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                  onMouseLeave={e => e.currentTarget.style.color = '#505070'}
                >
                  {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#9090b0' }}>
                <input type="checkbox" checked={form.rememberMe} onChange={e => setForm({ ...form, rememberMe: e.target.checked })} style={{ accentColor: '#7c3aed', width: 15, height: 15 }} />
                Remember me
              </label>
              <Link to="/forgot-password" style={{ color: '#a855f7', fontSize: 13, textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.3s ease', fontFamily: 'Space Grotesk,sans-serif', boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.1)', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.6), 0 0 60px rgba(124,58,237,0.2)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)'; }}
            >
              {loading
                ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
                : <><FiLogIn size={18} /> Sign In</>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0', position: 'relative' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.15)' }} />
            <span style={{ color: '#505070', fontSize: 12 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.15)' }} />
          </div>

          <p style={{ textAlign: 'center', color: '#505070', fontSize: 14, position: 'relative' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 700, transition: 'color 0.2s' }}>
              Create Account →
            </Link>
          </p>
        </div>

        {/* Admin hint */}
        <div style={{ marginTop: 16, padding: '12px 18px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 10, textAlign: 'center' }}>
          <p style={{ color: '#505070', fontSize: 12 }}>
            <span style={{ color: '#a855f7', fontWeight: 600 }}>Admin:</span> admin@gamingreseller.com &nbsp;/&nbsp;
            <span style={{ color: '#a855f7', fontWeight: 600 }}>Pass:</span> Admin@123456
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#505070', fontSize: 11, marginTop: 20 }}>
          © 2026 {settings.siteName || 'PRRX Gaming'}. All rights reserved.
        </p>
      </div>

      <style>{`@keyframes gradientMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>
    </div>
  );
}