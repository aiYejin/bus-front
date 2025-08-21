'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { busAPI } from '../services/api';
import { FaMapMarkerAlt, FaBus, FaClock, FaHeart, FaLocationArrow } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const NearbyStations = ({ compact = false }) => {
  const { user } = useAuth();
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

  // 거리 계산 (Haversine 공식)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 1 ? Math.round(distance * 1000) + 'm' : distance.toFixed(1) + 'km';
  };

  useEffect(() => {
    if (userLocation) {
      fetchNearbyStations(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  // 컴팩트 모드 (대시보드용)
  if (compact) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MdLocationOn className="text-xl text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">주변 정류장</h3>
          </div>
          <button
            onClick={getUserLocation}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
          >
            <FaLocationArrow className="text-xs" />
            <span>{loading ? '위치 확인 중...' : '현재 위치'}</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
            {error}
          </div>
        )}

        {loading && !stations.length && (
          <div className="flex justify-center items-center py-4 flex-1">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 text-sm">주변 정류장을 찾는 중...</span>
          </div>
        )}

        {!loading && !error && !userLocation && (
          <div className="text-center py-6 flex-1 flex flex-col justify-center">
            <FaMapMarkerAlt className="text-3xl text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm mb-3">현재 위치를 확인하여 주변 정류장을 찾아보세요</p>
            <button
              onClick={getUserLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              현재 위치 확인하기
            </button>
          </div>
        )}

        {stations.length > 0 && (
          <div className="space-y-3 flex-1 overflow-y-auto">
            {stations.slice(0, 6).map((station, index) => (
              <div
                key={station.stationId}
                onClick={() => handleStationClick(station.stationId)}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <FaBus className="text-blue-600 text-sm" />
                      <h4 className="font-medium text-gray-900 text-sm">
                        {station.stationName}
                      </h4>
                      {station.arsId && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded">
                          ARS: {station.arsId}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>
                          {userLocation 
                            ? calculateDistance(
                                userLocation.lat, 
                                userLocation.lng, 
                                station.lat, 
                                station.lng
                              )
                            : '거리 계산 중...'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // 즐겨찾기 추가 기능 (추후 구현)
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    >
                      <FaHeart />
                    </button>
                    <FaClock className="text-gray-400 text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && userLocation && stations.length === 0 && (
          <div className="text-center py-6 flex-1 flex flex-col justify-center">
            <FaBus className="text-3xl text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">주변에 정류장이 없습니다</p>
          </div>
        )}
      </div>
    );
  }

  // 전체 모드 (독립 페이지용)
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <MdLocationOn className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">주변 정류장</h2>
          </div>
          <button
            onClick={getUserLocation}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FaMapMarkerAlt />
            <span>{loading ? '위치 확인 중...' : '현재 위치로 찾기'}</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && !stations.length && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">주변 정류장을 찾는 중...</span>
          </div>
        )}

        {!loading && !error && !userLocation && (
          <div className="text-center py-8">
            <FaMapMarkerAlt className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">현재 위치를 확인하여 주변 정류장을 찾아보세요</p>
            <button
              onClick={getUserLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              현재 위치 확인하기
            </button>
          </div>
        )}

        {stations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>총 {stations.length}개의 정류장을 찾았습니다</span>
              {userLocation && (
                <span className="text-xs">
                  기준 위치: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                </span>
              )}
            </div>
            
            <div className="grid gap-4">
              {stations.map((station, index) => (
                <div
                  key={station.stationId}
                  onClick={() => handleStationClick(station.stationId)}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 cursor-pointer transition-colors border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaBus className="text-blue-600" />
                        <h3 className="font-semibold text-lg text-gray-800">
                          {station.stationName}
                        </h3>
                        {station.arsId && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            ARS: {station.arsId}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span>
                            {userLocation 
                              ? calculateDistance(
                                  userLocation.lat, 
                                  userLocation.lng, 
                                  station.lat, 
                                  station.lng
                                )
                              : '거리 계산 중...'
                            }
                          </span>
                        </div>
                        
                        {station.lat && station.lng && (
                          <div className="flex items-center space-x-1">
                            <span>위도: {station.lat.toFixed(6)}</span>
                            <span>경도: {station.lng.toFixed(6)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // 즐겨찾기 추가 기능 (추후 구현)
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FaHeart />
                      </button>
                      <FaClock className="text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && userLocation && stations.length === 0 && (
          <div className="text-center py-8">
            <FaBus className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">주변에 정류장이 없습니다</p>
            <p className="text-sm text-gray-500 mt-2">다른 위치에서 다시 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyStations;
