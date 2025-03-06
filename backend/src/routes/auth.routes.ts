import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['sender', 'traveler']).withMessage('Invalid role'),
  ],
  register as express.RequestHandler
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  login as express.RequestHandler
);

// @route   GET /api/auth/me
router.get('/me', protect, getMe as express.RequestHandler);

export default router; 