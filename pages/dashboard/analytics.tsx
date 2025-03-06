import React from 'react';
import Head from 'next/head';
import Analytics from '../../components/dashboard/Analytics';
import DashboardLayout from '../../components/layouts/DashboardLayout';

// Mock data for demonstration
const mockData = {
  deliveryStats: {
    total: 150,
    completed: 120,
    inProgress: 25,
    cancelled: 5,
  },
  earnings: {
    total: 15000,
    thisMonth: 3500,
    lastMonth: 2800,
  },
};

export default function AnalyticsPage() {
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
          <Analytics deliveryStats={mockData.deliveryStats} earnings={mockData.earnings} />
        </main>
      </DashboardLayout>
    </>
  );
} 