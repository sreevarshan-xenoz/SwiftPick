import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SuccessPopup } from '../common/SuccessPopup';

interface BankAccount {
  _id: string;
  status: 'not_added' | 'pending' | 'verified' | 'rejected';
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  isDefault: boolean;
  verifiedAt?: string;
}

export default function BankAccounts() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    accountHolder: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
  });

  useEffect(() => {
    fetchBankAccounts();
  }, [session]);

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bank/accounts', {
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      });
      const data = await response.json();
      setBankAccounts(data.bankAccounts);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/bank/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add bank account');

      setSuccess('Bank account added successfully!');
      setShowAddForm(false);
      setFormData({
        accountHolder: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
      });
      fetchBankAccounts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding bank account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (accountId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bank/default/${accountId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      });

      if (!response.ok) throw new Error('Failed to set default account');

      setSuccess('Default account updated successfully!');
      fetchBankAccounts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error setting default account:', error);
    }
  };

  const handleDelete = async (accountId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bank/${accountId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete account');

      setSuccess('Bank account deleted successfully!');
      fetchBankAccounts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Bank Accounts</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Account'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              value={formData.accountHolder}
              onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              IFSC Code
            </label>
            <input
              type="text"
              value={formData.ifscCode}
              onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Add Bank Account'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {bankAccounts.map((account) => (
          <div
            key={account._id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {account.accountHolder}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {account.bankName}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                {account.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Account Number</p>
                <p className="text-gray-900 dark:text-white">{account.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">IFSC Code</p>
                <p className="text-gray-900 dark:text-white">{account.ifscCode}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              {!account.isDefault && (
                <button
                  onClick={() => handleSetDefault(account._id)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Set as Default
                </button>
              )}
              {account.isDefault && (
                <span className="text-green-600 dark:text-green-400">Default Account</span>
              )}
              <button
                onClick={() => handleDelete(account._id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {bankAccounts.length === 0 && !showAddForm && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No bank accounts added yet.</p>
          </div>
        )}
      </div>

      {success && (
        <SuccessPopup message={success} />
      )}
    </div>
  );
} 