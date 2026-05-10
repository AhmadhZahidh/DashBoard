import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { GiCrystalBall } from 'react-icons/gi';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`/api/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed');
      }
    };
    verify();
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 20 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, var(--purple), var(--green))', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <GiCrystalBall size={32} color="white" />
        </div>
        {status === 'loading' && (
          <>
            <div style={{ width: 40, height: 40, border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--green)' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{message}</p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', padding: '12px 32px', textDecoration: 'none' }}>Go to Login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--red)' }}>Verification Failed</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{message}</p>
            <Link to="/login" className="btn-outline" style={{ display: 'inline-block', padding: '12px 32px', textDecoration: 'none' }}>Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
}
