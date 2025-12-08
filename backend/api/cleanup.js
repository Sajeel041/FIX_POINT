// Vercel serverless function for cleanup cron job
// This endpoint is called by Vercel Cron every 6 hours

import app from '../server.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Ensure MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

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
    console.log('✅ Connected to MongoDB (cleanup function)');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};

// This function handles the cleanup request
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Connect to MongoDB
  await connectDB();

  // Import cleanup logic
  const ServiceRequest = (await import('../models/ServiceRequest.js')).default;
  const Booking = (await import('../models/Booking.js')).default;

  try {
    const CLEANUP_SECRET = process.env.CLEANUP_SECRET || 'default-secret-change-in-production';
    const providedSecret = req.headers['x-cleanup-secret'] || req.body.secret;

    // Verify secret key
    if (providedSecret !== CLEANUP_SECRET) {
      return res.status(401).json({ 
        message: 'Unauthorized: Invalid secret key',
        timestamp: new Date().toISOString()
      });
    }

    console.log('🧹 Starting cleanup process at', new Date().toISOString());

    // Delete all service requests
    const serviceRequestsDeleted = await ServiceRequest.deleteMany({});
    console.log(`✅ Deleted ${serviceRequestsDeleted.deletedCount} service requests`);

    // Delete all bookings
    const bookingsDeleted = await Booking.deleteMany({});
    console.log(`✅ Deleted ${bookingsDeleted.deletedCount} bookings`);

    const result = {
      success: true,
      message: 'All logs have been reset successfully',
      timestamp: new Date().toISOString(),
      deleted: {
        serviceRequests: serviceRequestsDeleted.deletedCount,
        bookings: bookingsDeleted.deletedCount,
      }
    };

    console.log('✅ Cleanup completed:', result);
    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Cleanup failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
