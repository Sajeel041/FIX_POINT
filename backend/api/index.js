// This file is used for Vercel serverless deployment
// It exports the Express app for Vercel's serverless functions
import app from '../server.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Ensure MongoDB connection for serverless functions
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection options optimized for serverless
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10s
  maxPoolSize: 1, // Maintain up to 1 socket connection for serverless
  minPoolSize: 1, // Maintain at least 1 socket connection
  bufferMaxEntries: 0, // Disable mongoose buffering - fail immediately if not connected
  bufferCommands: false, // Disable mongoose buffering
};

// Connect to MongoDB if not already connected
const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in Vercel environment variables');
    console.error('📝 Please set MONGO_URI in your Vercel project settings');
    throw new Error('MONGO_URI is not defined');
  }

  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log('✅ Connected to MongoDB (serverless)');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

// Middleware to ensure DB connection before handling requests
const ensureConnection = async (req, res, next) => {
  try {
    // Check connection state
    if (mongoose.connection.readyState === 0) {
      // Not connected - try to connect
      console.log('⚠️ MongoDB not connected, attempting connection...');
      await connectDB();
    } else if (mongoose.connection.readyState === 2) {
      // Connecting - wait a bit
      await new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (mongoose.connection.readyState === 1) {
            clearInterval(checkConnection);
            resolve();
          } else if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
            clearInterval(checkConnection);
            resolve(); // Give up and continue (will fail later)
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkConnection);
          resolve();
        }, 5000);
      });
    }
    next();
  } catch (error) {
    console.error('❌ Database connection failed in middleware:', error.message);
    res.status(500).json({ 
      message: 'Database connection failed. Please check server configuration.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Apply connection middleware to all routes
app.use(ensureConnection);

// Try to connect on module load (non-blocking for serverless)
if (MONGO_URI) {
  connectDB().catch((err) => {
    console.error('⚠️ Initial MongoDB connection attempt failed:', err.message);
    console.error('📝 Connection will be retried on first request');
  });
} else {
  console.error('❌ MONGO_URI not found - MongoDB connection will fail');
}

// Export the app for Vercel (Express apps work directly)
export default app;

