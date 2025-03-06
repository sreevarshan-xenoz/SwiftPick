"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const delivery_controller_1 = require("../controllers/delivery.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_middleware_1.protect);
// @route   POST /api/deliveries
// @access  Private (Senders only)
router.post('/', auth_middleware_1.isSender, [
    (0, express_validator_1.body)('itemName').notEmpty().withMessage('Item name is required'),
    (0, express_validator_1.body)('itemDescription').notEmpty().withMessage('Item description is required'),
    (0, express_validator_1.body)('itemWeight').isNumeric().withMessage('Item weight must be a number'),
    (0, express_validator_1.body)('pickupAddress').notEmpty().withMessage('Pickup address is required'),
    (0, express_validator_1.body)('dropAddress').notEmpty().withMessage('Drop address is required'),
    (0, express_validator_1.body)('urgency')
        .isIn(['normal', 'urgent', 'express'])
        .withMessage('Urgency must be normal, urgent, or express'),
    (0, express_validator_1.body)('price').isNumeric().withMessage('Price must be a number'),
], delivery_controller_1.createDelivery);
// @route   GET /api/deliveries/available
// @access  Private (Travelers only)
router.get('/available', auth_middleware_1.isTraveler, [
    (0, express_validator_1.query)('location').optional(),
    (0, express_validator_1.query)('radius').optional().isNumeric().withMessage('Radius must be a number'),
    (0, express_validator_1.query)('maxWeight').optional().isNumeric().withMessage('Max weight must be a number'),
    (0, express_validator_1.query)('urgency').optional(),
    (0, express_validator_1.query)('sortBy').optional(),
], delivery_controller_1.getAvailableDeliveries);
// @route   PUT /api/deliveries/:id/accept
// @access  Private (Travelers only)
router.put('/:id/accept', auth_middleware_1.isTraveler, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid delivery ID'),
], delivery_controller_1.acceptDelivery);
// @route   PUT /api/deliveries/:id/status
// @access  Private (Travelers only)
router.put('/:id/status', auth_middleware_1.isTraveler, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid delivery ID'),
    (0, express_validator_1.body)('status')
        .isIn(['picked_up', 'in_transit', 'delivered', 'cancelled'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('location').notEmpty().withMessage('Location is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
], delivery_controller_1.updateDeliveryStatus);
// @route   GET /api/deliveries/my-deliveries
// @access  Private
router.get('/my-deliveries', delivery_controller_1.getMyDeliveries);
// @route   GET /api/deliveries/:id
// @access  Private
router.get('/:id', [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid delivery ID'),
], delivery_controller_1.getDeliveryById);
exports.default = router;
