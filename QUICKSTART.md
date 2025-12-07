# FixPoint - Quick Start Guide

## 🚀 Getting Started

### Step 1: Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fixpoint?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

4. **Start backend server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 2: Frontend Setup

1. **Open a new terminal and navigate to frontend folder:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start frontend development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📝 First Steps

1. **Create a Customer Account:**
   - Go to `/signup`
   - Select "Customer" role
   - Fill in the form and sign up

2. **Create a Merchant Account:**
   - Go to `/signup`
   - Select "Merchant" role
   - Fill in all required fields including:
     - CNIC
     - Skill Category
     - Years of Experience
     - Price per Service

3. **Test the Flow:**
   - Login as customer
   - Browse merchants on dashboard
   - Click "Book a Service"
   - Select service type
   - Choose a merchant
   - Confirm booking

## 🔧 Troubleshooting

### Backend Issues

- **MongoDB Connection Error:**
  - Check your MongoDB Atlas connection string
  - Ensure IP whitelist includes `0.0.0.0/0` for development
  - Verify username and password are correct

- **Port Already in Use:**
  - Change PORT in `.env` file
  - Or kill the process using port 5000

### Frontend Issues

- **API Connection Error:**
  - Verify backend is running
  - Check `VITE_API_URL` in `.env`
  - Ensure CORS is enabled in backend

- **Build Errors:**
  - Delete `node_modules` and reinstall
  - Clear Vite cache: `rm -rf node_modules/.vite`

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_API_URL=your_backend_url/api`
4. Deploy

### Backend (Railway/Render)

1. Push code to GitHub
2. Create new project in Railway/Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy

## 📚 Key Features

✅ User authentication (Customer & Merchant roles)
✅ Merchant portfolio management
✅ Service booking flow
✅ Booking status tracking
✅ Responsive mobile-first design
✅ Uber-inspired UI/UX
✅ Framer Motion animations
✅ Toast notifications

## 🎯 Next Steps

- Add image upload functionality (Cloudinary integration)
- Implement real-time notifications
- Add payment gateway integration
- Enhance merchant search and filtering
- Add review and rating system

