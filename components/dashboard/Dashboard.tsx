import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UserProfile from './UserProfile';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

// Remove mock user data and use real user data from auth context

export default function Dashboard() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, loading } = useAuth();
  
  // Default stats (will be replaced with API calls in the future)
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    completed: 0,
    rating: 0,
    rewards: 0
  });
  
  // Default activity (will be replaced with API calls in the future)
  const [activity, setActivity] = useState([]);

  // Extract user's first name from email if name is not available
  const getUserName = () => {
    if (!user) return '';
    if (user.name) return user.name.split(' ')[0];
    if (user.email) {
      // Extract name from email (part before @)
      const emailName = user.email.split('@')[0];
      // Capitalize first letter and replace dots/underscores with spaces
      return emailName.charAt(0).toUpperCase() + 
             emailName.slice(1).replace(/[._]/g, ' ');
    }
    return 'User';
  };

  // In the future, fetch real data from API
  useEffect(() => {
    // This would be replaced with actual API calls
    // Example:
    // const fetchUserStats = async () => {
    //   try {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/stats`, {
    //       headers: { Authorization: `Bearer ${session?.accessToken}` }
    //     });
    //     const data = await response.json();
    //     setStats(data);
    //   } catch (error) {
    //     console.error('Error fetching user stats:', error);
    //   }
    // };
    // fetchUserStats();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-50 dark:bg-gray-900">
        {/* Header with welcome message and notifications */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {getUserName()}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Here's what's happening with your deliveries today.</p>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">0</span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                        No notifications yet
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Quick Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Deliveries</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.activeDeliveries}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.rating || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rewards</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">₹{stats.rewards}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Action Cards and Recent Activity - Take 2/3 of the space on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Action Cards */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Send Package Card */}
                  <div 
                    onClick={() => router.push('/send-package')}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-100 dark:border-blue-800 rounded-lg p-5 cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-3 mr-4 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send a Package</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 ml-14">Create a new delivery request for your package</p>
                    <div className="mt-4 ml-14">
                      <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                        Get Started
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Find Deliveries Card */}
                  <div 
                    onClick={() => router.push('/available-deliveries')}
                    className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-100 dark:border-green-800 rounded-lg p-5 cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full p-3 mr-4 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Find Deliveries</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 ml-14">Browse available delivery requests near you</p>
                    <div className="mt-4 ml-14">
                      <span className="inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                        Explore
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Track Deliveries Card */}
                  <div 
                    onClick={() => router.push('/dashboard/delivery-tracking')}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-100 dark:border-purple-800 rounded-lg p-5 cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full p-3 mr-4 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Track Deliveries</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 ml-14">Monitor the status of your active deliveries</p>
                    <div className="mt-4 ml-14">
                      <span className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400">
                        Track Now
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Analytics Card */}
                  <div 
                    onClick={() => router.push('/dashboard/analytics')}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-100 dark:border-yellow-800 rounded-lg p-5 cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full p-3 mr-4 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 ml-14">View insights and statistics about your deliveries</p>
                    <div className="mt-4 ml-14">
                      <span className="inline-flex items-center text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        View Stats
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                </div>
                
                {activity.length > 0 ? (
                  <div className="space-y-4">
                    {activity.map((item: any) => (
                      <div key={item.id} className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <div className={`p-2 rounded-full mr-3 ${
                          item.type === 'delivery' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        }`}>
                          {item.type === 'delivery' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white font-medium">{item.description}</p>
                          <div className="flex justify-between mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.status === 'completed' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                : item.status === 'in_transit'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                            }`}>
                              {item.status === 'completed' ? 'Completed' : item.status === 'in_transit' ? 'In Transit' : 'Success'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No recent activity</p>
                    <p className="mt-2 text-sm">Your activity will appear here once you start using the platform</p>
                  </div>
                )}
              </div>
            </div>

            {/* User Profile - Take 1/3 of the space on large screens */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Profile</h2>
                {user && (
                  <UserProfile 
                    user={{
                      name: user.name || getUserName(),
                      email: user.email || '',
                      phone: user.phone || '',
                      role: user.role || 'sender',
                      joinedDate: user.joinedDate || 'Recently joined',
                      isVerified: user.isVerified || false,
                      accountStatus: user.accountStatus || 'active',
                      walletBalance: user.walletBalance || 0,
                      preferredLanguage: user.preferredLanguage || 'English',
                      currency: user.currency || 'INR',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 