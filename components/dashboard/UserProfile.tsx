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
  const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'security' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profileData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!profileData.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
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
              src="/default-avatar.png"
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span className="text-white text-sm">Change</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
              ) : (
                profileData.name
              )}
            </h3>
            {profileData.isVerified && (
              <span className="text-blue-500" title="Verified Account">✓</span>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-gray-600 dark:text-gray-400">
              {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
            </p>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(profileData.accountStatus)}`}>
              {profileData.accountStatus || 'Active'}
            </span>
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
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-900 dark:text-white">{profileData.email}</p>
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
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-900 dark:text-white">{profileData.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Member Since
          </label>
          <p className="text-gray-900 dark:text-white">{profileData.joinedDate}</p>
        </div>
      </div>
    </>
  );

  const renderWalletTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Wallet Balance</h3>
        <p className="text-3xl font-bold">₹{profileData.walletBalance || 0}</p>
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
              value={profileData.preferredLanguage || 'English'}
              onChange={(e) => setProfileData({ ...profileData, preferredLanguage: e.target.value })}
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
              value={profileData.currency || 'INR'}
              onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
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
    <div className="space-y-6">
      {showSuccess && (
        <SuccessPopup message="Profile updated successfully!" duration={3000} />
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              {(['profile', 'wallet', 'security', 'preferences'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'wallet' && renderWalletTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}

          {isEditing && activeTab === 'profile' && (
            <div className="mt-6">
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 