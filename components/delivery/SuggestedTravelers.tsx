import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SuccessPopup } from '../common/SuccessPopup';
import { useAuth } from '../../context/AuthContext';

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

export default function SuggestedTravelers() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTraveler, setSelectedTraveler] = useState<string | null>(null);
  const [travelers, setTravelers] = useState<Traveler[]>([]);

  useEffect(() => {
    // This would be replaced with actual API calls in the future
    // Example:
    // const fetchTravelers = async () => {
    //   try {
    //     setInitialLoading(true);
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/travelers/suggested`, {
    //       headers: { Authorization: `Bearer ${user?.token}` }
    //     });
    //     const data = await response.json();
    //     setTravelers(data);
    //   } catch (error) {
    //     console.error('Error fetching travelers:', error);
    //   } finally {
    //     setInitialLoading(false);
    //   }
    // };
    // fetchTravelers();

    // For now, just set loading to false after a delay
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleSelect = async (travelerId: string) => {
    setSelectedTraveler(travelerId);
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setShowSuccess(true);
    setLoading(false);

    // Hide success message after 3 seconds and redirect
    setTimeout(() => {
      setShowSuccess(false);
      router.push('/dashboard/delivery-tracking');
    }, 3000);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suggested Travelers</h1>
        </div>

        {travelers.length > 0 ? (
          <div className="space-y-6">
            {travelers.map((traveler) => (
              <div key={traveler.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                      <Image
                        src={traveler.profileImage || '/default-avatar.png'}
                        alt={traveler.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{traveler.name}</h3>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 ml-1">{traveler.rating}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({traveler.completedDeliveries} deliveries)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Route</p>
                      <p className="font-medium text-gray-900 dark:text-white">{traveler.route}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">{traveler.estimatedTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-medium text-green-600 dark:text-green-400">₹{traveler.price}</p>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6">
                    <button
                      onClick={() => handleSelect(traveler.id)}
                      disabled={loading && selectedTraveler === traveler.id}
                      className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading && selectedTraveler === traveler.id ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing
                        </span>
                      ) : (
                        'Select'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-10 text-center">
            <div className="text-5xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No travelers available</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There are no travelers available for your delivery at the moment.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Please check back later or try adjusting your delivery details.
            </p>
          </div>
        )}
      </div>

      {showSuccess && (
        <SuccessPopup
          message="Traveler selected successfully! You will be redirected to the tracking page."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
} 