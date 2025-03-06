import express, { Request, Response, RequestHandler } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, googleAuth } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { AuthRequest } from '../types/auth';

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
  register as unknown as RequestHandler
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  login as unknown as RequestHandler
);

// @route   POST /api/auth/google
router.post(
  '/google',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('name').optional(),
    body('image').optional(),
    body('role').optional().isIn(['sender', 'traveler']).withMessage('Invalid role'),
  ],
  googleAuth as unknown as RequestHandler
);

// @route   GET /api/auth/me
router.get('/me', protect as RequestHandler, getMe);

export default router;