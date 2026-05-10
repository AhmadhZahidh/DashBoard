import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { GiCrystalBall } from 'react-icons/gi';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed. Link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, var(--purple), var(--green))', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <GiCrystalBall size={32} color="white" />
          </div>
          <h1 className="font-gaming" style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>New Password</h1>
        </div>
        <div className="glass" style={{ borderRadius: 20, padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: 'Rajdhani, sans-serif' }}>Set New Password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Choose a strong password for your account.</p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input-gaming" type={showPassword ? 'text' : 'password'} placeholder="New password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Confirm Password</label>
              <input className="input-gaming" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><FiLock size={16} /> Reset Password</>}
            </button>
          </form>
          <div className="divider" />
          <Link to="/login" style={{ display: 'block', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
