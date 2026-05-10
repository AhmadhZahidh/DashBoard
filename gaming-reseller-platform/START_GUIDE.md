# 🚀 How to Run - Step by Step Guide (Windows PowerShell)

## ⚠️ IMPORTANT: Run each command SEPARATELY, one at a time.

---

## STEP 1 — Install Node.js (do this first, only once)

1. Open browser → go to https://nodejs.org
2. Download "LTS" version
3. Run the installer, click Next → Next → Finish
4. CLOSE PowerShell and REOPEN it
5. Verify installation:
   node --version
   npm --version

---

## STEP 2 — Install Backend Dependencies

Open PowerShell, navigate to project folder:

   cd "C:\Users\user\OneDrive\Desktop\DashBoard\gaming-reseller-platform"
   npm install

Wait for it to finish (may take 1-2 minutes).

---

## STEP 3 — Install Frontend Dependencies

   cd client
   npm install

Wait for it to finish (may take 2-3 minutes).

---

## STEP 4 — Setup Environment File

   cd ..
   copy .env.example .env

Then open .env in Notepad and set your MongoDB URI.
If you don't have MongoDB installed, use MongoDB Atlas (free):
  → https://www.mongodb.com/atlas → Create free cluster → Get connection string

---

## STEP 5 — Install MongoDB (if running locally)

Download from: https://www.mongodb.com/try/download/community
Install and start the MongoDB service.
Default URI: mongodb://localhost:27017/gaming_reseller

---

## STEP 6 — Run the Backend Server

Open PowerShell Terminal 1:

   cd "C:\Users\user\OneDrive\Desktop\DashBoard\gaming-reseller-platform"
   npm run dev

You should see:
  ✅ MongoDB Connected
  ✅ Admin user created
  🚀 Server running on port 5000

---

## STEP 7 — Run the Frontend (NEW PowerShell window)

Open a SECOND PowerShell Terminal:

   cd "C:\Users\user\OneDrive\Desktop\DashBoard\gaming-reseller-platform\client"
   npm start

Browser will open automatically at http://localhost:3000

---

## 🎮 Default Login Credentials

   Admin Email:    admin@gamingreseller.com
   Admin Password: Admin@123456
   Admin Panel:    http://localhost:3000/admin

   (Register a new user at: http://localhost:3000/register)

---

## ❌ Common Errors & Fixes

ERROR: '&&' is not valid
FIX: In PowerShell, use semicolon (;) instead of &&
     Example: cd client; npm start   ← WRONG (cd changes won't persist)
     Correct: Open a new terminal, navigate, then run npm start

ERROR: npm not recognized
FIX: Node.js not installed. Go to nodejs.org and install it.

ERROR: MongoDB connection failed
FIX: Make sure MongoDB is running, or use MongoDB Atlas URI in .env

ERROR: Port 3000 already in use
FIX: npm start will ask to use another port, press Y

---

## 📁 Two Terminals Needed

Terminal 1 (Backend):
  cd "C:\Users\user\OneDrive\Desktop\DashBoard\gaming-reseller-platform"
  npm run dev

Terminal 2 (Frontend):
  cd "C:\Users\user\OneDrive\Desktop\DashBoard\gaming-reseller-platform\client"
  npm start
