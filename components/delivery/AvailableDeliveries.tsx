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
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'urgency'>('distance');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    maxWeight: '',
    priceRange: '',
    urgency: 'all'
  });

  const handleAcceptDelivery = async (deliveryId: string) => {
    setSelectedDelivery(deliveryId);
    setLoading(true);
    
    try {
      // TODO: Implement API call to accept delivery
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/delivery-tracking');
      }, 1500);
    } catch (error) {
      console.error('Error accepting delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: DeliveryRequest['urgency']) => {
    switch (urgency) {
      case 'express':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'urgent':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <SuccessPopup
          message="Delivery accepted! Redirecting to tracking..."
          duration={1500}
        />
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Available Deliveries
          </h1>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Location Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Radius (km)
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="25">25 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
              <option value="200">200 km</option>
            </select>
          </div>

          {/* Weight Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Weight (kg)
            </label>
            <input
              type="number"
              value={filters.maxWeight}
              onChange={(e) => setFilters({ ...filters, maxWeight: e.target.value })}
              placeholder="Enter max weight"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'price' | 'urgency')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="distance">Distance</option>
              <option value="price">Price</option>
              <option value="urgency">Urgency</option>
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="mt-4 flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="urgency"
              value="all"
              checked={filters.urgency === 'all'}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">All</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="urgency"
              value="normal"
              checked={filters.urgency === 'normal'}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Normal</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="urgency"
              value="urgent"
              checked={filters.urgency === 'urgent'}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Urgent</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="urgency"
              value="express"
              checked={filters.urgency === 'express'}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Express</span>
          </label>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {mockDeliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {delivery.itemName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {delivery.id}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getUrgencyColor(delivery.urgency)}`}>
                {delivery.urgency.toUpperCase()}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                <p className="font-medium text-gray-900 dark:text-white">{delivery.from}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                <p className="font-medium text-gray-900 dark:text-white">{delivery.to}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                <p className="font-medium text-gray-900 dark:text-white">{delivery.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Distance</p>
                <p className="font-medium text-gray-900 dark:text-white">{delivery.distance} km</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{delivery.price}
              </div>
              <button
                onClick={() => handleAcceptDelivery(delivery.id)}
                disabled={loading && selectedDelivery === delivery.id}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading && selectedDelivery === delivery.id ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Accept Delivery'
                )}
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Posted {new Date(delivery.postedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 