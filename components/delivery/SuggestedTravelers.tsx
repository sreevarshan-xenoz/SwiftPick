import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SuccessPopup } from '../common/SuccessPopup';

interface Traveler {
  id: string;
  name: string;
  rating: number;
  completedDeliveries: number;
  route: string;
  price: number;
  estimatedTime: string;
  profileImage: string;
}

const mockTravelers: Traveler[] = [
  {
    id: '1',
    name: 'John Doe',
    rating: 4.8,
    completedDeliveries: 156,
    route: 'Mumbai → Pune',
    price: 250,
    estimatedTime: '2-3 hours',
    profileImage: '/default-avatar.png',
  },
  {
    id: '2',
    name: 'Jane Smith',
    rating: 4.9,
    completedDeliveries: 243,
    route: 'Mumbai → Pune',
    price: 300,
    estimatedTime: '2 hours',
    profileImage: '/default-avatar.png',
  },
  // Add more mock travelers as needed
];

export default function SuggestedTravelers() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTraveler, setSelectedTraveler] = useState<string | null>(null);

  const handleSelect = async (travelerId: string) => {
    setSelectedTraveler(travelerId);
    setLoading(true);
    
    try {
      // TODO: Implement API call to select traveler
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/delivery-tracking');
      }, 1500);
    } catch (error) {
      console.error('Error selecting traveler:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {showSuccess && (
        <SuccessPopup
          message="Traveler selected! Redirecting to tracking..."
          duration={1500}
        />
      )}
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Suggested Travelers
        </h2>

        <div className="space-y-4">
          {mockTravelers.map((traveler) => (
            <div
              key={traveler.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={traveler.profileImage}
                    alt={`${traveler.name}'s profile`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {traveler.name}
                    </h3>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ₹{traveler.price}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-1">⭐</span>
                        <span>{traveler.rating}</span>
                        <span className="mx-1">•</span>
                        <span>{traveler.completedDeliveries} deliveries</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {traveler.route}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Estimated Time
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {traveler.estimatedTime}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => handleSelect(traveler.id)}
                      disabled={loading && selectedTraveler === traveler.id}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {loading && selectedTraveler === traveler.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        'Select Traveler'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 