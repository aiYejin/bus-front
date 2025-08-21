'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { busAPI } from '@/services/api';

export default function SearchComponent({ onSearchResult, placeholder = "예: 472 (버스), 강남역 (정류장), 02215 (ARS)" }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const router = useRouter();

  // 검색 실행
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await busAPI.search(query);
      setSearchResults(response.data);
      setShowResults(true);
      if (onSearchResult) {
        onSearchResult(response.data);
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults(null);
      setShowResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // 검색 결과 클릭 시
  const handleResultClick = (type, item) => {
    setShowResults(false);
    setSearchQuery('');
    
    if (type === 'route') {
      // 노선 상세정보 페이지로 이동 (검색을 통해 들어온 것으로 표시)
      router.push(`/route/${item.routeId}?from=search`);
    } else if (type === 'stop') {
      // 정류장 상세정보 페이지로 이동 (검색을 통해 들어온 것으로 표시)
      router.push(`/station/${item.stationId}?from=search`);
    }
  };

  // 검색 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  return (
    <div className="relative w-full">
      {/* 검색 입력 폼 */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              className="w-full px-6 py-4 text-lg text-gray-900 placeholder-gray-500 focus:outline-none"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-semibold transition-colors"
          >
            검색
          </button>
        </div>
      </form>

      {/* 검색 결과 드롭다운 */}
      {showResults && (searchResults || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              검색 중...
            </div>
          ) : searchResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* 왼쪽: 노선 결과 */}
              <div className="border-r border-gray-200">
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-200">
                  노선 ({searchResults.routes ? searchResults.routes.length : 0})
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.routes && searchResults.routes.length > 0 ? (
                    searchResults.routes.map((route, index) => (
                      <div
                        key={`route-${index}`}
                        onClick={() => handleResultClick('route', route)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{route.routeName}</div>
                            <div className="text-sm text-gray-600">
                              {route.startStationName} ↔ {route.endStationName}
                            </div>
                          </div>
                          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            노선
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      노선 검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* 오른쪽: 정류장 결과 */}
              <div>
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-200">
                  정류장 ({searchResults.stops ? searchResults.stops.length : 0})
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.stops && searchResults.stops.length > 0 ? (
                    searchResults.stops.map((stop, index) => (
                      <div
                        key={`stop-${index}`}
                        onClick={() => handleResultClick('stop', stop)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{stop.stationName}</div>
                            <div className="text-sm text-gray-600">
                              ARS: {stop.arsId || '정보없음'}
                            </div>
                          </div>
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            정류장
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      정류장 검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* 검색 결과 외부 클릭 시 닫기 */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
