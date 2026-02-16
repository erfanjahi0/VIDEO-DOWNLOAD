from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os
import tempfile
import re
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Configuration
DOWNLOAD_FOLDER = tempfile.gettempdir()
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB limit

class DownloadLogger:
    def debug(self, msg):
        pass
    
    def warning(self, msg):
        pass
    
    def error(self, msg):
        print(f"ERROR: {msg}")

def get_video_info(url, platform):
    """Get video information without downloading"""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Extract relevant information
            video_info = {
                'title': info.get('title', 'Unknown'),
                'duration': info.get('duration', 0),
                'thumbnail': info.get('thumbnail', ''),
                'uploader': info.get('uploader', 'Unknown'),
                'formats': []
            }
            
            # Get available formats
            if 'formats' in info:
                for fmt in info['formats']:
                    format_info = {
                        'format_id': fmt.get('format_id'),
                        'ext': fmt.get('ext'),
                        'quality': fmt.get('format_note', 'Unknown'),
                        'filesize': fmt.get('filesize', 0),
                        'vcodec': fmt.get('vcodec', 'none'),
                        'acodec': fmt.get('acodec', 'none'),
                    }
                    video_info['formats'].append(format_info)
            
            return video_info
    except Exception as e:
        raise Exception(f"Error fetching video info: {str(e)}")

def sanitize_filename(filename):
    """Remove invalid characters from filename"""
    return re.sub(r'[<>:"/\\|?*]', '', filename)

@app.route('/')
def index():
    return jsonify({
        'status': 'online',
        'message': 'Video Downloader API',
        'version': '1.0',
        'endpoints': {
            '/api/info': 'Get video information',
            '/api/download': 'Download video',
            '/api/health': 'Health check'
        }
    })

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/info', methods=['POST'])
def get_info():
    """Get video information endpoint"""
    try:
        data = request.json
        url = data.get('url')
        platform = data.get('platform', 'youtube')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        info = get_video_info(url, platform)
        return jsonify({
            'success': True,
            'data': info
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/download', methods=['POST'])
def download_video():
    """Download video endpoint"""
    try:
        data = request.json
        url = data.get('url')
        platform = data.get('platform', 'youtube')
        quality = data.get('quality', '1080')
        format_type = data.get('format', 'video')  # 'video' or 'audio'
        audio_format = data.get('audio_format', 'mp3')
        remove_watermark = data.get('remove_watermark', False)
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Configure yt-dlp options based on platform and preferences
        ydl_opts = {
            'logger': DownloadLogger(),
            'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
            'quiet': False,
            'no_warnings': False,
        }
        
        # Platform-specific configurations
        if platform == 'youtube' or platform == 'youtube-music':
            if format_type == 'audio':
                ydl_opts.update({
                    'format': 'bestaudio/best',
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': audio_format,
                        'preferredquality': quality,
                    }],
                    'writethumbnail': True,
                    'embedthumbnail': True,
                    'addmetadata': True,
                })
            else:
                # For video, try to get the best quality with fallback
                if quality == '2160':
                    format_string = 'bestvideo[height<=2160]+bestaudio/best[height<=2160]'
                elif quality == '1440':
                    format_string = 'bestvideo[height<=1440]+bestaudio/best[height<=1440]'
                elif quality == '1080':
                    format_string = 'bestvideo[height<=1080]+bestaudio/best[height<=1080]'
                elif quality == '720':
                    format_string = 'bestvideo[height<=720]+bestaudio/best[height<=720]'
                elif quality == '480':
                    format_string = 'bestvideo[height<=480]+bestaudio/best[height<=480]'
                else:
                    format_string = 'bestvideo[height<=360]+bestaudio/best[height<=360]'
                
                ydl_opts.update({
                    'format': format_string,
                    'merge_output_format': 'mp4',
                })
        
        elif platform == 'tiktok':
            if remove_watermark:
                ydl_opts.update({
                    'format': 'best',
                    'http_headers': {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                })
            else:
                ydl_opts['format'] = 'best'
        
        elif platform == 'instagram':
            ydl_opts.update({
                'format': 'best',
                'http_headers': {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
                }
            })
        
        elif platform == 'facebook':
            ydl_opts.update({
                'format': 'best',
            })
        
        # Download the video
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            
            # Get the downloaded filename
            if format_type == 'audio':
                filename = ydl.prepare_filename(info)
                filename = os.path.splitext(filename)[0] + f'.{audio_format}'
            else:
                filename = ydl.prepare_filename(info)
            
            if not os.path.exists(filename):
                # Try alternative extensions
                base = os.path.splitext(filename)[0]
                for ext in ['.mp4', '.webm', '.mkv', '.m4a', '.mp3']:
                    alt_filename = base + ext
                    if os.path.exists(alt_filename):
                        filename = alt_filename
                        break
            
            if not os.path.exists(filename):
                return jsonify({
                    'success': False,
                    'error': 'Downloaded file not found'
                }), 500
            
            # Get file size
            file_size = os.path.getsize(filename)
            
            # Send file to user
            response = send_file(
                filename,
                as_attachment=True,
                download_name=os.path.basename(filename)
            )
            
            # Clean up file after sending (optional)
            # os.remove(filename)
            
            return response
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/formats', methods=['POST'])
def get_formats():
    """Get available formats for a video"""
    try:
        data = request.json
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            formats = []
            if 'formats' in info:
                for fmt in info['formats']:
                    formats.append({
                        'format_id': fmt.get('format_id'),
                        'ext': fmt.get('ext'),
                        'quality': fmt.get('format_note', 'Unknown'),
                        'filesize': fmt.get('filesize'),
                        'resolution': fmt.get('resolution'),
                        'fps': fmt.get('fps'),
                        'vcodec': fmt.get('vcodec'),
                        'acodec': fmt.get('acodec'),
                    })
            
            return jsonify({
                'success': True,
                'title': info.get('title'),
                'thumbnail': info.get('thumbnail'),
                'duration': info.get('duration'),
                'formats': formats
            })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # For local development
    app.run(debug=True, host='0.0.0.0', port=5000)
