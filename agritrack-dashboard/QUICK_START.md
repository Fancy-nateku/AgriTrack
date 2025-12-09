# 🚀 AgriTrack - Quick Start Commands

## 💻 Running Locally (RIGHT NOW)

### ✅ Currently Running:
1. **Backend**: http://localhost:3001 (Terminal 1)
2. **Frontend**: http://localhost:8080 (Terminal 2)

### 🌐 Access Your App:
Open browser → **http://localhost:8080**

---

## 🔄 Commands to Remember

### Start Backend
```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
npm run dev
```
**Runs on**: http://localhost:3001

### Start Frontend
```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard
npm run dev
```
**Runs on**: http://localhost:8080 or http://localhost:5173

### Build Frontend for Production
```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard
npm run build
```

### Build Backend for Production
```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
npm run build
```

---

## 📊 Health Checks

### Check Backend API
```bash
curl http://localhost:3001/health
```

### Check MongoDB
```bash
mongosh --eval "db.adminCommand('ping')"
```

### Check Backend Logs
Look at Terminal 1 (where backend is running)

### Check Frontend Logs  
Look at Terminal 2 (where frontend is running)

---

## 🛠️ Useful Development Commands

### Create Database Indexes
```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
npx tsx src/scripts/createIndexes.ts
```

### Check MongoDB Collections
```bash
mongosh
use agritrack
show collections
db.users.find().pretty()
```

### Restart Backend (if needed)
1. Press `Ctrl+C` in backend terminal
2. Run `npm run dev` again

### Restart Frontend (if needed)
1. Press `Ctrl+C` in frontend terminal
2. Run `npm run dev` again

---

## 🌐 For Deployment

See [deployment_guide.md](file:///home/fancy/.gemini/antigravity/brain/9970c120-31cf-4ad9-9261-18188bddb135/deployment_guide.md) for:
- Vercel deployment
- Railway deployment  
- Render deployment
- Production environment setup
