#!/bin/bash

echo "================================"
echo " Video Downloader - Starting..."
echo "================================"
echo ""

cd backend

echo "Installing/Updating dependencies..."
pip3 install -r requirements.txt

echo ""
echo "Starting Flask server..."
echo ""
echo "Server will be available at:"
echo "  - http://localhost:5000"
echo "  - Check your local IP for network access"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "================================"
echo ""

python3 app.py
