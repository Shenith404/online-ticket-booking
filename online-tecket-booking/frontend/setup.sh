#!/bin/bash

echo "🎯 Event Booking Frontend Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOL
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_EVENT_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_BOOKING_SERVICE_URL=http://localhost:3003
EOL
    echo "✅ Environment file created"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🚀 Setup complete! You can now run:"
echo ""
echo "   npm run dev    - Start development server"
echo "   npm run build  - Build for production"
echo "   npm start      - Start production server"
echo ""
echo "📝 Make sure your backend services are running:"
echo "   - Auth Service: http://localhost:3001"
echo "   - Event Service: http://localhost:3002"
echo "   - Booking Service: http://localhost:3003"
echo ""
echo "🌐 Frontend will be available at: http://localhost:3000"
