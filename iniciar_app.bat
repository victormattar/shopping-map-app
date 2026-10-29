@echo off
title Shopping Mall - Mapa Interactivo
cd /d "%~dp0"
echo ========================================================
echo   Iniciando Mapa Interactivo del Centro Comercial...
echo ========================================================
echo.
python server.py
pause
