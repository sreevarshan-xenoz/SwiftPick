import express, { RequestHandler } from 'express';
import { body } from 'express-validator';
import { submitKYC, getKYCStatus, verifyKYC } from '../controllers/kyc.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect as unknown as RequestHandler);

// @route   POST /api/kyc/submit
router.post(
  '/submit',
  [
    body('idType')
      .isIn(['passport', 'driving_license', 'national_id'])
      .withMessage('Invalid ID type'),
    body('idNumber').notEmpty().withMessage('ID number is required'),
  ],
  submitKYC as unknown as RequestHandler
);

// @route   GET /api/kyc/status
router.get('/status', getKYCStatus as unknown as RequestHandler);

// @route   PUT /api/kyc/:userId/verify
router.put(
  '/:userId/verify',
  [
    body('status')
      .isIn(['verified', 'rejected'])
      .withMessage('Invalid status'),
    body('rejectionReason')
      .if(body('status').equals('rejected'))
      .notEmpty()
      .withMessage('Rejection reason is required when rejecting KYC'),
  ],
  verifyKYC as unknown as RequestHandler
);

export default router; 