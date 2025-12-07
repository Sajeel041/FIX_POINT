# 🚨 Quick Fix for 404 Errors on Vercel

## The Problem

After deployment, you're getting:
- `Failed to load resource: the server responded with a status of 404`
- WebSocket connection errors

## Root Cause

The backend routes aren't being served correctly by Vercel's serverless functions.

## ✅ Solution Steps

### Step 1: Verify Backend Deployment

1. **Test your backend directly:**
   - Open: `https://your-backend.vercel.app/api/health`
   - If this returns 404, the backend routing is broken

### Step 2: Fix Backend Configuration

The files have been updated. Now you need to:

1. **Commit and push the changes:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push
   ```

2. **Redeploy on Vercel:**
   - Go to Vercel Dashboard
   - Find your backend project
   - Click "Redeploy" → "Redeploy" (or it will auto-deploy from GitHub)

### Step 3: Verify Environment Variables

**Backend Project in Vercel:**
- Go to Settings → Environment Variables
- Ensure these are set:
  - `MONGO_URI` = your MongoDB connection string
  - `JWT_SECRET` = any random string

**Frontend Project in Vercel:**
- Go to Settings → Environment Variables  
- Ensure:
  - `VITE_API_URL` = `https://your-backend.vercel.app/api`
  - **Important:** Must include `/api` at the end

### Step 4: Test Again

1. **Test Backend:**
   ```
   https://your-backend.vercel.app/api/health
   ```
   Should return: `{"status":"OK","message":"FixPoint API is running"}`

2. **Test Frontend:**
   - Visit your frontend URL
   - Open browser console (F12)
   - Check if 404 errors are gone

---

## 🔍 If Still Getting 404

### Check 1: Root Directory
In Vercel Dashboard → Backend Project → Settings:
- **Root Directory** should be: `backend`
- If it's wrong, update it and redeploy

### Check 2: File Structure
Make sure these files exist:
```
backend/
├── api/
│   └── index.js    ← Must exist
├── vercel.json     ← Must exist  
└── server.js       ← Must exist
```

### Check 3: Vercel Logs
1. Go to Vercel Dashboard
2. Backend Project → Deployments → Latest
3. Click "Functions" tab
4. Check for errors in logs

### Check 4: MongoDB Connection
If backend is returning 500 instead of 404:
- Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0)
- Verify MONGO_URI in Vercel environment variables

---

## 🐛 WebSocket Error Fix

The WebSocket error (`wss://.../ws/ws`) is from Vite's dev server trying to connect in production.

**This is fixed by:**
- Updated `frontend/vite.config.js` to disable HMR in production
- After redeploying frontend, this error should disappear

**If it persists:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

---

## 📝 Quick Checklist

- [ ] Backend `vercel.json` exists and is correct
- [ ] Backend `api/index.js` exists
- [ ] Root Directory in Vercel = `backend` (for backend project)
- [ ] Root Directory in Vercel = `frontend` (for frontend project)
- [ ] `MONGO_URI` set in backend environment variables
- [ ] `VITE_API_URL` set in frontend environment variables (with `/api` suffix)
- [ ] Both projects redeployed after changes
- [ ] MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

---

## 🎯 Expected URLs

**Backend:**
- Health: `https://your-backend.vercel.app/api/health`
- Auth: `https://your-backend.vercel.app/api/auth/*`
- Bookings: `https://your-backend.vercel.app/api/bookings/*`

**Frontend:**
- App: `https://your-frontend.vercel.app`

**Frontend Environment Variable:**
- `VITE_API_URL` = `https://your-backend.vercel.app/api`

---

## ✅ After Fixing

1. Backend health endpoint works
2. Frontend can make API calls
3. No 404 errors in console
4. No WebSocket errors (after frontend redeploy)

If you're still having issues, check the detailed troubleshooting guide: `TROUBLESHOOTING_VERCEL.md`

