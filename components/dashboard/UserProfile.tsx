import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { SuccessPopup } from '../common/SuccessPopup';

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    phone: string;
    role: 'sender' | 'traveler';
    joinedDate: string;
    isVerified?: boolean;
    accountStatus?: 'active' | 'pending' | 'suspended';
    walletBalance?: number;
    preferredLanguage?: string;
    currency?: string;
  };
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

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
    id: '1',
    type: 'credit',
    amount: 500,
    description: 'Payment received for delivery #1234',
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: '2',
    type: 'debit',
    amount: 200,
    description: 'Delivery fee for package #5678',
    date: '2024-01-14',
    status: 'completed'
  }
];

const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];
const currencies = ['INR', 'USD', 'EUR', 'GBP'];

export default function UserProfile({ user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [profileImage, setProfileImage] = useState('/default-avatar.png');
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // TODO: Implement API call to save profile changes
    setShowSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or GIF)');
        return;
      }

      // TODO: Implement actual image upload
      const reader = new FileReader();
      reader.onloadend = () => {
        // Handle image preview or upload
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: string = 'active') => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const renderProfileTab = () => (
    <>
      <div className="flex items-center mb-6">
        <div className="relative group">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <Image
              src={profileImage}
              alt={user.name}
              fill
              className="rounded-full object-cover"
            />
            {isEditing && (
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 cursor-pointer shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1"
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                    )}
                  </div>
                ) : (
                  formData.name
                )}
              </h3>
              {user.isVerified && (
                <span className="text-blue-500" title="Verified Account">✓</span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-gray-600 dark:text-gray-400">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.accountStatus)}`}>
                {user.accountStatus || 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          {isEditing ? (
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              />
              {formErrors.email && (
                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-900 dark:text-white">{formData.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          {isEditing ? (
            <div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              />
              {formErrors.phone && (
                <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-900 dark:text-white">{formData.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Member Since
          </label>
          <p className="text-gray-900 dark:text-white">{user.joinedDate}</p>
        </div>
      </div>
    </>
  );

  const renderWalletTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Wallet Balance</h3>
        <p className="text-3xl font-bold">₹{user.walletBalance || 0}</p>
        <div className="mt-4 flex space-x-2">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Add Money
          </button>
          <button className="bg-blue-400 bg-opacity-25 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors">
            Withdraw
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction History</h3>
        <div className="space-y-4">
          {mockTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {transaction.type === 'credit' ? '💰' : '📤'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'credit'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Biometric Login</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Use fingerprint or face recognition</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
            Change Password
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Login History</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Mumbai, India</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Chrome on Windows • 2 hours ago</p>
            </div>
            <span className="text-green-600 dark:text-green-400 text-sm">Current</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Delhi, India</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Safari on iPhone • Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">App Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language
            </label>
            <select
              value={user.preferredLanguage || 'English'}
              onChange={(e) => {
                // TODO: Implement language change
              }}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency
            </label>
            <select
              value={user.currency || 'INR'}
              onChange={(e) => {
                // TODO: Implement currency change
              }}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your deliveries</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">SMS Alerts</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get SMS updates for important notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Profile Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="relative mb-4 sm:mb-0 sm:mr-4">
            <img
              src={profileImage}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
            {isEditing && (
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 cursor-pointer shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-blue-100">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
            <div className="flex items-center justify-center sm:justify-start mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor()}`}>
                {user.accountStatus?.toUpperCase() || 'ACTIVE'}
              </span>
              {user.isVerified && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  VERIFIED
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-3 text-sm font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-2 px-3 text-sm font-medium ${
              activeTab === 'wallet'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-3 text-sm font-medium ${
              activeTab === 'security'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-3 text-sm font-medium ${
              activeTab === 'preferences'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'wallet' && renderWalletTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
      </div>
    </div>
  );
} 