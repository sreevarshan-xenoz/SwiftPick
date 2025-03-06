"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_middleware_1.protect);
// @route   PUT /api/users/profile
router.put('/profile', [
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Please include a valid email'),
    (0, express_validator_1.body)('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    (0, express_validator_1.body)('preferredLanguage').optional(),
    (0, express_validator_1.body)('currency').optional(),
], user_controller_1.updateProfile);
// @route   PUT /api/users/password
router.put('/password', [
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),
    (0, express_validator_1.body)('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match new password');
        }
        return true;
    }),
], user_controller_1.updatePassword);
// @route   POST /api/users/profile-image
router.post('/profile-image', user_controller_1.uploadProfileImage);
exports.default = router;
