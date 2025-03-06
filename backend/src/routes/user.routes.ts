import express from 'express';
import { body } from 'express-validator';
import { updateProfile, updatePassword, uploadProfileImage } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   PUT /api/users/profile
router.put(
  '/profile',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please include a valid email'),
    body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    body('preferredLanguage').optional(),
    body('currency').optional(),
  ],
  updateProfile as express.RequestHandler
);

// @route   PUT /api/users/password
router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  ],
  updatePassword as express.RequestHandler
);

// @route   POST /api/users/profile-image
router.post('/profile-image', uploadProfileImage as express.RequestHandler);

export default router; 