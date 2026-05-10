import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Wallet() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get('/api/wallet/transactions?limit=20');
      setTransactions(data.transactions || []);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>💰 Wallet</h2>

      {/* Balance cards */}
      <div className="grid-2" style={{ marginBottom: 28, gap: 20 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))',
          border: '1px solid rgba(124,58,237,0.4)', borderRadius: 16, padding: 28
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🪙</div>
          <div className="font-gaming" style={{ fontSize: 36, fontWeight: 800, color: 'var(--gold)', marginBottom: 4 }}>
            {user?.coinBalance?.toLocaleString() || 0}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>COIN BALANCE</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
          border: '1px solid rgba(16,185,129,0.4)', borderRadius: 16, padding: 28
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💵</div>
          <div className="font-gaming" style={{ fontSize: 36, fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>
            ${user?.walletBalance?.toFixed(2) || '0.00'}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>WALLET BALANCE</div>
        </div>
      </div>

      {/* Transaction history */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif' }}>Transaction History</h3>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <p>No transactions yet</p>
          </div>
        ) : (
          <div>
            {transactions.map(txn => (
              <div key={txn._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid rgba(124,58,237,0.05)', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: txn.type === 'credit' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                  }}>
                    {txn.type === 'credit' ? '⬆️' : '⬇️'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{txn.description}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {txn.transactionId} • {new Date(txn.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontWeight: 700, fontSize: 16,
                    color: txn.type === 'credit' ? 'var(--green)' : 'var(--red)'
                  }}>
                    {txn.type === 'credit' ? '+' : '-'}{txn.currency === 'coins' ? '🪙' : '$'}{txn.amount}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Balance: {txn.currency === 'coins' ? '🪙' : '$'}{txn.balanceAfter}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
