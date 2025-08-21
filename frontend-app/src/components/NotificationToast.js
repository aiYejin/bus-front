'use client';

import { useState, useEffect } from 'react';

export default function NotificationToast({ message, isVisible, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // 자동으로 닫지 않음 - 사용자가 직접 닫을 때까지 유지
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="text-lg">🚌</span>
          <span className="font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
