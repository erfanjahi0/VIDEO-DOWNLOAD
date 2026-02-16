# Quick Reference Cheat Sheet

## 🚀 Quick Start Commands

### Local Setup (Windows)
```cmd
cd video-downloader\backend
pip install -r requirements.txt
python app.py
```
Then open `frontend/index.html`

### Local Setup (Mac/Linux)
```bash
cd video-downloader/backend
pip3 install -r requirements.txt
python3 app.py
```
Then open `frontend/index.html`

### Or Just Double-Click:
- **Windows:** `START_WINDOWS.bat`
- **Mac/Linux:** `START_MAC_LINUX.sh`

---

## ⚙️ Switching Backends

Edit `frontend/config.js`:

```javascript
// Local PC (unlimited)
BACKEND_URL: 'http://localhost:5000'

// PythonAnywhere (24/7)
BACKEND_URL: 'https://yourusername.pythonanywhere.com'

// VPS
BACKEND_URL: 'https://your-server.com'
```

---

## 🔧 Common Tasks

### Update yt-dlp
```bash
pip install --upgrade yt-dlp
```

### Check if Server is Running
```bash
curl http://localhost:5000/api/health
```

### Change Port
Edit `backend/app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Access from Phone (Same WiFi)
1. Find your PC's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update `config.js`: `BACKEND_URL: 'http://192.168.1.100:5000'`
3. Open frontend on phone

### Run in Background (Linux/Mac)
```bash
nohup python3 app.py > output.log 2>&1 &
```

---

## 🐛 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Server Offline | Check if `python app.py` is running |
| Module not found | `pip install -r requirements.txt` |
| Port in use | Change port in app.py |
| Slow downloads | Lower quality or check internet |
| Download fails | `pip install --upgrade yt-dlp` |

---

## 📊 Feature Comparison

| Feature | Local | PythonAnywhere | VPS |
|---------|-------|----------------|-----|
| Cost | Free | Free | $5/mo |
| Limit | None | 20-30/day | None |
| Speed | Fast | Medium | Fast |
| 24/7 | No | Yes | Yes |
| Setup | 5min | 15min | 30min |

---

## 🎯 Supported Platforms & Features

### YouTube
- Videos: 360p to 4K
- Audio: 128-320 kbps
- Subtitles: Yes
- Formats: MP4, WebM, MP3

### TikTok
- Watermark removal: Yes
- Audio extraction: Yes
- HD quality: Yes

### Instagram
- Posts: Yes
- Reels: Yes
- Stories: Yes
- Carousel: Yes

### Facebook
- Videos: Yes
- Reels: Yes
- Stories: Yes

---

## 📝 API Endpoints

```
GET  /                 - Server info
GET  /api/health       - Health check
POST /api/info         - Get video info
POST /api/download     - Download video
POST /api/formats      - Get available formats
```

---

## 🔐 Security Checklist

- [ ] Don't share your public URLs
- [ ] Use HTTPS in production
- [ ] Add authentication if needed
- [ ] Monitor logs regularly
- [ ] Keep yt-dlp updated
- [ ] Backup configuration

---

## 📚 File Locations

```
video-downloader/
├── frontend/
│   ├── index.html          # Open this!
│   ├── app.js             
│   └── config.js          # Edit backend URL here!
├── backend/
│   ├── app.py             # Main server
│   └── requirements.txt   
├── START_WINDOWS.bat      # Windows quick start
├── START_MAC_LINUX.sh     # Mac/Linux quick start
└── README.md              # Full documentation
```

---

## 💡 Pro Tips

1. **Unlimited Downloads:** Use local PC setup
2. **Remote Access:** Use ngrok or VPS
3. **Best Quality:** Choose 1080p (good balance)
4. **Audio Only:** Use YouTube Music tab
5. **Multiple Videos:** Open multiple tabs
6. **Update Regularly:** Keep yt-dlp updated

---

## 🆘 Need Help?

1. Check browser console (F12)
2. Check backend terminal output
3. Read full guides:
   - `LOCAL_SETUP.md`
   - `PYTHONANYWHERE_SETUP.md`
   - `VPS_DEPLOYMENT.md`
4. Update yt-dlp: `pip install --upgrade yt-dlp`

---

## 🎉 Remember

✅ This is for **personal use only**
✅ Respect copyright laws
✅ Don't redistribute content
✅ Keep software updated

---

**Quick Setup Time:**
- Local: 5 minutes
- PythonAnywhere: 15 minutes  
- VPS: 30 minutes

**Choose based on your needs!** 🚀
