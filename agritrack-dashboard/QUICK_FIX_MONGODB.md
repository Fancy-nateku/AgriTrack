# Quick Fix: Create New MongoDB Atlas User

The auto-generated password isn't working. Let's create a new user with a simple password.

## Steps:

### 1. Go to Database Access
- In MongoDB Atlas dashboard, click **"Database Access"** in the left sidebar

### 2. Add New Database User
- Click **"+ ADD NEW DATABASE USER"** button

### 3. Create User with Simple Password
- **Authentication Method**: Password
- **Username**: `agritrack_user`
- **Password**: `agritrack123` (or any simple password you choose)
- **Database User Privileges**: Select "Atlas admin" or "Read and write to any database"
- Click **"Add User"**

### 4. Update Connection String

Edit `server/.env` file:

```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
nano .env
```

Update the MONGODB_URI line:
```
MONGODB_URI=mongodb+srv://agritrack_user:agritrack123@cluster0.3zhc3gl.mongodb.net/agritrack?retryWrites=true&w=majority
```

Save and exit (Ctrl+X, then Y, then Enter)

### 5. Restart the Server

The server should be running with `npm run dev`. It will automatically restart when you save the .env file.

If not, restart manually:
```bash
# Kill the current server (Ctrl+C in the terminal running it)
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
npm run dev
```

### 6. Test the Connection

In a new terminal:
```bash
curl http://localhost:3001/health
```

You should see:
```json
{"status":"ok","message":"AgriTrack API Server is running"}
```

## Success Indicators

When the server connects successfully, you'll see:
```
✅ .env file loaded successfully
🔍 MONGODB_URI exists: true
🔍 MongoDB URI: mongodb+srv://agritrack_user:****@cluster0.3zhc3gl.mongodb.net/agritrack...
🔍 DB Name: agritrack
✅ Connected to MongoDB
🚀 AgriTrack API Server running on http://localhost:3001
📡 Accepting requests from: http://localhost:5173
```

## Alternative: Use the Connection String from Atlas

1. In MongoDB Atlas, click **"Connect"** on your cluster
2. Choose **"Drivers"**
3. Copy the connection string
4. Click **"Show Password"** toggle to see the actual password
5. Replace `<db_password>` in the connection string with the shown password
6. Update `server/.env` with this connection string

## Troubleshooting

If you still get authentication errors:
- Make sure the user was created successfully in "Database Access"
- Verify the username and password match exactly
- Check that the user has the correct permissions
- Try deleting the old user (`dcode0832_db_user`) and creating a fresh one
