@echo off
title Nexus Dashboard
if not exist node_modules (
  echo Instalando dependencias...
  call npm install
)
echo.
echo Abrindo Nexus Dashboard...
call npm run dev
pause
