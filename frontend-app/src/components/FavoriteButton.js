'use client';

import { useState, useEffect } from 'react';
import { favoriteAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function FavoriteButton({ type, refId, refName, additionalInfo = '' }) {
  const { user, openAuthModal } = useAuth();
  const pathname = usePathname();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAliasModal, setShowAliasModal] = useState(false);
  const [alias, setAlias] = useState('');

  // 즐겨찾기 상태 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user?.id) return;
      
      try {
        const response = await favoriteAPI.getFavorites(user.id);
        const favorites = response.data;
        const existingFavorite = favorites.find(fav => 
          fav.type === type && fav.refId === refId
        );
        
        if (existingFavorite) {
          setIsFavorite(true);
          setFavoriteId(existingFavorite.id);
        }
      } catch (error) {
        console.error('즐겨찾기 상태 확인 실패:', error);
      }
    };

    checkFavoriteStatus();
  }, [user?.id, type, refId]);

  // 즐겨찾기 추가
  const addToFavorites = async () => {
    if (!alias.trim()) {
      alert('별칭을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await favoriteAPI.addFavorite({
        userId: user.id,
        type: type,
        refId: refId,
        refName: refName,
        additionalInfo: additionalInfo,
        alias: alias.trim()
      });
      setIsFavorite(true);
      setFavoriteId(response.data.id);
      setShowAliasModal(false);
      setAlias('');
    } catch (error) {
      console.error('즐겨찾기 추가 실패:', error);
      alert('즐겨찾기 추가 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 즐겨찾기 삭제
  const removeFromFavorites = async () => {
    setIsLoading(true);
    
    try {
      await favoriteAPI.removeFavorite(favoriteId, user.id);
      setIsFavorite(false);
      setFavoriteId(null);
    } catch (error) {
      console.error('즐겨찾기 삭제 실패:', error);
      alert('즐겨찾기 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 즐겨찾기 토글
  const toggleFavorite = async () => {
    if (!user?.id) {
      openAuthModal(pathname);
      return;
    }

    if (isFavorite) {
      // 즐겨찾기 삭제
      removeFromFavorites();
    } else {
      // 즐겨찾기 추가 - 별칭 입력 모달 표시
      setAlias(refName); // 기본값으로 이름 설정
      setShowAliasModal(true);
    }
  };

  if (!user?.id) {
    return null; // 로그인하지 않은 경우 버튼 숨김
  }

  return (
    <>
      <button
        onClick={toggleFavorite}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all duration-200 ${
          isFavorite 
            ? 'text-yellow-500 hover:text-yellow-600' 
            : 'text-gray-400 hover:text-yellow-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={isFavorite ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'}
      >
        {isLoading ? (
          <div className="w-5 h-5 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
        ) : (
          <svg 
            className={`w-6 h-6 ${isFavorite ? 'fill-current' : 'fill-none stroke-current stroke-2'}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
      </button>

      {/* 별칭 입력 모달 */}
      {showAliasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              즐겨찾기 별칭 설정
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                별칭 입력
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="별칭을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToFavorites();
                  }
                }}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAliasModal(false);
                  setAlias('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={addToFavorites}
                disabled={isLoading || !alias.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '추가 중...' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
