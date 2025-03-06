"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const wallet_controller_1 = require("../controllers/wallet.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_middleware_1.protect);
// @route   POST /api/wallet/add
// @access  Private
router.post('/add', [
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .custom((value) => {
        if (parseFloat(value) <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        return true;
    }),
    (0, express_validator_1.body)('paymentMethod')
        .notEmpty()
        .withMessage('Payment method is required')
        .isIn(['credit_card', 'debit_card', 'bank_transfer', 'paypal'])
        .withMessage('Invalid payment method'),
], wallet_controller_1.addMoney);
// @route   GET /api/wallet/balance
// @access  Private
router.get('/balance', wallet_controller_1.getWalletBalance);
// @route   GET /api/wallet/transactions
// @access  Private
router.get('/transactions', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('type').optional().isIn(['credit', 'debit', 'all']).withMessage('Type must be credit, debit, or all'),
], wallet_controller_1.getTransactions);
// @route   POST /api/wallet/withdraw
// @access  Private
router.post('/withdraw', [
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .custom((value) => {
        if (parseFloat(value) <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        return true;
    }),
    (0, express_validator_1.body)('withdrawalMethod')
        .notEmpty()
        .withMessage('Withdrawal method is required')
        .isIn(['bank_transfer', 'paypal'])
        .withMessage('Invalid withdrawal method'),
    (0, express_validator_1.body)('accountDetails').notEmpty().withMessage('Account details are required'),
], wallet_controller_1.withdrawMoney);
exports.default = router;
