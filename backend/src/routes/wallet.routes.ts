import express, { RequestHandler } from 'express';
import { body, query } from 'express-validator';
import {
  addMoney,
  getWalletBalance,
  getTransactions,
  withdrawMoney
} from '../controllers/wallet.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect as unknown as RequestHandler);

// @route   POST /api/wallet/add
// @access  Private
router.post(
  '/add',
  [
    body('amount')
      .isNumeric()
      .withMessage('Amount must be a number')
      .custom((value) => {
        if (parseFloat(value) <= 0) {
          throw new Error('Amount must be greater than 0');
        }
        return true;
      }),
    body('paymentMethod')
      .notEmpty()
      .withMessage('Payment method is required')
      .isIn(['credit_card', 'debit_card', 'bank_transfer', 'paypal'])
      .withMessage('Invalid payment method'),
  ],
  addMoney as unknown as RequestHandler
);

// @route   GET /api/wallet/balance
// @access  Private
router.get('/balance', getWalletBalance as unknown as RequestHandler);

// @route   GET /api/wallet/transactions
// @access  Private
router.get(
  '/transactions',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('type').optional().isIn(['credit', 'debit', 'all']).withMessage('Type must be credit, debit, or all'),
  ],
  getTransactions as unknown as RequestHandler
);

// @route   POST /api/wallet/withdraw
// @access  Private
router.post(
  '/withdraw',
  [
    body('amount')
      .isNumeric()
      .withMessage('Amount must be a number')
      .custom((value) => {
        if (parseFloat(value) <= 0) {
          throw new Error('Amount must be greater than 0');
        }
        return true;
      }),
    body('withdrawalMethod')
      .notEmpty()
      .withMessage('Withdrawal method is required')
      .isIn(['bank_transfer', 'paypal'])
      .withMessage('Invalid withdrawal method'),
    body('accountDetails').notEmpty().withMessage('Account details are required'),
  ],
  withdrawMoney as unknown as RequestHandler
);

export default router; 