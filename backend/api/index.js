// This file is used for Vercel serverless deployment
// It exports the Express app for Vercel's serverless functions
import app from '../server.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Ensure MongoDB connection for serverless functions
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB if not already connected
const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined');
    return;
  }

  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB (serverless)');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};

// Connect on module load
connectDB();

// Export the app for Vercel (Express apps work directly)
export default app;

