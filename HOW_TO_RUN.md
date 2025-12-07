# 🚀 How to Run FixPoint

## Quick Start Guide

### Step 1: Start Backend Server

1. **Open PowerShell** in the project folder

2. **Navigate to backend:**
```powershell
cd backend
```

3. **Start the server:**
```powershell
npm run dev
```

✅ You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**Keep this terminal open!** The backend must stay running.

---

### Step 2: Start Frontend (New Terminal)

1. **Open a NEW PowerShell window** (keep backend running)

2. **Navigate to frontend:**
```powershell
cd "C:\Users\Pakistan\OneDrive\Desktop\New folder\frontend"
```

3. **Start the frontend:**
```powershell
npm run dev
```

✅ You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

---

### Step 3: Open in Browser

Open your browser and go to:
**http://localhost:3000**

🎉 You should see the FixPoint landing page!

---

## 📋 Checklist

- [ ] Backend is running (port 5000) - see "✅ Connected to MongoDB"
- [ ] Frontend is running (port 3000) - see "Local: http://localhost:3000/"
- [ ] Browser opens http://localhost:3000
- [ ] Landing page loads

---

## 🐛 Troubleshooting

### Backend won't start?
- Check if `.env` file exists in `backend` folder
- Check MongoDB connection string is correct
- Make sure MongoDB Atlas IP is whitelisted

### Frontend won't start?
- Make sure backend is running first
- Check `.env` file exists in `frontend` folder
- Try: `npm install` again in frontend folder

### Can't connect?
- Make sure BOTH terminals are running
- Backend on port 5000
- Frontend on port 3000
- Check browser console for errors

---

## 🎯 Testing the App

1. **Sign up as Customer:**
   - Go to http://localhost:3000/signup
   - Select "Customer"
   - Fill form and sign up

2. **Create Service Request:**
   - Click "Book a Service"
   - Select service type (e.g., Electrician)
   - Enter issue: "Heater not working"
   - Enter location: "123 Main Street"
   - Submit

3. **Sign up as Merchant:**
   - Open new browser tab (or incognito)
   - Go to http://localhost:3000/signup
   - Select "Merchant"
   - Fill form (use same service type as request)
   - Toggle "Online" status

4. **Merchant Accepts Request:**
   - In merchant dashboard, you'll see the request
   - Click "Accept"

5. **Customer Selects Merchant:**
   - Go back to customer dashboard
   - See accepted merchants
   - Click "Select" on a merchant
   - Booking confirmed!

---

## ⚠️ Important Notes

- **Keep both terminals open** - Backend and Frontend must run simultaneously
- **Backend first** - Always start backend before frontend
- **MongoDB must be connected** - Check backend terminal for connection status

---

## 🛑 To Stop

Press `Ctrl + C` in each terminal to stop the servers.

