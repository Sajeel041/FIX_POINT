import express from 'express';
import ServiceRequest from '../models/ServiceRequest.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

const router = express.Router();

// Secret key to protect the cleanup endpoint (optional but recommended)
const CLEANUP_SECRET = process.env.CLEANUP_SECRET || 'default-secret-change-in-production';

// @route   POST /api/cleanup/reset-all
// @desc    Reset all service requests and bookings (run every 6 hours)
// @access  Protected by secret key
router.post('/reset-all', async (req, res) => {
  try {
    // Verify secret key for security
    const providedSecret = req.headers['x-cleanup-secret'] || req.body.secret;
    
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
    res.json(result);
  } catch (error) {
    console.error('❌ Cleanup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Cleanup failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// @route   GET /api/cleanup/status
// @desc    Get cleanup status (for testing)
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const serviceRequestCount = await ServiceRequest.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    res.json({
      status: 'OK',
      counts: {
        serviceRequests: serviceRequestCount,
        bookings: bookingCount,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get status',
      error: error.message 
    });
  }
});

export default router;
