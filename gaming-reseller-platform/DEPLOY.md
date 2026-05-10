# 🚀 PRRX Gaming Reseller — Complete Production Deployment

## Architecture
```
Vercel (Frontend)  ──→  Koyeb/Railway (Backend)  ──→  MongoDB Atlas
       ↕                         ↕
  Firebase RTDB            Socket.IO
```

---

## ✅ STEP 1 — MongoDB Atlas (Free Database)

1. Go to **https://cloud.mongodb.com** → Sign up free
2. **Create a deployment** → M0 Free → AWS → Frankfurt → Create
3. **Security → Database Access** → Add new user:
   - Username: `prrxadmin`
   - Password: Click "Autogenerate Secure Password" → **COPY IT**
   - Role: `Atlas admin` → Add User
4. **Security → Network Access** → Add IP Address → `0.0.0.0/0` → Confirm
5. **Deployment → Database** → Connect → Drivers → Node.js → Copy URI

Your URI:
```
mongodb+srv://prrxadmin:YOURPASSWORD@cluster0.xxxxx.mongodb.net/gaming_reseller?retryWrites=true&w=majority
```

---

## ✅ STEP 2 — Push to GitHub

Open PowerShell in the `gaming-reseller-platform` folder:

```powershell
cd "C:\Users\user\OneDrive\Desktop\DashBoard\gaming-reseller-platform"

git init
git add .
git commit -m "feat: production ready PRRX Gaming backend"

# Create repo at https://github.com/new
# Name: prrx-gaming-backend (public)

git remote add origin https://github.com/YOUR_USERNAME/prrx-gaming-backend.git
git branch -M main
git push -u origin main
```

---

## ✅ STEP 3 — Deploy Backend on Koyeb (Free)

1. Go to **https://app.koyeb.com** → Sign up with GitHub
2. **Create Service** → GitHub → Select `prrx-gaming-backend`
3. Configure the service:
   - **Service name**: `prrx-gaming-api`
   - **Region**: Frankfurt
   - **Instance**: Free (nano)
   - **Build command**: `npm install`
   - **Run command**: `node server.js`
   - **Port**: `5000`

4. **Environment Variables** — Add ALL of these exactly:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prrxadmin:YOURPASSWORD@cluster0.xxxxx.mongodb.net/gaming_reseller?retryWrites=true&w=majority
JWT_SECRET=prrx_jwt_2026_xK9mP3nQvL8rT5wY2zA4bC6dE8fG0hI
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=prrx_refresh_2026_yL8nR4mWqP7sX3vB5cD9eF1gH
JWT_REFRESH_EXPIRE=30d
CLIENT_URL=https://dash-board-delta-snowy.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=ahmadhzahidh215@gmail.com
EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD
EMAIL_FROM=PRRX Gaming <ahmadhzahidh215@gmail.com>
ADMIN_EMAIL=admin@gamingreseller.com
ADMIN_PASSWORD=Admin@123456
SESSION_SECRET=prrx_session_2026_zM7pS5kTnQ2rV4wX
WHATSAPP_NUMBER=94742560815
```

5. **Deploy** → Wait for green ✅ (2-3 minutes)
6. Copy your URL: `https://prrx-gaming-api-XXXX.koyeb.app`

### Test backend:
```
https://prrx-gaming-api-XXXX.koyeb.app/api/health
```
Expected: `{"status":"ok","db":"connected",...}`

---

## ✅ STEP 4 — Configure Vercel Frontend

1. Go to **https://vercel.com** → Your project `dash-board-delta-snowy`
2. **Settings** → **Environment Variables** → Add these:

| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | `https://prrx-gaming-api-XXXX.koyeb.app` |
| `REACT_APP_SOCKET_URL` | `https://prrx-gaming-api-XXXX.koyeb.app` |
| `REACT_APP_WA_NUMBER` | `94742560815` |
| `REACT_APP_ADMIN_EMAIL` | `ahmadhzahidh215@gmail.com` |

3. **Settings** → **General** → Set:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Deployments** → Latest → Three dots → **Redeploy**

---

## ✅ STEP 5 — Gmail App Password

1. Go to **https://myaccount.google.com/security**
2. Enable **2-Step Verification** (required)
3. Search "App passwords" → Select app: **Mail** → Generate
4. Copy the 16-character password → Use as `EMAIL_PASS` in Koyeb

---

## ✅ STEP 6 — Verify Everything Works

```
Backend:   https://prrx-gaming-api-XXXX.koyeb.app/api/health
Frontend:  https://dash-board-delta-snowy.vercel.app
Login:     https://dash-board-delta-snowy.vercel.app/login
Dashboard: https://dash-board-delta-snowy.vercel.app/dashboard
Admin:     https://dash-board-delta-snowy.vercel.app/admin
```

**Default login:**
```
Email:    admin@gamingreseller.com
Password: Admin@123456
```

---

## 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| API requests fail on Vercel | Add `REACT_APP_API_URL` in Vercel env vars → Redeploy |
| MongoDB connection failed | Check URI, whitelist `0.0.0.0/0` in Atlas |
| CORS error in browser | Check `CLIENT_URL` in Koyeb = exact Vercel URL |
| Socket.IO not connecting | Check `REACT_APP_SOCKET_URL` = Koyeb URL |
| Dashboard 404 on refresh | `vercel.json` in `client/` folder fixes this |
| Login not working | Check backend health endpoint first |

---

## 🚂 Railway Alternative

1. Go to **https://railway.app** → New Project → Deploy from GitHub
2. Select `prrx-gaming-backend`
3. Add same environment variables
4. Railway auto-detects Node.js → runs `npm start`
5. Copy Railway URL → use as `REACT_APP_API_URL` in Vercel

---

## 📁 Deployment Structure

```
GitHub: gaming-reseller-platform/
├── server.js              ← Koyeb/Railway runs this
├── package.json           ← Backend dependencies
├── .env.example           ← Reference (not committed)
├── Procfile               ← web: node server.js
├── routes/                ← API endpoints
├── models/                ← MongoDB schemas
├── middleware/
├── socket/
├── utils/
└── client/                ← Vercel deploys from here
    ├── package.json
    ├── vercel.json        ← Fixes React Router 404s
    ├── .env.example
    └── src/
        ├── context/
        │   ├── AuthContext.js    ← Uses REACT_APP_API_URL
        │   └── SocketContext.js  ← Uses REACT_APP_SOCKET_URL
        └── firebase.js           ← Direct Firebase (no backend needed)
```
