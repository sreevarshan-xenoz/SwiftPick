import { Router } from 'express';
import {
  addBankAccount,
  getBankAccounts,
  setDefaultAccount,
  deleteBankAccount,
  verifyBankAccount
} from '../controllers/bank.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = Router();

// @route   POST /api/bank/add
router.post('/add', protect, addBankAccount);

// @route   GET /api/ban
// 
//k/accounts
router.get('/accounts', protect, getBankAccounts);

// @route   PUT /api/bank/default/:accountId
router.put('/default/:accountId', protect, setDefaultAccount);

// @route   DELETE /api/bank/:accountId
router.delete('/:accountId', protect, deleteBankAccount);

// @route   PUT /api/bank/:userId/:accountId/verify
router.put('/:userId/:accountId/verify', protect, admin, verifyBankAccount);

export default router;