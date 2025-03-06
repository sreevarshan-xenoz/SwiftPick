import React, { useState } from 'react';
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Implement API call to create delivery request
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/suggested-travelers');
      }, 1500);
    } catch (error) {
      console.error('Error creating delivery request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {showSuccess && (
        <SuccessPopup
          message="Delivery request created! Finding travelers..."
          duration={1500}
        />
      )}
      
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <BackButton />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Delivery Request
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {/* Item Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Item Details</h3>
            
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Item Name
              </label>
              <input
                type="text"
                id="itemName"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="itemDescription"
                value={formData.itemDescription}
                onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="itemWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Weight (kg)
              </label>
              <input
                type="number"
                id="itemWeight"
                value={formData.itemWeight}
                onChange={(e) => setFormData({ ...formData, itemWeight: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Details</h3>
            
            <div>
              <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pickup Address
              </label>
              <textarea
                id="pickupAddress"
                value={formData.pickupAddress}
                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="dropAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Drop Address
              </label>
              <textarea
                id="dropAddress"
                value={formData.dropAddress}
                onChange={(e) => setFormData({ ...formData, dropAddress: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Urgency Level
              </label>
              <select
                id="urgency"
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as 'normal' | 'urgent' | 'express' })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="express">Express</option>
              </select>
            </div>

            <div>
              <label htmlFor="expectedPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Expected Price (₹)
              </label>
              <input
                type="number"
                id="expectedPrice"
                value={formData.expectedPrice}
                onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
                min="0"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 