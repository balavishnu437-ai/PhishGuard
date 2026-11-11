Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   PhishGuard v2.0 - AI Phishing Detection System" -ForegroundColor Green
Write-Host "   Authors: Bala Vishnu & Diyanezwaran" -ForegroundColor Green
Write-Host "   Backend API: http://127.0.0.1:8001" -ForegroundColor Yellow
Write-Host "   Frontend UI: http://localhost:3000" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$backendDir = Join-Path $PSScriptRoot "backend"
$frontendDir = Join-Path $PSScriptRoot "frontend"
$pythonPath = "C:\Users\Vishnu\AppData\Local\Programs\Python\Python311\python.exe"

Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k", "cd /d `"$backendDir`" && `"$pythonPath`" server.py" -WindowStyle Normal

Write-Host "Waiting for backend to initialize (8 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 8

Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k", "cd /d `"$frontendDir`" && npm run dev" -WindowStyle Normal

Write-Host "Waiting for frontend (5 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 5

Write-Host "Opening PhishGuard UI in default browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"
