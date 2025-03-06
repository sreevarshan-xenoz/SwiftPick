import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Analytics from '../../components/dashboard/Analytics';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState({
    deliveryStats: {
      total: 0,
      completed: 0,
      inProgress: 0,
      cancelled: 0,
    },
    earnings: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
    },
  });

  // In the future, fetch real data from API
  useEffect(() => {
    // This would be replaced with actual API calls
    // Example:
    // const fetchAnalyticsData = async () => {
    //   try {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/analytics`, {
    //       headers: { Authorization: `Bearer ${session?.accessToken}` }
    //     });
    //     const data = await response.json();
    //     setAnalyticsData(data);
    //   } catch (error) {
    //     console.error('Error fetching analytics data:', error);
    //   }
    // };
    // fetchAnalyticsData();
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
    <>
      <Head>
        <title>Analytics - SwiftPick</title>
        <meta name="description" content="View your delivery and earnings analytics on SwiftPick" />
      </Head>

      <DashboardLayout>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Download Report
            </button>
          </div>
          <Analytics deliveryStats={analyticsData.deliveryStats} earnings={analyticsData.earnings} />
        </main>
      </DashboardLayout>
    </>
  );
} 