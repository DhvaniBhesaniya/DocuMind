# DocuMind Deployment Guide

## 🏗️ Architecture Overview

Your application is designed to run **client and server on the same port**. Here's how it works:

```
Single Port (5001)
    │
    ├─── /api/*          → Express API Routes (Backend)
    │    ├─── /api/auth
    │    ├─── /api/documents
    │    └─── /api/chat
    │
    └─── /*              → React Client (Frontend)
         └─── All other routes serve the React app
```

---

## 🚀 Running the Application

### **Option 1: Development Mode** (Recommended for development)

```bash
npm run dev
```

**What happens:**
- Express server starts on port 5001
- Vite dev server runs as middleware inside Express
- React client is served through the same Express server
- Hot Module Replacement (HMR) works automatically
- **Access at:** `http://localhost:5001`

**Advantages:**
- ✅ Fast hot reload
- ✅ Better debugging
- ✅ Source maps available
- ✅ No build step needed

---

### **Option 2: Production Mode** (For deployment)

#### Step 1: Build the application
```bash
npm run build
```

**What happens:**
- Vite builds the React client → `dist/public/` (static files)
- ESBuild bundles the server → `dist/index.js`

**Output:**
```
dist/
├── public/              # Built React client
│   ├── index.html
│   └── assets/
│       ├── index-[hash].css
│       └── index-[hash].js
└── index.js            # Bundled Express server
```

#### Step 2: Start the production server
```bash
npm start
```

**What happens:**
- Runs `dist/index.js` (bundled server)
- Server serves API routes at `/api/*`
- Server serves static client files from `dist/public/`
- **Access at:** `http://localhost:5001`

**Advantages:**
- ✅ Optimized and minified code
- ✅ Smaller bundle sizes
- ✅ Production-ready performance
- ✅ Single deployment artifact

---

## 🔧 Fixing Your Current MongoDB Error

### Problem
```
querySrv ENOTFOUND _mongodb._tcp.obito.mt07zzb.mongodb.net
```

This is a **DNS/Network error** with MongoDB Atlas, not a client/server issue.

### Solutions

#### **Solution 1: Check MongoDB Atlas Network Access**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to: **Network Access** (left sidebar)
3. Click **"Add IP Address"**
4. Choose one:
   - **"Add Current IP Address"** (for your current location)
   - **"Allow Access from Anywhere"** (0.0.0.0/0) - for testing only!

#### **Solution 2: Verify Connection String**

Your `.env` should have:
```bash
MONGODB_URI=mongodb+srv://username:password@obito.mt07zzb.mongodb.net/?retryWrites=true&w=majority&appName=obito
```

**Check:**
- ✅ Replace `username` with your actual MongoDB username
- ✅ Replace `password` with your actual MongoDB password
- ✅ Ensure no spaces in the connection string
- ✅ Password should be URL-encoded if it contains special characters

**URL Encode Special Characters:**
If your password has special characters like `@`, `#`, `$`, etc., encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- etc.

Example:
```bash
# If password is: MyP@ss#123
MONGODB_URI=mongodb+srv://myuser:MyP%40ss%23123@obito.mt07zzb.mongodb.net/?retryWrites=true&w=majority&appName=obito
```

#### **Solution 3: Test Connection**

Create a test script to verify MongoDB connection:

```bash
node -e "
const { MongoClient } = require('mongodb');
const uri = 'YOUR_MONGODB_URI_HERE';
const client = new MongoClient(uri);
client.connect()
  .then(() => { console.log('✅ Connected!'); client.close(); })
  .catch(err => console.error('❌ Error:', err.message));
"
```

#### **Solution 4: Use Alternative MongoDB Provider**

If MongoDB Atlas continues to have issues, try:
- **Local MongoDB**: Install MongoDB locally
  ```bash
  # Ubuntu/Debian
  sudo apt-get install mongodb
  
  # Then use:
  MONGODB_URI=mongodb://localhost:27017/documind
  ```
- **MongoDB Cloud alternatives**: Railway, Render, DigitalOcean

#### **Solution 5: Check Firewall/VPN**

- Disable VPN temporarily
- Check if your firewall is blocking MongoDB Atlas
- Try from a different network

---

## 📝 Complete Workflow

### For Development:
```bash
# 1. Install dependencies (first time only)
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Run in development mode
npm run dev

# 4. Open browser
# http://localhost:5001
```

### For Production Deployment:
```bash
# 1. Build the application
npm run build

# 2. Verify build output
ls -la dist/
ls -la dist/public/

# 3. Start production server
npm start

# 4. Access application
# http://localhost:5001
```

---

## 🌐 How Client/Server Integration Works

### Development Mode (`npm run dev`)

**File:** `server/index.js` (lines 96-101)
```javascript
if (app.get("env") === "development") {
  await setupVite(app, server);  // Vite middleware
} else {
  serveStatic(app);              // Static files
}
```

**File:** `server/vite.js` - `setupVite()` function
- Creates Vite dev server in middleware mode
- Intercepts all non-API requests
- Serves React app with HMR
- Transforms and serves files on-the-fly

### Production Mode (`npm start`)

**File:** `server/vite.js` - `serveStatic()` function
```javascript
export function serveStatic(app) {
  const distPath = path.resolve(import.meta.dirname, "public");
  
  // Serve static files from dist/public/
  app.use(express.static(distPath));
  
  // Fallback to index.html for client-side routing
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
```

**How it works:**
1. API requests (`/api/*`) → Handled by Express routes
2. Static files (`/assets/*`) → Served from `dist/public/assets/`
3. All other routes (`/*`) → Serve `index.html` (React Router handles routing)

---

## 🎯 Key Points

✅ **Single Port Architecture**: Client and server run on the same port (5001)
✅ **No CORS Issues**: Since everything is on the same origin
✅ **Seamless Development**: Vite HMR works through Express middleware
✅ **Production Ready**: Static files served efficiently by Express
✅ **SPA Routing**: All routes fallback to `index.html` for React Router

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '/path/to/build'"
**Solution:** Use `npm run build`, not `node build`

### Issue: "Unknown command: build"
**Solution:** Use `npm run build`, not `npm build`

### Issue: MongoDB connection failed
**Solution:** See "Fixing Your Current MongoDB Error" section above

### Issue: Port already in use
**Solution:** 
```bash
# Find process using port 5001
lsof -i :5001

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=5002
```

### Issue: Build succeeds but npm start fails
**Check:**
1. `.env` file exists and has all required variables
2. MongoDB connection string is correct
3. API keys are valid
4. `dist/public/` directory exists after build

---

## 📦 Deployment to Production Servers

### Deploy to Railway/Render/Heroku:

1. **Build Command:**
   ```bash
   npm run build
   ```

2. **Start Command:**
   ```bash
   npm start
   ```

3. **Environment Variables:**
   - Set all variables from `.env.example`
   - Use production MongoDB URI
   - Use strong JWT_SECRET
   - Set `NODE_ENV=production`

4. **Port Configuration:**
   - Most platforms provide `PORT` environment variable
   - Your app already uses `process.env.PORT` (defaults to 5001)

---

## ✨ Summary

Your application is **already configured** to run client and server together:

- **Development**: `npm run dev` → Everything on port 5001 with HMR
- **Production**: `npm run build` + `npm start` → Everything on port 5001 optimized

The current error is **MongoDB connection**, not architecture. Fix the MongoDB connection and your app will work perfectly! 🚀
