import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { BackButton } from '../../components/common/BackButton';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN001',
    type: 'credit',
    amount: 500,
    description: 'Added money via UPI',
    date: '2024-01-20T10:30:00Z',
    status: 'completed'
  },
  {
    id: 'TXN002',
    type: 'debit',
    amount: 200,
    description: 'Package delivery fee',
    date: '2024-01-19T15:45:00Z',
    status: 'completed'
  }
];

export default function WalletPage() {
  const [balance] = useState(1500);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement payment gateway integration
    setShowAddMoney(false);
    setAmount('');
  };

  return (
    <>
      <Head>
        <title>Wallet - SwiftPick</title>
        <meta name="description" content="Manage your SwiftPick wallet" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Wallet
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Wallet Balance</h2>
            <div className="text-4xl font-bold mb-4">₹{balance.toFixed(2)}</div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddMoney(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Add Money
              </button>
              <button className="bg-blue-400 bg-opacity-25 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-colors">
                Withdraw
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="text-2xl mb-2">📱</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">UPI Transfer</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="text-2xl mb-2">🏦</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Bank Transfer</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="text-2xl mb-2">💳</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Cards</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="text-2xl mb-2">📊</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Statement</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Transaction History</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.description}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'credit'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Money Modal */}
        {showAddMoney && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Money</h3>
              <form onSubmit={handleAddMoney}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    placeholder="Enter amount"
                    min="1"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Proceed to Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMoney(false)}
                    className="flex-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 