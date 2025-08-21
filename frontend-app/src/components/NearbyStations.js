'use client';

import { FaLocationArrow } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

// 커스텀 훅과 분리된 컴포넌트들 import
import { useNearbyStations } from '@/hooks/useNearbyStations';
import StationCard from './NearbyStations/StationCard';
import LoadingState from './NearbyStations/LoadingState';
import EmptyState from './NearbyStations/EmptyState';
import ErrorState from './NearbyStations/ErrorState';

const NearbyStations = ({ compact = false }) => {
  const {
    stations,
    loading,
    error,
    userLocation,
    getUserLocation,
    handleStationClick
  } = useNearbyStations();

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

        {error && <ErrorState error={error} compact={true} />}

        {loading && !stations.length && <LoadingState compact={true} />}

        {!loading && !error && !userLocation && (
          <EmptyState type="no-location" onGetLocation={getUserLocation} compact={true} />
        )}

        {stations.length > 0 && (
          <div className="space-y-3 flex-1 overflow-y-auto">
            {stations.slice(0, 6).map((station) => (
              <StationCard
                key={station.stationId}
                station={station}
                userLocation={userLocation}
                onStationClick={handleStationClick}
                compact={true}
              />
            ))}
          </div>
        )}

        {!loading && !error && userLocation && stations.length === 0 && (
          <EmptyState type="no-stations" compact={true} />
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
            <FaLocationArrow />
            <span>{loading ? '위치 확인 중...' : '현재 위치로 찾기'}</span>
          </button>
        </div>

        {error && <ErrorState error={error} compact={false} />}

        {loading && !stations.length && <LoadingState compact={false} />}

        {!loading && !error && !userLocation && (
          <EmptyState type="no-location" onGetLocation={getUserLocation} compact={false} />
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
              {stations.map((station) => (
                <StationCard
                  key={station.stationId}
                  station={station}
                  userLocation={userLocation}
                  onStationClick={handleStationClick}
                  compact={false}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && userLocation && stations.length === 0 && (
          <EmptyState type="no-stations" compact={false} />
        )}
      </div>
    </div>
  );
};

export default NearbyStations;
