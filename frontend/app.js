// Main Application Logic

// Check server health on page load
document.addEventListener('DOMContentLoaded', function() {
    checkServerHealth();
    
    // Check health every 30 seconds
    setInterval(checkServerHealth, 30000);
});

async function checkServerHealth() {
    const statusDiv = document.getElementById('serverStatus');
    const statusText = document.getElementById('statusText');
    
    try {
        const response = await fetch(getApiUrl(CONFIG.API.HEALTH), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            statusDiv.className = 'server-status online';
            statusText.textContent = '🟢 Server Online';
            
            if (CONFIG.DEBUG) {
                console.log('Server health check:', data);
            }
        } else {
            throw new Error('Server returned error');
        }
    } catch (error) {
        statusDiv.className = 'server-status offline';
        statusText.textContent = '🔴 Server Offline';
        
        if (CONFIG.DEBUG) {
            console.error('Health check failed:', error);
        }
    }
}

function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function updateYouTubeQuality(format) {
    const qualitySelect = document.getElementById('youtube-quality');
    qualitySelect.innerHTML = '';
    
    if (format === 'video') {
        qualitySelect.innerHTML = `
            <option value="2160">4K (2160p)</option>
            <option value="1440">2K (1440p)</option>
            <option value="1080" selected>Full HD (1080p)</option>
            <option value="720">HD (720p)</option>
            <option value="480">SD (480p)</option>
            <option value="360">Low (360p)</option>
        `;
    } else {
        qualitySelect.innerHTML = `
            <option value="320">320 kbps (Best)</option>
            <option value="256" selected>256 kbps (High)</option>
            <option value="192">192 kbps (Medium)</option>
            <option value="128">128 kbps (Standard)</option>
        `;
    }
}

function showStatus(platform, message, type) {
    const statusDiv = document.getElementById(`${platform}-status`);
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    statusDiv.style.display = 'block';
    
    // Auto-hide after 10 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 10000);
    }
}

function showProgress(platform, show) {
    const progressBar = document.getElementById(`${platform}-progress`);
    if (show) {
        progressBar.classList.add('active');
    } else {
        progressBar.classList.remove('active');
    }
}

function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
        button.querySelector('.button-text').textContent = 'Processing...';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        button.querySelector('.button-text').textContent = button.querySelector('.button-text').getAttribute('data-original') || 'Download';
    }
}

async function handleDownload(event, platform) {
    event.preventDefault();
    
    const form = event.target;
    const button = form.querySelector('.download-button');
    
    // Store original button text
    if (!button.querySelector('.button-text').hasAttribute('data-original')) {
        button.querySelector('.button-text').setAttribute('data-original', button.querySelector('.button-text').textContent);
    }
    
    // Get form values
    const url = form.querySelector(`#${platform}-url`).value.trim();
    
    if (!url) {
        showStatus(platform, '❌ Please enter a valid URL', 'error');
        return;
    }
    
    // Validate URL format
    if (!isValidUrl(url)) {
        showStatus(platform, '❌ Invalid URL format. Please check and try again.', 'error');
        return;
    }
    
    // Set button to loading state
    setButtonLoading(button, true);
    showProgress(platform, true);
    showStatus(platform, '⏳ Connecting to server...', 'info');
    
    try {
        // Prepare download parameters based on platform
        const downloadParams = prepareDownloadParams(platform, form);
        downloadParams.url = url;
        downloadParams.platform = platform;
        
        if (CONFIG.DEBUG) {
            console.log('Download params:', downloadParams);
        }
        
        // Make download request
        showStatus(platform, '📥 Downloading... This may take a moment.', 'info');
        
        const response = await fetch(getApiUrl(CONFIG.API.DOWNLOAD), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(downloadParams)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Download failed');
        }
        
        // Get the filename from the content-disposition header
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'download';
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
        }
        
        // Convert response to blob and trigger download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        
        // Show success message
        showStatus(platform, '✅ Download complete! Check your downloads folder.', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        
        let errorMessage = '❌ Download failed: ';
        
        if (error.message.includes('fetch')) {
            errorMessage += 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.message.includes('not found')) {
            errorMessage += 'Video not found or unavailable.';
        } else if (error.message.includes('private')) {
            errorMessage += 'This content is private or restricted.';
        } else {
            errorMessage += error.message;
        }
        
        showStatus(platform, errorMessage, 'error');
    } finally {
        setButtonLoading(button, false);
        showProgress(platform, false);
    }
}

function prepareDownloadParams(platform, form) {
    const params = {};
    
    switch(platform) {
        case 'youtube':
            params.format = form.querySelector('#youtube-format').value;
            params.quality = form.querySelector('#youtube-quality').value;
            params.subtitles = form.querySelector('#youtube-subtitles').checked;
            break;
            
        case 'youtube-music':
            params.format = 'audio';
            params.audio_format = form.querySelector('#ytmusic-format').value;
            params.quality = form.querySelector('#ytmusic-quality').value;
            params.metadata = form.querySelector('#ytmusic-metadata').checked;
            break;
            
        case 'facebook':
            params.format = 'video';
            params.quality = form.querySelector('#facebook-quality').value;
            break;
            
        case 'instagram':
            params.format = 'video';
            params.quality = form.querySelector('#instagram-quality').value;
            params.carousel = form.querySelector('#instagram-carousel').checked;
            break;
            
        case 'tiktok':
            const formatType = form.querySelector('#tiktok-format').value;
            params.format = formatType;
            params.quality = form.querySelector('#tiktok-quality').value;
            params.remove_watermark = params.quality === '1080';
            params.cover = form.querySelector('#tiktok-cover').checked;
            break;
    }
    
    return params;
}

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Optional: Video info preview (can be implemented later)
async function fetchVideoInfo(url, platform) {
    try {
        const response = await fetch(getApiUrl(CONFIG.API.INFO), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, platform })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.data;
        }
    } catch (error) {
        console.error('Error fetching video info:', error);
    }
    return null;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form in active tab
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            const form = activeTab.querySelector('form');
            if (form) {
                form.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        }
    }
});

// Add paste event listener for URL inputs
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('paste', function(e) {
        setTimeout(() => {
            // Auto-trim pasted URLs
            this.value = this.value.trim();
        }, 10);
    });
});

// Console message
if (CONFIG.DEBUG) {
    console.log('%c🎬 Video Downloader', 'font-size: 20px; font-weight: bold; color: #667eea;');
    console.log('%cBackend URL:', 'font-weight: bold;', CONFIG.BACKEND_URL);
    console.log('%cDebug mode enabled', 'color: #f0ad4e;');
}
