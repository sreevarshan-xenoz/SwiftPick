import express, { RequestHandler } from 'express';
import { body, param, query } from 'express-validator';
import {
  createDelivery,
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getMyDeliveries,
  getDeliveryById
} from '../controllers/delivery.controller';
import { protect, isSender, isTraveler } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect as unknown as RequestHandler);

// @route   POST /api/deliveries
// @access  Private (Senders only)
router.post(
  '/',
  isSender as unknown as RequestHandler,
  [
    body('itemName').notEmpty().withMessage('Item name is required'),
    body('itemDescription').notEmpty().withMessage('Item description is required'),
    body('itemWeight').isNumeric().withMessage('Item weight must be a number'),
    body('pickupAddress').notEmpty().withMessage('Pickup address is required'),
    body('dropAddress').notEmpty().withMessage('Drop address is required'),
    body('urgency')
      .isIn(['normal', 'urgent', 'express'])
      .withMessage('Urgency must be normal, urgent, or express'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  createDelivery as unknown as RequestHandler
);

// @route   GET /api/deliveries/available
// @access  Private (Travelers only)
router.get(
  '/available',
  isTraveler as unknown as RequestHandler,
  [
    query('location').optional(),
    query('radius').optional().isNumeric().withMessage('Radius must be a number'),
    query('maxWeight').optional().isNumeric().withMessage('Max weight must be a number'),
    query('urgency').optional(),
    query('sortBy').optional(),
  ],
  getAvailableDeliveries as unknown as RequestHandler
);

// @route   PUT /api/deliveries/:id/accept
// @access  Private (Travelers only)
router.put(
  '/:id/accept',
  isTraveler as unknown as RequestHandler,
  [
    param('id').isMongoId().withMessage('Invalid delivery ID'),
  ],
  acceptDelivery as unknown as RequestHandler
);

// @route   PUT /api/deliveries/:id/status
// @access  Private (Travelers only)
router.put(
  '/:id/status',
  isTraveler as unknown as RequestHandler,
  [
    param('id').isMongoId().withMessage('Invalid delivery ID'),
    body('status')
      .isIn(['picked_up', 'in_transit', 'delivered', 'cancelled'])
      .withMessage('Invalid status'),
    body('location').notEmpty().withMessage('Location is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  updateDeliveryStatus as unknown as RequestHandler
);

// @route   GET /api/deliveries/my-deliveries
// @access  Private
router.get('/my-deliveries', getMyDeliveries as unknown as RequestHandler);

// @route   GET /api/deliveries/:id
// @access  Private
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid delivery ID'),
  ],
  getDeliveryById as unknown as RequestHandler
);

export default router; 