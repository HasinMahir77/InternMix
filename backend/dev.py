#!/usr/bin/env python3
"""
Development server script for InternMix backend
Provides auto-reload, debug mode, and development-friendly settings
"""

import os
import sys
from pathlib import Path

# Ensure project root is on sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Set development environment variables
os.environ["INTERNMIX_DEBUG"] = "true"
os.environ["INTERNMIX_DATABASE_URL"] = "sqlite:///./app.db"

if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Starting InternMix Backend in Development Mode")
    print("📍 Auto-reload: ENABLED")
    print("🐛 Debug mode: ENABLED")
    print("📁 Watching: backend/ directory")
    print("🌐 Server: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔍 Interactive API: http://localhost:8000/redoc")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            reload_dirs=["."],
            log_level="debug",
            access_log=True,
            use_colors=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        sys.exit(1)
