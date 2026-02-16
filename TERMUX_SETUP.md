# Termux Setup Guide (Android)

Run your video downloader backend on Android phone - Get unlimited downloads!

## 📱 **Why Termux?**

✅ **Unlimited downloads** - No daily limits
✅ **Full features** - 1080p, TikTok no watermark, everything works
✅ **Free forever** - Zero cost
✅ **Your own server** - Complete control
✅ **Fast** - Uses your internet speed

---

## ⚙️ **Requirements:**

- Android 7.0+ (any phone/tablet)
- 2GB+ free storage
- Good internet connection
- 1-2 hours battery (while downloading)

---

## 📥 **Step 1: Install Termux**

### ⚠️ **IMPORTANT: Do NOT use Google Play Store version!**

The Play Store version is outdated and broken. Use F-Droid instead.

### **Option A: F-Droid (Recommended)**

1. Download **F-Droid** app from: https://f-droid.org/
2. Open F-Droid
3. Search for "**Termux**"
4. Install **Termux** (by Fredrik Fornwall)
5. Also install **Termux:API** (optional but useful)

### **Option B: Direct APK Download**

1. Go to: https://github.com/termux/termux-app/releases
2. Download latest `termux-app_vX.XX.X+github-debug_arm64-v8a.apk`
3. Install APK (enable "Install from unknown sources")

---

## 🚀 **Step 2: Initial Termux Setup**

Open Termux app and run these commands **one by one**:

```bash
# Update package list
pkg update && pkg upgrade -y

# This will ask for confirmation, type 'y' and press Enter
```

**Note:** First time setup takes 5-10 minutes. Be patient!

---

## 🐍 **Step 3: Install Python & Dependencies**

```bash
# Install Python
pkg install python -y

# Install git (to download files)
pkg install git -y

# Install other required packages
pkg install ffmpeg -y
pkg install libxml2 libxslt -y

# Verify Python is installed
python --version
# Should show: Python 3.11.x or similar
```

---

## 📁 **Step 4: Get Your Backend Files**

### **Option A: Using Git (if you have repository)**

```bash
# Go to home directory
cd ~

# Clone your repository
git clone https://github.com/yourusername/video-downloader.git

# Or download via termux
cd ~
git clone <your-repo-url>
```

### **Option B: Manual Upload (Recommended for beginners)**

**Using Termux to create folder structure:**

```bash
# Create project directory
cd ~
mkdir -p video-downloader/backend
cd video-downloader/backend

# Now we'll create files manually
```

**Transfer files from your computer to phone:**

1. **Connect phone to PC via USB**
2. Enable "File Transfer" mode
3. Copy `backend/` folder to phone's storage
4. In Termux, copy to termux home:

```bash
# Copy from phone storage to Termux
cp -r /sdcard/Download/backend/* ~/video-downloader/backend/

# Or use termux-setup-storage to access phone files
termux-setup-storage
# Then: cp -r ~/storage/downloads/backend/* ~/video-downloader/backend/
```

### **Option C: Create Files Directly in Termux**

You can also create files using Termux's text editor:

```bash
cd ~/video-downloader/backend

# Install nano editor
pkg install nano -y

# Create app.py
nano app.py
# Paste the content from backend/app.py
# Save: Ctrl+X, then Y, then Enter

# Create requirements.txt
nano requirements.txt
# Paste the content
# Save: Ctrl+X, then Y, then Enter
```

---

## 📦 **Step 5: Install Python Dependencies**

```bash
# Navigate to backend folder
cd ~/video-downloader/backend

# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# This will install:
# - Flask
# - flask-cors
# - yt-dlp
# - requests
```

**Note:** This takes 5-10 minutes depending on your internet speed.

---

## 🔧 **Step 6: Configure Backend for Mobile**

Edit `app.py` to ensure it's accessible from network:

```bash
nano app.py
```

Make sure the last line looks like this:

```python
if __name__ == '__main__':
    # For Termux - accessible from network
    app.run(debug=True, host='0.0.0.0', port=5000)
```

Save: `Ctrl+X`, then `Y`, then `Enter`

