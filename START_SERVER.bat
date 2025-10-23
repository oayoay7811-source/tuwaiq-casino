@echo off
echo ========================================
echo   🎰 Tuwaiq Casino Game Server 🎰
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo Download the LTS version and install it.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    echo This may take a minute...
    echo.
    call npm install
    echo.
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
    echo.
)

echo 🚀 Starting server...
echo.
echo ========================================
echo   Server will start in a moment...
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

:: Start the server
node server.js

pause

