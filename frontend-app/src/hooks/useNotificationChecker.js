'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { busAPI } from '@/services/api';

export default function useNotificationChecker() {
  const { user } = useAuth();
  const { notifications, deleteNotification } = useNotifications();
  const [isChecking, setIsChecking] = useState(false);

  // 알림 체크 및 처리
  const checkNotifications = useCallback(async () => {

    
    // 알림이 없으면 체크하지 않음
    if (!user?.id || notifications.length === 0 || isChecking) {

      return;
    }
    
    setIsChecking(true);
    
    try {
      for (const notification of notifications) {
        // 정류장 도착 정보 가져오기
        const response = await busAPI.getStationArrivals(notification.stationId);
        const arrivals = response.data || [];
        

        
        // 해당 노선의 도착 정보 찾기
        const targetArrival = arrivals.find(arrival => arrival.routeId === notification.routeId);
        

        
        if (targetArrival && targetArrival.remainMin1 && targetArrival.remainMin1 <= notification.alertMinutes) {
          // 알림 발생!

          const message = `${targetArrival.routeName} • ${notification.stationName || '정류장'} • ${notification.alertMinutes}분 이내 도착!`;
          

          
          // 브라우저 알림 권한 확인 및 요청

          
          let permission = Notification.permission;
          
          if (permission === 'default') {
            permission = await Notification.requestPermission();
          }
          
          // 브라우저 알림 표시
          if (permission === 'granted') {

            try {
              const notification = new Notification('🚌 버스 도착 알림', {
                body: message,
                icon: '/logo.png',
                badge: '/logo.png',
                tag: 'bus-arrival',
                requireInteraction: true,
                timestamp: Date.now()
              });
              

              
              // 클릭 이벤트 추가
              notification.onclick = function() {
                window.focus();
                notification.close();
              };
              
            } catch (error) {
              console.error('브라우저 알림 생성 실패:', error);
            }
          } else {

          }
          
          // 해당 알림 삭제
          await deleteNotification(notification.id);
          

          
          // 콜백으로 알림 메시지 전달 (Toast 표시용)
          return message;
        }
      }
    } catch (error) {
      console.error('알림 체크 실패:', error);
    } finally {
      setIsChecking(false);
    }
    
    return null;
  }, [user?.id, notifications, isChecking, deleteNotification]);

  // 15초마다 버스 도착 시간 확인
  useEffect(() => {

    
    if (!user?.id) {

      return;
    }
    

    
    // 15초마다 버스 도착 시간 확인 (알림이 있을 때만)
    const interval = setInterval(async () => {

      const message = await checkNotifications();
      if (message) {
        // Toast 알림을 위한 이벤트 발생

        window.dispatchEvent(new CustomEvent('showNotification', { detail: message }));
      }
    }, 15000);
    
    return () => {

      clearInterval(interval);
    };
  }, [user?.id, checkNotifications]);
}
