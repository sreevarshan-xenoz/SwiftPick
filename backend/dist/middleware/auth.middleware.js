"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActive = exports.isTraveler = exports.isSender = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const protect = async (req, res, next) => {
    let token;
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Get user from the token
            req.user = await user_model_1.default.findById(decoded.id).select('-password');
            next();
        }
        catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
exports.protect = protect;
// Middleware to check if user is a sender
const isSender = (req, res, next) => {
    if (req.user && req.user.role === 'sender') {
        next();
    }
    else {
        res.status(403).json({ message: 'Not authorized, sender access required' });
    }
};
exports.isSender = isSender;
// Middleware to check if user is a traveler
const isTraveler = (req, res, next) => {
    if (req.user && req.user.role === 'traveler') {
        next();
    }
    else {
        res.status(403).json({ message: 'Not authorized, traveler access required' });
    }
};
exports.isTraveler = isTraveler;
// Middleware to check if account is active
const isActive = (req, res, next) => {
    if (req.user && req.user.accountStatus === 'active') {
        next();
    }
    else {
        res.status(403).json({ message: 'Account is not active' });
    }
};
exports.isActive = isActive;
