@echo off
title Gaming Reseller - Backend Server
color 0A
echo.
echo  ==========================================
echo   GAMING RESELLER PLATFORM - BACKEND
echo  ==========================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing backend dependencies...
    npm install
    echo.
)

:: Check if .env exists
if not exist ".env" (
    echo [INFO] Creating .env file from template...
    copy .env.example .env
    echo.
    echo [!] IMPORTANT: Edit .env file with your MongoDB URI before continuing!
    echo     Opening .env in Notepad...
    notepad .env
    echo.
    pause
)

echo [INFO] Starting backend server on port 5000...
echo.
npm run dev
pause
