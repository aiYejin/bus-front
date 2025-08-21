'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import SearchComponent from '@/components/SearchComponent';
import NearbyStations from '@/components/NearbyStations';
import { favoriteAPI, recentAPI } from '@/services/api';

export default function Dashboard() {
  const { isLoggedIn, user, handleLogout } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentError, setRecentError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      refreshFavorites();
      refreshRecents();
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

  const refreshRecents = async () => {
    if (!user?.id) return;
    
    try {
      setRecentLoading(true);
      const response = await recentAPI.getRecents(user.id);
      setRecents(response.data || []);
      setRecentError(null);
    } catch (err) {
      console.error('최근 검색 목록을 가져오는데 실패했습니다:', err);
      setRecentError('최근 검색 목록을 불러오는데 실패했습니다.');
    } finally {
      setRecentLoading(false);
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

  const renderRecentItem = (recent) => {
    const handleRecentClick = () => {
      if (recent.entityType === 'ROUTE') {
        router.push(`/route/${recent.refId}`);
      } else if (recent.entityType === 'STOP') {
        router.push(`/station/${recent.refId}`);
      }
    };

    const formatTimeAgo = (viewedAt) => {
      const now = new Date();
      const viewed = new Date(viewedAt);
      const diffInMinutes = Math.floor((now - viewed) / (1000 * 60));
      
      if (diffInMinutes < 1) return '방금 전';
      if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}시간 전`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}일 전`;
    };

    if (recent.entityType === 'ROUTE') {
      return (
        <div 
          key={recent.id} 
          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleRecentClick}
        >
          <div className="font-medium text-gray-900">{recent.refName}</div>
          <div className="text-sm text-gray-600">{recent.additionalInfo || '노선 정보'}</div>
          <div className="text-xs text-gray-500 mt-1">{formatTimeAgo(recent.viewedAt)}</div>
        </div>
      );
    } else if (recent.entityType === 'STOP') {
      return (
        <div 
          key={recent.id} 
          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleRecentClick}
        >
          <div className="font-medium text-gray-900">{recent.refName}</div>
          <div className="text-sm text-gray-600">{recent.additionalInfo || '정류장 정보'}</div>
          <div className="text-xs text-gray-500 mt-1">{formatTimeAgo(recent.viewedAt)}</div>
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
        <div className="flex items-center justify-center py-4 px-4 bg-white border-b">
          <div className="w-full max-w-7xl">
            <SearchComponent onSearchResult={handleSearchResult} />
          </div>
        </div>

        {/* 3개 영역으로 구성된 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    최근 검색 ({recents.length}개의 최근 검색 기록)
                  </h3>
                  <button
                    onClick={refreshRecents}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    title="새로고침"
                  >
                    ↻
                  </button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">최근 검색 목록을 불러오는 중...</p>
                    </div>
                  ) : recentError ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-red-500">{recentError}</p>
                    </div>
                  ) : recents.length > 0 ? (
                    recents.map(renderRecentItem)
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">최근 검색 기록이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3번 영역: 주변 정류장 (직사각형 비율) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6" style={{ height: 'calc(2 * (256px + 2rem + 3rem) + 2rem)' }}>
                <NearbyStations compact={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
