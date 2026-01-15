@echo off
REM Chronos Installer for Windows CMD
REM Usage: curl -fsSL https://raw.githubusercontent.com/example/chronos/main/install.cmd -o install.cmd && install.cmd

echo.
echo   ========================================
echo            Chronos Installer
echo      Autonomous Gemini Code Runner
echo   ========================================
echo.

REM Configuration
set REPO=farhanmir/Chronos
set INSTALL_DIR=%LOCALAPPDATA%\Chronos
set BINARY_NAME=chronos.exe

REM Create install directory
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Get latest version
echo Fetching latest version...
for /f "tokens=*" %%i in ('powershell -Command "(Invoke-RestMethod -Uri 'https://api.github.com/repos/%REPO%/releases/latest').tag_name"') do set VERSION=%%i
echo Latest version: %VERSION%

REM Download binary
set URL=https://github.com/%REPO%/releases/download/%VERSION%/chronos-windows-x64.exe
echo Downloading from: %URL%
powershell -Command "Invoke-WebRequest -Uri '%URL%' -OutFile '%INSTALL_DIR%\%BINARY_NAME%'"

REM Add to PATH
echo Adding to PATH...
setx PATH "%PATH%;%INSTALL_DIR%" >nul 2>&1

echo.
echo SUCCESS: Chronos installed to %INSTALL_DIR%\%BINARY_NAME%
echo.
echo To get started:
echo   1. Open a new command prompt
echo   2. Run: chronos --help
echo.

pause
