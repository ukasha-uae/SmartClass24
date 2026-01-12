@echo off
echo Restarting dev server with fresh config...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
npm run dev
