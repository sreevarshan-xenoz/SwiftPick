import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTheme } from '../../context/ThemeContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 p-4">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-opacity-90 transition-all duration-200"
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>

      <div className="w-full max-w-md space-y-8 text-center animate-fade-in">
        {/* Logo */}
        <div className="relative w-32 h-32 mx-auto animate-bounce-slow">
          <Image
            src="/logo.png"
            alt="SwiftPick Logo"
            width={128}
            height={128}
            className="object-contain"
            priority
            loading="eager"
          />
        </div>

        {/* Welcome Text */}
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4 animate-slide-down">
            Welcome to SwiftPick
          </h1>
          <p className="text-xl opacity-90">
            Join our community of travelers and senders for faster, cheaper, and eco-friendly deliveries
          </p>
        </div>

        {/* Authentication Buttons */}
        <div className="mt-8 space-y-4 animate-slide-up">
          <button
            onClick={() => router.push('/auth/signup')}
            className="w-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 py-3 px-8 rounded-lg font-semibold text-lg hover:bg-opacity-90 hover:transform hover:scale-105 transition duration-300 shadow-lg"
          >
            Create Account
          </button>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full border-2 border-white text-white py-3 px-8 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400 hover:transform hover:scale-105 transition duration-300"
          >
            Sign In
          </button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          <div className="text-white text-center transform hover:scale-110 transition duration-300">
            <div className="text-3xl mb-2">🚀</div>
            <div className="text-sm">Fast Delivery</div>
          </div>
          <div className="text-white text-center transform hover:scale-110 transition duration-300">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-sm">Save Money</div>
          </div>
          <div className="text-white text-center transform hover:scale-110 transition duration-300">
            <div className="text-3xl mb-2">🌱</div>
            <div className="text-sm">Eco-Friendly</div>
          </div>
        </div>
      </div>
    </div>
  );
} 