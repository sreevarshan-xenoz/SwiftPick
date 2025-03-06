import React from 'react';

interface DeliveryStatus {
  id: string;
  packageId: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  location: string;
  timestamp: string;
  description: string;
}

interface Package {
  id: string;
  name: string;
  from: string;
  to: string;
  status: DeliveryStatus['status'];
  updatedAt: string;
  trackingHistory: DeliveryStatus[];
}

// Mock data for demonstration
const mockPackages: Package[] = [
  {
    id: 'PKG001',
    name: 'Electronics Package',
    from: 'Mumbai',
    to: 'Delhi',
    status: 'in_transit',
    updatedAt: '2024-01-20T10:30:00Z',
    trackingHistory: [
      {
        id: 'TRK001',
        packageId: 'PKG001',
        status: 'picked_up',
        location: 'Mumbai Hub',
        timestamp: '2024-01-19T15:00:00Z',
        description: 'Package picked up from sender'
      },
      {
        id: 'TRK002',
        packageId: 'PKG001',
        status: 'in_transit',
        location: 'Nagpur Hub',
        timestamp: '2024-01-20T10:30:00Z',
        description: 'Package in transit to destination'
      }
    ]
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  picked_up: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusEmoji = {
  pending: '⏳',
  picked_up: '📦',
  in_transit: '🚚',
  delivered: '✅',
  cancelled: '❌'
};

export default function DeliveryTracking() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Deliveries</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          New Delivery
        </button>
      </div>

      {/* Package List */}
      <div className="space-y-4">
        {mockPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tracking ID: {pkg.id}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[pkg.status]}`}>
                {statusEmoji[pkg.status]} {pkg.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                <p className="font-medium text-gray-900 dark:text-white">{pkg.from}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                <p className="font-medium text-gray-900 dark:text-white">{pkg.to}</p>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Tracking History</h4>
              <div className="relative space-y-4">
                {pkg.trackingHistory.map((status, index) => (
                  <div key={status.id} className="flex items-start">
                    <div className="flex items-center">
                      <div className="relative flex items-center justify-center">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 text-lg">
                            {statusEmoji[status.status]}
                          </span>
                        </div>
                        {index !== pkg.trackingHistory.length - 1 && (
                          <div className="absolute top-9 left-4 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {status.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {status.location}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(status.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 