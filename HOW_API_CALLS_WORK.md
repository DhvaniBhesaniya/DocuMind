# How API Calls Work in Development Mode (`npm run dev`)

## 🎯 Quick Answer

In `npm run dev`, the client makes API calls using **relative URLs** (like `/api/auth/login`) which automatically go to the **same server** (port 5001) because both client and server run together through Vite middleware.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser (localhost:5001)                      │
│                                                                  │
│  React App makes fetch request:                                 │
│  fetch("/api/auth/login", { ... })                              │
│         │                                                        │
│         │ Relative URL → Same origin (localhost:5001)           │
│         ▼                                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Request
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Express Server (localhost:5001)                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware Stack (server/index.js)                      │  │
│  │                                                           │  │
│  │  1. express.json()          ← Parse JSON body            │  │
│  │  2. cookieParser()          ← Parse cookies              │  │
│  │  3. attachUser()            ← Attach user from JWT       │  │
│  │  4. Request logging         ← Log API requests           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Route Matching                                          │  │
│  │                                                           │  │
│  │  /api/auth/*       → authRoutes.js                       │  │
│  │  /api/documents/*  → documentRoutes.js                   │  │
│  │  /api/chat/*       → chatRoutes.js                       │  │
│  │  /*                → Vite middleware (serves React)      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Controller → Service → Database                         │  │
│  │                                                           │  │
│  │  authController.js                                       │  │
│  │       ↓                                                   │  │
│  │  MongoDB / Gemini / Pinecone                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│                      JSON Response                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Response
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Browser receives response                     │
│                                                                  │
│  React Query updates cache → Component re-renders               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Flow

### 1. **Server Starts** (`npm run dev`)

**File:** `server/index.js` (lines 77-101)

```javascript
// Server initialization
(async () => {
  // Initialize MongoDB connection
  await initializeStorage();
  
  // Create HTTP server
  const server = createServer(app);
  const port = 5001;
  
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`);
  });
  
  // Setup Vite in development mode
  if (app.get("env") === "development") {
    await setupVite(app, server);  // ← This is the magic!
  }
})();
```

**What happens:**
1. ✅ Express server starts on port 5001
2. ✅ API routes are registered (`/api/auth/*`, `/api/documents/*`, `/api/chat/*`)
3. ✅ Vite middleware is added to serve React app
4. ✅ Everything runs on **one port: 5001**

---

### 2. **Vite Middleware Setup**

**File:** `server/vite.js` - `setupVite()` function

```javascript
export async function setupVite(app, server) {
  // Create Vite dev server in middleware mode
  const vite = await createViteServer({
    server: {
      middlewareMode: true,  // ← Runs inside Express!
      hmr: { server },       // ← Hot reload through same server
    },
    appType: "custom",
  });
  
  // Add Vite middleware to Express
  app.use(vite.middlewares);
  
  // Catch-all route for React app
  app.use("*", async (req, res, next) => {
    // Serve index.html for all non-API routes
    const template = await fs.promises.readFile("client/index.html", "utf-8");
    const page = await vite.transformIndexHtml(url, template);
    res.status(200).set({ "Content-Type": "text/html" }).end(page);
  });
}
```

**What this does:**
- ✅ Vite runs **inside** Express (not as a separate server)
- ✅ API routes are handled **before** Vite middleware
- ✅ Non-API routes fall through to Vite → serves React app
- ✅ Hot Module Replacement works through the same server

---

### 3. **Client Makes API Call**

**File:** `client/src/hooks/useAuth.js` (line 23)

```javascript
// Example: Login request
const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ email, password }),
  credentials: "include",
});
```

**Key Points:**
- ✅ Uses **relative URL**: `/api/auth/login` (not `http://localhost:5001/api/auth/login`)
- ✅ Browser automatically sends to **same origin** (localhost:5001)
- ✅ No CORS issues because same origin
- ✅ Includes JWT token from `localStorage`

---

### 4. **Request Routing**

**File:** `server/index.js` (lines 56-59)

```javascript
// API Routes are registered BEFORE Vite middleware
app.use("/api/auth", authRoutes);        // ← Matches /api/auth/*
app.use("/api/documents", documentRoutes); // ← Matches /api/documents/*
app.use("/api/chat", chatRoutes);         // ← Matches /api/chat/*

// Vite middleware comes AFTER (line 98)
await setupVite(app, server);  // ← Only handles non-API routes
```

**Request Flow:**
1. Request comes in: `POST /api/auth/login`
2. Express checks routes in order:
   - ✅ Matches `/api/auth` → Goes to `authRoutes.js`
   - ❌ Never reaches Vite middleware
3. For non-API requests like `GET /`:
   - ❌ Doesn't match `/api/*` routes
   - ✅ Falls through to Vite → Serves React app

---

## 🔍 Detailed Example: Login Flow

### **Step 1: User Clicks Login Button**

**File:** `client/src/pages/auth.jsx` (example)

```javascript
const { login } = useAuth();

const handleLogin = () => {
  login({ email: "user@example.com", password: "password123" });
};
```

---

### **Step 2: useAuth Hook Makes API Call**

**File:** `client/src/hooks/useAuth.js` (lines 47-58)

```javascript
const loginMutation = useMutation({
  mutationFn: async ({ email, password }) => {
    // apiRequest is a wrapper around fetch
    const response = await apiRequest("POST", "/api/auth/login", { 
      email, 
      password 
    });
    return response.json();
  },
  onSuccess: (data) => {
    // Store JWT token
    localStorage.setItem("token", data.token);
    // Update React Query cache
    queryClient.setQueryData(["/api/auth/me"], data.user);
  },
});
```

---

### **Step 3: apiRequest Helper**

**File:** `client/src/lib/queryClient.js` (lines 10-31)

```javascript
export async function apiRequest(method, url, data) {
  // Get JWT token from localStorage
  const token = localStorage.getItem("token");
  
  // Build headers
  const headers = data ? { "Content-Type": "application/json" } : {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Make fetch request with RELATIVE URL
  const res = await fetch(url, {  // url = "/api/auth/login"
    method,                        // method = "POST"
    headers,                       // { Content-Type, Authorization }
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",        // Send cookies
  });
  
  // Check response
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  
  return res;
}
```

**Actual HTTP Request:**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:5001
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{"email":"user@example.com","password":"password123"}
```

---

### **Step 4: Express Receives Request**

**File:** `server/index.js` (middleware stack)

```javascript
// 1. Parse JSON body
app.use(express.json());  // ← Parses request body

// 2. Parse cookies
app.use(cookieParser());

// 3. Attach user from JWT
app.use(attachUser);  // ← Verifies JWT token

// 4. Route to auth handler
app.use("/api/auth", authRoutes);  // ← Matches our request!
```

---

### **Step 5: Auth Route Handler**

**File:** `server/routes/authRoutes.js` (example)

```javascript
import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);  // ← Matches POST /api/auth/login

export default router;
```

---

### **Step 6: Auth Controller**

**File:** `server/controllers/authController.js` (example)

```javascript
export async function login(req, res) {
  const { email, password } = req.body;
  
  // 1. Find user in MongoDB
  const user = await storage.findUserByEmail(email);
  
  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  // 3. Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  
  // 4. Send response
  res.json({
    user: { id: user._id, email: user.email, name: user.name },
    token,
  });
}
```

---

### **Step 7: Response Returns to Client**

**HTTP Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **Step 8: React Query Updates**

**File:** `client/src/hooks/useAuth.js` (lines 52-57)

```javascript
onSuccess: (data) => {
  // 1. Store token for future requests
  localStorage.setItem("token", data.token);
  
  // 2. Update React Query cache
  queryClient.setQueryData(["/api/auth/me"], data.user);
  
  // 3. Component automatically re-renders with new user data!
}
```

---

## 🎨 Visual Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Browser: localhost:5001                                          │
│                                                                  │
│ [Login Button Click]                                             │
│         │                                                        │
│         ▼                                                        │
│ useAuth.login({ email, password })                              │
│         │                                                        │
│         ▼                                                        │
│ apiRequest("POST", "/api/auth/login", data)                     │
│         │                                                        │
│         ▼                                                        │
│ fetch("/api/auth/login", {                                      │
│   method: "POST",                                               │
│   headers: { Authorization: "Bearer token" },                   │
│   body: JSON.stringify({ email, password })                     │
│ })                                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST /api/auth/login
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Express Server: localhost:5001                                   │
│                                                                  │
│ [Middleware Stack]                                               │
│  1. express.json()        → Parse body                          │
│  2. cookieParser()        → Parse cookies                       │
│  3. attachUser()          → Verify JWT                          │
│         │                                                        │
│         ▼                                                        │
│ [Route Matching]                                                 │
│  /api/auth/* → authRoutes.js                                    │
│         │                                                        │
│         ▼                                                        │
│ [Auth Controller]                                                │
│  1. Find user in MongoDB                                         │
│  2. Verify password with bcrypt                                  │
│  3. Generate JWT token                                           │
│  4. Return { user, token }                                       │
│         │                                                        │
│         ▼                                                        │
│ res.json({ user, token })                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP 200 OK
                              │ { user: {...}, token: "..." }
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Browser: localhost:5001                                          │
│                                                                  │
│ [Response Received]                                              │
│         │                                                        │
│         ▼                                                        │
│ onSuccess(data)                                                  │
│  1. localStorage.setItem("token", data.token)                   │
│  2. queryClient.setQueryData(["/api/auth/me"], data.user)       │
│         │                                                        │
│         ▼                                                        │
│ [Component Re-renders]                                           │
│  - User is now logged in                                         │
│  - UI shows authenticated state                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Concepts

### 1. **Relative URLs = Same Origin**

```javascript
// ✅ CORRECT: Relative URL
fetch("/api/auth/login")  
// Goes to: http://localhost:5001/api/auth/login

// ❌ NOT NEEDED: Absolute URL
fetch("http://localhost:5001/api/auth/login")
// Would work but unnecessary and causes issues in production
```

### 2. **No CORS Issues**

Because client and server are on the **same origin** (localhost:5001):
- ✅ No `Access-Control-Allow-Origin` headers needed
- ✅ Cookies work automatically
- ✅ Credentials are sent by default

### 3. **JWT Token Flow**

```javascript
// 1. Login → Receive token
localStorage.setItem("token", data.token);

// 2. Subsequent requests → Include token
const token = localStorage.getItem("token");
headers.Authorization = `Bearer ${token}`;

// 3. Server verifies token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 4. **React Query Caching**

```javascript
// After login, cache is updated
queryClient.setQueryData(["/api/auth/me"], data.user);

// Other components can access cached data
const { data: user } = useQuery({ queryKey: ["/api/auth/me"] });
// No API call needed! Uses cached data
```

---

## 📊 All API Endpoints in Your App

### **Authentication** (`/api/auth/*`)
```javascript
POST   /api/auth/register    → Register new user
POST   /api/auth/login       → Login user
POST   /api/auth/logout      → Logout user
GET    /api/auth/me          → Get current user
PUT    /api/auth/profile     → Update profile
```

### **Documents** (`/api/documents/*`)
```javascript
POST   /api/documents/upload      → Upload PDF
GET    /api/documents             → List all documents
GET    /api/documents/:id         → Get document details
GET    /api/documents/:id/status  → Get processing status
DELETE /api/documents/:id         → Delete document
```

### **Chat** (`/api/chat/*`)
```javascript
POST   /api/chat                      → Send message (unified)
POST   /api/chat/conversations        → Create conversation
GET    /api/chat/conversations        → List conversations
GET    /api/chat/conversations/:id    → Get conversation + messages
POST   /api/chat/conversations/:id/messages  → Send message
PUT    /api/chat/conversations/:id/title     → Update title
```

---

## 🚀 Summary

### How API Calls Work in `npm run dev`:

1. **Single Server**: Express runs on port 5001
2. **Vite Middleware**: Runs inside Express (not separate)
3. **Relative URLs**: Client uses `/api/*` (same origin)
4. **Route Priority**: API routes handled before Vite
5. **No CORS**: Everything on same origin
6. **JWT Auth**: Token stored in localStorage, sent in headers
7. **React Query**: Manages caching and state updates

### The Magic Formula:

```
Express Server (port 5001)
    ├── API Routes (/api/*)     → Backend logic
    └── Vite Middleware (/*)    → React app

Client makes fetch("/api/auth/login")
    → Same origin (localhost:5001)
    → No CORS issues
    → Works perfectly!
```

---

## 🎯 Why This Architecture is Awesome

✅ **No CORS headaches** - Same origin for everything  
✅ **Simple deployment** - One server, one port  
✅ **Fast development** - HMR works seamlessly  
✅ **Production ready** - Same architecture in prod (just static files instead of Vite)  
✅ **Type safety** - Can share types between client/server  
✅ **Easy debugging** - All logs in one place  

This is a **modern, production-ready full-stack architecture**! 🚀
