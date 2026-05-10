import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (user && token) {
      const newSocket = io(process.env.REACT_APP_SOCKET_URL || '', {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      newSocket.on('connect', () => {
        setConnected(true);
        console.log('🔌 Socket connected');
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
      });

      newSocket.on('connected', (data) => {
        setOnlineCount(data.onlineCount || 0);
      });

      newSocket.on('online_count', (data) => {
        setOnlineCount(data.count || 0);
      });

      newSocket.on('notification', (data) => {
        toast(data.message, {
          icon: data.type === 'success' ? '✅' : data.type === 'error' ? '❌' : data.type === 'warning' ? '⚠️' : '📢',
          duration: 5000
        });
      });

      newSocket.on('broadcast', (data) => {
        toast(data.message, { icon: '📢', duration: 6000 });
      });

      newSocket.on('balance_updated', (data) => {
        toast.success(data.message || 'Balance updated!');
      });

      newSocket.on('order_completed', (data) => {
        toast.success(`Order ${data.orderId} completed!`);
      });

      newSocket.on('account_banned', (data) => {
        toast.error(data.message || 'Your account has been banned.');
      });

      newSocket.on('settings_updated', (data) => {
        if (data.maintenanceMode) {
          toast('Site is under maintenance', { icon: '🔧' });
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        setConnected(false);
      };
    }
  }, [user, token]);

  const sendMessage = (data) => {
    if (socket) socket.emit('send_message', data);
  };

  const emitTyping = (data) => {
    if (socket) socket.emit('typing', data);
  };

  return (
    <SocketContext.Provider value={{ socket, connected, onlineCount, sendMessage, emitTyping }}>
      {children}
    </SocketContext.Provider>
  );
};
