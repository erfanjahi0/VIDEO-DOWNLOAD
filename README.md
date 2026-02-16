# 🎬 Multi-Platform Video Downloader

A powerful, easy-to-use video downloader that supports YouTube, Instagram, TikTok, Facebook, and more!

## ✨ Features

### Supported Platforms
- 📺 **YouTube** - Videos up to 4K, audio extraction, subtitles
- 🎵 **YouTube Music** - High-quality audio with metadata
- 📘 **Facebook** - Videos, reels, stories
- 📷 **Instagram** - Posts, reels, stories, IGTV, carousel support
- 🎪 **TikTok** - Videos with/without watermark, audio extraction

### Key Features
- ✅ Multiple quality options (360p to 4K)
- ✅ Audio extraction (MP3, M4A, OPUS)
- ✅ TikTok watermark removal
- ✅ Metadata embedding
- ✅ Clean, modern interface
- ✅ **Flexible backend** - Switch between local/cloud easily
- ✅ Progress tracking
- ✅ Mobile-responsive design

---

## 🏗️ Architecture

This project uses a **decoupled architecture** for maximum flexibility:

```
┌─────────────────┐
│    Frontend     │  ← HTML/CSS/JavaScript
│  (index.html)   │     Can run anywhere
└────────┬────────┘
         │
         │ API calls
         ▼
┌─────────────────┐
│     Backend     │  ← Python Flask + yt-dlp
│     (app.py)    │     Switchable location
└─────────────────┘
```

**Benefits:**
- Change backend URL in ONE place (`config.js`)
- Run backend on: Local PC, PythonAnywhere, VPS, or Cloud
- Switch instantly between different backends
- Frontend works independently

---

## 🚀 Quick Start

### Choose Your Setup:

#### Option 1: Local PC (Recommended for Unlimited Downloads)
Perfect for daily use, unlimited downloads, no restrictions.

👉 **[Follow LOCAL_SETUP.md](LOCAL_SETUP.md)**

**Pros:**
- ✅ Unlimited downloads
- ✅ Super fast
- ✅ Free forever
- ✅ Full control

**Cons:**
- ⚠️ Only works when PC is on
- ⚠️ Requires Python installation

---

#### Option 2: PythonAnywhere (24/7 Online)
Perfect for access from anywhere, always available.

👉 **[Follow PYTHONANYWHERE_SETUP.md](PYTHONANYWHERE_SETUP.md)**

**Pros:**
- ✅ Always online (24/7)
- ✅ Access from anywhere
- ✅ Free tier available
- ✅ No PC needed

**Cons:**
- ⚠️ Limited to ~20-30 downloads/day (free tier)
- ⚠️ Slower processing

---

#### Option 3: Both! (Best of Both Worlds)

Use **Local PC** when at home, **PythonAnywhere** when away!

Just change this in `frontend/config.js`:

```javascript
// At home? Use local:
BACKEND_URL: 'http://localhost:5000'

// Away from home? Use cloud:
BACKEND_URL: 'https://yourusername.pythonanywhere.com'
```

That's it! Switch in 5 seconds.

---

## 📁 Project Structure

```
video-downloader/
├── frontend/
│   ├── index.html          # Main UI
│   ├── app.js             # Frontend logic
│   └── config.js          # Backend URL configuration (CHANGE THIS!)
├── backend/
│   ├── app.py             # Flask API server
│   └── requirements.txt   # Python dependencies
├── LOCAL_SETUP.md         # Local installation guide
├── PYTHONANYWHERE_SETUP.md # Cloud deployment guide
└── README.md              # This file
```

---

## ⚙️ Configuration

### Switching Backends

**Edit `frontend/config.js`:**

```javascript
const CONFIG = {
    // Local PC (unlimited downloads)
    BACKEND_URL: 'http://localhost:5000',
    
    // PythonAnywhere (24/7 online)
    // BACKEND_URL: 'https://yourusername.pythonanywhere.com',
    
    // VPS/Cloud Server
    // BACKEND_URL: 'https://your-server-ip:5000',
    
    // Custom domain
    // BACKEND_URL: 'https://api.yourdownloader.com',
    
    DEBUG: true  // Set to false in production
};
```

Just uncomment the one you want to use!

---

## 🎯 Usage

1. **Start the backend** (see setup guides)
2. **Open `frontend/index.html`** in your browser
3. **Check server status** (should show 🟢 Online)
4. **Select platform tab**
5. **Paste video URL**
6. **Choose quality/format**
7. **Click Download!**

---

## 🔧 Advanced Configuration

### Change Server Port

Edit `backend/app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change port here
```

Then update `frontend/config.js`:
```javascript
BACKEND_URL: 'http://localhost:5001'
```

