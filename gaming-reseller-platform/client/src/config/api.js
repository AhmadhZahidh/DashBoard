/**
 * API Configuration
 * Automatically uses the correct backend URL based on environment
 */

// In production: use REACT_APP_API_URL env var (set in Vercel)
// In development: use proxy (empty string routes through localhost:5000)
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Socket.IO URL
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL || '';

// WhatsApp
export const WA_NUMBER = process.env.REACT_APP_WA_NUMBER || '94742560815';

// Admin email
export const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'ahmadhzahidh215@gmail.com';

export default API_BASE_URL;
