'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { isLoggedIn, handleLogout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const handleLogoutClick = () => {
    handleLogout();
    router.push('/');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <div className="w-80 bg-white shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">즐겨찾기 (4개의 항목)</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">472번</div>
              <div className="text-sm text-gray-600">강남역 ↔ 잠실역</div>
              <div className="text-xs text-blue-600">회사버스</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">역삼역(2번출구)</div>
              <div className="text-sm text-gray-600">02301</div>
              <div className="text-xs text-blue-600">회사앞</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">146번</div>
              <div className="text-sm text-gray-600">강남역 ↔ 서초역</div>
              <div className="text-xs text-blue-600">집버스</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">강남역(중앙차로)</div>
              <div className="text-sm text-gray-600">02215</div>
            </div>
            <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              + 새 즐겨찾기 추가
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-4 mt-8">최근 검색 (3개의 최근 검색 기록)</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">472번</div>
              <div className="text-sm text-gray-600">강남역 ↔ 잠실역</div>
              <div className="text-xs text-gray-500">5분 전</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">역삼역(2번출구)</div>
              <div className="text-sm text-gray-600">02301</div>
              <div className="text-xs text-gray-500">15분 전</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">146번</div>
              <div className="text-sm text-gray-600">강남역 ↔ 서초역</div>
              <div className="text-xs text-gray-500">30분 전</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input 
                type="text" 
                placeholder="버스 번호, 정류장명으로 검색..." 
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>강남역 강남구</span>
                <span>▼</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>🔔</span>
              <span>⚙️</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                W
              </div>
              <button
                onClick={handleLogoutClick}
                className="text-gray-600 hover:text-red-600 text-sm"
              >
                로그아웃
              </button>
            </div>
          </div>
        </header>
        
        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">실시간 도착 정보</h1>
            <p className="text-gray-600">강남역 주변 정류장</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600">실시간 업데이트</span>
            </div>
          </div>
          
          {/* 버스 도착 정보 */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium mb-2">472번</div>
              <div className="text-sm text-gray-600 mb-2">강남역(중앙...</div>
              <div className="flex space-x-4">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">보통 2분 후 도착</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">여유 7분 후 도착</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium mb-2">146번</div>
              <div className="text-sm text-gray-600 mb-2">강남역(중앙...</div>
              <div className="flex space-x-4">
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">혼잡 곧 도착</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">보통 12분 후 도착</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium mb-2">143번</div>
              <div className="text-sm text-gray-600 mb-2">논현역(2번출...</div>
              <div className="flex space-x-4">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">여유 5분 후 도착</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium mb-2">472번</div>
              <div className="text-sm text-gray-600 mb-2">역삼역(2번출...</div>
              <div className="flex space-x-4">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">보통 8분 후 도착</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">혼잡 15분 후 도착</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a href="#" className="text-blue-600 hover:underline">더 많은 정류장 보기 →</a>
          </div>
        </main>
      </div>
    </div>
  );
}
