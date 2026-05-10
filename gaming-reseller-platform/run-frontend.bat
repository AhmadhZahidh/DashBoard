@echo off
title Gaming Reseller - Frontend
color 0B
echo.
echo  ==========================================
echo   GAMING RESELLER PLATFORM - FRONTEND
echo  ==========================================
echo.

:: Go to client folder
cd client

:: Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    npm install
    echo.
)

echo [INFO] Starting frontend on http://localhost:3000
echo [INFO] Browser will open automatically...
echo.
npm start
pause
