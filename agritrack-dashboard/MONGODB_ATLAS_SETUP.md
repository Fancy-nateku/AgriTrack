# MongoDB Atlas Connection Setup Guide

This guide will help you connect your AgriTrack backend to MongoDB Atlas using the credentials provided.

## Prerequisites

✅ MongoDB driver is already installed (`mongodb@^6.3.0` in `server/package.json`)

## Step 1: Get Your Database Password

You need to replace `<db_password>` in the connection string with your actual password.

**Option A: Use the auto-generated password**
- Go to MongoDB Atlas Dashboard → Database Access
- Find user `dcode0832_db_user`
- Click "Edit" and view/reset the password

**Option B: Create a new user with a simple password** (Recommended)
1. Go to **Database Access** in MongoDB Atlas
2. Click **"+ ADD NEW DATABASE USER"**
3. Fill in:
   - **Username**: `agritrack_user`
   - **Password**: Choose a strong password (e.g., `AgriTrack2024!`)
   - **Database User Privileges**: Select "Read and write to any database"
4. Click **"Add User"**

## Step 2: Update Your Environment File

Navigate to the server directory and update the `.env` file:

```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
```

Edit the `.env` file and update the `MONGODB_URI`:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://dcode0832_db_user:<YOUR_PASSWORD>@cluster0.syxfiwt.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=agritrack

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:5173

# JWT Configuration (generate a secure secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Replace `<YOUR_PASSWORD>` with your actual database password!

### Example with new user:
```env
MONGODB_URI=mongodb+srv://agritrack_user:AgriTrack2024!@cluster0.syxfiwt.mongodb.net/?appName=Cluster0
```

### Example with original user:
```env
MONGODB_URI=mongodb+srv://dcode0832_db_user:YourActualPassword123@cluster0.syxfiwt.mongodb.net/?appName=Cluster0
```

## Step 3: Verify Network Access

Make sure your IP address is whitelisted in MongoDB Atlas:

1. Go to **Network Access** in MongoDB Atlas
2. Click **"+ ADD IP ADDRESS"**
3. Either:
   - Click **"ADD CURRENT IP ADDRESS"** (for your current IP)
   - Click **"ALLOW ACCESS FROM ANYWHERE"** (for development - use `0.0.0.0/0`)
4. Click **"Confirm"**

## Step 4: Start the Backend Server

```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
npm run dev
```

## Step 5: Verify Connection

You should see output like this:

```
✅ .env file loaded successfully
🔍 MONGODB_URI exists: true
🔍 MongoDB URI: mongodb+srv://agritrack_user:****@cluster0.syxfiwt.mongodb.net/...
🔍 DB Name: agritrack
✅ Connected to MongoDB
🚀 AgriTrack API Server running on http://localhost:3001
📡 Accepting requests from: http://localhost:5173
```

Test the health endpoint:

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","message":"AgriTrack API Server is running"}
```

## Troubleshooting

### Authentication Failed Error

If you see `MongoServerError: bad auth: Authentication failed`:

1. **Double-check password**: Make sure there are no typos
2. **URL encode special characters**: If your password contains special characters like `@`, `#`, `$`, etc., you need to URL encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   
   Example: Password `Pass@123#` becomes `Pass%40123%23`

3. **Create a new user**: Follow Option B in Step 1 to create a fresh user with a simple password

### Connection Timeout Error

If you see `MongoServerError: connection timeout`:

1. Check Network Access in MongoDB Atlas
2. Make sure your IP is whitelisted
3. Try allowing access from anywhere (`0.0.0.0/0`) for testing

### Database Name

The connection string from MongoDB Atlas doesn't specify a database name. We're using `agritrack` as the database name in the `.env` file. The database will be created automatically when you insert the first document.

## Connection String Breakdown

```
mongodb+srv://[username]:[password]@[cluster-url]/[database]?[options]
```

- **Protocol**: `mongodb+srv://` (uses DNS SRV records)
- **Username**: `dcode0832_db_user` or your custom username
- **Password**: Your database user password (URL encoded if needed)
- **Cluster URL**: `cluster0.syxfiwt.mongodb.net`
- **Database**: Specified in `MONGODB_DB_NAME` env variable
- **Options**: `appName=Cluster0` (helps identify your app in Atlas)

## Next Steps

Once connected successfully:

1. ✅ Test API endpoints
2. ✅ Verify data persistence
3. ✅ Set up database indexes (optional, for performance)
4. ✅ Configure production environment variables

## Code Reference

The MongoDB connection is handled in:
- [database.ts](file:///home/fancy/Desktop/AgriTrack/agritrack-dashboard/server/src/config/database.ts) - Database connection class
- [server.ts](file:///home/fancy/Desktop/AgriTrack/agritrack-dashboard/server/src/server.ts) - Server initialization

The connection uses the official MongoDB Node.js driver with the following features:
- ✅ Stable API version (v1)
- ✅ Automatic connection pooling
- ✅ Graceful shutdown handling
- ✅ Error handling and logging
