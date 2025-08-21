'use client';

import { FaBus, FaMapMarkerAlt, FaHeart, FaClock } from 'react-icons/fa';
import { calculateDistance } from '@/utils/distanceCalculator';

export default function StationCard({ 
  station, 
  userLocation, 
  onStationClick, 
  compact = false 
}) {
  const handleStationClick = () => {
    onStationClick(station.stationId);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    // 즐겨찾기 추가 기능 (추후 구현)
  };

  const distance = userLocation 
    ? calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        station.lat, 
        station.lng
      )
    : '거리 계산 중...';

  if (compact) {
    return (
      <div
        onClick={handleStationClick}
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
                <span>{distance}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={handleFavoriteClick}
              className="text-gray-400 hover:text-red-500 transition-colors text-sm"
            >
              <FaHeart />
            </button>
            <FaClock className="text-gray-400 text-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleStationClick}
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
              <span>{distance}</span>
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
            onClick={handleFavoriteClick}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaHeart />
          </button>
          <FaClock className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
