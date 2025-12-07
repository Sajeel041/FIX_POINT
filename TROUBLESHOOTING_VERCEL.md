# 🔧 Troubleshooting Vercel Deployment Errors

## Error 1: 404 Not Found

**Symptoms:**
- `Failed to load resource: the server responded with a status of 404`
- API calls failing
- Backend routes not accessible

**Causes & Solutions:**

### Solution 1: Check Backend URL Configuration
1. Verify your backend is deployed and accessible
2. Test the health endpoint: `https://your-backend.vercel.app/api/health`
3. If it returns 404, the backend routing is incorrect

### Solution 2: Verify Environment Variables
1. Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
2. Ensure `MONGO_URI` is set correctly
3. **Redeploy** after adding/changing environment variables

### Solution 3: Check Vercel Configuration
1. Verify `backend/vercel.json` exists and is correct
2. Verify `backend/api/index.js` exists
3. Check that Root Directory in Vercel is set to `backend`

### Solution 4: Verify Routes
Your backend routes should be accessible at:
- `https://your-backend.vercel.app/api/auth/*`
- `https://your-backend.vercel.app/api/bookings/*`
- `https://your-backend.vercel.app/api/services/*`
- etc.

**Test Command:**
```bash
curl https://your-backend.vercel.app/api/health
```

Expected response:
```json
{"status":"OK","message":"FixPoint API is running"}
```

---

## Error 2: WebSocket Connection Failed

**Symptoms:**
- `WebSocket connection to 'wss://your-app.vercel.app/ws/ws' failed`
- Console errors about WebSocket
- App still works but console shows errors

**Cause:**
This is from Vite's Hot Module Replacement (HMR) trying to connect in production. It's harmless but annoying.

**Solution:**
The `vite.config.js` has been updated to disable HMR in production. After redeploying, this error should disappear.

**If it persists:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that you're viewing the production build, not a preview deployment

---

## Error 3: CORS Errors

**Symptoms:**
- `Access to XMLHttpRequest blocked by CORS policy`
- API calls fail with CORS errors

**Solution:**
1. Backend already has CORS enabled for all origins
2. If issues persist, check that:
   - Frontend URL is correct in `VITE_API_URL`
   - Backend is actually deployed and running
   - No typos in the backend URL

---

## Error 4: MongoDB Connection Fails

**Symptoms:**
- Backend returns 500 errors
- Vercel function logs show MongoDB connection errors

**Solution:**
1. **Check MongoDB Atlas:**
   - Network Access → IP Whitelist → Should include `0.0.0.0/0`
   - Database Access → User exists and has correct permissions

2. **Check Environment Variables:**
   - `MONGO_URI` in Vercel should be your full connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
   - Make sure password is URL-encoded if it contains special characters

3. **Redeploy:**
   - After changing environment variables, redeploy the backend

---

## Error 5: Frontend Can't Connect to Backend

**Symptoms:**
- Frontend loads but API calls fail
- Network tab shows failed requests

**Solution:**
1. **Check `VITE_API_URL` in Frontend:**
   - Go to Vercel Dashboard → Frontend Project → Settings → Environment Variables
   - Should be: `https://your-backend.vercel.app/api`
   - **Important:** Include `/api` at the end
   - **Redeploy** frontend after changing this

2. **Verify Backend is Running:**
   - Visit `https://your-backend.vercel.app/api/health` in browser
   - Should return JSON response

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Network tab for failed requests
   - Look at the actual URL being called

---

## Quick Diagnostic Steps

### Step 1: Test Backend
```bash
# Test health endpoint
curl https://your-backend.vercel.app/api/health

# Should return:
# {"status":"OK","message":"FixPoint API is running"}
```

### Step 2: Check Vercel Logs
1. Go to Vercel Dashboard
2. Select your backend project
3. Click "Deployments"
4. Click on latest deployment
5. Click "Functions" tab
6. Check for any errors

### Step 3: Verify Environment Variables
**Backend:**
- `MONGO_URI` ✅
- `JWT_SECRET` ✅

**Frontend:**
- `VITE_API_URL` ✅ (should be `https://your-backend.vercel.app/api`)

### Step 4: Test Frontend
1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check which requests are failing
5. Look at the request URL and status code

---

## Common Mistakes

1. **Wrong Backend URL in Frontend:**
   - ❌ `https://your-backend.vercel.app` (missing `/api`)
   - ✅ `https://your-backend.vercel.app/api`

2. **Not Redeploying After Env Var Changes:**
   - Always redeploy after changing environment variables

3. **Wrong Root Directory:**
   - Backend project: Root Directory = `backend`
   - Frontend project: Root Directory = `frontend`

4. **MongoDB IP Whitelist:**
   - Must include `0.0.0.0/0` to allow Vercel connections

---

## Still Having Issues?

1. **Check Vercel Function Logs:**
   - Vercel Dashboard → Project → Deployments → Latest → Functions → Logs

2. **Test Backend Locally:**
   - Make sure it works locally first
   - If it works locally but not on Vercel, it's a deployment config issue

3. **Verify File Structure:**
   ```
   backend/
   ├── api/
   │   └── index.js  ✅ Must exist
   ├── vercel.json   ✅ Must exist
   └── server.js     ✅ Must exist
   ```

4. **Check Build Logs:**
   - Vercel Dashboard → Deployment → Build Logs
   - Look for any build errors

---

## Need More Help?

- Check Vercel documentation: https://vercel.com/docs
- Check deployment logs in Vercel dashboard
- Verify all files are committed and pushed to GitHub

