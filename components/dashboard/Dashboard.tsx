import React from 'react';
import { useRouter } from 'next/router';
import UserProfile from './UserProfile';
import DashboardLayout from '../layouts/DashboardLayout';

// Mock user data (replace with actual user data from your authentication system)
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  role: 'sender' as const,
  joinedDate: 'January 2024',
  isVerified: true,
  accountStatus: 'active' as const,
  walletBalance: 1500,
  preferredLanguage: 'English',
  currency: 'INR',
};

export default function Dashboard() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
        </header>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Action Cards - Take 2/3 of the space on large screens */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Send Package Card */}
                  <div 
                    onClick={() => router.push('/send-package')}
                    className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-500 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Send a Package</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">Create a new delivery request for your package</p>
                  </div>

                  {/* Find Deliveries Card */}
                  <div 
                    onClick={() => router.push('/available-deliveries')}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-4 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <div className="flex items-center mb-2">
                      <div className="bg-green-500 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Find Deliveries</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">Browse available delivery requests near you</p>
                  </div>

                  {/* Track Deliveries Card */}
                  <div 
                    onClick={() => router.push('/dashboard/delivery-tracking')}
                    className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg p-4 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <div className="flex items-center mb-2">
                      <div className="bg-purple-500 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Track Deliveries</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">Monitor the status of your active deliveries</p>
                  </div>

                  {/* Analytics Card */}
                  <div 
                    onClick={() => router.push('/dashboard/analytics')}
                    className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                  >
                    <div className="flex items-center mb-2">
                      <div className="bg-yellow-500 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Analytics</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">View insights and statistics about your deliveries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile - Take 1/3 of the space on large screens */}
            <div className="lg:col-span-1">
              <UserProfile user={mockUser} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 