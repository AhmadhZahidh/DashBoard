import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEye, FiX } from 'react-icons/fi';

const statusColors = { pending: 'var(--gold)', processing: 'var(--blue)', completed: 'var(--green)', cancelled: 'var(--red)', refunded: 'var(--text-muted)' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchOrders(); }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/orders?page=${page}&limit=15`);
      setOrders(data.orders || []);
      setPagination(data.pagination || {});
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { orderStatus: status });
      toast.success('Order status updated');
      fetchOrders();
      if (selectedOrder?._id === orderId) setSelectedOrder(prev => ({ ...prev, orderStatus: status }));
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>📦 Order Management</h2>

      <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-gaming">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td><span className="font-gaming" style={{ fontSize: 11, color: 'var(--purple-light)' }}>{order.orderId}</span></td>
                    <td style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{order.user?.username}</td>
                    <td style={{ fontSize: 12 }}>{order.items?.length} item(s)</td>
                    <td><span style={{ color: 'var(--gold)', fontWeight: 700 }}>🪙 {order.totalCoins || order.totalAmount}</span></td>
                    <td><span className="badge badge-purple">{order.paymentMethod}</span></td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: statusColors[order.orderStatus] || 'white', padding: '4px 8px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                      >
                        {['pending', 'processing', 'completed', 'cancelled', 'refunded'].map(s => (
                          <option key={s} value={s}>{s.toUpperCase()}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => setSelectedOrder(order)} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: 'var(--purple-light)', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                        <FiEye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center', gap: 8, borderTop: '1px solid var(--border)' }}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: p === page ? 'var(--purple)' : 'var(--bg-card)', color: p === page ? 'white' : 'var(--text-secondary)', fontWeight: 600 }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 className="font-gaming" style={{ fontSize: 16 }}>Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Order ID', selectedOrder.orderId],
                ['User', selectedOrder.user?.username],
                ['Email', selectedOrder.user?.email],
                ['Status', selectedOrder.orderStatus?.toUpperCase()],
                ['Payment', selectedOrder.paymentMethod],
                ['Total', `🪙 ${selectedOrder.totalCoins || selectedOrder.totalAmount}`],
                ['Date', new Date(selectedOrder.createdAt).toLocaleString()]
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, fontFamily: 'Rajdhani, sans-serif' }}>Items</h4>
            {selectedOrder.items?.map((item, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13 }}>{item.productName} x{item.quantity}</span>
                <span style={{ color: 'var(--gold)', fontSize: 13 }}>🪙 {item.coinPrice * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
