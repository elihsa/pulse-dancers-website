#!/bin/bash

echo "🚗 ParkBuddy SA - Setting up..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Install from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo ""

# Install frontend dependencies first
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"
cd ..
echo ""

# Run database migration
echo "🗄️ Setting up database..."
cd backend
npm run db:migrate
if [ $? -ne 0 ]; then
    echo "⚠️  Database migration failed (this is OK if tables already exist)"
fi
cd ..
echo ""

echo "✅ Setup complete!"
echo ""
echo "🚀 Starting servers..."
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start both servers
(cd backend && npm run dev) &
BACKEND_PID=$!
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
