# 🚀 Quick Start: Install MongoDB Locally

## Option 1: Automated Installation (Easiest)

Run the installation script:

```bash
cd /home/fancy/Desktop/AgriTrack/agritrack-dashboard
./install-mongodb.sh
```

## Option 2: Manual Installation

```bash
# Import GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor

# Add repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## After Installation

### 1. Verify MongoDB is Running

```bash
sudo systemctl status mongod
```

### 2. Update Server Configuration

Edit `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=agritrack
```

### 3. Start Your Backend Server

```bash
cd server
npm run dev
```

### 4. Test Connection

```bash
curl http://localhost:3001/health
```

## Useful Commands

```bash
# Connect to MongoDB shell
mongosh

# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo journalctl -u mongod -f

# Restart MongoDB
sudo systemctl restart mongod
```

---

**Need detailed instructions?** See [INSTALL_MONGODB_LOCAL.md](file:///home/fancy/Desktop/AgriTrack/agritrack-dashboard/INSTALL_MONGODB_LOCAL.md)
