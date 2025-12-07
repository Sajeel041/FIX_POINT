# 🚀 Start Here - Run FixPoint on Your Laptop

## Quick Setup (5 minutes)

### 1️⃣ Backend Setup

**Open PowerShell in the project folder and run:**

```powershell
cd backend
```

**Create `.env` file:**
1. In the `backend` folder, create a new file named `.env` (exactly this name, no extension)
2. Copy and paste this into it:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fixpoint?retryWrites=true&w=majority
JWT_SECRET=fixpoint_local_secret_key_12345678901234567890
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```

**Get MongoDB Connection String (FREE):**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (FREE forever)
3. Click "Build a Database" → Choose FREE tier
4. Wait 1-2 minutes
5. Click "Database Access" → "Add New Database User"
   - Username: `fixpoint` (or any name)
   - Password: Create one (SAVE IT!)
   - Click "Add User"
6. Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
7. Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Add `/fixpoint` at the end
   - Example: `mongodb+srv://fixpoint:MyPass123@cluster0.abc.mongodb.net/fixpoint?retryWrites=true&w=majority`
8. Paste it into `.env` file as `MONGO_URI`

**Start Backend:**
```powershell
npm run dev
```

✅ You should see: `✅ Connected to MongoDB` and `🚀 Server running on port 5000`

---

### 2️⃣ Frontend Setup (Open NEW PowerShell Window)

```powershell
cd "C:\Users\Pakistan\OneDrive\Desktop\New folder\frontend"
```

**Create `.env` file:**
1. In the `frontend` folder, create a new file named `.env`
2. Add this:

```env
VITE_API_URL=http://localhost:5000/api
```

**Install and Start:**
```powershell
npm install
npm run dev
```

✅ You should see: `Local: http://localhost:3000/`

---

### 3️⃣ Open in Browser

Go to: **http://localhost:3000**

🎉 You should see the FixPoint landing page!

---

## ✅ Checklist

- [ ] Backend `.env` file created with MongoDB connection string
- [ ] Backend running (port 5000)
- [ ] Frontend `.env` file created
- [ ] Frontend running (port 3000)
- [ ] Can open http://localhost:3000

## 🐛 Problems?

**Backend error?**
- Check `.env` file exists in `backend` folder
- Check MongoDB connection string is correct
- Make sure IP is whitelisted in MongoDB Atlas

**Frontend error?**
- Check `.env` file exists in `frontend` folder
- Make sure backend is running first
- Check `VITE_API_URL` is correct

**Still stuck?** Check `LOCAL_SETUP.md` for detailed help!

