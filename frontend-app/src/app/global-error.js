'use client';

import { FaBus, FaRedo } from 'react-icons/fa';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <FaBus className="text-6xl text-gray-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">시스템 오류</h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">전체 시스템에 문제가 발생했습니다</h2>
              <p className="text-gray-600 mb-8">
                예상치 못한 오류가 발생했습니다. 관리자에게 문의해주세요.
              </p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={reset}
                className="inline-flex items-center justify-center w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                <FaRedo className="mr-2" />
                애플리케이션 재시작
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                페이지 새로고침
              </button>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              <p>오류 코드: GLOBAL_ERROR</p>
              <p>시간: {new Date().toLocaleString('ko-KR')}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
