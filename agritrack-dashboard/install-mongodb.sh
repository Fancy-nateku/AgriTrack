#!/bin/bash

# MongoDB Installation Script for Ubuntu 24.04 LTS
# This script automates the installation of MongoDB Community Edition

set -e  # Exit on error

echo "🚀 MongoDB Installation Script for Ubuntu 24.04"
echo "================================================"
echo ""

# Check if running on Ubuntu 24.04
if ! grep -q "24.04" /etc/os-release; then
    echo "⚠️  Warning: This script is designed for Ubuntu 24.04"
    echo "Your system: $(lsb_release -d | cut -f2)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Step 1: Importing MongoDB public GPG key..."
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor

echo "✅ GPG key imported"
echo ""

echo "📝 Step 2: Adding MongoDB repository..."
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

echo "✅ Repository added"
echo ""

echo "🔄 Step 3: Updating package database..."
sudo apt-get update

echo "✅ Package database updated"
echo ""

echo "📥 Step 4: Installing MongoDB..."
sudo apt-get install -y mongodb-org

echo "✅ MongoDB installed"
echo ""

echo "🚀 Step 5: Starting MongoDB service..."
sudo systemctl start mongod

echo "✅ MongoDB service started"
echo ""

echo "🔧 Step 6: Enabling MongoDB to start on boot..."
sudo systemctl enable mongod

echo "✅ MongoDB enabled on boot"
echo ""

echo "🔍 Step 7: Verifying MongoDB status..."
sudo systemctl status mongod --no-pager

echo ""
echo "================================================"
echo "✅ MongoDB Installation Complete!"
echo "================================================"
echo ""
echo "MongoDB is now running on: mongodb://localhost:27017"
echo ""
echo "Next steps:"
echo "1. Update server/.env with: MONGODB_URI=mongodb://localhost:27017"
echo "2. Start your backend server: cd server && npm run dev"
echo ""
echo "Useful commands:"
echo "  - Connect to MongoDB shell: mongosh"
echo "  - Check status: sudo systemctl status mongod"
echo "  - View logs: sudo journalctl -u mongod -f"
echo "  - Stop MongoDB: sudo systemctl stop mongod"
echo "  - Start MongoDB: sudo systemctl start mongod"
echo ""
