# Finding Railway Service Settings

## Current Situation
The three-dot menu on the deployment only shows: Restart, Redeploy, Remove
This is NOT where we set the root directory.

## Where to Find Service Settings

### Step 1: Close This Panel
- Click the X button to close the current deployment view

### Step 2: Look for Service Card
On the Architecture page, you should see the AgriTrack service as a card/box.

### Step 3: Access Service Settings
Look **very carefully** at the AgriTrack service card for one of these:
- A **gear/cog icon ⚙️** (usually in the corner)
- A **settings icon** on the card itself
- Try **double-clicking** the service card
- Try **hovering over** the service card to see if controls appear

### Alternative: Use Details Tab
1. Click on the AgriTrack service card once
2. You should see tabs: **Details** | Build Logs | Deploy Logs | HTTP Logs
3. Click on the **Details** tab
4. In the Details view, look for **"Source"** or **"Configuration"** section
5. There should be a **"Root Directory"** setting

### What to Set
Once you find it, set:
**Root Directory:** `agritrack-dashboard/server`

### If You Still Can't Find It
We may need to delete this service and create a new one with the correct settings from the start.
