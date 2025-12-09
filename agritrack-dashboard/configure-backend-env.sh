#!/bin/bash

# Configure backend .env file for local MongoDB
# This script creates/updates the .env file with proper settings

cd "$(dirname "$0")/server"

# Generate JWT secret if not provided
JWT_SECRET="${1:-d8706aefcb2e87e1a47036bd98edad7bfa5f2628cdcb5484d629063d8d36c833}"

cat > .env << EOF
# MongoDB Configuration
# Local MongoDB (recommended for development)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=agritrack

# JWT Secret
JWT_SECRET=$JWT_SECRET

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
EOF

echo "✅ Backend .env configured successfully!"
echo "📁 Location: server/.env"
echo ""
echo "Configuration:"
echo "  - MongoDB URI: mongodb://localhost:27017"
echo "  - Database: agritrack"
echo "  - Port: 3001"
echo "  - Frontend URL: http://localhost:5173"