---

## ▶️ **Step 7: Start the Server**

```bash
# Make sure you're in backend directory
cd ~/video-downloader/backend

# Start the server
python app.py
```

You should see:

```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.1.XXX:5000
```

✅ **Server is running!** 

**Important:** Note the IP address (192.168.1.XXX) - you'll need this!

---

## 📱 **Step 8: Find Your Phone's IP Address**

If the IP doesn't show up, find it manually:

```bash
# In a NEW Termux session (swipe from left, click "New session")
pkg install net-tools -y
ifconfig wlan0

# Look for "inet" address like: 192.168.1.100
```

Or check in phone settings:
- Settings → WiFi → Current Network → Advanced → IP Address

---

## 🌐 **Step 9: Configure Frontend**

### **On the same phone:**

1. Open file manager app
2. Navigate to `video-downloader/frontend/config.js`
3. Edit with text editor
4. Change:

```javascript
const CONFIG = {
    BACKEND_URL: 'http://192.168.1.XXX:5000',  // Use your phone's IP
    // ... rest stays same
};
```

Save the file.

### **From another device (PC/tablet/another phone):**

Same thing - just use your phone's IP address in config.js

---

## 🎯 **Step 10: Open Frontend & Start Downloading!**

### **Option A: On the same phone**

1. Open Chrome/Firefox browser
2. Type in address bar: `file:///sdcard/Download/video-downloader/frontend/index.html`
3. Or use a file manager app, navigate to `index.html`, open with browser

### **Option B: From another device (same WiFi)**

1. Copy `frontend/` folder to that device
2. Edit `config.js` with your phone's IP
3. Open `index.html` in browser

You should see **🟢 Server Online**!

---

## 🔋 **Step 11: Keep Server Running (Important!)**

By default, Android will kill Termux when screen is off. Prevent this:

### **Method 1: Termux Wake Lock (Built-in)**

```bash
# Acquire wake lock
termux-wake-lock

# Your phone will stay awake (battery drains faster!)
# To release: termux-wake-unlock
```

### **Method 2: Use Wakelock App**

1. Install "**Wakelock - CPU Awake**" from Play Store
2. Enable wake lock for Termux
3. Keep phone charging while downloading

### **Method 3: Disable Battery Optimization**

