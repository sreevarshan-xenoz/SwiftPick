import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SuccessPopup } from '../common/SuccessPopup';
import { BackButton } from '../common/BackButton';

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

// Mock data for demonstration
const mockDeliveries: DeliveryRequest[] = [
  {
    id: 'DEL001',
    itemName: 'Electronics Package',
    from: 'Mumbai',
    to: 'Pune',
    weight: 2.5,
    price: 300,
    urgency: 'normal',
    distance: 150,
    postedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 'DEL002',
    itemName: 'Documents',
    from: 'Mumbai',
    to: 'Nashik',
    weight: 0.5,
    price: 200,
    urgency: 'urgent',
    distance: 180,
    postedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: 'DEL003',
    itemName: 'Gift Package',
    from: 'Mumbai',
    to: 'Lonavala',
    weight: 1.0,
    price: 150,
    urgency: 'express',
    distance: 80,
    postedAt: '2024-01-20T11:45:00Z'
  }
];

export default function AvailableDeliveries() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('50');
  const [sortBy, setSortBy] = useState('distance');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [acceptedDeliveryId, setAcceptedDeliveryId] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [urgency, setUrgency] = useState('all');
  const [deliveries, setDeliveries] = useState(mockDeliveries);

  const handleAcceptDelivery = async (deliveryId: string) => {
    setLoading(true);
    setAcceptedDeliveryId(deliveryId);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push('/dashboard/delivery-tracking');
      }, 1500);
    }, 1000);
  };

  const getUrgencyColor = (urgency: DeliveryRequest['urgency']) => {
    switch (urgency) {
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'urgent':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'express':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Available Deliveries
          </h1>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="Enter your location"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Radius
              </label>
              <select
                id="radius"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              >
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
                <option value="200">200 km</option>
              </select>
            </div>
            <div>
              <label htmlFor="maxWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Package Weight (kg)
              </label>
              <input
                type="number"
                id="maxWeight"
                placeholder="Any weight"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Urgency Level
              </label>
              <select
                id="urgency"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="all">All</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="express">Express</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="distance">Distance</option>
                <option value="price">Price (High to Low)</option>
                <option value="urgency">Urgency</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{delivery.itemName}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ID: {delivery.id}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(delivery.urgency)}`}>
                    {delivery.urgency.charAt(0).toUpperCase() + delivery.urgency.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3 text-sm">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="font-medium mr-2">From:</span> {delivery.from}
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="font-medium mr-2">To:</span> {delivery.to}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-gray-700 dark:text-gray-300">
                    <div>
                      <span className="font-medium">Weight:</span>
                      <p>{delivery.weight} kg</p>
                    </div>
                    <div>
                      <span className="font-medium">Distance:</span>
                      <p>{delivery.distance} km</p>
                    </div>
                    <div>
                      <span className="font-medium">Price:</span>
                      <p className="text-green-600 dark:text-green-400 font-semibold">₹{delivery.price}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Posted {new Date(delivery.postedAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleAcceptDelivery(delivery.id)}
                    disabled={loading && acceptedDeliveryId === delivery.id}
                    className="bg-green-600 text-white py-1.5 px-3 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && acceptedDeliveryId === delivery.id ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Accepting...</span>
                      </div>
                    ) : (
                      'Accept Delivery'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showSuccess && (
        <SuccessPopup
          message="Delivery accepted successfully! Redirecting to tracking page..."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
} 