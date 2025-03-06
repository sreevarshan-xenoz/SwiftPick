import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SuccessPopup } from '../common/SuccessPopup';

type UserRole = 'sender' | 'traveler';

interface FormErrors {
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic format: 10 digits)
    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implement actual signup API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error signing up:', error);
      setErrors({
        email: 'An error occurred during signup. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {showSuccess && (
        <SuccessPopup
          message="Account created successfully! Redirecting..."
          duration={1500}
        />
      )}
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join SwiftPick and start connecting with travelers
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            type="button"
            onClick={() => setRole('sender')}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              role === 'sender'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500'
            }`}
          >
            <div className="text-2xl mb-2">📦</div>
            <div className="font-medium">I want to send packages</div>
          </button>
          <button
            type="button"
            onClick={() => setRole('traveler')}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              role === 'traveler'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500'
            }`}
          >
            <div className="text-2xl mb-2">🚗</div>
            <div className="font-medium">I want to deliver packages</div>
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.email
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.phone
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.password
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.confirmPassword
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!role || loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                role && !loading
                  ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 