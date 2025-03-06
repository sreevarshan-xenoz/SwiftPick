import { Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';
import { AuthRequest } from '../types/auth';

// @desc    Add money to wallet
// @route   POST /api/wallet/add
// @access  Private
export const addMoney = async (req: AuthRequest, res: Response) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);
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
    const transaction = await Transaction.create(
      [
        {
          user: req.user?._id,
          type: 'credit',
          amount: amountNumber,
          description: `Added ${amountNumber} via ${paymentMethod}`,
          status: 'completed',
          reference: `ADD-${Date.now()}`,
        },
      ],
      { session }
    );

    // Update user's wallet balance
    const user = await User.findById(req.user?._id).session(session);
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
  } catch (error: any) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error('Add money error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
export const getWalletBalance = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      balance: user.walletBalance || 0,
      currency: user.currency || 'USD',
    });
  } catch (error: any) {
    console.error('Get wallet balance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type as string;

    // Build query
    const query: any = { user: req.user?._id };
    if (type && type !== 'all') {
      query.type = type;
    }

    // Get transactions with pagination
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Transaction.countDocuments({ user: req.user?._id });

    res.json({
      transactions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Withdraw money from wallet
// @route   POST /api/wallet/withdraw
// @access  Private
export const withdrawMoney = async (req: AuthRequest, res: Response) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);
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
    const user = await User.findById(req.user?._id).session(session);
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
    const transaction = await Transaction.create(
      [
        {
          user: req.user?._id,
          type: 'debit',
          amount: amountNumber,
          description: `Withdrew ${amountNumber} via ${withdrawalMethod}`,
          status: 'completed',
          reference: `WD-${Date.now()}`,
        },
      ],
      { session }
    );

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
  } catch (error: any) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error('Withdraw money error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 