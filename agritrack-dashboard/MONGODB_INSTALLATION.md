# MongoDB Setup for AgriTrack Backend

## Option 1: MongoDB Atlas (Recommended - Easiest)

### Why Atlas?
- ✅ Free tier available (512MB storage)
- ✅ No installation needed
- ✅ Works immediately
- ✅ Accessible from anywhere
- ✅ Automatic backups

### Setup Steps:

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Free Cluster**
   - Click "Build a Database"
   - Choose "FREE" (M0 Sandbox)
   - Select a cloud provider and region (choose closest to you)
   - Click "Create Cluster" (takes 1-3 minutes)

3. **Create Database User**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `agritrack`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist Your IP**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://agritrack:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add database name: `/agritrack` before the `?`
     ```
     mongodb+srv://agritrack:yourpassword@cluster0.xxxxx.mongodb.net/agritrack?retryWrites=true&w=majority
     ```

6. **Update server/.env**
   ```bash
   cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
   nano .env
   ```
   
   Add your connection string:
   ```env
   MONGODB_URI=mongodb+srv://agritrack:yourpassword@cluster0.xxxxx.mongodb.net/agritrack?retryWrites=true&w=majority
   MONGODB_DB_NAME=agritrack
   JWT_SECRET=your-random-secret-here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

7. **Generate JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as JWT_SECRET

8. **Start the Backend**
   ```bash
   cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
   npm run dev
   ```

---

## Option 2: Local MongoDB Installation (Advanced)

### For Ubuntu 22.04/24.04:

1. **Import MongoDB GPG Key**
   ```bash
   curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   ```

2. **Add MongoDB Repository**
   
   For Ubuntu 22.04:
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

   For Ubuntu 24.04:
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Update Package List**
   ```bash
   sudo apt-get update
   ```

4. **Install MongoDB**
   ```bash
   sudo apt-get install -y mongodb-org
   ```

5. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   sudo systemctl status mongod
   ```

6. **Verify Installation**
   ```bash
   mongosh
   ```
   Type `exit` to quit

7. **Update server/.env**
   ```bash
   cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
   nano .env
   ```
   
   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=agritrack
   JWT_SECRET=your-random-secret-here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

---

## Recommendation

**Use MongoDB Atlas (Option 1)** - It's:
- Faster to set up (5 minutes vs 30 minutes)
- No system configuration needed
- Free tier is sufficient for development
- Easier to share/deploy later

## After Setup

Once MongoDB is configured, start the backend:

```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 AgriTrack API Server running on http://localhost:3001
```

Then test with:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","message":"AgriTrack API Server is running"}
```
