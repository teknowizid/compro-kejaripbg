@echo off
rem ==============================================================================
rem Dev Manager - Dashboard Desktop GUI Kejaksaan Negeri Purbalingga
rem Mengelola Backend API (:3001) dan Frontend Website (:5173) dalam 1 Dashboard
rem Cukup double-click file ini untuk membuka dashboard tanpa jendela terminal.
rem ==============================================================================
title Kejari Dev Manager Launcher
cd /d "%~dp0"

start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0tools\dev-manager.ps1"
