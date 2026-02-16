# Local PC Setup Guide (Windows/Mac/Linux)

This guide will help you run the video downloader on your own computer.

## Why Run Locally?

✅ **Unlimited downloads** - No CPU or bandwidth limits
✅ **Faster processing** - Downloads at your internet speed
✅ **Complete control** - No external dependencies
✅ **Free forever** - Zero costs
✅ **Access from any device on your network** - Use from phone, tablet, etc.

---

## Prerequisites

You'll need:
1. Python 3.8 or higher
2. pip (comes with Python)
3. 5 minutes of your time!

---

## Installation Steps

### Step 1: Install Python

#### Windows:
1. Download Python from [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Run installer
3. ⚠️ **IMPORTANT:** Check "Add Python to PATH"
4. Click "Install Now"

#### Mac:
```bash
# Using Homebrew (recommended)
brew install python3

# Or download from python.org
```

#### Linux:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Fedora/RHEL
sudo dnf install python3 python3-pip

# Arch
sudo pacman -S python python-pip
```

### Step 2: Verify Installation

Open terminal/command prompt and run:
```bash
python --version
# or
python3 --version
```

You should see something like `Python 3.10.x`

### Step 3: Extract Files

Extract the `video-downloader` folder to a location like:
- Windows: `C:\Users\YourName\video-downloader`
- Mac/Linux: `~/video-downloader`

### Step 4: Install Dependencies

Open terminal/command prompt in the `backend` folder:

```bash
cd video-downloader/backend

# Install required packages
pip install -r requirements.txt

# Or if pip doesn't work:
pip3 install -r requirements.txt
```

This will install:
- Flask (web framework)
- yt-dlp (download engine)
- flask-cors (for frontend-backend communication)

### Step 5: Run the Backend Server

Still in the `backend` folder:

```bash
python app.py
# or
python3 app.py
```

You should see:
```
 * Running on http://0.0.0.0:5000
 * Running on http://192.168.x.x:5000
```

✅ **Server is now running!**

### Step 6: Open the Frontend

1. Go to the `frontend` folder
2. Open `index.html` in your web browser
3. You should see "🟢 Server Online"
4. Start downloading!

---

## Configuration

### Change Backend URL (if needed)

Open `frontend/config.js` and set:

```javascript
BACKEND_URL: 'http://localhost:5000'
```

### Access from Other Devices

Want to use from your phone/tablet on the same WiFi?

1. Find your computer's local IP address:

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" (usually 192.168.x.x)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```
Look for "inet" under your WiFi adapter

2. Update `frontend/config.js`:
```javascript
BACKEND_URL: 'http://192.168.1.100:5000'  // Use your actual IP
```

3. On your phone/tablet, open browser and go to:
```
file:///path/to/frontend/index.html
```

Or better yet, serve the frontend too (see below).

---

## Running Both Frontend and Backend Together

### Option A: Simple File Access
Just open `frontend/index.html` in browser - works great!

### Option B: Serve Frontend via Python (Optional)

If you want a "proper" web server for the frontend:

```bash
# In the frontend folder
cd video-downloader/frontend

# Start simple HTTP server
python -m http.server 8000

# Now open: http://localhost:8000
```

---

## Access from Anywhere (Advanced)

Want to access your downloader from outside your home network?

### Using ngrok (Free):

1. Download ngrok: [https://ngrok.com/download](https://ngrok.com/download)
2. Unzip and run:
```bash
ngrok http 5000
```

3. You'll get a public URL like: `https://abc123.ngrok.io`
4. Update `frontend/config.js`:
```javascript
BACKEND_URL: 'https://abc123.ngrok.io'
```

5. Now you can access from anywhere! (URL changes on restart in free tier)

---

## Keeping It Running 24/7

### Windows:
- Just minimize the terminal window
- Or create a Windows service using NSSM

### Mac/Linux:
Use `screen` or `tmux`:
```bash
# Start screen session
screen -S downloader

# Run your app
cd ~/video-downloader/backend
python app.py

# Detach: Press Ctrl+A, then D
# Reattach: screen -r downloader
```

Or use `systemd` (Linux):
```bash
# Create service file
sudo nano /etc/systemd/system/video-downloader.service
```

Add:
```ini
[Unit]
Description=Video Downloader Service
After=network.target

[Service]
Type=simple
User=yourusername
WorkingDirectory=/home/yourusername/video-downloader/backend
ExecStart=/usr/bin/python3 /home/yourusername/video-downloader/backend/app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable video-downloader
sudo systemctl start video-downloader
```

---

## Troubleshooting

### "Module not found" error
```bash
pip install -r requirements.txt --upgrade
```

### "Port already in use"
Another program is using port 5000. Change the port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change to 5001
```

### Downloads are slow
- Normal! Depends on your internet speed
- Try lower quality settings

### "Cannot connect to server"
- Make sure backend is running (check terminal)
- Verify the URL in `config.js` matches where backend is running
- Check firewall settings

### FFmpeg errors
Some conversions need FFmpeg:

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg  # Ubuntu/Debian
sudo dnf install ffmpeg  # Fedora
```

---

## Updating

To update yt-dlp (download engine):
```bash
pip install --upgrade yt-dlp
```

To update all dependencies:
```bash
pip install --upgrade -r requirements.txt
```

---

## Security Notes

If exposing to internet:
- Consider adding authentication
- Use HTTPS (with ngrok it's automatic)
- Don't share your public URL publicly
- Monitor usage/logs

---

## Performance Tips

1. **Storage:** Downloads go to temp folder and are sent to browser. Old files may accumulate. Clear periodically:
   - Windows: `C:\Users\YourName\AppData\Local\Temp`
   - Mac/Linux: `/tmp`

2. **Multiple Downloads:** Backend handles one at a time. For parallel downloads, run multiple backend instances on different ports.

3. **Large Files:** For 4K videos, ensure you have enough disk space (5-10GB recommended free space).

---

## Comparison: Local vs PythonAnywhere

| Feature | Local PC | PythonAnywhere |
|---------|----------|----------------|
| Cost | Free | Free (limited) |
| Downloads/day | Unlimited | ~20-30 |
| Speed | Your internet | Slower |
| Always on | Manual | Automatic |
| Setup time | 5 minutes | 15 minutes |
| Access | WiFi/ngrok | Anywhere |

**Recommendation:** 
- Use **Local** for daily use at home (unlimited!)
- Use **PythonAnywhere** as backup when away from home

---

## Questions?

Check the logs in the terminal where you ran `python app.py` - errors will show there!
