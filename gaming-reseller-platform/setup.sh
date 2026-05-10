#!/bin/bash
echo "========================================"
echo " Gaming Reseller Platform - Setup"
echo "========================================"
echo ""

echo "[1/4] Installing backend dependencies..."
npm install
echo ""

echo "[2/4] Installing frontend dependencies..."
cd client && npm install && cd ..
echo ""

echo "[3/4] Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created! Please edit it with your settings."
else
    echo ".env already exists, skipping."
fi
echo ""

echo "[4/4] Creating uploads directories..."
mkdir -p uploads/products uploads/avatars uploads/banners uploads/backgrounds
echo ""

echo "========================================"
echo " Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Edit .env with your MongoDB URI and secrets"
echo "2. Run: npm run dev  (backend on port 5000)"
echo "3. Run: cd client && npm start  (frontend on port 3000)"
echo ""
echo "Default Admin Login:"
echo "  Email: admin@gamingreseller.com"
echo "  Password: Admin@123456"
