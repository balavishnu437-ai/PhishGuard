@echo off
title PhishGuard - FastAPI Backend
echo ========================================================
echo   PhishGuard AI Phishing URL Detection Backend API
echo   Port: 8001 | Host: 127.0.0.1
echo ========================================================
cd /d "%~dp0"
"C:\Users\Vishnu\AppData\Local\Programs\Python\Python311\python.exe" server.py
pause

