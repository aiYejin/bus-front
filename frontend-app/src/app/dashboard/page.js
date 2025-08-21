'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import SearchComponent from '@/components/SearchComponent';
import { favoriteAPI } from '@/services/api';

export default function Dashboard() {
  const { isLoggedIn, user, handleLogout } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      refreshFavorites();
    }
  }, [isLoggedIn, user?.id]);

  const handleLogoutClick = () => {
    handleLogout();
    router.push('/');
  };

  const handleSearchResult = (searchData) => {
    console.log('검색 결과:', searchData);
    // 여기에 검색 결과 처리 로직 추가
  };

  const refreshFavorites = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await favoriteAPI.getFavorites(user.id);
      setFavorites(response.data || []);
      setError(null);
    } catch (err) {
      console.error('즐겨찾기 목록을 가져오는데 실패했습니다:', err);
      setError('즐겨찾기 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFavorite = async (e, favoriteId) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    if (!confirm('이 즐겨찾기를 삭제하시겠습니까?')) return;
    
    try {
      await favoriteAPI.removeFavorite(favoriteId, user.id);
      // 삭제 후 목록 새로고침
      await refreshFavorites();
    } catch (err) {
      console.error('즐겨찾기 삭제에 실패했습니다:', err);
      alert('즐겨찾기 삭제에 실패했습니다.');
    }
  };

  const renderFavoriteItem = (favorite) => {
    const handleFavoriteClick = () => {
      if (favorite.type === 'ROUTE') {
        router.push(`/route/${favorite.refId}`);
      } else if (favorite.type === 'STOP') {
        router.push(`/station/${favorite.refId}`);
      }
    };

         if (favorite.type === 'ROUTE') {
       return (
         <div 
           key={favorite.id} 
           className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors relative group"
           onClick={handleFavoriteClick}
         >
           <div className="font-medium text-gray-900">{favorite.refName}</div>
           <div className="text-sm text-gray-600">{favorite.additionalInfo || '노선 정보'}</div>
           <div className="text-xs text-blue-600 mt-1">{favorite.alias || '즐겨찾기'}</div>
           <button
             onClick={(e) => handleDeleteFavorite(e, favorite.id)}
             className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100"
             title="삭제"
           >
             ×
           </button>
         </div>
       );
         } else if (favorite.type === 'STOP') {
       return (
         <div 
           key={favorite.id} 
           className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors relative group"
           onClick={handleFavoriteClick}
         >
           <div className="font-medium text-gray-900">{favorite.refName}</div>
           <div className="text-sm text-gray-600">{favorite.refId}</div>
           <div className="text-xs text-blue-600 mt-1">{favorite.alias || '즐겨찾기'}</div>
           <button
             onClick={(e) => handleDeleteFavorite(e, favorite.id)}
             className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100"
             title="삭제"
           >
             ×
           </button>
         </div>
       );
    }
    return null;
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    즐겨찾기 ({favorites.length}개의 항목)
                  </h3>
                  <button
                    onClick={refreshFavorites}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    title="새로고침"
                  >
                    ↻
                  </button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">즐겨찾기 목록을 불러오는 중...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  ) : favorites.length > 0 ? (
                    favorites.map(renderFavoriteItem)
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">즐겨찾기가 없습니다.</p>
                    </div>
                  )}
                  
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
