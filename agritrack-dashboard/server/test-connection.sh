#!/bin/bash

# MongoDB Atlas Connection Test Script
# This script helps you test your MongoDB Atlas connection

echo "🧪 Testing MongoDB Atlas Connection..."
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please create a .env file in the server directory"
    echo "💡 You can copy .env.example: cp .env.example .env"
    exit 1
fi

# Check if MONGODB_URI is set
if ! grep -q "MONGODB_URI=" .env; then
    echo "❌ Error: MONGODB_URI not found in .env file!"
    exit 1
fi

# Check if password placeholder is still present
if grep -q "<db_password>" .env; then
    echo "⚠️  Warning: You still have <db_password> placeholder in your .env file"
    echo "📝 Please replace it with your actual MongoDB Atlas password"
    echo ""
    echo "Steps:"
    echo "1. Open server/.env file"
    echo "2. Find the line: MONGODB_URI=mongodb+srv://..."
    echo "3. Replace <db_password> with your actual password"
    echo "4. Save the file and run this script again"
    exit 1
fi

echo "✅ .env file found"
echo "✅ MONGODB_URI is set"
echo ""

# Start the server in test mode
echo "🚀 Starting server to test connection..."
echo ""

cd "$(dirname "$0")"
npm run dev
