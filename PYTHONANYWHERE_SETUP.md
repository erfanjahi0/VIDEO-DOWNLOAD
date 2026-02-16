# PythonAnywhere Deployment Guide

## Step 1: Create PythonAnywhere Account

1. Go to [https://www.pythonanywhere.com](https://www.pythonanywhere.com)
2. Click "Start running Python online in less than a minute!"
3. Create a FREE "Beginner" account
4. Verify your email

## Step 2: Upload Backend Files

### Method A: Using Git (Recommended)
1. Open a **Bash console** in PythonAnywhere
2. Clone your repository (if you have one):
```bash
git clone https://github.com/yourusername/video-downloader.git
cd video-downloader/backend
```

### Method B: Manual Upload
1. Go to **Files** tab in PythonAnywhere
2. Create directory: `/home/yourusername/video-downloader/backend`
3. Upload these files:
   - `app.py`
   - `requirements.txt`

## Step 3: Install Dependencies

1. Open a **Bash console**
2. Run these commands:

```bash
cd ~/video-downloader/backend

# Create virtual environment
mkvirtualenv --python=/usr/bin/python3.10 myenv

# Activate environment
workon myenv

# Install dependencies
pip install -r requirements.txt

# Install ffmpeg (required for video processing)
# Note: On PythonAnywhere free tier, you may need to request this
```

## Step 4: Create Web App

1. Go to **Web** tab
2. Click "Add a new web app"
3. Choose "Manual configuration"
4. Select Python 3.10
5. Click "Next"

## Step 5: Configure WSGI File

1. In the **Web** tab, find "Code" section
2. Click on the WSGI configuration file link
3. **DELETE all contents** and replace with:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/yourusername/video-downloader/backend'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Set environment variable for Flask
os.environ['FLASK_APP'] = 'app.py'

# Import Flask app
from app import app as application
```

**IMPORTANT:** Replace `yourusername` with your actual PythonAnywhere username!

## Step 6: Set Virtual Environment

1. Still in **Web** tab, find "Virtualenv" section
2. Enter path: `/home/yourusername/.virtualenvs/myenv`
3. Click the checkmark

## Step 7: Reload Web App

1. Scroll to top of **Web** tab
2. Click the big green **"Reload"** button
3. Your app should now be live at: `https://yourusername.pythonanywhere.com`

## Step 8: Configure Frontend

1. Open `frontend/config.js`
2. Change the backend URL:

```javascript
const CONFIG = {
    BACKEND_URL: 'https://yourusername.pythonanywhere.com',
    // ... rest of config
};
```

## Step 9: Test Your Setup

1. Open `frontend/index.html` in your browser
2. The server status should show "🟢 Server Online"
3. Try downloading a YouTube video!

## Troubleshooting

### Server shows offline
- Check if web app is running (green in Web tab)
- Check error log in Web tab
- Verify WSGI configuration

### "Module not found" errors
- Make sure virtual environment is activated
- Reinstall requirements: `pip install -r requirements.txt`

### Downloads fail
- Check if yt-dlp is installed: `pip show yt-dlp`
- Check console logs in PythonAnywhere
- Some platforms may be blocked on free tier

### CPU time exceeded
- You hit the daily limit (100 seconds)
- Wait until tomorrow (resets at midnight UTC)
- Consider upgrading or using local backend

## PythonAnywhere Free Tier Limits

- ✅ Always-on web apps: Yes
- ✅ CPU seconds per day: 100 (enough for ~20-30 downloads)
- ✅ Disk space: 512MB
- ✅ Bandwidth: Reasonable for personal use
- ⚠️ Outbound internet: Whitelist required (free tier limitation)

### About Outbound Internet

PythonAnywhere's free tier restricts outbound connections to whitelisted sites. This means:
- ✅ YouTube, TikTok, Instagram, Facebook are usually whitelisted
- ⚠️ Some sites may not work
- 💰 Paid tier ($5/month) removes this restriction

## Updating Your App

When you make changes:

```bash
cd ~/video-downloader/backend
git pull  # if using git
# or upload files manually
```

Then click **Reload** in the Web tab.

## Alternative: Use Your Local PC as Backup

You can easily switch between PythonAnywhere and local:

**Use PythonAnywhere:**
```javascript
BACKEND_URL: 'https://yourusername.pythonanywhere.com'
```

**Use Local PC:**
```javascript
BACKEND_URL: 'http://localhost:5000'
```

Just change this in `config.js` and you're set!

## Getting Help

- PythonAnywhere Forum: https://www.pythonanywhere.com/forums/
- PythonAnywhere Help: https://help.pythonanywhere.com/
- Check error logs in Web tab
