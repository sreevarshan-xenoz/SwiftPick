import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt.utils';
import { AuthRequest } from '../types/auth';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'sender',
      accountStatus: 'active', // For demo purposes, set to active by default
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(403).json({ message: `Your account is ${user.accountStatus}` });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance,
      preferredLanguage: user.preferredLanguage,
      currency: user.currency,
      isVerified: user.isVerified,
      accountStatus: user.accountStatus,
      token: generateToken(user),
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { name, email, image } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, log them in
      // Check if account is active
      if (user.accountStatus !== 'active') {
        return res.status(403).json({ message: `Your account is ${user.accountStatus}` });
      }

      // Update user's profile image if provided and not already set
      if (image && !user.profileImage) {
        user.profileImage = image;
        await user.save();
      }
    } else {
      // User doesn't exist, create a new account
      // Get the preferred role from the request or default to 'sender'
      const role = req.body.role || 'sender';

      // Create a random password for the user (they can reset it later)
      const randomPassword = Math.random().toString(36).slice(-8);

      user = await User.create({
        name,
        email,
        password: randomPassword,
        role,
        profileImage: image,
        accountStatus: 'active',
        isVerified: true, // Since they're verified through Google
        phone: '', // This can be updated later
      });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        walletBalance: user.walletBalance,
        profileImage: user.profileImage,
      },
      token: generateToken(user),
    });
  } catch (error: any) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance,
      preferredLanguage: user.preferredLanguage,
      currency: user.currency,
      isVerified: user.isVerified,
      accountStatus: user.accountStatus,
      joinedDate: user.joinedDate,
      profileImage: user.profileImage,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 