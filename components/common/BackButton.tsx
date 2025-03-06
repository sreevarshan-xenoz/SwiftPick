import React from 'react';
import { useRouter } from 'next/router';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back
    </button>
  );
} 