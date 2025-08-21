'use client';

import { useEffect } from 'react';
import { FaBus, FaRedo } from 'react-icons/fa';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FaBus className="text-6xl text-red-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">오류가 발생했습니다</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">일시적인 문제가 발생했습니다</h2>
          <p className="text-gray-600 mb-8">
            페이지를 로드하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={reset}
            className="inline-flex items-center justify-center w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <FaRedo className="mr-2" />
            다시 시도
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center justify-center w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <FaBus className="mr-2" />
            홈으로 이동
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-white/50 rounded-lg border border-red-200">
          <p className="text-sm text-gray-600 mb-2">기술적 정보:</p>
          <code className="text-xs text-red-600 break-all">
            {error?.message || '알 수 없는 오류'}
          </code>
        </div>
      </div>
    </div>
  );
}
