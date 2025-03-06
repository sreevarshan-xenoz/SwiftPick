import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SuccessPopup } from '../common/SuccessPopup';

interface KYCStatus {
  status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  idType?: 'passport' | 'driving_license' | 'national_id';
  idNumber?: string;
  rejectionReason?: string;
  submittedAt?: string;
  verifiedAt?: string;
}

export default function KYCVerification() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    idImage: null as File | null,
    selfieImage: null as File | null,
    addressProofImage: null as File | null,
  });

  useEffect(() => {
    fetchKYCStatus();
  }, [session]);

  const fetchKYCStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/kyc/status', {
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      });
      const data = await response.json();
      setKycStatus(data.kyc);
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({
        ...prev,
        [type]: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('idType', formData.idType);
      formDataToSend.append('idNumber', formData.idNumber);
      if (formData.idImage) formDataToSend.append('idImage', formData.idImage);
      if (formData.selfieImage) formDataToSend.append('selfieImage', formData.selfieImage);
      if (formData.addressProofImage) formDataToSend.append('addressProofImage', formData.addressProofImage);

      const response = await fetch('http://localhost:5000/api/kyc/submit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to submit KYC');

      setSuccess(true);
      fetchKYCStatus();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (!kycStatus) return <LoadingSpinner />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">KYC Verification</h2>

      {kycStatus.status === 'verified' ? (
        <div className="text-center">
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('verified')}`}>
              ✓ Verified
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Your KYC verification is complete. Verified on {new Date(kycStatus.verifiedAt!).toLocaleDateString()}
          </p>
        </div>
      ) : kycStatus.status === 'pending' ? (
        <div className="text-center">
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('pending')}`}>
              ⏳ Under Review
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Your KYC verification is under review. Submitted on {new Date(kycStatus.submittedAt!).toLocaleDateString()}
          </p>
        </div>
      ) : kycStatus.status === 'rejected' ? (
        <div className="text-center mb-6">
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('rejected')}`}>
              ✕ Rejected
            </span>
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4">{kycStatus.rejectionReason}</p>
          <p className="text-gray-600 dark:text-gray-300">Please submit your documents again.</p>
        </div>
      ) : null}

      {(kycStatus.status === 'not_submitted' || kycStatus.status === 'rejected') && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Type
            </label>
            <select
              value={formData.idType}
              onChange={(e) => setFormData(prev => ({ ...prev, idType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            >
              <option value="">Select ID Type</option>
              <option value="passport">Passport</option>
              <option value="driving_license">Driving License</option>
              <option value="national_id">National ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Number
            </label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'idImage')}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selfie with ID
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'selfieImage')}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address Proof
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'addressProofImage')}
              className="w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Submit Documents'}
          </button>
        </form>
      )}

      {success && (
        <SuccessPopup message="KYC documents submitted successfully!" />
      )}
    </div>
  );
} 