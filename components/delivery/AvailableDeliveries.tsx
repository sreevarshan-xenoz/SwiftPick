import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SuccessPopup } from '../common/SuccessPopup';
import { BackButton } from '../common/BackButton';
import { useAuth } from '../../context/AuthContext';

interface DeliveryRequest {
  id: string;
  itemName: string;
  from: string;
  to: string;
  weight: number;
  price: number;
  urgency: 'normal' | 'urgent' | 'express';
  distance: number;
  postedAt: string;
}

export default function AvailableDeliveries() {
  const router = useRouter();
  const { user } = useAuth();
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('50');
  const [sortBy, setSortBy] = useState('distance');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [acceptedDeliveryId, setAcceptedDeliveryId] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [urgency, setUrgency] = useState('all');
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);

  useEffect(() => {
    // This would be replaced with actual API calls in the future
    // Example:
    // const fetchDeliveries = async () => {
    //   try {
    //     setInitialLoading(true);
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deliveries/available`, {
    //       headers: { Authorization: `Bearer ${user?.token}` }
    //     });
    //     const data = await response.json();
    //     setDeliveries(data);
    //   } catch (error) {
    //     console.error('Error fetching deliveries:', error);
    //   } finally {
    //     setInitialLoading(false);
    //   }
    // };
    // fetchDeliveries();

    // For now, just set loading to false after a delay
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleAcceptDelivery = async (deliveryId: string) => {
    setLoading(true);
    setAcceptedDeliveryId(deliveryId);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setShowSuccess(true);
    setLoading(false);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      // Navigate to dashboard
      router.push('/dashboard');
    }, 3000);
  };

  const getUrgencyColor = (urgency: DeliveryRequest['urgency']) => {
    const colors = {
      normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      urgent: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      express: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[urgency];
  };

  const handleSearch = () => {
    // This would be replaced with actual API calls in the future
    // For now, just simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Deliveries</h1>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Search Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Radius (km)
              </label>
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              >
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Weight (kg)
              </label>
              <input
                type="number"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
                placeholder="Any weight"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              >
                <option value="all">All</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="express">Express</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              >
                <option value="distance">Distance</option>
                <option value="price">Price (High to Low)</option>
                <option value="weight">Weight (Low to High)</option>
                <option value="date">Date Posted</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Delivery List */}
        {deliveries.length > 0 ? (
          <div className="space-y-6">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {delivery.itemName}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${getUrgencyColor(delivery.urgency)}`}>
                        {delivery.urgency.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        Posted {new Date(delivery.postedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{delivery.price}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{delivery.weight} kg</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                        <span className="text-blue-600 dark:text-blue-400">A</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                        <p className="font-medium text-gray-900 dark:text-white">{delivery.from}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                        <span className="text-green-600 dark:text-green-400">B</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                        <p className="font-medium text-gray-900 dark:text-white">{delivery.to}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{delivery.distance} km</span>
                  </div>
                  <button
                    onClick={() => handleAcceptDelivery(delivery.id)}
                    disabled={loading && acceptedDeliveryId === delivery.id}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading && acceptedDeliveryId === delivery.id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing
                      </span>
                    ) : (
                      'Accept Delivery'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-10 text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No deliveries available</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There are no delivery requests matching your criteria at the moment.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search filters or check back later.
            </p>
          </div>
        )}
      </div>

      {showSuccess && (
        <SuccessPopup
          message="Delivery accepted successfully! You will be redirected to your dashboard."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
} 