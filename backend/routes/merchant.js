import express from 'express';
import MerchantProfile from '../models/MerchantProfile.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/merchants
// @desc    Get all merchants
// @access  Public
router.get('/', async (req, res) => {
  try {
    const merchants = await MerchantProfile.find()
      .populate('userId', 'name email phone')
      .sort({ rating: -1, createdAt: -1 });

    res.json(merchants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/merchants/:id
// @desc    Get merchant by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const merchant = await MerchantProfile.findOne({ userId: req.params.id })
      .populate('userId', 'name email phone');

    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    res.json(merchant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/merchants/update
// @desc    Update merchant profile
// @access  Private (Merchant only)
router.post('/update', protect, authorize('merchant'), async (req, res) => {
  try {
    const {
      skillCategory,
      yearsExperience,
      about,
      price,
      availability,
      certifications,
    } = req.body;

    let profile = await MerchantProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Merchant profile not found' });
    }

    // Update fields
    if (skillCategory) profile.skillCategory = skillCategory;
    if (yearsExperience !== undefined) profile.yearsExperience = yearsExperience;
    if (about !== undefined) profile.about = about;
    if (price !== undefined) profile.price = price;
    if (availability) profile.availability = availability;
    if (certifications) profile.certifications = certifications;

    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/merchants/portfolio
// @desc    Update merchant portfolio (images, profile picture)
// @access  Private (Merchant only)
router.post('/portfolio', protect, authorize('merchant'), async (req, res) => {
  try {
    const { profilePicture, previousWorkImages } = req.body;

    let profile = await MerchantProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Merchant profile not found' });
    }

    if (profilePicture) profile.profilePicture = profilePicture;
    if (previousWorkImages) profile.previousWorkImages = previousWorkImages;

    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

