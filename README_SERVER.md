# 🎰 Tuwaiq Casino Game - Node.js Server Setup

Your casino game now includes a professional Node.js server for better deployment and hosting options!

---

## 🚀 Quick Start (Windows)

### Option 1: Use the Batch File (Easiest)
1. **Double-click** `START_SERVER.bat`
2. Wait for dependencies to install (first time only)
3. Server will start automatically!
4. Open your browser to: **http://localhost:3000**

### Option 2: Manual Start
```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start the server
npm start
```

---

## 📋 Prerequisites

**Install Node.js:**
- Download from: https://nodejs.org
- Choose the **LTS version** (Long Term Support)
- Install with default settings
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

---

## 🎮 Available Scripts

```bash
# Start the server (production mode)
npm start

# Start with auto-reload during development
npm run dev
```

---

## 🌐 Endpoints

Once the server is running, you can access:

| Endpoint | Description |
|----------|-------------|
| `http://localhost:3000/` | Main game page |
| `http://localhost:3000/health` | Health check (returns server status) |
| `http://localhost:3000/api/stats` | Game statistics API |

---

## 📦 Server Features

✅ **Express.js** - Fast, minimalist web framework
✅ **Compression** - Gzip compression for faster loading
✅ **Helmet** - Security headers for protection
✅ **Static File Serving** - Optimized caching
✅ **Health Check** - For monitoring and deployment
✅ **API Endpoints** - Ready for future features
✅ **Error Handling** - Graceful error management
✅ **404 Handling** - Redirects to main game

---

## 🚀 Deployment Options

### 1. **Heroku** (FREE tier available)

```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create a new app
heroku create your-casino-game

# Deploy
git push heroku main

# Open your app
heroku open
```

**Heroku will automatically:**
- Detect it's a Node.js app
- Install dependencies
- Run `npm start`
- Assign a URL

### 2. **Railway** (FREE - RECOMMENDED)

1. Go to: https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway auto-deploys! 🎉
7. Get your link: `https://your-app.railway.app`

**Why Railway?**
- ✅ Easiest deployment
- ✅ Free tier included
- ✅ Auto-deploy on git push
- ✅ Custom domains
- ✅ Environment variables

### 3. **Render** (FREE tier available)

1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New Web Service"
4. Connect your repository
5. Render auto-detects Node.js
6. Click "Create Web Service"
7. Wait for deployment
8. Get your link!

### 4. **Fly.io** (FREE tier)

```bash
# Install Fly CLI
# Windows: Download from https://fly.io/docs/getting-started/installing-flyctl/

# Login
fly auth login

# Launch (creates fly.toml)
fly launch

# Deploy
fly deploy

# Open your app
fly open
```

### 5. **Glitch** (FREE - Browser-based)

1. Go to: https://glitch.com
2. Click "New Project" → "Import from GitHub"
3. Paste your GitHub URL
4. Glitch auto-runs your server
5. Share the link!

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional):

```env
PORT=3000
NODE_ENV=production
```

### Port Configuration

The server uses port **3000** by default. To change it:

**Option 1: Environment Variable**
```bash
PORT=8080 npm start
```

**Option 2: In server.js**
```javascript
const PORT = 5000; // Change this line
```

---

## 🎯 Project Structure

```
My-Game/
├── server.js              # Node.js server
├── package.json           # Dependencies & scripts
├── index.html            # Game UI
├── script.js             # Game logic
├── style.css             # Styling
├── START_SERVER.bat      # Windows quick start
├── .gitignore           # Git ignore rules
└── node_modules/         # Dependencies (auto-created)
```

---

## 🔒 Security Features

The server includes several security measures:

- **Helmet.js** - Sets security HTTP headers
- **Content Security Policy** - Prevents XSS attacks
- **Compression** - Reduces bandwidth usage
- **Error Handling** - Prevents information leakage
- **Static File Caching** - Improves performance

---

## 🐛 Troubleshooting

### "Node is not recognized"
- Node.js is not installed or not in PATH
- Download and install from: https://nodejs.org
- Restart your terminal/cmd

### "npm install" fails
- Check your internet connection
- Try: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Port already in use
- Another app is using port 3000
- Change the port: `PORT=3001 npm start`
- Or stop the other application

### "Cannot find module 'express'"
- Dependencies not installed
- Run: `npm install`

---

## 📊 Performance

The server includes optimizations:

- **Gzip Compression** - Reduces file sizes by ~70%
- **Static File Caching** - Caches files for 1 day
- **ETags** - Efficient cache validation
- **Helmet Security** - Minimal overhead

**Expected Performance:**
- First load: ~50-100ms
- Cached load: ~10-20ms
- Concurrent users: 100+ (depending on hosting)

---

## 🔄 Updating Your Game

1. Make changes to your files
2. Restart the server (Ctrl+C, then `npm start`)
3. Refresh your browser (or Ctrl+Shift+R for hard refresh)

**For automatic reloading during development:**
```bash
npm run dev
```
This will restart the server whenever you save changes!

---

## 🌟 Next Steps

Now that you have a Node.js server, you can:

1. **Deploy to the cloud** (Railway, Heroku, Render)
2. **Add a database** (MongoDB, PostgreSQL)
3. **Add user accounts** (authentication)
4. **Track high scores** (persistent storage)
5. **Add real-time features** (Socket.io)
6. **Create leaderboards** (competitive gameplay)

---

## 📝 Example: Deploy to Railway

**Super Easy - 3 Steps:**

1. Push your code to GitHub
2. Go to https://railway.app
3. Import your GitHub repo
4. Railway automatically:
   - Detects Node.js
   - Runs `npm install`
   - Runs `npm start`
   - Gives you a live URL! 🎉

**You're live in ~2 minutes!**

---

## 🆘 Need Help?

- **Node.js Docs**: https://nodejs.org/docs
- **Express.js Docs**: https://expressjs.com
- **Railway Docs**: https://docs.railway.app
- **Heroku Docs**: https://devcenter.heroku.com

---

## 🎊 Congratulations!

Your casino game is now powered by a professional Node.js server! You can deploy it to any cloud platform and share it with the world! 🌍🎰

Good luck! 🚀✨

