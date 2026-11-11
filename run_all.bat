@echo off
title PhishGuard - Fullstack Launcher
echo ========================================================
echo   PhishGuard v2.0  -  AI Phishing Detection System
echo   Authors: Bala Vishnu and Diyanezwaran
echo ========================================================
echo   Backend  -^> http://127.0.0.1:8001
echo   Frontend -^> http://localhost:3000
echo ========================================================
echo.

start "PhishGuard Backend" cmd /k "cd /d "%~dp0backend" && "C:\Users\Vishnu\AppData\Local\Programs\Python\Python311\python.exe" server.py"

echo Waiting for backend to initialize (8 seconds)...
ping 127.0.0.1 -n 9 >nul

start "PhishGuard Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Waiting for frontend dev server (5 seconds)...
ping 127.0.0.1 -n 6 >nul

echo Opening browser...
start http://localhost:3000
echo.
echo Both services are running. Close those windows to stop them.


