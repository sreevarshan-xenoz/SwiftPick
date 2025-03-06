import React, { useEffect, useState } from 'react';

interface SuccessPopupProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function SuccessPopup({ message, duration = 3000, onClose }: SuccessPopupProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 animate-slide-up">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
} 