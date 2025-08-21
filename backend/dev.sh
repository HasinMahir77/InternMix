#!/bin/bash

# Development server startup script for InternMix backend

echo "🚀 Starting InternMix Backend in Development Mode"
echo "📍 Auto-reload: ENABLED"
echo "🐛 Debug mode: ENABLED"
echo "📁 Watching: backend/ directory"
echo "🌐 Server: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "🔍 Interactive API: http://localhost:8000/redoc"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="

# Set development environment
export INTERNMIX_DEBUG=true
export INTERNMIX_DATABASE_URL="sqlite:///./app.db"

# Start the development server
python dev.py
