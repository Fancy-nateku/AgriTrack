# 🔐 AgriTrack Production Credentials

**IMPORTANT: Keep this file secure! Do NOT commit to GitHub!**

---

## Production JWT Secrets

**Primary Secret (Use this one):**
```
d6dd750e61906ac518e4e026af88ee767d0d612cfe5aee710b66ca4edb690e5a7261aa39b9859986d8211437e1025f58a543bd1b3852fa8119ab7d59eac6e001
```

**Backup Secret (In case you need to rotate):**
```
da4c794e7429a111bacf65c40e290b7a66897e5fd5a568766e7febbb9f6a4410248ea0231d42398c24217b0339eff1dd6284dc6e8f941ebed09575c1ea923e41
```

---

## MongoDB Atlas Credentials

**Track your MongoDB credentials here:**

**Username:** `agritrack_user`

**Password:** `______________RF5VQ6Y1ZuiIcBv6___________` (Fill this in when you create the user)

**Connection String:**
```
mongodb+srv://agritrack_user:RF5VQ6Y1ZuiIcBv6@agritrack-cluster.ycbfash.mongodb.net/?appName=agritrack-cluster
```

---

## Railway Backend URL

**Backend URL:** `https://agritrack-production.up.railway.app`

---

## Environment Variables Summary

Copy these to Railway after filling in the MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://agritrack_user:YOUR_PASSWORD@agritrack-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=agritrack
JWT_SECRET=d6dd750e61906ac518e4e026af88ee767d0d612cfe5aee710b66ca4edb690e5a7261aa39b9859986d8211437e1025f58a543bd1b3852fa8119ab7d59eac6e001
NODE_ENV=production
FRONTEND_URL=https://agri-track-two.vercel.app
PORT=3001
```

---

## Quick Copy-Paste Reference

### For Railway Environment Variables:

**MONGODB_URI:** (paste your full connection string)  
**MONGODB_DB_NAME:** `agritrack`  
**JWT_SECRET:** `d6dd750e61906ac518e4e026af88ee767d0d612cfe5aee710b66ca4edb690e5a7261aa39b9859986d8211437e1025f58a543bd1b3852fa8119ab7d59eac6e001`  
**NODE_ENV:** `production`  
**FRONTEND_URL:** `https://agri-track-two.vercel.app`  
**PORT:** `3001`

### For Vercel Environment Variable:

**VITE_API_URL:** (paste your Railway backend URL here)

---

**Remember to delete this file or keep it very secure after deployment!**
