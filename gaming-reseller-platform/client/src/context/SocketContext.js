import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

/**
 * Socket URL resolution:
 * - Production: REACT_APP_SOCKET_URL or REACT_APP_API_URL env var (REQUIRED)
 * - Development: localhost:5000 direct connection
 */
const getSocketURL = () => {
  if (process.env.REACT_APP_SOCKET_URL) return process.env.REACT_APP_SOCKET_URL;
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  // Development fallback only
  return 'http://localhost:5000';
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Disconnect existing socket when user logs out
    if (!user || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const SOCKET_URL = getSocketURL();

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      forceNew: true,
      withCredentials: true
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      setConnected(false);
      if (reason === 'io server disconnect') {
        // Server disconnected us — try to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (err) => {
      setConnected(false);
      // Don't spam errors in production
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Socket error:', err.message);
      }
    });

    newSocket.on('connected', (data) => {
      setOnlineCount(data.onlineCount || 0);
    });

    newSocket.on('online_count', (data) => {
      setOnlineCount(data.count || 0);
    });

    newSocket.on('notification', (data) => {
      const icons = { success: '✅', error: '❌', warning: '⚠️', info: '📢' };
      toast(data.message, {
        icon: icons[data.type] || '📢',
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
      toast.success(`Order ${data.orderId} completed! 🎮`);
    });

    newSocket.on('order_updated', (data) => {
      toast(`Order ${data.orderId}: ${data.status}`, { icon: '📦' });
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
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [user?._id, token]); // Only re-run when user ID or token changes

  const sendMessage = (data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', data);
    }
  };

  const emitTyping = (data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', data);
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      onlineCount,
      sendMessage,
      emitTyping
    }}>
      {children}
    </SocketContext.Provider>
  );
};
