# 🎮 Gaming Reseller Platform

A full-stack premium gaming reseller dashboard inspired by the Free Fire reseller panel style, featuring dark neon UI, glassmorphism cards, real-time features, and complete admin controls.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Real-time | Socket.IO |
| File Upload | Multer (local) |
| Charts | Chart.js + react-chartjs-2 |
| Styling | Custom CSS (dark neon gaming theme) |
| Email | Nodemailer |

---

## 📁 Project Structure

```
gaming-reseller-platform/
├── server.js              # Main server entry
├── package.json
├── .env.example           # Environment variables template
├── models/                # MongoDB models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Announcement.js
│   ├── Chat.js
│   ├── Transaction.js
│   ├── Coupon.js
│   ├── Settings.js
│   └── AdminLog.js
├── routes/                # Express API routes
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── orders.js
│   ├── wallet.js
│   ├── announcements.js
│   ├── chat.js
│   ├── admin.js
│   ├── upload.js
│   ├── settings.js
│   ├── coupons.js
│   └── notifications.js
├── middleware/
│   ├── auth.js            # JWT middleware
│   ├── errorHandler.js
│   └── rateLimiter.js
├── socket/
│   └── socketHandler.js   # Socket.IO events
├── utils/
│   ├── generateToken.js
│   ├── seedAdmin.js
│   └── sendEmail.js
├── uploads/               # Local file uploads
└── client/                # React frontend
    ├── public/
    └── src/
        ├── App.js
        ├── index.css      # Global gaming styles
        ├── context/       # React contexts
        │   ├── AuthContext.js
        │   ├── SocketContext.js
        │   └── SettingsContext.js
        ├── layouts/
        │   ├── DashboardLayout.js
        │   └── AdminLayout.js
        └── pages/
            ├── LandingPage.js
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── dashboard/
            │   ├── Dashboard.js
            │   ├── GameStore.js
            │   ├── MyOrders.js
            │   ├── Wallet.js
            │   ├── CoinTopUp.js
            │   ├── MyProfile.js
            │   ├── ChatWithAdmin.js
            │   └── Notifications.js
            └── admin/
                ├── AdminDashboard.js
                ├── AdminUsers.js
                ├── AdminProducts.js
                ├── AdminOrders.js
                ├── AdminWallet.js
                ├── AdminAnnouncements.js
                ├── AdminChat.js
                ├── AdminSettings.js
                ├── AdminCoupons.js
                └── AdminLogs.js
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd gaming-reseller-platform
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Variables

```bash
cp .env.example .env
# Edit .env with your values
```

Key variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gaming_reseller
JWT_SECRET=your_super_secret_key
ADMIN_EMAIL=admin@gamingreseller.com
ADMIN_PASSWORD=Admin@123456
CLIENT_URL=http://localhost:3000
```

### 3. Run Development

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### 4. Production Build

```bash
cd client && npm run build
cd ..
NODE_ENV=production npm start
```

---

## 🔐 Default Admin Login

| Field | Value |
|-------|-------|
| Email | admin@gamingreseller.com |
| Username | admin |
| Password | Admin@123456 |

> ⚠️ Change these in `.env` before deploying!

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/verify-email/:token` | Verify email |
| POST | `/api/auth/change-password` | Change password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| POST | `/api/products/:id/keys` | Add keys (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get orders |
| GET | `/api/orders/:id` | Get order by ID |
| PUT | `/api/orders/:id/status` | Update status (admin) |

### Wallet
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallet/balance` | Get balance |
| GET | `/api/wallet/transactions` | Get transactions |
| POST | `/api/wallet/topup` | Add coins (admin) |
| POST | `/api/wallet/deduct` | Deduct coins (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/logs` | Admin logs |
| POST | `/api/admin/broadcast` | Broadcast notification |
| GET | `/api/admin/online-users` | Online users |
| GET | `/api/admin/revenue-stats` | Revenue statistics |

---

## 🎨 UI Features

- **Dark neon gaming theme** - Black background with purple/green glow
- **Glassmorphism cards** - Frosted glass effect panels
- **Animated particles** - Canvas-based particle background on landing
- **Smooth transitions** - CSS animations and hover effects
- **Mobile responsive** - Works on Android and iPhone
- **Gaming fonts** - Orbitron + Rajdhani + Inter
- **Real-time updates** - Socket.IO for live notifications

---

## 🔌 Socket.IO Events

### Client → Server
- `send_message` - Send chat message
- `typing` - Typing indicator
- `ping` - Heartbeat

### Server → Client
- `connected` - Connection confirmed
- `new_message` - New chat message
- `notification` - User notification
- `broadcast` - Admin broadcast
- `balance_updated` - Balance change
- `order_completed` - Order done
- `online_count` - Online user count
- `admin_typing` - Admin typing indicator
- `account_banned` - Account banned

---

## 🚀 Deployment

### Environment
Set `NODE_ENV=production` and update `CLIENT_URL` to your domain.

### MongoDB Atlas
Replace `MONGODB_URI` with your Atlas connection string.

### File Uploads
For production, configure Cloudinary:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📱 Mobile Support

The dashboard is fully responsive with:
- Collapsible sidebar with hamburger menu
- Touch-friendly buttons and cards
- Mobile-optimized chat interface
- Responsive grid layouts

---

## 🛡️ Security Features

- JWT authentication with refresh tokens
- bcrypt password hashing (12 rounds)
- Rate limiting on auth endpoints
- Helmet.js security headers
- CORS configuration
- Input validation
- Role-based access control (RBAC)
- Account ban system

---

*Built with ❤️ for the gaming community*
