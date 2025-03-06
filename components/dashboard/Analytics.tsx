import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { BackButton } from '../common/BackButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsProps {
  deliveryStats: {
    total: number;
    completed: number;
    inProgress: number;
    cancelled: number;
  };
  earnings: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
}

export default function Analytics({ deliveryStats, earnings }: AnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Line chart data for earnings - using empty data for now
  // This would be replaced with real data from API
  const earningsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Earnings',
        data: [0, 0, 0, 0, 0, 0], // Empty data for now
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  // Bar chart data for deliveries - using empty data for now
  // This would be replaced with real data from API
  const deliveriesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Deliveries',
        data: [0, 0, 0, 0, 0, 0, 0], // Empty data for now
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  // Doughnut chart data for delivery status
  const statusData = {
    labels: ['Completed', 'In Progress', 'Cancelled'],
    datasets: [
      {
        data: [
          deliveryStats.completed || 0, 
          deliveryStats.inProgress || 0, 
          deliveryStats.cancelled || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Deliveries
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {deliveryStats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Completed
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {deliveryStats.completed}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            In Progress
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {deliveryStats.inProgress}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Earnings
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            ₹{earnings.total}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {(['week', 'month', 'year'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setSelectedTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Earnings Overview
          </h3>
          <Line data={earningsData} options={chartOptions} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Deliveries
          </h3>
          <Bar data={deliveriesData} options={chartOptions} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Delivery Status Distribution
          </h3>
          <div className="w-full max-w-md mx-auto">
            <Doughnut data={statusData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  On-time Delivery Rate
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">0%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Customer Satisfaction
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">0%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Package Safety
                </span>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">0%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 