### Enable HTTPS (Production)

For production, use a reverse proxy like nginx with SSL certificate.

### Add Authentication (Optional)

Add basic auth to `backend/app.py`:
```python
from flask_httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(username, password):
    if username == 'admin' and password == 'your_password':
        return username
```

---

## 🐛 Troubleshooting

### Server shows offline (🔴)
- Check if backend is running
- Verify `BACKEND_URL` in `config.js`
- Check browser console for errors (F12)

### Downloads fail
- Update yt-dlp: `pip install --upgrade yt-dlp`
- Check if URL is valid and accessible
- Some content may be geo-restricted
- Private/age-restricted content may not work

### "Module not found" error
```bash
pip install -r requirements.txt --upgrade
```

### Slow downloads
- Normal! Depends on:
  - Your internet speed
  - Video quality/size
  - Server processing power
- Try lower quality settings

### Port already in use
- Change port in `app.py` and `config.js`
- Or close other program using that port

---

## 📊 Comparison Table

| Aspect | Local PC | PythonAnywhere | VPS ($5/mo) |
|--------|----------|----------------|-------------|
| **Cost** | Free | Free | ~$5/month |
| **Downloads/day** | Unlimited | ~20-30 | Unlimited |
| **Speed** | Fast | Medium | Fast |
| **Always On** | No | Yes | Yes |
| **Setup Time** | 5 min | 15 min | 20 min |
| **Maintenance** | None | None | Minimal |
| **Best For** | Daily use | Backup/Away | Heavy use |

---

## 🔒 Legal & Privacy

### Important Notes:
- ⚠️ **For personal use only**
- ⚠️ Respect copyright and platform terms of service
- ⚠️ Don't download copyrighted content without permission
- ⚠️ Don't redistribute downloaded content
- ⚠️ Some platforms prohibit downloading

### Privacy:
- Videos are processed on YOUR server (local or PythonAnywhere)
- No third-party services involved
- No data collection or tracking
- Downloaded videos go directly to YOUR device

---

## 🔄 Updating

### Update yt-dlp (do this regularly):
```bash
pip install --upgrade yt-dlp
```

### Update all dependencies:
```bash
pip install --upgrade -r requirements.txt
```

### Get latest code:
```bash
git pull  # if using git
```

---

## 🎓 Technical Details

### Backend Stack:
- **Python 3.8+**
- **Flask** - Web framework
- **yt-dlp** - Download engine (fork of youtube-dl)
- **flask-cors** - Cross-origin support

### Frontend Stack:
- **Vanilla JavaScript** - No frameworks needed
- **HTML5 + CSS3** - Modern, responsive design
- **Fetch API** - For backend communication

### How It Works:
1. User pastes URL in frontend
2. Frontend sends request to backend API
3. Backend uses yt-dlp to fetch video info
4. Backend downloads and processes video
5. Backend streams video to user's browser
6. Browser triggers download to user's device

---

## 🚀 Future Enhancements

Possible improvements:
- [ ] Batch download multiple videos
- [ ] Download entire playlists
- [ ] Schedule downloads
- [ ] User authentication
- [ ] Download history
- [ ] Resume interrupted downloads
- [ ] Direct upload to cloud storage
- [ ] Browser extension
- [ ] Mobile app

---

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 📝 License

This project is for educational and personal use only.

---

## 🆘 Getting Help

1. **Check the guides:**
   - [LOCAL_SETUP.md](LOCAL_SETUP.md) - Running on your PC
   - [PYTHONANYWHERE_SETUP.md](PYTHONANYWHERE_SETUP.md) - Cloud deployment

2. **Check browser console:**
   - Press F12 to open developer tools
   - Look for errors in Console tab

3. **Check backend logs:**
   - Look at terminal where you ran `python app.py`
   - Errors will be displayed there

4. **Common Issues:**
   - Server offline? Check if backend is running
   - Downloads fail? Update yt-dlp
   - Port errors? Change port number
   - Module errors? Reinstall requirements

---

## 🎉 Quick Start Summary

### For Daily Unlimited Use (Local PC):
```bash
# 1. Install Python 3.8+
# 2. Install dependencies
cd backend
pip install -r requirements.txt

# 3. Run server
python app.py

# 4. Open frontend/index.html in browser
# 5. Start downloading!
```

### For 24/7 Access (PythonAnywhere):
```bash
# 1. Create account at pythonanywhere.com
# 2. Upload backend files
# 3. Install requirements in console
# 4. Configure WSGI and virtualenv
# 5. Update frontend/config.js with your URL
# 6. Done!
```

---

**Built with ❤️ for personal use**

**Remember:** Always respect copyright and platform terms of service!
