"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawMoney = exports.getTransactions = exports.getWalletBalance = exports.addMoney = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
// @desc    Add money to wallet
// @route   POST /api/wallet/add
// @access  Private
const addMoney = async (req, res) => {
    var _a, _b;
    // Start a session for transaction
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { amount, paymentMethod } = req.body;
        const amountNumber = parseFloat(amount);
        // Validate amount
        if (amountNumber <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }
        // In a real app, this would process the payment through a payment gateway
        // For now, we'll just create a transaction record and update the wallet balance
        // Create transaction record
        const transaction = await transaction_model_1.default.create([
            {
                user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                type: 'credit',
                amount: amountNumber,
                description: `Added ${amountNumber} via ${paymentMethod}`,
                status: 'completed',
                reference: `ADD-${Date.now()}`,
            },
        ], { session });
        // Update user's wallet balance
        const user = await user_model_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'User not found' });
        }
        user.walletBalance = (user.walletBalance || 0) + amountNumber;
        await user.save({ session });
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({
            message: 'Money added to wallet successfully',
            transaction: transaction[0],
            newBalance: user.walletBalance,
        });
    }
    catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        session.endSession();
        console.error('Add money error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.addMoney = addMoney;
// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
const getWalletBalance = async (req, res) => {
    var _a;
    try {
        const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            balance: user.walletBalance || 0,
            currency: user.currency || 'USD',
        });
    }
    catch (error) {
        console.error('Get wallet balance error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getWalletBalance = getWalletBalance;
// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
const getTransactions = async (req, res) => {
    var _a, _b;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const type = req.query.type;
        // Build query
        const query = { user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id };
        if (type && type !== 'all') {
            query.type = type;
        }
        // Get transactions with pagination
        const transactions = await transaction_model_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Get total count for pagination
        const total = await transaction_model_1.default.countDocuments({ user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
        res.json({
            transactions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getTransactions = getTransactions;
// @desc    Withdraw money from wallet
// @route   POST /api/wallet/withdraw
// @access  Private
const withdrawMoney = async (req, res) => {
    var _a, _b;
    // Start a session for transaction
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { amount, withdrawalMethod, accountDetails } = req.body;
        const amountNumber = parseFloat(amount);
        // Validate amount
        if (amountNumber <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }
        // Get user and check balance
        const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'User not found' });
        }
        if ((user.walletBalance || 0) < amountNumber) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        // Create transaction record
        const transaction = await transaction_model_1.default.create([
            {
                user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
                type: 'debit',
                amount: amountNumber,
                description: `Withdrew ${amountNumber} via ${withdrawalMethod}`,
                status: 'completed',
                reference: `WD-${Date.now()}`,
            },
        ], { session });
        // Update user's wallet balance
        user.walletBalance = (user.walletBalance || 0) - amountNumber;
        await user.save({ session });
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({
            message: 'Money withdrawn successfully',
            transaction: transaction[0],
            newBalance: user.walletBalance,
        });
    }
    catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        session.endSession();
        console.error('Withdraw money error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.withdrawMoney = withdrawMoney;
