'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { notificationAPI } from '@/services/api';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 알림 목록 가져오기
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }
    
    try {
      const response = await notificationAPI.getNotifications(user.id);
      const notificationsData = response.data || response;
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
      setNotifications([]);
    }
  }, [user?.id]);

  // 알림 추가
  const addNotification = useCallback(async (notificationData) => {
    if (!user?.id) return;
    
    try {
      const response = await notificationAPI.addNotification(notificationData);
      const newNotification = response.data || response;
      setNotifications(prev => [...prev, newNotification]);
      return newNotification;
    } catch (error) {
      console.error('알림 추가 실패:', error);
      throw error;
    }
  }, [user?.id]);

  // 알림 삭제
  const deleteNotification = useCallback(async (notificationId) => {
    if (!user?.id) return;
    
    try {
      await notificationAPI.deleteNotification(notificationId, user.id);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      throw error;
    }
  }, [user?.id]);

  // 특정 알림 찾기
  const findNotification = useCallback((stationId, routeId) => {
    return notifications.find(
      notif => notif.stationId === stationId && notif.routeId === routeId
    );
  }, [notifications]);

  // 알림 존재 여부 확인
  const hasNotification = useCallback((stationId, routeId) => {
    return notifications.some(
      notif => notif.stationId === stationId && notif.routeId === routeId
    );
  }, [notifications]);

  // 사용자 변경 시 알림 목록 새로고침
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const value = {
    notifications,
    isLoading,
    fetchNotifications,
    addNotification,
    deleteNotification,
    findNotification,
    hasNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
