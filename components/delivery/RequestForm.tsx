import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SuccessPopup } from '../common/SuccessPopup';
import { BackButton } from '../common/BackButton';

interface DeliveryRequest {
  itemName: string;
  itemDescription: string;
  itemWeight: string;
  pickupAddress: string;
  dropAddress: string;
  urgency: 'normal' | 'urgent' | 'express';
  expectedPrice: string;
  deliveryType: 'doorstep' | 'pickup_point' | 'flexible';
  packageSize: 'small' | 'medium' | 'large';
  fragile: boolean;
  distance?: number;
  estimatedTime?: string;
}

export default function RequestForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<DeliveryRequest>({
    itemName: '',
    itemDescription: '',
    itemWeight: '',
    pickupAddress: '',
    dropAddress: '',
    urgency: 'normal',
    expectedPrice: '',
    deliveryType: 'flexible',
    packageSize: 'medium',
    fragile: false,
  });
  const [distance, setDistance] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

  // Calculate distance when addresses change
  useEffect(() => {
    if (formData.pickupAddress && formData.dropAddress) {
      // This would be replaced with actual API calls to calculate distance
      // For now, just simulate a calculation
      const timer = setTimeout(() => {
        const mockDistance = Math.floor(Math.random() * 20) + 5; // 5-25km
        setDistance(mockDistance);
        setEstimatedTime(`${Math.floor(mockDistance * 3)} minutes`);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.pickupAddress, formData.dropAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/delivery-tracking');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <BackButton />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white ml-4">Create Delivery Request</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Package Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Package Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Package Size
                    </label>
                    <select
                      value={formData.packageSize}
                      onChange={(e) => setFormData({ ...formData, packageSize: e.target.value as 'small' | 'medium' | 'large' })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="small">Small (less than 5kg)</option>
                      <option value="medium">Medium (5-15kg)</option>
                      <option value="large">Large (more than 15kg)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Description
                  </label>
                  <textarea
                    value={formData.itemDescription}
                    onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="fragile"
                    checked={formData.fragile}
                    onChange={(e) => setFormData({ ...formData, fragile: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fragile" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    This package is fragile
                  </label>
                </div>
              </div>

              {/* Delivery Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delivery Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pickup Address
                    </label>
                    <input
                      type="text"
                      value={formData.pickupAddress}
                      onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Drop Address
                    </label>
                    <input
                      type="text"
                      value={formData.dropAddress}
                      onChange={(e) => setFormData({ ...formData, dropAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {distance && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Estimated Distance</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{distance} km</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Estimated Time</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{estimatedTime}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Type
                  </label>
                  <select
                    value={formData.deliveryType}
                    onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value as 'doorstep' | 'pickup_point' | 'flexible' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="doorstep">Doorstep Delivery</option>
                    <option value="pickup_point">Pickup Point</option>
                    <option value="flexible">Flexible (Both Options)</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Urgency
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as 'normal' | 'urgent' | 'express' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="express">Express</option>
                  </select>
                </div>
              </div>

              {/* Price Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Price Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expected Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Request'}
            </button>
          </div>
        </form>

        {showSuccess && (
          <SuccessPopup
            message="Delivery request created successfully! Redirecting to tracking page..."
            duration={2000}
          />
        )}
      </div>
    </div>
  );
} 