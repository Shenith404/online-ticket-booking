@echo off
echo 🎯 Event Booking Frontend Setup
echo ================================

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

:: Install dependencies
echo 📦 Installing dependencies...
npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

:: Create .env.local if it doesn't exist
if not exist .env.local (
    echo 🔧 Creating .env.local file...
    (
        echo NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
        echo NEXT_PUBLIC_EVENT_SERVICE_URL=http://localhost:3002
        echo NEXT_PUBLIC_BOOKING_SERVICE_URL=http://localhost:3003
    ) > .env.local
    echo ✅ Environment file created
) else (
    echo ✅ Environment file already exists
)

echo.
echo 🚀 Setup complete! You can now run:
echo.
echo    npm run dev    - Start development server
echo    npm run build  - Build for production
echo    npm start      - Start production server
echo.
echo 📝 Make sure your backend services are running:
echo    - Auth Service: http://localhost:3001
echo    - Event Service: http://localhost:3002
echo    - Booking Service: http://localhost:3003
echo.
echo 🌐 Frontend will be available at: http://localhost:3000
echo.
pause
