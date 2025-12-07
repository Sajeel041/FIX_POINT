# FixPoint - Local Development Setup

## 🖥️ Running on Your Laptop (Local Development)

### Step 1: Backend Setup

1. **Navigate to backend folder:**
```powershell
cd backend
```

2. **Install dependencies (if not done):**
```powershell
npm install
```

3. **Create `.env` file in backend folder:**
   - Create a new file named `.env` (no extension)
   - Add this content:

```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/fixpoint?retryWrites=true&w=majority
JWT_SECRET=fixpoint_local_dev_secret_key_2024_abc123xyz789
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```

### Step 2: Get MongoDB Connection (Choose ONE option)

#### Option A: MongoDB Atlas (Free Cloud - Recommended for Easy Setup)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (it's FREE forever for development)
3. Create a FREE cluster (click "Build a Database" → Choose FREE tier)
4. Wait 1-3 minutes for cluster to be created
5. Click "Database Access" → "Add New Database User"
   - Username: `fixpoint_user` (or any name)
   - Password: Create a strong password (SAVE IT!)
   - Click "Add User"
6. Click "Network Access" → "Add IP Address"
   - Click "Add Current IP Address" (or "Allow Access from Anywhere" for easier setup)
   - Click "Confirm"
7. Go back to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://fixpoint_user:<password>@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password
   - Add `/fixpoint` at the end: `mongodb+srv://fixpoint_user:YourPassword123@cluster0.xxxxx.mongodb.net/fixpoint?retryWrites=true&w=majority`
8. Paste this into your `.env` file as `MONGO_URI`

#### Option B: Local MongoDB (If you have MongoDB installed)

If you have MongoDB installed locally on your laptop:

1. Start MongoDB service:
   - Windows: Open Services → Start "MongoDB" service
   - Or run: `mongod` in terminal
2. Use this in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/fixpoint
```

### Step 3: Start Backend Server

```powershell
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

If you see errors, check:
- Is `.env` file in the `backend` folder?
- Is `MONGO_URI` correct?
- For Atlas: Is your IP whitelisted?

### Step 4: Frontend Setup (New Terminal)

1. **Open a NEW terminal/PowerShell window**

2. **Navigate to frontend folder:**
```powershell
cd "C:\Users\Pakistan\OneDrive\Desktop\New folder\frontend"
```

3. **Install dependencies:**
```powershell
npm install
```

4. **Create `.env` file in frontend folder:**
   - Create a new file named `.env`
   - Add this content:

```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start frontend:**
```powershell
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Step 5: Test the Application

1. Open browser: http://localhost:3000
2. You should see the FixPoint landing page
3. Click "Sign up" to create an account
4. Test the app!

## 🐛 Troubleshooting

### Backend won't start:
- ✅ Check `.env` file exists in `backend` folder
- ✅ Check `MONGO_URI` is correct (no extra spaces)
- ✅ For Atlas: Make sure IP is whitelisted
- ✅ Check MongoDB Atlas cluster is running (green status)

### Frontend won't start:
- ✅ Check `.env` file exists in `frontend` folder
- ✅ Check `VITE_API_URL` is correct
- ✅ Make sure backend is running first

### Connection errors:
- ✅ Make sure backend is running on port 5000
- ✅ Check browser console for errors
- ✅ Verify `VITE_API_URL` matches backend URL

## 📝 Quick Checklist

- [ ] Backend `.env` file created with `MONGO_URI` and `JWT_SECRET`
- [ ] MongoDB Atlas account created (or local MongoDB running)
- [ ] Backend running on port 5000
- [ ] Frontend `.env` file created with `VITE_API_URL`
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000 in browser

## 🎯 Next Steps After Local Setup Works

Once everything runs locally:
1. Test all features (signup, login, booking, etc.)
2. Create some test data
3. Then we can deploy to Vercel/Railway when ready

