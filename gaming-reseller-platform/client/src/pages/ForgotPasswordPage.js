import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { GiCrystalBall } from 'react-icons/gi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
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
          <h1 className="font-gaming" style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>Reset Password</h1>
        </div>

        <div className="glass" style={{ borderRadius: 20, padding: 32 }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Check Your Email</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
                We sent a password reset link to <strong style={{ color: 'var(--purple-light)' }}>{email}</strong>
              </p>
              <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', textDecoration: 'none' }}>
                <FiArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: 'Rajdhani, sans-serif' }}>Forgot Password?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Enter your email to receive a reset link.</p>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Email Address</label>
                  <input className="input-gaming" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {loading ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><FiMail size={16} /> Send Reset Link</>}
                </button>
              </form>
              <div className="divider" />
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none' }}>
                <FiArrowLeft size={14} /> Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
