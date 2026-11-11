@echo off
title PhishGuard - Frontend Dev Server
echo ========================================================
echo   PhishGuard UI Dev Server
echo   Port: 3000 | URL: http://localhost:3000
echo ========================================================
cd /d "%~dp0"
npm run dev
pause

