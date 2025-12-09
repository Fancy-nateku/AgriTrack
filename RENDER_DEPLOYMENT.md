# Deploy AgriTrack Backend to Render.com

Complete step-by-step guide to deploy your Express backend to Render's free tier.

---

## Part 1: Create Render Account

1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your GitHub account

---

## Part 2: Create New Web Service

1. From Render Dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect GitHub"** if not already connected
4. Find and select your repository: **Fancy-nateku/AgriTrack**
5. Click **"Connect"**

---

## Part 3: Configure Service Settings

Fill in the following settings:

### Basic Settings

| Setting | Value |
|---------|-------|
| **Name** | `agritrack-backend` (or any name you prefer) |
| **Region** | Choose closest to you (e.g., Oregon, Frankfurt, Singapore) |
| **Branch** | `main` |
| **Root Directory** | `agritrack-dashboard/server` ⚠️ **IMPORTANT** |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

### Instance Type

- Select: **Free** (shows "$0/month")

---

## Part 4: Add Environment Variables

Click **"Advanced"** to expand environment variables section.

Add these **6 variables** (click "+ Add Environment Variable" for each):

### Variable 1: MONGODB_URI
```
mongodb+srv://agritrack_user:RF5VQ6Y1ZuiIcBv6@agritrack-cluster.ycbfash.mongodb.net/?appName=agritrack-cluster
```

### Variable 2: MONGODB_DB_NAME
```
agritrack
```

### Variable 3: JWT_SECRET
```
d6dd750e61906ac518e4e026af88ee767d0d612cfe5aee710b66ca4edb690e5a7261aa39b9859986d8211437e1025f58a543bd1b3852fa8119ab7d59eac6e001
```

### Variable 4: NODE_ENV
```
production
```

### Variable 5: FRONTEND_URL
```
https://agri-track-two.vercel.app
```

### Variable 6: PORT
```
3001
```

---

## Part 5: Deploy

1. Click **"Create Web Service"** button at the bottom
2. Wait for deployment (usually 2-5 minutes)
3. Watch the logs - you should see:
   ```
   ✅ Connected to MongoDB
   🚀 AgriTrack API Server running on http://localhost:3001
   ```

---

## Part 6: Get Your Backend URL

Once deployed, Render will give you a URL like:
```
https://agritrack-backend.onrender.com
```

**Copy this URL** - you'll need it for the next step!

---

## Part 7: Update Vercel Frontend

Now update your frontend to use the new Render backend:

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on **agri-track-two** project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` and click **Edit**
5. Change the value to your Render URL:
   ```
   https://agritrack-backend.onrender.com
   ```
6. Click **Save**
7. Go to **Deployments** tab
8. Click **"..."** on latest deployment → **Redeploy**

---

## Part 8: Test Your Deployment

### Test Backend Health
Open in browser:
```
https://agritrack-backend.onrender.com/health
```

Should show:
```json
{"status":"ok","message":"AgriTrack API Server is running"}
```

### Test Frontend
1. Visit: https://agri-track-two.vercel.app
2. Try to **Sign Up** with a new account
3. Try to **Login**
4. Check if Dashboard loads data

---

## ⚠️ Important Notes

### Free Tier Limitations
- Apps **spin down after 15 minutes** of inactivity
- First request after spin-down takes **~30 seconds** to wake up
- This is normal and acceptable for a farm management app

### If Deployment Fails
Check the **Logs** in Render dashboard for errors. Common issues:
- **MongoDB connection failed**: Check Network Access in MongoDB Atlas allows `0.0.0.0/0`
- **Build failed**: Check if `npm run build` works locally
- **Port binding**: Render provides PORT automatically, code uses `process.env.PORT`

---

## Success Checklist ✅

- [ ] Render deployment shows "Live" status
- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Frontend can sign up new users
- [ ] Frontend can login
- [ ] Dashboard displays data
- [ ] Can add expenses/income
- [ ] Data persists after refresh

---

## Your Deployment URLs

- **Frontend**: https://agri-track-two.vercel.app
- **Backend**: https://agritrack-backend.onrender.com (update after deployment)
- **Database**: MongoDB Atlas Cluster

---

**Ready to deploy?** Start with Part 1 and work through step-by-step!
