# Step-by-Step Guide: Deploying Frontend and Backend on Vercel

This guide will walk you through deploying both your React frontend and Express backend on Vercel.

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be on GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **MongoDB Atlas Account** - For your database (if not already set up)
4. **Node.js installed** - For local testing

---

## 🎯 Overview

You'll deploy:
- **Frontend** → Vercel (as a static site)
- **Backend** → Vercel (as serverless functions)

Both will be separate Vercel projects for easier management.

---

## 📦 Part 1: Prepare Your Code for Deployment

### Step 1.1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it (e.g., `fixpoint-app`)
   - Don't initialize with README
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/fixpoint-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 1.2: Set Up Environment Variables

You'll need these environment variables:

**For Backend:**
- `MONGO_URI` - Your MongoDB Atlas connection string
- `PORT` - Port number (Vercel will set this automatically)
- `JWT_SECRET` - A secret key for JWT tokens (generate a random string)
- `CLOUDINARY_CLOUD_NAME` - If using Cloudinary
- `CLOUDINARY_API_KEY` - If using Cloudinary
- `CLOUDINARY_API_SECRET` - If using Cloudinary

**For Frontend:**
- `VITE_API_URL` - Your backend API URL (will be set after backend deployment)

---

## 🚀 Part 2: Deploy Backend to Vercel

### Step 2.1: Create Backend Vercel Configuration

The `backend/vercel.json` file has been created for you. It configures Vercel to:
- Convert your Express app to serverless functions
- Handle all `/api/*` routes
- Set up proper rewrites

### Step 2.2: Deploy Backend

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository you just pushed

3. **Configure Backend Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `backend` (click "Edit" and set to `backend`)
   - **Build Command**: Leave empty (or `npm install`)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   MONGO_URI = your_mongodb_atlas_connection_string
   JWT_SECRET = your_random_secret_key_here
   PORT = (leave empty, Vercel sets this)
   ```
   
   If using Cloudinary:
   ```
   CLOUDINARY_CLOUD_NAME = your_cloud_name
   CLOUDINARY_API_KEY = your_api_key
   CLOUDINARY_API_SECRET = your_api_secret
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - **Copy your deployment URL** (e.g., `https://your-backend.vercel.app`)

---

## 🎨 Part 3: Deploy Frontend to Vercel

### Step 3.1: Update Frontend Configuration

The frontend is already configured with `vercel.json`. You just need to set the API URL.

### Step 3.2: Deploy Frontend

1. **Create New Project in Vercel**:
   - In Vercel dashboard, click "Add New..." → "Project"
   - Import the same GitHub repository

2. **Configure Frontend Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (click "Edit" and set to `frontend`)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install`

3. **Add Environment Variables**:
   Add the backend URL you copied:
   ```
   VITE_API_URL = https://your-backend.vercel.app/api
   ```
   (Replace `your-backend.vercel.app` with your actual backend URL)

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be live!

---

## ✅ Part 4: Verify Deployment

### Step 4.1: Test Backend

1. Visit: `https://your-backend.vercel.app/api/health`
2. You should see: `{"status":"OK","message":"FixPoint API is running"}`

### Step 4.2: Test Frontend

1. Visit your frontend URL (e.g., `https://your-frontend.vercel.app`)
2. Try logging in or creating an account
3. Check browser console for any errors

---

## 🔧 Part 5: Troubleshooting

### Common Issues:

1. **Backend returns 404**:
   - Check that `backend/vercel.json` exists and is correct
   - Verify routes are prefixed with `/api`

2. **CORS Errors**:
   - Backend already has CORS enabled, but if issues persist:
   - Update CORS in `backend/server.js` to allow your frontend domain

3. **MongoDB Connection Fails**:
   - Verify `MONGO_URI` is set correctly in Vercel
   - Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

4. **Environment Variables Not Working**:
   - After adding env vars, redeploy the project
   - Vercel requires a new deployment for env vars to take effect

5. **Build Fails**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`

---

## 🔄 Part 6: Updating Your Deployment

Whenever you push changes to GitHub:

1. **Automatic Deployment** (if enabled):
   - Vercel automatically deploys on every push to `main` branch

2. **Manual Deployment**:
   - Go to Vercel dashboard
   - Click "Redeploy" on your project

3. **Preview Deployments**:
   - Vercel creates preview deployments for pull requests
   - Test changes before merging

---

## 📝 Quick Reference

### Backend URL Format:
```
https://your-backend-project.vercel.app/api
```

### Frontend URL Format:
```
https://your-frontend-project.vercel.app
```

### Environment Variables Location:
- Vercel Dashboard → Your Project → Settings → Environment Variables

### Important Files:
- `backend/vercel.json` - Backend Vercel configuration
- `frontend/vercel.json` - Frontend Vercel configuration
- `backend/server.js` - Express server entry point
- `frontend/vite.config.js` - Vite build configuration

---

## 🎉 You're Done!

Your app should now be live on Vercel! Both frontend and backend will have their own URLs and will work together seamlessly.

**Next Steps:**
- Set up custom domains (optional)
- Configure production MongoDB database
- Set up monitoring and analytics
- Enable Vercel Analytics (optional)

---

## 💡 Pro Tips

1. **Use Vercel CLI** for faster deployments:
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

2. **Separate Projects**: Deploying frontend and backend as separate projects gives you:
   - Independent scaling
   - Separate environment variables
   - Easier debugging
   - Better organization

3. **Environment Variables**: Use different values for:
   - Production (Production)
   - Preview (Preview)
   - Development (Development)

4. **MongoDB Atlas**: Make sure your IP whitelist includes:
   - `0.0.0.0/0` (allows all IPs) OR
   - Specific Vercel IP ranges

---

## 📞 Need Help?

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vercel Discord: [vercel.com/discord](https://vercel.com/discord)
- Check deployment logs in Vercel dashboard for detailed error messages

