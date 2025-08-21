'use client';

import { FaMapMarkerAlt, FaBus } from 'react-icons/fa';

export default function EmptyState({ 
  type = 'no-location', // 'no-location' | 'no-stations'
  onGetLocation,
  compact = false 
}) {
  if (type === 'no-location') {
    if (compact) {
      return (
        <div className="text-center py-6 flex-1 flex flex-col justify-center">
          <FaMapMarkerAlt className="text-3xl text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm mb-3">현재 위치를 확인하여 주변 정류장을 찾아보세요</p>
          <button
            onClick={onGetLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            현재 위치 확인하기
          </button>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <FaMapMarkerAlt className="text-4xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">현재 위치를 확인하여 주변 정류장을 찾아보세요</p>
        <button
          onClick={onGetLocation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          현재 위치 확인하기
        </button>
      </div>
    );
  }

  // no-stations
  if (compact) {
    return (
      <div className="text-center py-6 flex-1 flex flex-col justify-center">
        <FaBus className="text-3xl text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">주변에 정류장이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <FaBus className="text-4xl text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">주변에 정류장이 없습니다</p>
      <p className="text-sm text-gray-500 mt-2">다른 위치에서 다시 시도해보세요</p>
    </div>
  );
}
