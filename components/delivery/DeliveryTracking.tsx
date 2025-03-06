import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { BackButton } from '../common/BackButton';
import { useAuth } from '../../context/AuthContext';

interface DeliveryStatus {
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered';
  currentLocation: string;
  estimatedDeliveryTime: string;
  travelerName: string;
  travelerPhone: string;
}

export default function DeliveryTracking() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null);

  useEffect(() => {
    // This would be replaced with actual API calls in the future
    // Example:
    // const fetchStatus = async () => {
    //   try {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deliveries/active`, {
    //       headers: { Authorization: `Bearer ${session?.accessToken}` }
    //     });
    //     const data = await response.json();
    //     setDeliveryStatus(data);
    //   } catch (error) {
    //     console.error('Error fetching delivery status:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchStatus();

    // For now, just set loading to false after a delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  const getStatusSteps = () => [
    { label: 'Request Created', completed: true },
    { label: 'Traveler Assigned', completed: deliveryStatus !== null },
    { label: 'Package Picked Up', completed: deliveryStatus?.status !== 'pending' },
    { label: 'In Transit', completed: ['in_transit', 'delivered'].includes(deliveryStatus?.status || '') },
    { label: 'Delivered', completed: deliveryStatus?.status === 'delivered' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <BackButton />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Deliveries</h2>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          New Delivery
        </button>
      </div>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {deliveryStatus ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Delivery Tracking
              </h2>

              {/* Status Timeline */}
              <div className="relative">
                <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
                
                {getStatusSteps().map((step, index) => (
                  <div key={step.label} className="relative flex items-center mb-8">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      ${step.completed
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      }
                    `}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {step.label}
                      </div>
                      {index === 2 && deliveryStatus?.status === 'picked_up' && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Package picked up at {new Date().toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Status */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Current Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Current Location
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {deliveryStatus?.currentLocation}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Estimated Delivery
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {deliveryStatus?.estimatedDeliveryTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* Traveler Info */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Traveler Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Name
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {deliveryStatus?.travelerName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Phone
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {deliveryStatus?.travelerPhone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Button */}
              <div className="mt-8">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Chat with Traveler
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-10 text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No active deliveries</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You don't have any active deliveries at the moment.
              </p>
              <button 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => window.location.href = '/send-package'}
              >
                Send a Package
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 