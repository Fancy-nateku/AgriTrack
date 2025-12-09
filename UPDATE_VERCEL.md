# Update Vercel Environment Variable

## Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Click on your project: **agri-track-two**
3. Click **"Settings"**
4. Click **"Environment Variables"**

## Update or Add Variable

Look for `VITE_API_URL`:

- If it exists: Click "Edit" → Update value
- If it doesn't exist: Click "Add New"

**Variable Name:**
```
VITE_API_URL
```

**Value:**
```
https://agritrack-production.up.railway.app
```

**Environments:** Select all (Production, Preview, Development)

## Redeploy Frontend

1. Go to **"Deployments"** tab
2. Click **"..."** on the latest deployment  
3. Click **"Redeploy"**
4. Wait for deployment to complete

## Done!

Your frontend will now connect to your Railway backend!
