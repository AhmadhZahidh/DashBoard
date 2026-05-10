import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import ParticlesBG from '../components/ParticlesBG';
import { GiCrystalBall } from 'react-icons/gi';

export default function RegisterPage() {
  const { register } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form.username, form.email, form.password);
      toast.success(`Welcome, ${user.username}! Account created! 🎮`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#05050d', padding: 20, position: 'relative'
    }}>
      <ParticlesBG density={40} opacity={0.6} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.1) 0%, transparent 60%)'
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, background: 'linear-gradient(135deg, var(--purple), var(--green))',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: 'var(--glow-purple)'
          }}>
            <GiCrystalBall size={32} color="white" />
          </div>
          <h1 className="font-gaming" style={{ fontSize: 22, fontWeight: 700, color: 'white', letterSpacing: 2 }}>
            {settings.siteName || 'GAMEZONE'}
          </h1>
          <p style={{ color: 'var(--green)', fontSize: 12, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: 2, marginTop: 4 }}>
            JOIN THE PLATFORM
          </p>
        </div>

        <div className="glass" style={{ borderRadius: 20, padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, fontFamily: 'Rajdhani, sans-serif' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>Start your gaming journey today</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>Username</label>
              <input
                className="input-gaming"
                type="text"
                placeholder="Choose a username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                minLength={3}
                maxLength={30}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>Email</label>
              <input
                className="input-gaming"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-gaming"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password (min 6 chars)"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>Confirm Password</label>
              <input
                className="input-gaming"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? (
                <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <FiUserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--purple-light)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
