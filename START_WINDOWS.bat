@echo off
echo ================================
echo  Video Downloader - Starting...
echo ================================
echo.

cd backend

echo Installing/Updating dependencies...
pip install -r requirements.txt

echo.
echo Starting Flask server...
echo.
echo Server will be available at:
echo  - http://localhost:5000
echo  - Check your local IP for network access
echo.
echo Press Ctrl+C to stop the server
echo.
echo ================================
echo.

python app.py

pause
