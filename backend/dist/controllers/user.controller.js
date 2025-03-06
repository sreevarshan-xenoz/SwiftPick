"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileImage = exports.updatePassword = exports.updateProfile = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/user.model"));
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    var _a;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, phone, preferredLanguage, currency } = req.body;
        // Find user
        const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if email is already taken
        if (email && email !== user.email) {
            const emailExists = await user_model_1.default.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        // Update user fields
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (phone)
            user.phone = phone;
        if (preferredLanguage)
            user.preferredLanguage = preferredLanguage;
        if (currency)
            user.currency = currency;
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
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updateProfile = updateProfile;
// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res) => {
    var _a;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { currentPassword, newPassword } = req.body;
        // Find user
        const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select('+password');
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
    }
    catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updatePassword = updatePassword;
// @desc    Upload profile image
// @route   POST /api/users/profile-image
// @access  Private
const uploadProfileImage = async (req, res) => {
    var _a, _b;
    try {
        // In a real implementation, this would handle file upload
        // For now, we'll just update the profileImage field with a URL
        // Mock image URL (in a real app, this would be the uploaded file URL)
        const imageUrl = `https://example.com/profile-images/${(_a = req.user) === null || _a === void 0 ? void 0 : _a._id}-${Date.now()}.jpg`;
        // Find and update user
        const user = await user_model_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b._id, { profileImage: imageUrl }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            profileImage: imageUrl,
            message: 'Profile image updated successfully',
        });
    }
    catch (error) {
        console.error('Upload profile image error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.uploadProfileImage = uploadProfileImage;
