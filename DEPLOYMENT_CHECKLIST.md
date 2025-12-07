# 🚀 Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## ✅ Pre-Deployment Checklist

### Code Preparation
- [ ] Code is pushed to GitHub repository
- [ ] All dependencies are in `package.json` files
- [ ] No hardcoded localhost URLs in code
- [ ] Environment variables are documented

### Backend Setup
- [ ] MongoDB Atlas account created
- [ ] MongoDB database created
- [ ] MongoDB connection string ready
- [ ] JWT_SECRET generated (use a random string)
- [ ] Cloudinary credentials ready (if using image uploads)
- [ ] `backend/vercel.json` exists
- [ ] `backend/api/index.js` exists

### Frontend Setup
- [ ] `frontend/vercel.json` exists
- [ ] Build command works locally (`npm run build` in frontend folder)
- [ ] No console errors in browser

---

## 📝 Deployment Steps Checklist

### Step 1: Deploy Backend
- [ ] Sign in to Vercel (vercel.com)
- [ ] Click "Add New Project"
- [ ] Import GitHub repository
- [ ] Set Root Directory to `backend`
- [ ] Framework Preset: Other
- [ ] Add environment variables:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `CLOUDINARY_CLOUD_NAME` (if needed)
  - [ ] `CLOUDINARY_API_KEY` (if needed)
  - [ ] `CLOUDINARY_API_SECRET` (if needed)
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., `https://your-backend.vercel.app`)
- [ ] Test backend: Visit `https://your-backend.vercel.app/api/health`

### Step 2: Deploy Frontend
- [ ] In Vercel, click "Add New Project" again
- [ ] Import the same GitHub repository
- [ ] Set Root Directory to `frontend`
- [ ] Framework Preset: Vite (auto-detected)
- [ ] Add environment variable:
  - [ ] `VITE_API_URL` = `https://your-backend.vercel.app/api`
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy frontend URL

### Step 3: Update CORS (if needed)
- [ ] If CORS errors occur, update `backend/server.js`
- [ ] Add frontend URL to CORS allowed origins

### Step 4: Test Everything
- [ ] Visit frontend URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test API calls from frontend
- [ ] Check browser console for errors
- [ ] Check Vercel function logs for backend errors

---

## 🔧 Environment Variables Reference

### Backend Environment Variables
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_here_min_32_characters
PORT=5000 (optional, Vercel sets this automatically)
CLOUDINARY_CLOUD_NAME=your_cloud_name (if using Cloudinary)
CLOUDINARY_API_KEY=your_api_key (if using Cloudinary)
CLOUDINARY_API_SECRET=your_api_secret (if using Cloudinary)
```

### Frontend Environment Variables
```
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🐛 Troubleshooting Checklist

If something doesn't work:

- [ ] Check Vercel deployment logs
- [ ] Verify environment variables are set correctly
- [ ] Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0)
- [ ] Verify backend URL is accessible
- [ ] Check browser console for errors
- [ ] Verify CORS is configured correctly
- [ ] Check that routes are prefixed with `/api`
- [ ] Ensure MongoDB connection string is correct
- [ ] Redeploy after changing environment variables

---

## 📞 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 🎯 Your Deployment URLs

After deployment, fill these in:

**Backend URL**: `https://____________________.vercel.app`
**Frontend URL**: `https://____________________.vercel.app`

**Backend Health Check**: `https://____________________.vercel.app/api/health`

---

## 💡 Pro Tips

1. **Use different project names** in Vercel for frontend and backend (e.g., `fixpoint-api` and `fixpoint-app`)

2. **Test locally first**:
   ```bash
   # Backend
   cd backend
   npm install
   npm start
   
   # Frontend (in another terminal)
   cd frontend
   npm install
   npm run dev
   ```

3. **Generate JWT_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **MongoDB Atlas Setup**:
   - Create cluster
   - Create database user
   - Whitelist IP: `0.0.0.0/0` (allows all IPs)
   - Get connection string
   - Replace `<password>` with your password

5. **Vercel automatically deploys** on every push to main branch (if connected to GitHub)

---

## ✅ Post-Deployment

- [ ] Both frontend and backend are live
- [ ] Can register new users
- [ ] Can login
- [ ] API calls work from frontend
- [ ] No console errors
- [ ] Database operations work correctly

🎉 **Congratulations! Your app is live!**

