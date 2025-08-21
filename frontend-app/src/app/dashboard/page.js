'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchComponent from '@/components/SearchComponent';

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

  const handleSearchResult = (searchData) => {
    console.log('검색 결과:', searchData);
    // 여기에 검색 결과 처리 로직 추가
  };

  if (!isLoggedIn) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* 검색창만 있는 상단 섹션 */}
        <div className="flex items-center justify-center py-8 px-4 bg-white border-b">
          <div className="w-full max-w-7xl">
            <SearchComponent onSearchResult={handleSearchResult} />
          </div>
        </div>

        {/* 3개 영역으로 구성된 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
            {/* 왼쪽 영역: 즐겨찾기와 최근 검색 */}
            <div className="lg:col-span-1 space-y-8">
              {/* 1번 영역: 즐겨찾기 */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">즐겨찾기 (4개의 항목)</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">472번</div>
                    <div className="text-sm text-gray-600">강남역 ↔ 잠실역</div>
                    <div className="text-xs text-blue-600 mt-1">회사버스</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">역삼역(2번출구)</div>
                    <div className="text-sm text-gray-600">02301</div>
                    <div className="text-xs text-blue-600 mt-1">회사앞</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">146번</div>
                    <div className="text-sm text-gray-600">강남역 ↔ 서초역</div>
                    <div className="text-xs text-blue-600 mt-1">집버스</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">강남역(중앙차로)</div>
                    <div className="text-sm text-gray-600">02215</div>
                  </div>
                  <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                    + 새 즐겨찾기 추가
                  </div>
                </div>
              </div>

              {/* 2번 영역: 최근 검색 */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">최근 검색 (3개의 최근 검색 기록)</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">472번</div>
                    <div className="text-sm text-gray-600">강남역 ↔ 잠실역</div>
                    <div className="text-xs text-gray-500 mt-1">5분 전</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">역삼역(2번출구)</div>
                    <div className="text-sm text-gray-600">02301</div>
                    <div className="text-xs text-gray-500 mt-1">15분 전</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">146번</div>
                    <div className="text-sm text-gray-600">강남역 ↔ 서초역</div>
                    <div className="text-xs text-gray-500 mt-1">30분 전</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3번 영역: 주변 정류장 (1:2 비율) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">주변 정류장</h3>
                  <p className="text-gray-600">강남역 주변 정류장</p>
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">실시간 업데이트</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2 text-gray-900">472번</div>
                    <div className="text-sm text-gray-600 mb-2">강남역(중앙...</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">보통 2분 후 도착</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">여유 7분 후 도착</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2 text-gray-900">146번</div>
                    <div className="text-sm text-gray-600 mb-2">강남역(중앙...</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">혼잡 곧 도착</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">보통 12분 후 도착</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2 text-gray-900">143번</div>
                    <div className="text-sm text-gray-600 mb-2">논현역(2번출...</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">여유 5분 후 도착</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2 text-gray-900">472번</div>
                    <div className="text-sm text-gray-600 mb-2">역삼역(2번출...</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">보통 8분 후 도착</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">혼잡 15분 후 도착</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2 text-gray-900">360번</div>
                    <div className="text-sm text-gray-600 mb-2">강남역(중앙...</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">여유 3분 후 도착</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">보통 10분 후 도착</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2 text-gray-900">740번</div>
                    <div className="text-sm text-gray-600 mb-2">역삼역(2번출...</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">혼잡 6분 후 도착</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <a href="#" className="text-blue-600 hover:underline text-sm">더 많은 정류장 보기 →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
