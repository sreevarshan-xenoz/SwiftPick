"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.googleAuth = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_utils_1 = require("../utils/jwt.utils");
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, phone, password, role } = req.body;
        // Check if user already exists
        const userExists = await user_model_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = await user_model_1.default.create({
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
                token: (0, jwt_utils_1.generateToken)(user),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // Find user by email
        const user = await user_model_1.default.findOne({ email }).select('+password');
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
            token: (0, jwt_utils_1.generateToken)(user),
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.login = login;
// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, name, image, role } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        // Check if user exists
        let user = await user_model_1.default.findOne({ email });
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
        }
        else {
            // User doesn't exist, create a new account
            // Get the preferred role from the request or default to 'sender'
            const role = req.body.role || 'sender';
            // Create a random password for the user (they can reset it later)
            const randomPassword = Math.random().toString(36).slice(-8);
            user = await user_model_1.default.create({
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
            token: (0, jwt_utils_1.generateToken)(user),
        });
    }
    catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.googleAuth = googleAuth;
// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    var _a;
    try {
        const authReq = req;
        const user = await user_model_1.default.findById((_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getMe = getMe;
