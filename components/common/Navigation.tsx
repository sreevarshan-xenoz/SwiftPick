import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';

export default function Navigation() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Send Package', path: '/send-package', icon: '📦' },
    { label: 'My Deliveries', path: '/dashboard/delivery-tracking', icon: '��' },
    { label: 'Analytics', path: '/dashboard/analytics', icon: '📈' },
    { label: 'Wallet', path: '/dashboard/wallet', icon: '💰' },
    { label: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl mr-2">🚀</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">SwiftPick</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === item.path
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  router.pathname === item.path
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="mr-2">{theme === 'dark' ? '🌞' : '🌙'}</span>
              Toggle Theme
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 