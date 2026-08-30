@echo off
title AutoAnalytics Dashboard
echo =======================================================
echo           Starting AutoAnalytics Dashboard
echo =======================================================
echo.
cd /d "%~dp0"
echo Opening web browser at http://localhost:3000 ...
start http://localhost:3000
echo.
echo Running server... (Keep this window open)
cmd /c "npm run dev"
pause
