"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActive = exports.admin = exports.isTraveler = exports.isSender = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const protect = async (req, res, next) => {
    var _a;
    try {
        let token;
        if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        const user = await user_model_1.default.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = {
            id: user.id,
            role: user.role,
            accountStatus: user.accountStatus
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
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
const admin = async (req, res, next) => {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.admin = admin;
const isActive = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.accountStatus) === 'active') {
        next();
    }
    else {
        res.status(403).json({ message: 'Account is not active' });
    }
};
exports.isActive = isActive;
