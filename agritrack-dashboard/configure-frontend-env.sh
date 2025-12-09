#!/bin/bash

# Configure frontend .env file
# This script creates/updates the frontend .env file with proper settings

cd "$(dirname "$0")"

cat > .env << EOF
# Backend API URL
VITE_API_URL=http://localhost:3001
EOF

echo "✅ Frontend .env configured successfully!"
echo "📁 Location: .env"
echo ""
echo "Configuration:"
echo "  - API URL: http://localhost:3001"
