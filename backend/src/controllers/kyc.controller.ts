import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import User from '../models/user.model';

// @desc    Submit KYC details
// @route   POST /api/kyc/submit
// @access  Private
export const submitKYC = async (req: AuthRequest, res: Response) => {
  try {
    const { idType, idNumber } = req.body;
    const idImage = req.files?.idImage;
    const selfieImage = req.files?.selfieImage;
    const addressProofImage = req.files?.addressProofImage;

    if (!idType || !idNumber || !idImage || !selfieImage || !addressProofImage) {
      return res.status(400).json({ message: 'Please provide all required documents' });
    }

    const user = await User.findById(req.user?._id);
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
  } catch (error: any) {
    console.error('KYC submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get KYC status
// @route   GET /api/kyc/status
// @access  Private
export const getKYCStatus = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('kyc');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ kyc: user.kyc });
  } catch (error: any) {
    console.error('Get KYC status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update KYC status (Admin only)
// @route   PUT /api/kyc/:userId/verify
// @access  Private (Admin)
export const verifyKYC = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { status, rejectionReason } = req.body;

    const user = await User.findById(userId);
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
  } catch (error: any) {
    console.error('KYC verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 