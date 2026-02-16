# VPS Deployment Guide (Future Scaling)

Use this guide when you want to upgrade to a VPS for unlimited downloads and better performance.

## Why VPS?

✅ **Unlimited downloads** - No daily limits
✅ **24/7 availability** - Always online
✅ **Fast processing** - Dedicated resources
✅ **Full control** - Root access
✅ **Scalable** - Upgrade as needed

**Cost:** $3-10/month depending on provider

---

## Recommended VPS Providers

### Budget Options:
- **Contabo** - $4/month (4GB RAM) - Best value
- **Vultr** - $6/month (1GB RAM) - Easy to use
- **DigitalOcean** - $6/month (1GB RAM) - Popular
- **Linode** - $5/month (1GB RAM) - Reliable
- **Hetzner** - €4/month (2GB RAM) - EU based

### Requirements:
- **Minimum:** 1GB RAM, 25GB storage, 1TB bandwidth
- **OS:** Ubuntu 22.04 LTS (recommended)

---

## Deployment Steps

### Step 1: Create VPS

1. Sign up with a provider
2. Create a new VPS/Droplet
3. Choose **Ubuntu 22.04 LTS**
4. Select smallest plan ($5-6/month is plenty)
5. Add your SSH key (or use password)
6. Create and note the IP address

### Step 2: Connect to VPS

```bash
# From your computer
ssh root@your-vps-ip

# Or if using a key
ssh -i ~/.ssh/your-key root@your-vps-ip
```

### Step 3: Initial Setup

```bash
# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y python3 python3-pip python3-venv nginx certbot python3-certbot-nginx git

# Install ffmpeg (for video processing)
apt install -y ffmpeg

# Create non-root user (recommended)
adduser downloader
usermod -aG sudo downloader
su - downloader
```

### Step 4: Deploy Application

```bash
# Clone or upload your files
cd ~
git clone https://your-repo.git video-downloader
# Or upload via SCP/SFTP

cd video-downloader/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn  # Production server
```

### Step 5: Configure Gunicorn

Create `gunicorn_config.py`:

```python
bind = "127.0.0.1:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 300  # 5 minutes for large downloads
keepalive = 5
errorlog = "/home/downloader/video-downloader/backend/error.log"
accesslog = "/home/downloader/video-downloader/backend/access.log"
loglevel = "info"
```

### Step 6: Create Systemd Service

```bash
sudo nano /etc/systemd/system/video-downloader.service
```

Add:

```ini
[Unit]
Description=Video Downloader Service
After=network.target

[Service]
Type=notify
User=downloader
Group=downloader
RuntimeDirectory=video-downloader
WorkingDirectory=/home/downloader/video-downloader/backend
Environment="PATH=/home/downloader/video-downloader/backend/venv/bin"
ExecStart=/home/downloader/video-downloader/backend/venv/bin/gunicorn \
    --config /home/downloader/video-downloader/backend/gunicorn_config.py \
    app:app
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable video-downloader
sudo systemctl start video-downloader
sudo systemctl status video-downloader
```

### Step 7: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/video-downloader
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or use IP address

    client_max_body_size 0;  # No upload limit
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/video-downloader /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Setup SSL (HTTPS) - Optional but Recommended

```bash
sudo certbot --nginx -d your-domain.com
```

Follow prompts. Certbot will automatically configure SSL.

### Step 9: Configure Frontend

Update `frontend/config.js`:

```javascript
const CONFIG = {
    BACKEND_URL: 'https://your-domain.com',  // or http://your-ip
    // ... rest
};
```

### Step 10: Test

1. Open frontend in browser
2. Should show 🟢 Server Online
3. Try downloading a video!

---

## Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

---

## Monitoring & Maintenance

### Check Service Status
```bash
sudo systemctl status video-downloader
```

### View Logs
```bash
# Application logs
tail -f ~/video-downloader/backend/error.log
tail -f ~/video-downloader/backend/access.log

# System logs
sudo journalctl -u video-downloader -f
```

### Restart Service
```bash
sudo systemctl restart video-downloader
```

### Update Application
```bash
cd ~/video-downloader
git pull  # if using git
source backend/venv/bin/activate
pip install -r backend/requirements.txt --upgrade
sudo systemctl restart video-downloader
```

---

## Performance Tuning

### For Heavy Usage:

1. **Increase Workers:**
   Edit `gunicorn_config.py`:
   ```python
   workers = 8  # 2-4 × CPU cores
   ```

2. **Add Redis Caching:**
   ```bash
   sudo apt install redis-server
   pip install redis flask-caching
   ```

3. **Setup CDN** (Cloudflare, etc.) for static files

4. **Optimize yt-dlp:**
   ```python
   # In app.py
   ydl_opts = {
       'concurrent_fragment_downloads': 4,
       'http_chunk_size': 10485760,  # 10MB chunks
   }
   ```

---

## Backup Strategy

### Automated Backups:

```bash
# Create backup script
nano ~/backup.sh
```

Add:
```bash
#!/bin/bash
tar -czf ~/backup-$(date +%Y%m%d).tar.gz ~/video-downloader
# Upload to S3, Backblaze, etc.
```

Make executable:
```bash
chmod +x ~/backup.sh
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /home/downloader/backup.sh
```

---

## Security Hardening

### 1. Disable Root Login
```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### 2. Setup Fail2Ban
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 3. Add Rate Limiting (Nginx)
```nginx
# In nginx config
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location / {
    limit_req zone=api burst=20;
    # ... rest
}
```

### 4. Add Authentication
See main README for adding basic auth to Flask.

---

## Cost Optimization

### Tips to Save Money:

1. **Choose budget provider** (Contabo, Hetzner)
2. **Start small** (1GB RAM is enough)
3. **Use reserved instances** (some providers offer discounts)
4. **Monitor bandwidth** usage
5. **Setup log rotation** to save disk space:
   ```bash
   sudo nano /etc/logrotate.d/video-downloader
   ```

---

## Troubleshooting

### Service Won't Start
```bash
# Check logs
sudo journalctl -u video-downloader -n 50

# Test manually
cd ~/video-downloader/backend
source venv/bin/activate
python app.py
```

### High Memory Usage
```bash
# Check memory
free -h
htop

# Reduce workers in gunicorn_config.py
```

### Slow Downloads
```bash
# Check bandwidth
iftop

# Test speed
speedtest-cli
```

### Disk Full
```bash
# Check disk usage
df -h

# Clear temp files
sudo apt autoclean
sudo apt autoremove
rm -rf /tmp/*
```

---

## Migration Checklist

When moving from PythonAnywhere to VPS:

- [ ] VPS created and accessible
- [ ] All packages installed
- [ ] Application deployed and tested
- [ ] Nginx configured
- [ ] SSL certificate installed (if using domain)
- [ ] Firewall configured
- [ ] Frontend config.js updated with new URL
- [ ] Backups setup
- [ ] Monitoring in place
- [ ] Old server can be shut down

---

## Questions?

Check these resources:
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
