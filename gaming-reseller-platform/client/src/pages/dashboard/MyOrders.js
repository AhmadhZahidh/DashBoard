import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPackage, FiEye, FiX } from 'react-icons/fi';

const statusColors = {
  pending: 'var(--gold)', processing: 'var(--blue)',
  completed: 'var(--green)', cancelled: 'var(--red)', refunded: 'var(--text-muted)'
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchOrders(); }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/orders?page=${page}&limit=10`);
      setOrders(data.orders || []);
      setPagination(data.pagination || {});
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <h2 className="font-gaming" style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>📦 My Orders</h2>

      <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p style={{ fontSize: 16 }}>No orders yet</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Visit the store to make your first purchase!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-gaming">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <span className="font-gaming" style={{ fontSize: 12, color: 'var(--purple-light)' }}>
                        {order.orderId}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-primary)' }}>
                      {order.items?.map(i => i.productName).join(', ').substring(0, 30)}...
                    </td>
                    <td>
                      <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                        🪙 {order.totalCoins || order.totalAmount}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-purple">{order.paymentMethod}</span>
                    </td>
                    <td>
                      <span style={{
                        color: statusColors[order.orderStatus] || 'var(--text-muted)',
                        fontWeight: 600, fontSize: 13, fontFamily: 'Rajdhani, sans-serif',
                        textTransform: 'uppercase'
                      }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                      >
                        <FiEye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center', gap: 8, borderTop: '1px solid var(--border)' }}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: p === page ? 'var(--purple)' : 'var(--bg-card)',
                  color: p === page ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: 14
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 className="font-gaming" style={{ fontSize: 16 }}>Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <FiX size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Order ID</span>
                <span className="font-gaming" style={{ fontSize: 12, color: 'var(--purple-light)' }}>{selectedOrder.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Status</span>
                <span style={{ color: statusColors[selectedOrder.orderStatus], fontWeight: 700, textTransform: 'uppercase', fontSize: 13 }}>
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Date</span>
                <span style={{ fontSize: 13 }}>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="divider" />

            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: 'Rajdhani, sans-serif' }}>Items</h4>
            {selectedOrder.items?.map((item, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{item.productName}</span>
                  <span style={{ color: 'var(--gold)' }}>🪙 {item.coinPrice * item.quantity}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                {item.deliveredKey && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--green)', marginBottom: 4, fontWeight: 600 }}>🔑 YOUR KEY:</div>
                    <code style={{ fontSize: 13, color: 'white', fontFamily: 'monospace', wordBreak: 'break-all' }}>{item.deliveredKey}</code>
                  </div>
                )}
              </div>
            ))}

            <div style={{ marginTop: 16, padding: '12px', background: 'var(--bg-primary)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total Paid</span>
                <span style={{ color: 'var(--gold)' }}>🪙 {selectedOrder.totalCoins || selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
