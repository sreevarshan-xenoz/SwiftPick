"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// @route   POST /api/auth/register
router.post('/register', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
    (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role').optional().isIn(['sender', 'traveler']).withMessage('Invalid role'),
], auth_controller_1.register);
// @route   POST /api/auth/login
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
    (0, express_validator_1.body)('password').exists().withMessage('Password is required'),
], auth_controller_1.login);
// @route   POST /api/auth/google
router.post('/google', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
    (0, express_validator_1.body)('name').optional(),
    (0, express_validator_1.body)('image').optional(),
    (0, express_validator_1.body)('role').optional().isIn(['sender', 'traveler']).withMessage('Invalid role'),
], auth_controller_1.googleAuth);
// @route   GET /api/auth/me
router.get('/me', auth_middleware_1.protect, auth_controller_1.getMe);
exports.default = router;
