import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import merchantRoutes from './routes/merchant.js';
import bookingRoutes from './routes/booking.js';
import serviceRoutes from './routes/service.js';
import serviceRequestRoutes from './routes/serviceRequest.js';
import chatRoutes from './routes/chat.js';
import cleanupRoutes from './routes/cleanup.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/cleanup', cleanupRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FixPoint API is running' });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection function
const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env file');
    console.error('📝 Please create a .env file in the backend folder with your MongoDB Atlas connection string');
    console.error('📖 See SETUP_MONGODB.md for detailed instructions');
    throw new Error('MONGO_URI is not defined');
  }

  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('📝 Please check your MONGO_URI in .env file');
    console.error('📖 See SETUP_MONGODB.md for help');
    throw error;
  }
};

// Only start server if not in Vercel serverless environment
// Vercel will use the api/index.js file instead
if (process.env.VERCEL !== '1') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}

export default app;
