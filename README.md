# FixPoint - Home Service Marketplace

A full-stack MERN application inspired by Uber's UI/UX, connecting customers with home service technicians (electricians, plumbers, AC repair workers, etc.).

## 🚀 Features

### Customer Features
- Browse and search for technicians
- View merchant portfolios with ratings, experience, and previous work
- Book services with address and notes
- Track booking status
- View booking history

### Merchant Features
- Create and manage profile
- Add portfolio with previous work images
- Set pricing and availability
- View and manage bookings
- Update booking status (accept, in-progress, complete)

## 📦 Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- React Router for navigation
- Framer Motion for animations
- Axios for API calls
- React Hot Toast for notifications
- Context API for state management

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
FixPoint/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── MerchantProfile.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── merchant.js
│   │   ├── booking.js
│   │   └── service.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Merchants
- `GET /api/merchants` - Get all merchants
- `GET /api/merchants/:id` - Get merchant by ID
- `POST /api/merchants/update` - Update merchant profile
- `POST /api/merchants/portfolio` - Update portfolio images

### Bookings
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/user/:id` - Get user bookings
- `GET /api/bookings/merchant/:id` - Get merchant bookings
- `PATCH /api/bookings/status` - Update booking status

### Services
- `GET /api/services` - Get all services

## 🚢 Deployment

### Frontend (Vercel)

1. Build the project:
```bash
cd frontend
npm run build
```

2. Deploy to Vercel:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable: `VITE_API_URL=your_backend_url/api`

### Backend (Railway/Render)

1. Set up environment variables in your hosting platform:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (usually auto-set)
   - Cloudinary credentials (if using)

2. Deploy:
   - Connect your GitHub repository
   - Set start command: `npm start`
   - Ensure MongoDB Atlas allows connections from your hosting IP

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Features Overview

- **Uber-inspired UI**: Modern, clean interface with smooth animations
- **Role-based Access**: Separate dashboards for customers and merchants
- **Real-time Updates**: Booking status updates in real-time
- **Responsive Design**: Mobile-first approach with bottom navigation
- **Secure Authentication**: JWT-based authentication with protected routes
- **Portfolio Management**: Merchants can showcase their work
- **Booking Flow**: Step-by-step booking process similar to Uber

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for home service marketplace

---

**Note**: Make sure to update the MongoDB connection string and JWT secret before deploying to production!

