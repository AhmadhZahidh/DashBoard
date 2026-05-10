import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminWallet() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ userId: '', amount: '', currency: 'coins', description: '' });
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get('/api/wallet/transactions?limit=30');
      setTransactions(data.transactions || []);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users?limit=100');
      setUsers(data.users || []);
    } catch (error) {}
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.amount) { toast.error('Select user and enter amount'); return; }
    setSaving(true);
    try {
      await axios.post('/api/wallet/topup', { ...form, amount: parseInt(form.amount) });
      toast.success(`${form.amount} ${form.currency} added!`);
      setForm({ userId: '', amount: '', currency: 'coins', description: '' });
      fetchTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Top-up failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>🪙 Coin Manager</h2>

      <div className="grid-2" style={{ gap: 24, marginBottom: 28 }}>
        {/* Add coins form */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, fontFamily: 'Rajdhani, sans-serif' }}>➕ Add Coins to User</h3>
          <form onSubmit={handleTopUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Select User</label>
              <select className="input-gaming" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}>
                <option value="">-- Select User --</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.username} ({u.email})</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Amount</label>
                <input className="input-gaming" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Amount" min="1" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Type</label>
                <select className="input-gaming" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                  <option value="coins">Coins</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Description (optional)</label>
              <input className="input-gaming" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Reason for top-up" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {saving ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : '🪙 Add Coins'}
            </button>
          </form>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Total Transactions', value: transactions.length, icon: '📊', color: 'var(--purple-light)' },
            { label: 'Total Credits', value: transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0), icon: '⬆️', color: 'var(--green)' },
            { label: 'Total Debits', value: transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0), icon: '⬇️', color: 'var(--red)' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 28 }}>{stat.icon}</div>
              <div>
                <div className="font-gaming" style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value.toLocaleString()}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif' }}>Transaction History</h3>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ width: 32, height: 32, border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-gaming">
              <thead>
                <tr><th>ID</th><th>User</th><th>Type</th><th>Amount</th><th>Description</th><th>Date</th></tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn._id}>
                    <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{txn.transactionId}</td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{txn.user?.username}</td>
                    <td><span className={`badge ${txn.type === 'credit' ? 'badge-green' : 'badge-red'}`}>{txn.type}</span></td>
                    <td style={{ color: txn.type === 'credit' ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                      {txn.type === 'credit' ? '+' : '-'}{txn.currency === 'coins' ? '🪙' : '$'}{txn.amount}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{txn.description}</td>
                    <td style={{ fontSize: 12 }}>{new Date(txn.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
