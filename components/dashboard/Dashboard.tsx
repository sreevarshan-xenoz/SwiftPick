import React from 'react';
import { useRouter } from 'next/router';
import UserProfile from './UserProfile';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-1">
            <UserProfile user={mockUser} />
          </div>

          {/* Right Column - Actions and Stats */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Send Package Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="text-4xl mb-4">📦</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Send a Package</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Connect with travelers heading your way and send your package quickly and affordably.
                  </p>
                  <button
                    onClick={() => router.push('/send-package')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
                  >
                    Send Package
                  </button>
                </div>
              </div>

              {/* Receive/Deliver Package Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="text-4xl mb-4">🚗</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Deliver Packages</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Turn your daily commute into an opportunity. Deliver packages and earn rewards.
                  </p>
                  <button
                    onClick={() => router.push('/available-deliveries')}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
                  >
                    Find Deliveries
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-fade-in">
                <div className="text-sm text-gray-500 dark:text-gray-400">Active Deliveries</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-fade-in">
                <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-fade-in">
                <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">⭐ 0.0</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-fade-in">
                <div className="text-sm text-gray-500 dark:text-gray-400">Rewards</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">₹0</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 