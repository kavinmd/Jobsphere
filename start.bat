@echo off
echo ========================================
echo   JobSphere — Starting Backend Server
echo ========================================
echo.
echo Starting MongoDB service...
net start MongoDB 2>nul || echo (MongoDB service not found, trying mongod...)
timeout /t 2 >nul

echo.
echo Starting Backend (Node.js + Express)...
cd /d %~dp0server
start cmd /k "npm run dev"

echo.
echo ========================================
echo   JobSphere — Starting Frontend Server  
echo ========================================
echo.
cd /d %~dp0client
start cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
