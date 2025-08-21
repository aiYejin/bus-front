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
    console.log('[알림 체커] 체크 시작');
    console.log('[알림 체커] user?.id:', user?.id);
    console.log('[알림 체커] notifications.length:', notifications.length);
    console.log('[알림 체커] isChecking:', isChecking);
    
    // 알림이 없으면 체크하지 않음
    if (!user?.id || notifications.length === 0 || isChecking) {
      console.log('[알림 체커] 체크 조건 불만족 - 종료');
      return;
    }
    
    setIsChecking(true);
    
    try {
      for (const notification of notifications) {
        // 정류장 도착 정보 가져오기
        const response = await busAPI.getStationArrivals(notification.stationId);
        const arrivals = response.data || [];
        
        console.log(`[알림 체크] 정류장 ${notification.stationId}, 노선 ${notification.routeId}`);
        console.log(`[알림 체크] 도착 정보:`, arrivals);
        
        // 해당 노선의 도착 정보 찾기
        const targetArrival = arrivals.find(arrival => arrival.routeId === notification.routeId);
        
        console.log(`[알림 체크] 대상 노선:`, targetArrival);
        console.log(`[알림 체크] 남은 시간: ${targetArrival?.remainMin1}, 알림 설정: ${notification.alertMinutes}분`);
        
        if (targetArrival && targetArrival.remainMin1 && targetArrival.remainMin1 <= notification.alertMinutes) {
          // 알림 발생!
          console.log(`[알림 발생!] ${targetArrival.routeName} • ${notification.stationName} • ${targetArrival.remainMin1}분 남음`);
          const message = `${targetArrival.routeName} • ${notification.stationName || '정류장'} • ${notification.alertMinutes}분 이내 도착!`;
          
          console.log('[알림 발생!] 메시지:', message);
          
          // 브라우저 알림 권한 확인 및 요청
          console.log('[알림 발생!] 현재 권한 상태:', Notification.permission);
          
          let permission = Notification.permission;
          
          if (permission === 'default') {
            console.log('[알림 발생!] 권한 요청 중...');
            permission = await Notification.requestPermission();
            console.log('[알림 발생!] 권한 요청 결과:', permission);
          }
          
          // 브라우저 알림 표시
          if (permission === 'granted') {
            console.log('[알림 발생!] 브라우저 알림 생성 중...');
            try {
              const notification = new Notification('🚌 버스 도착 알림', {
                body: message,
                icon: '/logo.png',
                badge: '/logo.png',
                tag: 'bus-arrival',
                requireInteraction: true,
                timestamp: Date.now()
              });
              
              console.log('[알림 발생!] 브라우저 알림 생성 완료:', notification);
              
              // 클릭 이벤트 추가
              notification.onclick = function() {
                window.focus();
                notification.close();
              };
              
            } catch (error) {
              console.error('[알림 발생!] 브라우저 알림 생성 실패:', error);
            }
          } else {
            console.log('[알림 발생!] 브라우저 알림 권한 없음:', permission);
          }
          
          // 해당 알림 삭제
          await deleteNotification(notification.id);
          
          console.log('[알림 발생!] 메시지 반환:', message);
          
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
    console.log('[알림 체커] useEffect 실행');
    console.log('[알림 체커] user?.id:', user?.id);
    
    if (!user?.id) {
      console.log('[알림 체커] 사용자 없음 - 종료');
      return;
    }
    
    console.log('[알림 체커] 15초 간격 타이머 시작');
    
    // 15초마다 버스 도착 시간 확인 (알림이 있을 때만)
    const interval = setInterval(async () => {
      console.log('[알림 체커] 타이머 실행');
      const message = await checkNotifications();
      if (message) {
        // Toast 알림을 위한 이벤트 발생
        console.log('[알림 체커] Toast 이벤트 발생:', message);
        window.dispatchEvent(new CustomEvent('showNotification', { detail: message }));
      }
    }, 15000);
    
    return () => {
      console.log('[알림 체커] 타이머 정리');
      clearInterval(interval);
    };
  }, [user?.id, checkNotifications]);
}
