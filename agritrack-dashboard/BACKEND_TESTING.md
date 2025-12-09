# Backend API Server Testing Guide

## Prerequisites

### 1. MongoDB Setup Required

The backend server requires MongoDB to be running. You have two options:

#### Option A: MongoDB Atlas (Recommended - No Installation)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account and cluster
3. Get your connection string
4. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agritrack
   ```

#### Option B: Local MongoDB Installation
1. Install MongoDB Community Edition:
   - Ubuntu: `sudo apt-get install mongodb`
   - Mac: `brew install mongodb-community`
   - Windows: Download from mongodb.com

2. Start MongoDB:
   ```bash
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # Mac
   ```

3. Update `server/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017
   ```

### 2. Environment Configuration

Create `server/.env` file:
```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your MongoDB URI and a secure JWT secret:
```env
MONGODB_URI=your-mongodb-uri-here
MONGODB_DB_NAME=agritrack
JWT_SECRET=your-random-secret-key-here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Starting the Backend Server

```bash
cd server
npm install  # If not already done
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 AgriTrack API Server running on http://localhost:3001
📡 Accepting requests from: http://localhost:5173
```

## Testing the API

### Method 1: Using curl

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Register a User:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123","full_name":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

Save the token from the response, then:

**Get Current User:**
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Get Default Farm:**
```bash
curl http://localhost:3001/api/farms/default \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Method 2: Using Thunder Client / Postman

1. Install Thunder Client extension in VS Code
2. Import this collection or create requests manually:

**Collection:**
- Base URL: `http://localhost:3001/api`
- Authorization: Bearer Token (add after login)

**Requests to test:**
1. POST `/auth/register` - Register user
2. POST `/auth/login` - Login user (save token)
3. GET `/auth/me` - Get current user
4. GET `/farms/default` - Get/create default farm (save farm_id)
5. GET `/expenses?farm_id=FARM_ID` - Get expenses
6. POST `/expenses` - Create expense
7. GET `/income?farm_id=FARM_ID` - Get income
8. POST `/income` - Create income
9. GET `/activities?farm_id=FARM_ID` - Get activities
10. POST `/activities` - Create activity
11. GET `/dashboard/metrics?farm_id=FARM_ID` - Get metrics

### Method 3: Using the Frontend (After Migration)

Once the frontend is migrated, you can test through the UI:
1. Start backend: `cd server && npm run dev`
2. Start frontend: `npm run dev`
3. Register/login through the UI
4. Test all CRUD operations

## Troubleshooting

### Server won't start
- Check if port 3001 is already in use: `lsof -i :3001`
- Check MongoDB connection string in `.env`
- Ensure MongoDB is running

### Connection refused
- Verify MongoDB is running: `mongosh` or `mongo`
- Check MONGODB_URI in `.env`
- For Atlas: Check IP whitelist and credentials

### 401 Unauthorized
- Token may be expired (7 days)
- Login again to get a new token
- Check Authorization header format: `Bearer TOKEN`

### CORS errors
- Check FRONTEND_URL in server `.env`
- Ensure it matches your frontend URL

## Expected Test Results

✅ **All endpoints should:**
- Return proper status codes (200, 201, 400, 401, 404, 500)
- Include appropriate error messages
- Protect routes with authentication (except auth routes)
- Return data in expected format

✅ **Database should:**
- Create collections automatically
- Store data correctly
- Enforce data types
- Handle ObjectId conversions

## Next Steps After Testing

Once backend testing is complete:
1. Migrate frontend AuthContext
2. Update all page components
3. Update all hooks
4. Test full integration
5. Deploy both frontend and backend
