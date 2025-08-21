# InternMix Backend - Development Guide

## 🚀 Quick Start

### Option 1: Development Script (Recommended)
```bash
cd backend
./dev.sh
```

### Option 2: Python Script
```bash
cd backend
python dev.py
```

### Option 3: Direct Python
```bash
cd backend
python main.py
```

## 🔄 Auto-Reload Features

The development server automatically reloads when you make changes to:
- Python files in the `backend/` directory
- Any imported modules
- Configuration files

**No need to restart the server manually!** 🎉

## 🌍 Development URLs

- **API Server**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `INTERNMIX_DEBUG` | `true` | Enable debug mode and auto-reload |
| `INTERNMIX_DATABASE_URL` | `sqlite:///./app.db` | Database connection string |
| `INTERNMIX_SECRET_KEY` | `dev-secret-change-me` | JWT secret key |
| `INTERNMIX_TOKEN_EXPIRE_MINUTES` | `10080` | JWT token expiration (7 days) |

## 🛠️ Development Features

### Auto-Reload
- ✅ **File Watching**: Monitors `backend/` directory for changes
- ✅ **Hot Reload**: Automatically restarts server on file changes
- ✅ **Error Recovery**: Graceful handling of syntax errors

### Debug Mode
- ✅ **Detailed Logging**: Debug-level logging for development
- ✅ **Error Details**: Full error traces and debugging info
- ✅ **Development Headers**: Custom headers for debugging
- ✅ **Interactive API**: Swagger UI with full API documentation

### Database
- ✅ **Auto-Create Tables**: Tables created automatically on startup
- ✅ **SQLite Development**: Local SQLite database for development
- ✅ **Schema Migration**: Easy to modify models and restart

## 📁 Project Structure

```
backend/
├── main.py          # Main FastAPI application
├── models.py        # Database models
├── dev.py           # Development server script
├── dev.sh           # Development shell script
├── requirements.txt # Python dependencies
└── app.db          # SQLite database (auto-created)
```

## 🔧 Customization

### Change Port
Edit `dev.py` or `main.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
```

### Change Reload Directory
Edit `dev.py`:
```python
reload_dirs=["backend", "shared", "utils"]
```

### Environment-Specific Settings
Create `.env` file:
```bash
INTERNMIX_DEBUG=true
INTERNMIX_DATABASE_URL=sqlite:///./dev.db
INTERNMIX_SECRET_KEY=my-secret-key
```

## 🐛 Troubleshooting

### Server Won't Start
1. Check Python version: `python --version`
2. Install dependencies: `pip install -r requirements.txt`
3. Check for syntax errors: `python -m py_compile main.py`

### Auto-Reload Not Working
1. Ensure `reload=True` is set
2. Check file permissions
3. Verify you're editing files in the `backend/` directory

### Database Issues
1. Delete `app.db` and restart (will recreate tables)
2. Check `models.py` for syntax errors
3. Verify SQLite is working: `python -c "import sqlite3"`

## 🚀 Production Deployment

For production, disable auto-reload:
```bash
export INTERNMIX_DEBUG=false
python main.py
```

Or use a production WSGI server:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)

---

**Happy Coding! 🎉**
