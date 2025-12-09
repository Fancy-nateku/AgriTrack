# 🚀 Quick Start: MongoDB Atlas Connection

## 1️⃣ Update Your Password

Edit `server/.env` and replace `<db_password>`:

```env
MONGODB_URI=mongodb+srv://dcode0832_db_user:YOUR_ACTUAL_PASSWORD@cluster0.syxfiwt.mongodb.net/?appName=Cluster0
```

**Special Characters?** URL encode them:
- `@` → `%40`
- `#` → `%23`  
- `$` → `%24`
- `%` → `%25`

## 2️⃣ Whitelist Your IP

In MongoDB Atlas:
1. Go to **Network Access**
2. Click **"+ ADD IP ADDRESS"**
3. Choose **"ALLOW ACCESS FROM ANYWHERE"** (for development)

## 3️⃣ Start the Server

```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
npm run dev
```

## 4️⃣ Verify Connection

Look for these messages:
```
✅ Connected to MongoDB
✅ Successfully pinged MongoDB deployment
🚀 AgriTrack API Server running on http://localhost:3001
```

Test the API:
```bash
curl http://localhost:3001/health
```

---

**Need help?** See [MONGODB_ATLAS_SETUP.md](file:///home/fancy/Desktop/AgriTrack/agritrack-dashboard/MONGODB_ATLAS_SETUP.md) for detailed instructions.
