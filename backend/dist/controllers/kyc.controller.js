"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyKYC = exports.getKYCStatus = exports.submitKYC = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
// @desc    Submit KYC details
// @route   POST /api/kyc/submit
// @access  Private
const submitKYC = async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const { idType, idNumber } = req.body;
        const idImage = (_a = req.files) === null || _a === void 0 ? void 0 : _a.idImage;
        const selfieImage = (_b = req.files) === null || _b === void 0 ? void 0 : _b.selfieImage;
        const addressProofImage = (_c = req.files) === null || _c === void 0 ? void 0 : _c.addressProofImage;
        if (!idType || !idNumber || !idImage || !selfieImage || !addressProofImage) {
            return res.status(400).json({ message: 'Please provide all required documents' });
        }
        const user = await user_model_1.default.findById((_d = req.user) === null || _d === void 0 ? void 0 : _d._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // In a real application, you would:
        // 1. Upload images to cloud storage (e.g., AWS S3)
        // 2. Store image URLs in the database
        // 3. Implement actual verification logic
        // For now, we'll simulate the process
        user.kyc = {
            status: 'pending',
            idType,
            idNumber,
            idImage: 'dummy_id_image_url',
            selfieImage: 'dummy_selfie_url',
            addressProofImage: 'dummy_address_proof_url',
            submittedAt: new Date(),
        };
        await user.save();
        res.status(200).json({
            message: 'KYC documents submitted successfully',
            status: user.kyc.status,
        });
    }
    catch (error) {
        console.error('KYC submission error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.submitKYC = submitKYC;
// @desc    Get KYC status
// @route   GET /api/kyc/status
// @access  Private
const getKYCStatus = async (req, res) => {
    var _a;
    try {
        const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select('kyc');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ kyc: user.kyc });
    }
    catch (error) {
        console.error('Get KYC status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getKYCStatus = getKYCStatus;
// @desc    Update KYC status (Admin only)
// @route   PUT /api/kyc/:userId/verify
// @access  Private (Admin)
const verifyKYC = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, rejectionReason } = req.body;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.kyc.status = status;
        if (status === 'rejected' && rejectionReason) {
            user.kyc.rejectionReason = rejectionReason;
        }
        if (status === 'verified') {
            user.kyc.verifiedAt = new Date();
            user.isVerified = true;
        }
        await user.save();
        res.status(200).json({
            message: `KYC ${status === 'verified' ? 'verified' : 'rejected'} successfully`,
            kyc: user.kyc,
        });
    }
    catch (error) {
        console.error('KYC verification error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.verifyKYC = verifyKYC;
