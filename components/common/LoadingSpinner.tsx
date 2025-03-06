import React from 'react';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500`}
      />
    </div>
  );
} 