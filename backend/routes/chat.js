import express from 'express';
import Message from '../models/Message.js';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/chat/send
// @desc    Send a message
// @access  Private
router.post('/send', protect, async (req, res) => {
  try {
    const { bookingId, message } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    // Verify booking exists and user is part of it
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.error('Booking not found:', bookingId);
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure booking has populated customer and merchant IDs
    if (!booking.customerId || !booking.merchantId) {
      // Populate if not already populated
      await booking.populate('customerId', '_id');
      await booking.populate('merchantId', '_id');
    }

    // Check if user is customer or merchant in this booking (handle both ObjectId and string)
    const userId = req.user._id.toString();
    const customerId = booking.customerId._id ? booking.customerId._id.toString() : booking.customerId.toString();
    const merchantId = booking.merchantId._id ? booking.merchantId._id.toString() : booking.merchantId.toString();
    
    const isCustomer = userId === customerId;
    const isMerchant = userId === merchantId;

    if (!isCustomer && !isMerchant) {
      console.error('Authorization failed:', {
        userId,
        customerId,
        merchantId,
        bookingId: booking._id
      });
      return res.status(403).json({ message: 'Not authorized to send messages for this booking' });
    }

    // Determine receiver
    const receiverId = isCustomer ? booking.merchantId : booking.customerId;

    // Create message
    const newMessage = await Message.create({
      bookingId,
      senderId: req.user._id,
      receiverId,
      message: message.trim(),
    });

    await newMessage.populate('senderId', 'name email');
    await newMessage.populate('receiverId', 'name email');

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/chat/booking/:bookingId
// @desc    Get all messages for a booking
// @access  Private
router.get('/booking/:bookingId', protect, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Verify booking exists and user is part of it
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure booking has populated customer and merchant IDs
    if (!booking.customerId || !booking.merchantId) {
      // Populate if not already populated
      await booking.populate('customerId', '_id');
      await booking.populate('merchantId', '_id');
    }

    // Check if user is customer or merchant in this booking (handle both ObjectId and string)
    const userId = req.user._id.toString();
    const customerId = booking.customerId._id ? booking.customerId._id.toString() : booking.customerId.toString();
    const merchantId = booking.merchantId._id ? booking.merchantId._id.toString() : booking.merchantId.toString();
    
    const isCustomer = userId === customerId;
    const isMerchant = userId === merchantId;

    if (!isCustomer && !isMerchant) {
      return res.status(403).json({ message: 'Not authorized to view messages for this booking' });
    }

    // Get all messages for this booking
    const messages = await Message.find({ bookingId })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ createdAt: 1 }); // Oldest first

    // Mark messages as read if they're for the current user
    await Message.updateMany(
      {
        bookingId,
        receiverId: req.user._id,
        read: false,
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/chat/unread-count
// @desc    Get unread message count for user
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiverId: req.user._id,
      read: false,
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/chat/latest-unread
// @desc    Get the latest unread message for user
// @access  Private
router.get('/latest-unread', protect, async (req, res) => {
  try {
    const latestUnread = await Message.findOne({
      receiverId: req.user._id,
      read: false,
    })
      .populate('senderId', 'name email')
      .populate({
        path: 'bookingId',
        select: 'serviceType status customerId merchantId',
        populate: [
          { path: 'customerId', select: 'name email' },
          { path: 'merchantId', select: 'name email' }
        ]
      })
      .sort({ createdAt: -1 }); // Most recent first

    if (!latestUnread) {
      return res.json({ message: null });
    }

    res.json({
      message: latestUnread,
      booking: latestUnread.bookingId,
    });
  } catch (error) {
    console.error('Error fetching latest unread message:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;


