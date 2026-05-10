import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { SettingsProvider } from './context/SettingsContext';
import PageLoader from './components/PageLoader';
import WhatsAppButton from './components/WhatsAppButton';

// Lazy load pages for performance
const LandingPage      = lazy(() => import('./pages/LandingPage'));
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const RegisterPage     = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmailPage    = lazy(() => import('./pages/VerifyEmailPage'));
const PrivacyPage        = lazy(() => import('./pages/PrivacyPage'));
const TermsPage          = lazy(() => import('./pages/TermsPage'));
const AboutPage          = lazy(() => import('./pages/AboutPage'));
const ContactPage        = lazy(() => import('./pages/ContactPage'));

// Dashboard
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const Dashboard       = lazy(() => import('./pages/dashboard/Dashboard'));
const GameStore       = lazy(() => import('./pages/dashboard/GameStore'));
const MyOrders        = lazy(() => import('./pages/dashboard/MyOrders'));
const Wallet          = lazy(() => import('./pages/dashboard/Wallet'));
const CoinTopUp       = lazy(() => import('./pages/dashboard/CoinTopUp'));
const MyProfile       = lazy(() => import('./pages/dashboard/MyProfile'));
const ChatWithAdmin   = lazy(() => import('./pages/dashboard/ChatWithAdmin'));
const Notifications   = lazy(() => import('./pages/dashboard/Notifications'));
const LiveChat        = lazy(() => import('./pages/dashboard/LiveChat'));

// Admin
const AdminLayout       = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers        = lazy(() => import('./pages/admin/AdminUsers'));
const AdminProducts     = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders       = lazy(() => import('./pages/admin/AdminOrders'));
const AdminWallet       = lazy(() => import('./pages/admin/AdminWallet'));
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'));
const AdminChat         = lazy(() => import('./pages/admin/AdminChat'));
const AdminSettings     = lazy(() => import('./pages/admin/AdminSettings'));
const AdminCoupons      = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminLogs         = lazy(() => import('./pages/admin/AdminLogs'));

// Spinner fallback
const Fallback = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#05050d' }}>
    <div style={{ position:'relative', width:60, height:60 }}>
      <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'3px solid transparent', borderTopColor:'#7c3aed', borderRightColor:'#7c3aed', animation:'spin 1s linear infinite' }} />
      <div style={{ position:'absolute', inset:8, borderRadius:'50%', border:'2px solid transparent', borderBottomColor:'#10b981', animation:'spin 0.7s linear infinite reverse' }} />
    </div>
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <Fallback />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin' && user.role !== 'moderator') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Fallback />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

function AppRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Public */}
        <Route path="/"                    element={<LandingPage />} />
        <Route path="/login"               element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register"            element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password"     element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/privacy"             element={<PrivacyPage />} />
        <Route path="/terms"               element={<TermsPage />} />
        <Route path="/about"               element={<AboutPage />} />
        <Route path="/contact"             element={<ContactPage />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index          element={<Dashboard />} />
          <Route path="store"   element={<GameStore />} />
          <Route path="orders"  element={<MyOrders />} />
          <Route path="wallet"  element={<Wallet />} />
          <Route path="topup"   element={<CoinTopUp />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="chat"    element={<ChatWithAdmin />} />
          <Route path="live-chat" element={<LiveChat />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Admin Panel */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index                element={<AdminDashboard />} />
          <Route path="users"         element={<AdminUsers />} />
          <Route path="products"      element={<AdminProducts />} />
          <Route path="orders"        element={<AdminOrders />} />
          <Route path="wallet"        element={<AdminWallet />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="chat"          element={<AdminChat />} />
          <Route path="coupons"       element={<AdminCoupons />} />
          <Route path="logs"          element={<AdminLogs />} />
          <Route path="settings"      element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <SocketProvider>
            {!loaded && <PageLoader onComplete={() => setLoaded(true)} />}
            <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
              <AppRoutes />
              <WhatsAppButton />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#0e0e1f',
                  color: '#fff',
                  border: '1px solid rgba(124,58,237,0.35)',
                  borderRadius: '12px',
                  fontFamily: 'Space Grotesk,sans-serif',
                  fontSize: '14px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                duration: 4000
              }}
            />
          </SocketProvider>
        </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;
