# MongoDB Connection Fix for Login Issues

## Problem
You're getting a **500 Internal Server Error** when trying to log in because:
1. **Database timeout**: "Operation `users.findOne()` buffering timed out after 10000ms"
2. MongoDB connection is not being established properly in Vercel serverless functions

## Root Cause
In Vercel serverless functions, MongoDB connections need special handling:
- Serverless functions can be "cold starts" (no existing connection)
- Mongoose buffering might timeout before connection is established
- Connection pooling needs to be configured for serverless environments

## Fixes Applied

### 1. Enhanced MongoDB Connection (`backend/api/index.js`)
- Added connection options optimized for serverless:
  - `bufferMaxEntries: 0` - Fail immediately if not connected (no buffering)
  - `bufferCommands: false` - Don't buffer operations
  - `serverSelectionTimeoutMS: 5000` - Faster timeout (5s instead of 30s)
  - `maxPoolSize: 1` - Minimal connections for serverless
- Added connection middleware that ensures DB is connected before handling requests
- Better error handling and logging

### 2. Enhanced Login Route (`backend/routes/auth.js`)
- Added MongoDB connection state check before querying
- Added query timeout (5 seconds) to prevent hanging
- Better error messages for database connection issues

## What You Need to Check in Vercel

### Critical: Environment Variables
Go to your Vercel project → Settings → Environment Variables and make sure these are set:

1. **MONGO_URI** (REQUIRED)
   - Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
   - Make sure it's set for **Production**, **Preview**, and **Development**

2. **JWT_SECRET** (REQUIRED)
   - Any random secret string for JWT token signing
   - Example: `your-super-secret-jwt-key-12345`
   - Should be different for production

### MongoDB Atlas Setup
1. **IP Whitelist**: 
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` to allow all IPs (for serverless)
   - OR add Vercel's IP ranges (less secure but recommended)

2. **Database User**:
   - Make sure you have a database user with read/write permissions
   - The username/password should match what's in your MONGO_URI

3. **Connection String**:
   - Get it from: Atlas → Clusters → Connect → Connect your application
   - Copy the connection string and replace `<password>` with your actual password

## Testing Steps

1. **Check Environment Variables**:
   ```bash
   # In Vercel Dashboard, verify:
   - MONGO_URI is set and correct
   - JWT_SECRET is set
   ```

2. **Redeploy**:
   - After setting/changing environment variables, **redeploy** your backend
   - Vercel needs a redeploy to pick up new environment variables

3. **Test Connection**:
   - Visit: `https://your-backend.vercel.app/api/health`
   - Should return: `{"status":"OK","message":"FixPoint API is running"}`

4. **Test Login**:
   - Try logging in with valid credentials
   - Check Vercel function logs for any errors

## Common Issues

### Issue 1: "MONGO_URI is not defined"
**Solution**: Add `MONGO_URI` to Vercel environment variables

### Issue 2: "Authentication failed"
**Solution**: 
- Check your MongoDB username/password in MONGO_URI
- Verify database user exists and has correct permissions

### Issue 3: "Connection timeout"
**Solution**:
- Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0 or Vercel IPs)
- Verify network connectivity
- Check if MongoDB cluster is paused (Atlas free tier pauses after inactivity)

### Issue 4: Still getting 500 errors after setting variables
**Solution**:
1. **Redeploy** your backend on Vercel (very important!)
2. Check Vercel function logs: Vercel Dashboard → Your Project → Functions → View Logs
3. Look for MongoDB connection errors in the logs

## Verification Checklist

- [ ] MONGO_URI is set in Vercel (all environments)
- [ ] JWT_SECRET is set in Vercel (all environments)
- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0 (or Vercel IPs)
- [ ] MongoDB database user exists and has correct password
- [ ] Backend has been **redeployed** after setting variables
- [ ] Can access `/api/health` endpoint
- [ ] Login works with valid credentials

## Next Steps

1. **Set environment variables** in Vercel (if not already done)
2. **Redeploy** the backend
3. **Test login** again
4. If still having issues, check **Vercel function logs** for specific error messages

## Need More Help?

Check the Vercel function logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Click on a function (e.g., `api/auth/login`)
5. View the logs to see exact error messages

The logs will show exactly what's wrong - whether it's:
- Missing MONGO_URI
- Connection timeout
- Authentication failure
- Or something else