1. Settings → Apps → Termux
2. Battery → Unrestricted (or Don't optimize)
3. This helps keep Termux running in background

---

## 💡 **Daily Usage Workflow:**

### **Starting the Server:**

```bash
# Open Termux
cd ~/video-downloader/backend
python app.py

# Minimize Termux (don't close!)
# Open browser, use the downloader
```

### **Stopping the Server:**

```bash
# In Termux, press: Ctrl+C
# Or just close Termux app
```

### **Quick Start Script (Optional):**

Create a start script:

```bash
nano ~/start-downloader.sh
```

Add:

```bash
#!/data/data/com.termux/files/usr/bin/bash
cd ~/video-downloader/backend
termux-wake-lock
python app.py
```

Save, then make executable:

```bash
chmod +x ~/start-downloader.sh
```

Now just run:

```bash
~/start-downloader.sh
```

---

## 🔄 **Updating yt-dlp (Important!)**

Update regularly to keep downloads working:

```bash
pip install --upgrade yt-dlp
```

Do this weekly or when downloads start failing.

---

## 🐛 **Troubleshooting:**

### **"Command not found" errors**
```bash
pkg update
pkg upgrade
```

### **"Permission denied"**
```bash
termux-setup-storage
# Grant storage permission when asked
```

### **Server won't start**
```bash
# Check if port is already in use
pkill python
# Then try again
python app.py
```

### **Can't access from other devices**
- Both devices must be on same WiFi
- Check firewall on phone (unlikely on Android)
- Verify IP address is correct
- Make sure server is running (check Termux)

### **Downloads are slow**
- Normal! Depends on your internet speed
- Try lower quality settings
- Check if other apps are using internet

### **"Module not found" errors**
```bash
cd ~/video-downloader/backend
pip install -r requirements.txt --force-reinstall
```

### **Battery drains fast**
- Keep phone plugged in while downloading
- Use wake lock only when needed
- Lower screen brightness

---

## 📊 **Performance Tips:**

### **Best Practices:**

1. **Keep phone charged** while downloading
2. **Use WiFi** not mobile data (downloads are large!)
3. **Close other apps** for better performance
4. **Enable wake lock** only when downloading
5. **Update yt-dlp** weekly

### **Expected Performance:**

- 720p video: 1-3 minutes
- 1080p video: 2-5 minutes
- 4K video: 5-10 minutes
- Audio only: 30 seconds - 2 minutes

(Depends on video size and internet speed)

---

## 🔒 **Security Notes:**

### **Only allow access on your home WiFi!**

Your server is accessible to anyone on the same WiFi. To secure it:

1. **Don't use on public WiFi** (coffee shops, airports)
2. **Only share IP with trusted people**
3. **Stop server when not using** (Ctrl+C in Termux)

For public use, add authentication (see advanced section below).

---

## 🚀 **Advanced: Auto-start on Boot (Optional)**

Requires Termux:Boot app:

1. Install **Termux:Boot** from F-Droid
2. Create startup script:

```bash
mkdir -p ~/.termux/boot
nano ~/.termux/boot/start-downloader.sh
```

Add:

```bash
#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
cd ~/video-downloader/backend
python app.py > ~/downloader.log 2>&1
```

Make executable:

```bash
chmod +x ~/.termux/boot/start-downloader.sh
```

Now server starts automatically when phone boots!

---

## 📈 **Monitoring & Logs:**

### **Check if server is running:**

```bash
# In new Termux session
ps aux | grep python
```

### **View logs:**

Server logs show in the Termux window where you ran `python app.py`

To save logs to file:

```bash
python app.py > ~/downloader.log 2>&1 &
tail -f ~/downloader.log
```

---

## 🔄 **Switching to Other Backends:**

The beauty of this setup: **You can switch anytime!**

### **Using Termux (at home):**
```javascript
BACKEND_URL: 'http://192.168.1.100:5000'
```

### **Using PythonAnywhere (away from home):**
```javascript
BACKEND_URL: 'https://yourusername.pythonanywhere.com'
```

### **Using VPS (upgraded):**
```javascript
BACKEND_URL: 'https://your-server.com'
```

Just change ONE line in `config.js`! 🎉

---

## ⚡ **Quick Command Reference:**

```bash
# Start server
cd ~/video-downloader/backend && python app.py

# Update yt-dlp
pip install --upgrade yt-dlp

# Stop server
# Press: Ctrl+C

# Check Python version
python --version

# Check installed packages
pip list

# Enable wake lock
termux-wake-lock

# Disable wake lock
termux-wake-unlock

# View running processes
ps aux | grep python

# Kill Python processes
pkill python
```

---

## 🎉 **You're Done!**

Your Android phone is now a video downloader server!

**Benefits:**
- ✅ Unlimited downloads
- ✅ Full features (1080p, TikTok no watermark)
- ✅ Free forever
- ✅ Works on your schedule
- ✅ No cloud dependency

**Usage Pattern:**
1. Open Termux → Start server (1 command)
2. Open browser → Download videos
3. Done → Stop server (Ctrl+C)

---

## 🆘 **Need Help?**

1. Check the error message in Termux
2. Try restarting Termux app
3. Reinstall packages: `pip install -r requirements.txt --force-reinstall`
4. Update everything: `pkg upgrade && pip install --upgrade yt-dlp`
5. Check other guides: README.md, QUICK_REFERENCE.md

---

## 💡 **Pro Tips:**

1. **Create a shortcut:** Use Termux widget to start server with one tap
2. **Notification:** Server running shows in Termux notification - don't dismiss it!
3. **Multiple sessions:** Swipe from left in Termux to open new sessions
4. **Save bandwidth:** Download lower quality when on mobile data
5. **Regular updates:** Update yt-dlp every week for best compatibility

---

**Enjoy your unlimited video downloads!** 🚀📱

**Remember:** This is for personal use only. Respect copyright laws!
