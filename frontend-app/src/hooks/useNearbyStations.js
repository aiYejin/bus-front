'use client';

import { useState, useEffect } from 'react';
import { busAPI } from '@/services/api';

export const useNearbyStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // 사용자 위치 가져오기
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchNearbyStations(latitude, longitude);
      },
      (error) => {
        console.error('위치 정보 가져오기 실패:', error);
        setError('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        setLoading(false);
      }
    );
  };

  // 주변 정류장 가져오기
  const fetchNearbyStations = async (lat, lng) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await busAPI.getStationsAround(lat, lng);
      setStations(response.data.stations || []);
    } catch (err) {
      console.error('주변 정류장 가져오기 실패:', err);
      setError('주변 정류장 정보를 가져올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 정류장 클릭 시 상세 페이지로 이동
  const handleStationClick = (stationId) => {
    window.location.href = `/station/${stationId}`;
  };

  // 사용자 위치가 변경되면 주변 정류장 다시 조회
  useEffect(() => {
    if (userLocation) {
      fetchNearbyStations(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  return {
    stations,
    loading,
    error,
    userLocation,
    getUserLocation,
    fetchNearbyStations,
    handleStationClick
  };
};
