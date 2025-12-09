# Install MongoDB Community Edition on Ubuntu 24.04

This guide will help you install MongoDB Community Edition locally on your Ubuntu 24.04 LTS machine.

## Quick Installation (Recommended)

Run these commands in your terminal:

```bash
# 1. Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor

# 2. Create MongoDB list file for Ubuntu 24.04
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

# 3. Update package database
sudo apt-get update

# 4. Install MongoDB
sudo apt-get install -y mongodb-org

# 5. Start MongoDB service
sudo systemctl start mongod

# 6. Enable MongoDB to start on boot
sudo systemctl enable mongod

# 7. Verify MongoDB is running
sudo systemctl status mongod
```

## Step-by-Step Installation

### Step 1: Import MongoDB GPG Key

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
```

This imports the MongoDB public GPG key for package verification.

### Step 2: Add MongoDB Repository

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
```

This adds the MongoDB repository to your system.

### Step 3: Update Package Database

```bash
sudo apt-get update
```

### Step 4: Install MongoDB

```bash
sudo apt-get install -y mongodb-org
```

This installs:
- `mongodb-org-server` - The MongoDB daemon
- `mongodb-org-mongos` - MongoDB Sharded Cluster query router
- `mongodb-org-shell` - MongoDB shell (mongosh)
- `mongodb-org-tools` - MongoDB tools

### Step 5: Start MongoDB Service

```bash
sudo systemctl start mongod
```

### Step 6: Enable MongoDB on Boot

```bash
sudo systemctl enable mongod
```

This ensures MongoDB starts automatically when your system boots.

### Step 7: Verify Installation

Check if MongoDB is running:

```bash
sudo systemctl status mongod
```

You should see output showing MongoDB is **active (running)**.

## Test MongoDB Connection

### Using mongosh (MongoDB Shell)

```bash
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/...
Using MongoDB: 8.0.x
Using Mongosh: ...

test>
```

Type `exit` to quit the shell.

### Test with Your Backend Server

1. Update `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=agritrack
   ```

2. Start your backend server:
   ```bash
   cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard/server
   npm run dev
   ```

3. You should see:
   ```
   ✅ Connected to MongoDB
   ✅ Successfully pinged MongoDB deployment
   🚀 AgriTrack API Server running on http://localhost:3001
   ```

## MongoDB Service Management

### Start MongoDB
```bash
sudo systemctl start mongod
```

### Stop MongoDB
```bash
sudo systemctl stop mongod
```

### Restart MongoDB
```bash
sudo systemctl restart mongod
```

### Check Status
```bash
sudo systemctl status mongod
```

### View Logs
```bash
sudo journalctl -u mongod -f
```

## MongoDB Configuration

MongoDB configuration file is located at:
```
/etc/mongod.conf
```

Default settings:
- **Port**: 27017
- **Data Directory**: `/var/lib/mongodb`
- **Log Directory**: `/var/log/mongodb`
- **Bind IP**: 127.0.0.1 (localhost only)

## Troubleshooting

### MongoDB won't start

1. Check logs:
   ```bash
   sudo journalctl -u mongod -n 50
   ```

2. Check if port 27017 is already in use:
   ```bash
   sudo lsof -i :27017
   ```

3. Check data directory permissions:
   ```bash
   sudo chown -R mongodb:mongodb /var/lib/mongodb
   sudo chown -R mongodb:mongodb /var/log/mongodb
   ```

4. Restart MongoDB:
   ```bash
   sudo systemctl restart mongod
   ```

### Connection refused

Make sure MongoDB is running:
```bash
sudo systemctl status mongod
```

If not running, start it:
```bash
sudo systemctl start mongod
```

### Permission denied

The MongoDB service runs as the `mongodb` user. If you have permission issues:

```bash
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
sudo systemctl restart mongod
```

## Uninstall MongoDB (if needed)

```bash
# Stop MongoDB
sudo systemctl stop mongod

# Remove packages
sudo apt-get purge mongodb-org*

# Remove data and logs (WARNING: This deletes all data!)
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongodb

# Remove repository
sudo rm /etc/apt/sources.list.d/mongodb-org-8.0.list
```

## Next Steps

After installation:

1. ✅ MongoDB is running locally on `mongodb://localhost:27017`
2. ✅ Update `server/.env` with local connection string
3. ✅ Start your backend server
4. ✅ Test API endpoints

## Resources

- [MongoDB Official Documentation](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
- [MongoDB Shell (mongosh) Documentation](https://www.mongodb.com/docs/mongodb-shell/)
- [MongoDB Node.js Driver Documentation](https://www.mongodb.com/docs/drivers/node/current/)

## Security Note

By default, MongoDB is configured to:
- ✅ Listen only on localhost (127.0.0.1)
- ⚠️ No authentication required (for development)

For production, you should:
- Enable authentication
- Create admin and application users
- Configure firewall rules
- Use SSL/TLS connections
