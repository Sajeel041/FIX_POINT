import express from 'express';
import Booking from '../models/Booking.js';
import ServiceRequest from '../models/ServiceRequest.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/bookings/create
// @desc    Create a new booking
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { merchantId, serviceType, price, address, notes } = req.body;

    if (!req.user.roles || !req.user.roles.includes('customer')) {
      return res.status(403).json({ message: 'Only customers can create bookings' });
    }

    const booking = await Booking.create({
      customerId: req.user._id,
      merchantId,
      serviceType,
      price,
      address,
      notes,
      status: 'pending',
    });

    await booking.populate('customerId', 'name email phone');
    await booking.populate('merchantId', 'name email phone');

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/bookings/user/:id
// @desc    Get bookings for a user (only active bookings - completed are removed from active logs)
// @access  Private
router.get('/user/:id', protect, async (req, res) => {
  try {
    // Only return active bookings (completed bookings are removed from active logs)
    const bookings = await Booking.find({ 
      customerId: req.params.id,
      status: { $ne: 'completed' } // Exclude completed bookings
    })
      .populate('merchantId', 'name email phone')
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/merchant/:id
// @desc    Get bookings for a merchant (only active jobs - completed are removed from active logs)
// @access  Private
router.get('/merchant/:id', protect, async (req, res) => {
  try {
    // Only return active bookings (completed bookings are removed from active logs)
    const bookings = await Booking.find({ 
      merchantId: req.params.id,
      status: { $ne: 'completed' } // Exclude completed bookings
    })
      .populate('customerId', 'name email phone')
      .populate('merchantId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get a single booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('merchantId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization - user must be either customer or merchant of this booking
    const customerId = booking.customerId._id ? booking.customerId._id.toString() : booking.customerId.toString();
    const merchantId = booking.merchantId._id ? booking.merchantId._id.toString() : booking.merchantId.toString();
    const userId = req.user._id.toString();

    const isCustomer = userId === customerId;
    const isMerchant = userId === merchantId;

    if (!isCustomer && !isMerchant) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/bookings/status
// @desc    Update booking status
// @access  Private
router.patch('/status', protect, async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization - handle both ObjectId and populated objects
    const merchantIdStr = booking.merchantId._id 
      ? booking.merchantId._id.toString() 
      : booking.merchantId.toString();
    const customerIdStr = booking.customerId._id 
      ? booking.customerId._id.toString() 
      : booking.customerId.toString();
    const userIdStr = req.user._id.toString();

    if (
      req.user.roles && req.user.roles.includes('merchant') &&
      merchantIdStr !== userIdStr
    ) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    if (
      req.user.roles && req.user.roles.includes('customer') &&
      customerIdStr !== userIdStr
    ) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    // If booking is marked as completed, also update the associated ServiceRequest
    if (status === 'completed') {
      await ServiceRequest.updateOne(
        { bookingId: booking._id },
        { status: 'completed' }
      );
    }

    await booking.populate('customerId', 'name email phone');
    await booking.populate('merchantId', 'name email phone');

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(400).json({ 
      message: error.message || 'Failed to update booking status' 
    });
  }
});

export default router;

