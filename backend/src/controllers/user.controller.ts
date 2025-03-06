import { Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/user.model';
import { AuthRequest } from '../types/auth';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, preferredLanguage, currency } = req.body;

    // Find user
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (currency) user.currency = currency;

    // Save updated user
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      preferredLanguage: updatedUser.preferredLanguage,
      currency: updatedUser.currency,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(req.user?._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload profile image
// @route   POST /api/users/profile-image
// @access  Private
export const uploadProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    // In a real implementation, this would handle file upload
    // For now, we'll just update the profileImage field with a URL
    
    // Mock image URL (in a real app, this would be the uploaded file URL)
    const imageUrl = `https://example.com/profile-images/${req.user?._id}-${Date.now()}.jpg`;
    
    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { profileImage: imageUrl },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      profileImage: imageUrl,
      message: 'Profile image updated successfully',
    });
  } catch (error: any) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 