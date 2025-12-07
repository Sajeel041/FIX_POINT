import express from 'express';
import ServiceRequest from '../models/ServiceRequest.js';
import Booking from '../models/Booking.js';
import MerchantProfile from '../models/MerchantProfile.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/service-requests/create
// @desc    Create a new service request
// @access  Private (Customer only)
router.post('/create', protect, async (req, res) => {
  try {
    if (!req.user.roles || !req.user.roles.includes('customer')) {
      return res.status(403).json({ message: 'Only customers can create service requests' });
    }

    const { serviceType, issue, location } = req.body;

    const serviceRequest = await ServiceRequest.create({
      customerId: req.user._id,
      serviceType,
      issue,
      location,
      status: 'pending',
    });

    await serviceRequest.populate('customerId', 'name email phone');

    res.status(201).json(serviceRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/service-requests/customer/:id
// @desc    Get all service requests for a customer
// @access  Private
router.get('/customer/:id', protect, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customerId: req.params.id })
      .populate('customerId', 'name email phone')
      .populate('acceptedMerchants.merchantId', 'name email phone')
      .populate('selectedMerchantId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/service-requests/available
// @desc    Get all available service requests for merchants
// @access  Private (Merchant only)
router.get('/available', protect, async (req, res) => {
  try {
    if (!req.user.roles || !req.user.roles.includes('merchant')) {
      return res.status(403).json({ message: 'Only merchants can view available requests' });
    }

    // Get merchant profile to filter by skill category
    const merchantProfile = await MerchantProfile.findOne({ userId: req.user._id });

    if (!merchantProfile) {
      return res.status(404).json({ message: 'Merchant profile not found' });
    }

    // Get pending requests that match merchant's skill category
    // Only show requests that are pending or have offers submitted (not accepted/active/completed)
    // Also exclude requests where this merchant already submitted an offer
    const requests = await ServiceRequest.find({
      status: { $in: ['pending', 'offerSubmitted'] },
      serviceType: merchantProfile.skillCategory,
      // Don't show requests where merchant already accepted
      'acceptedMerchants.merchantId': { $ne: req.user._id },
      // Don't show requests that have been accepted/selected by customer
      selectedMerchantId: null,
    })
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/service-requests/accept
// @desc    Merchant accepts a service request
// @access  Private (Merchant only)
router.post('/accept', protect, async (req, res) => {
  try {
    if (!req.user.roles || !req.user.roles.includes('merchant')) {
      return res.status(403).json({ message: 'Only merchants can accept requests' });
    }

    const { requestId, price, negotiable } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({ message: 'Price is required and must be greater than 0' });
    }

    const serviceRequest = await ServiceRequest.findById(requestId);

    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    if (serviceRequest.status !== 'pending' && serviceRequest.status !== 'offerSubmitted') {
      return res.status(400).json({ message: 'Request is no longer available' });
    }

    // Check if merchant already accepted
    const alreadyAccepted = serviceRequest.acceptedMerchants.some(
      (acc) => acc.merchantId.toString() === req.user._id.toString()
    );

    if (alreadyAccepted) {
      return res.status(400).json({ message: 'You have already accepted this request' });
    }

    // Check if max 10 merchants limit
    if (serviceRequest.acceptedMerchants.length >= 10) {
      return res.status(400).json({ message: 'Maximum 10 merchants can accept this request' });
    }

    // Add merchant to accepted list with price
    serviceRequest.acceptedMerchants.push({
      merchantId: req.user._id,
      price: parseFloat(price),
      negotiable: negotiable || false,
      acceptedAt: new Date(),
    });


    // Update status to offerSubmitted if it was pending
    if (serviceRequest.status === 'pending') {
      serviceRequest.status = 'offerSubmitted';
    }

    await serviceRequest.save();

    await serviceRequest.populate('customerId', 'name email phone');
    await serviceRequest.populate('acceptedMerchants.merchantId', 'name email phone');

    res.json(serviceRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/service-requests/select-merchant
// @desc    Customer selects a merchant from accepted merchants
// @access  Private (Customer only)
router.post('/select-merchant', protect, async (req, res) => {
  try {
    if (!req.user.roles || !req.user.roles.includes('customer')) {
      return res.status(403).json({ message: 'Only customers can select merchants' });
    }

    const { requestId, merchantId } = req.body;

    const serviceRequest = await ServiceRequest.findById(requestId);

    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    if (serviceRequest.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get the accepted merchant entry to get the price
    const acceptedMerchant = serviceRequest.acceptedMerchants.find(
      (acc) => acc.merchantId.toString() === merchantId
    );

    if (!acceptedMerchant) {
      return res.status(400).json({ message: 'Merchant has not accepted this request' });
    }

    // First, update service request status to 'accepted'
    serviceRequest.selectedMerchantId = merchantId;
    serviceRequest.status = 'accepted';
    await serviceRequest.save();

    // Create booking with status 'active' (as per requirements: accepted → active)
    const booking = await Booking.create({
      customerId: req.user._id,
      merchantId: merchantId,
      serviceType: serviceRequest.serviceType,
      price: acceptedMerchant.price,
      address: serviceRequest.location,
      notes: serviceRequest.issue,
      status: 'active',
    });

    // Update service request with booking ID and set to active
    serviceRequest.bookingId = booking._id;
    serviceRequest.status = 'active';
    await serviceRequest.save();

    await booking.populate('customerId', 'name email phone');
    await booking.populate('merchantId', 'name email phone');

    res.json({ serviceRequest, booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/service-requests/:id
// @desc    Get a single service request
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('acceptedMerchants.merchantId', 'name email phone')
      .populate('selectedMerchantId', 'name email phone');

    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

