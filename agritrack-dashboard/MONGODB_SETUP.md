# MongoDB Realm Setup Guide for AgriTrack

This guide will help you set up MongoDB Atlas App Services (Realm) for the AgriTrack application.

## Prerequisites

- A MongoDB Atlas account (free tier available)
- Basic understanding of MongoDB

## Step 1: Create MongoDB Atlas Cluster

1. **Sign up for MongoDB Atlas**:
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a new cluster**:
   - Click "Build a Database"
   - Choose the FREE tier (M0 Sandbox)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Set up database access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Atlas admin"
   - Click "Add User"

4. **Configure network access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

## Step 2: Create Realm Application

1. **Create a new App Services application**:
   - In Atlas, click "App Services" in the left sidebar
   - Click "Create a New App"
   - Choose a name (e.g., "agritrack")
   - Link it to your cluster
   - Click "Create App Services"

2. **Get your App ID**:
   - In your App Services dashboard, you'll see your **Application ID**
   - Copy this ID (format: `agritrack-xxxxx`)
   - You'll need this for your `.env` file

## Step 3: Configure Authentication

1. **Enable Email/Password Authentication**:
   - In App Services, go to "Authentication" → "Authentication Providers"
   - Click on "Email/Password"
   - Toggle "Provider Enabled" to ON
   - Set "User Confirmation Method" to "Automatically confirm users"
   - Set "Password Reset Method" to "Send a password reset email" (optional)
   - Click "Save Draft" then "Review Draft & Deploy"

## Step 4: Configure Database Access

1. **Set up MongoDB service**:
   - Go to "Linked Data Sources"
   - Your cluster should already be linked
   - Note the service name (usually "mongodb-atlas")

2. **Configure database rules**:
   - Go to "Rules"
   - For each collection (users, profiles, farms, expenses, income, activities):
     - Click "Add Collection"
     - Database name: `agritrack`
     - Collection name: (e.g., `farms`)
     - Select "Users can only read and write their own data"
     - Click "Add Collection"

3. **Create custom rules** (Advanced):
   - For the `farms` collection:
     ```json
     {
       "name": "owner_id",
       "apply_when": {},
       "read": { "owner_id": "%%user.id" },
       "write": { "owner_id": "%%user.id" }
     }
     ```
   - For `expenses` and `income`:
     ```json
     {
       "name": "farm_access",
       "apply_when": {},
       "read": true,
       "write": true
     }
     ```

## Step 5: Deploy Your Changes

1. **Review and deploy**:
   - Click "Review Draft & Deploy" at the top
   - Review your changes
   - Click "Deploy"

## Step 6: Configure Your Application

1. **Update `.env` file**:
   Create or update `/home/fancy/Desktop/AgriTrack/agritrack-dashboard/.env`:
   ```env
   VITE_REALM_APP_ID=your-app-id-here
   VITE_MONGODB_DB_NAME=agritrack
   VITE_JWT_SECRET=your-random-secret-key-here
   ```

2. **Generate a secure JWT secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as your `VITE_JWT_SECRET`

## Step 7: Test Your Setup

1. **Start the development server**:
   ```bash
   cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard
   npm run dev
   ```

2. **Test registration**:
   - Open the app in your browser
   - Try to register a new user
   - Check the browser console for any errors

3. **Verify in Atlas**:
   - Go to your Atlas cluster
   - Click "Browse Collections"
   - You should see the `agritrack` database with `users` and `profiles` collections

## Troubleshooting

### "App ID not found" error
- Double-check your `VITE_REALM_APP_ID` in `.env`
- Make sure you've deployed your Realm app

### "Authentication failed" error
- Verify Email/Password authentication is enabled
- Check that "Automatically confirm users" is enabled

### "Permission denied" error
- Review your database rules
- Make sure the user is authenticated
- Check that the collection exists in your database

### Connection issues
- Verify your IP is whitelisted in Network Access
- Check that your cluster is running

## Important Notes

- **Development vs Production**: For production, restrict IP access and use environment-specific configurations
- **Security**: Never commit your `.env` file to version control
- **Data Migration**: If you have existing data in Supabase, you'll need to export it and import it into MongoDB
- **Realm Web SDK Deprecation**: While `realm-web` is deprecated, it still works. MongoDB recommends migrating to Atlas App Services SDK in the future

## Next Steps

1. Set up proper database indexes for performance
2. Implement data validation rules in Realm
3. Set up backup and monitoring
4. Configure production environment variables

For more information, visit:
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [App Services Documentation](https://www.mongodb.com/docs/atlas/app-services/)
- [Realm Web SDK Documentation](https://www.mongodb.com/docs/realm/web/)
