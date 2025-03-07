"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const kyc_controller_1 = require("../controllers/kyc.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_middleware_1.protect);
// @route   POST /api/kyc/submit
router.post('/submit', [
    (0, express_validator_1.body)('idType')
        .isIn(['passport', 'driving_license', 'national_id'])
        .withMessage('Invalid ID type'),
    (0, express_validator_1.body)('idNumber').notEmpty().withMessage('ID number is required'),
], kyc_controller_1.submitKYC);
// @route   GET /api/kyc/status
router.get('/status', kyc_controller_1.getKYCStatus);
// @route   PUT /api/kyc/:userId/verify
router.put('/:userId/verify', [
    (0, express_validator_1.body)('status')
        .isIn(['verified', 'rejected'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('rejectionReason')
        .if((0, express_validator_1.body)('status').equals('rejected'))
        .notEmpty()
        .withMessage('Rejection reason is required when rejecting KYC'),
], kyc_controller_1.verifyKYC);
exports.default = router;
