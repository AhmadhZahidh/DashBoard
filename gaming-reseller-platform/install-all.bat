@echo off
title Gaming Reseller - Install All Dependencies
color 0E
echo.
echo  ==========================================
echo   GAMING RESELLER - INSTALL DEPENDENCIES
echo  ==========================================
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js first:
    echo 1. Open browser
    echo 2. Go to: https://nodejs.org
    echo 3. Download LTS version
    echo 4. Run installer, click Next until Finish
    echo 5. CLOSE this window and reopen it
    echo 6. Run this file again
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.

:: Install backend
echo [1/3] Installing backend dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Backend install failed!
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed!
echo.

:: Install frontend
echo [2/3] Installing frontend dependencies...
cd client
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend install failed!
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed!
echo.

:: Create .env
echo [3/3] Setting up environment file...
if not exist ".env" (
    copy .env.example .env
    echo [OK] .env file created!
    echo.
    echo ==========================================
    echo  IMPORTANT: Edit .env file now!
    echo  Set your MONGODB_URI connection string
    echo ==========================================
    echo.
    notepad .env
) else (
    echo [OK] .env already exists
)

:: Create upload folders
mkdir uploads\products 2>nul
mkdir uploads\avatars 2>nul
mkdir uploads\banners 2>nul
mkdir uploads\backgrounds 2>nul
echo [OK] Upload folders created!
echo.

echo ==========================================
echo  INSTALLATION COMPLETE!
echo ==========================================
echo.
echo Now run these TWO files (in separate windows):
echo   1. run-backend.bat   (starts server on port 5000)
echo   2. run-frontend.bat  (starts React on port 3000)
echo.
echo Default Admin Login:
echo   Email:    admin@gamingreseller.com
echo   Password: Admin@123456
echo.
pause
