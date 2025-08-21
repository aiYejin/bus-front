'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

export default function NotificationButton({ stationId, routeId, routeName, stationName, alertMinutes = 3 }) {
  const { user } = useAuth();
  const { hasNotification, addNotification, deleteNotification, findNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(alertMinutes);
  
  const isNotificationSet = hasNotification(stationId, routeId);

  const handleNotificationToggle = async (e) => {
    // 이벤트 전파 중단
    e.stopPropagation();
    
    if (!user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

         if (isNotificationSet) {
       // 알림 해제
       setIsLoading(true);
       try {
         const notification = findNotification(stationId, routeId);
         if (notification) {
           await deleteNotification(notification.id);
         }
       } catch (error) {
         console.error('알림 해제 실패:', error);
         alert('알림 해제에 실패했습니다.');
       } finally {
         setIsLoading(false);
       }
    } else {
      // 알림 설정
      setShowTimeSelector(true);
    }
  };

  const handleSetNotification = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await addNotification({
        userId: user.id,
        stationId,
        routeId,
        stationName,
        routeName,
        alertMinutes: selectedMinutes,
        startTime: new Date().toISOString()
      });
      
      setShowTimeSelector(false);
    } catch (error) {
      console.error('알림 설정 실패:', error);
      alert('알림 설정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.id) {
    return null; // 로그인하지 않은 사용자에게는 버튼을 보여주지 않음
  }

  return (
    <div className="relative">
      <button
        onClick={handleNotificationToggle}
        disabled={isLoading}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          isNotificationSet
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isNotificationSet ? '알림 해제' : '알림 설정'}
      </button>

             {/* 시간 선택 모달 */}
       {showTimeSelector && (
         <div 
           className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-48"
           onClick={(e) => e.stopPropagation()}
         >
          <div className="text-sm font-medium text-gray-900 mb-3">알림 시간 설정</div>
          <div className="space-y-2">
            {[1, 3, 5, 10].map((minutes) => (
              <label key={minutes} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="alertMinutes"
                  value={minutes}
                  checked={selectedMinutes === minutes}
                  onChange={(e) => setSelectedMinutes(parseInt(e.target.value))}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">{minutes}분 전</span>
              </label>
            ))}
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleSetNotification}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              설정
            </button>
                         <button
               onClick={(e) => {
                 e.stopPropagation();
                 setShowTimeSelector(false);
               }}
               className="flex-1 bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
             >
               취소
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
