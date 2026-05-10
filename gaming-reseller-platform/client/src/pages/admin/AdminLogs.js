import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiShield } from 'react-icons/fi';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchLogs(); }, [page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/logs?page=${page}&limit=20`);
      setLogs(data.logs || []);
      setPagination(data.pagination || {});
    } catch (error) {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <FiShield size={22} color="var(--purple-light)" />
        <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700 }}>Admin Logs</h2>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FiShield size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p>No admin logs yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-gaming">
              <thead>
                <tr><th>Admin</th><th>Action</th><th>Target</th><th>Details</th><th>IP</th><th>Time</th></tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id}>
                    <td style={{ fontWeight: 600, fontSize: 13, color: 'white' }}>{log.admin?.username || log.adminName}</td>
                    <td><span className="badge badge-purple">{log.action}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{log.target}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.details}</td>
                    <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.ipAddress}</td>
                    <td style={{ fontSize: 12 }}>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center', gap: 8, borderTop: '1px solid var(--border)' }}>
            {Array.from({ length: Math.min(pagination.pages, 10) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: p === page ? 'var(--purple)' : 'var(--bg-card)', color: p === page ? 'white' : 'var(--text-secondary)', fontWeight: 600 }}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
