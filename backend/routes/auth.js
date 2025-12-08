import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import MerchantProfile from '../models/MerchantProfile.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, roles, phone, merchantData } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Support both single role (backward compatibility) and roles array
    let userRoles = roles || (role ? [role] : ['customer']);

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      roles: userRoles,
      phone,
    });

    // If merchant role is included, create merchant profile
    if (userRoles.includes('merchant') && merchantData) {
      await MerchantProfile.create({
        userId: user._id,
        skillCategory: merchantData.skillCategory,
        yearsExperience: merchantData.yearsExperience,
        about: merchantData.about || '',
        cnic: merchantData.cnic || '',
        profilePicture: merchantData.profilePicture || '',
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roles: user.roles,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    let token;
    try {
      token = generateToken(user._id);
    } catch (jwtError) {
      console.error('❌ JWT generation error:', jwtError);
      return res.status(500).json({ message: 'Token generation failed' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || (user.roles && user.roles[0]) || 'customer',
      roles: user.roles || [user.role || 'customer'],
      token,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      message: error.message || 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // Ensure roles array exists
    if (!user.roles || user.roles.length === 0) {
      user.roles = [user.role || 'customer'];
      await user.save();
    }
    
    // If merchant role is included, include profile
    if (user.roles.includes('merchant')) {
      const profile = await MerchantProfile.findOne({ userId: user._id });
      return res.json({ user, profile });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/add-role
// @desc    Add a role to user
// @access  Private
router.post('/add-role', protect, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['customer', 'merchant'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user.roles) {
      user.roles = [user.role || 'customer'];
    }
    
    if (!user.roles.includes(role)) {
      user.roles.push(role);
      await user.save();
      
      // If adding merchant role, create profile if it doesn't exist
      if (role === 'merchant') {
        const existingProfile = await MerchantProfile.findOne({ userId: user._id });
        if (!existingProfile) {
          await MerchantProfile.create({
            userId: user._id,
            skillCategory: 'Electrician', // Default, user can update
            yearsExperience: 0,
          });
        }
      }
    }
    
    res.json({ user, message: `Role ${role} added successfully` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
