#!/bin/bash

# Post-Installation Configuration Script
# Updates server/.env with local MongoDB connection

set -e

echo "🔧 MongoDB Post-Installation Configuration"
echo "=========================================="
echo ""

SERVER_DIR="/home/fancy/Desktop/AgriTrack/agritrack-dashboard/server"
ENV_FILE="$SERVER_DIR/.env"
ENV_EXAMPLE="$SERVER_DIR/.env.example"

# Check if MongoDB is running
if ! systemctl is-active --quiet mongod; then
    echo "⚠️  MongoDB is not running!"
    echo "Starting MongoDB..."
    sudo systemctl start mongod
    sleep 2
fi

if systemctl is-active --quiet mongod; then
    echo "✅ MongoDB is running"
else
    echo "❌ Failed to start MongoDB"
    exit 1
fi

echo ""

# Check if .env file exists
if [ -f "$ENV_FILE" ]; then
    echo "📝 .env file exists"
    
    # Check if it has the local MongoDB URI
    if grep -q "mongodb://localhost:27017" "$ENV_FILE"; then
        echo "✅ .env already configured for local MongoDB"
    else
        echo "⚠️  .env exists but may be configured for MongoDB Atlas"
        echo ""
        read -p "Update .env to use local MongoDB? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Backup existing .env
            cp "$ENV_FILE" "$ENV_FILE.backup"
            echo "✅ Backed up existing .env to .env.backup"
            
            # Update MONGODB_URI
            sed -i 's|MONGODB_URI=.*|MONGODB_URI=mongodb://localhost:27017|' "$ENV_FILE"
            echo "✅ Updated MONGODB_URI to mongodb://localhost:27017"
        fi
    fi
else
    echo "📝 Creating .env file from .env.example..."
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    echo "✅ Created .env file"
fi

echo ""
echo "=========================================="
echo "✅ Configuration Complete!"
echo "=========================================="
echo ""
echo "MongoDB Connection: mongodb://localhost:27017"
echo "Database Name: agritrack"
echo ""
echo "Next steps:"
echo "1. Start your backend server:"
echo "   cd $SERVER_DIR"
echo "   npm run dev"
echo ""
echo "2. Test the connection:"
echo "   curl http://localhost:3001/health"
echo ""
