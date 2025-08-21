'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { busAPI } from '@/services/api';

// Leaflet 컴포넌트를 동적으로 로드 (SSR 방지)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const useMapEvents = dynamic(() => import('react-leaflet').then(mod => mod.useMapEvents), { ssr: false });

// KT 판교지사 좌표 (기본값)
const DEFAULT_LOCATION = {
  lat: 37.4016,
  lng: 127.1086,
  name: 'KT 판교지사'
};

// 지도 클릭 이벤트 핸들러
function MapClickHandler({ onLocationSelect }) {
  if (typeof useMapEvents === 'function') {
    useMapEvents({
      click: (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
  }
  return null;
}



export default function LocationSelector({ isOpen, onClose, onLocationUpdate }) {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]);
  const [mapZoom, setMapZoom] = useState(15);

  // 컴포넌트 마운트 시 Leaflet CSS 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Leaflet 아이콘 설정
      import('leaflet').then((L) => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
        setIsMapLoaded(true);
      });
    }
  }, []);

  // 사용자 현재 위치 로드
  useEffect(() => {
    if (user?.currentLat && user?.currentLng) {
      setSelectedLocation({
        lat: user.currentLat,
        lng: user.currentLng,
        name: user.currentLocationName || '현재 위치'
      });
      setMapCenter([user.currentLat, user.currentLng]);
    }
  }, [user]);

  // 실제 위치 검색 API
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // 한국 지역 최적화된 검색
      const koreanQuery = encodeURIComponent(query + ', 대한민국');
      
      // AbortController로 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${koreanQuery}&limit=15&countrycodes=kr&dedupe=1&addressdetails=1&accept-language=ko,en`,
        { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'BusAlimi/1.0'
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          const formattedResults = data
            .filter(item => item.lat && item.lon)
            .map(item => {
              // 한국어 주소 포맷팅
              let displayName = item.display_name;
              let placeName = item.name || displayName.split(',')[0];
              
              // 주소에서 한국어 부분 추출
              if (item.address) {
                const addr = item.address;
                const koreanParts = [];
                
                if (addr.state) koreanParts.push(addr.state);
                if (addr.city || addr.county) koreanParts.push(addr.city || addr.county);
                if (addr.borough || addr.district) koreanParts.push(addr.borough || addr.district);
                if (addr.neighbourhood || addr.suburb) koreanParts.push(addr.neighbourhood || addr.suburb);
                if (addr.road) koreanParts.push(addr.road);
                
                if (koreanParts.length > 0) {
                  displayName = koreanParts.join(' ');
                }
              }
              
              return {
                place_name: placeName,
                address_name: displayName,
                x: item.lon,
                y: item.lat,
                type: item.type || 'place',
                importance: item.importance || 0.5
              };
            })
            .sort((a, b) => (b.importance || 0) - (a.importance || 0));
          
          setSearchResults(formattedResults);
        } else {
          // 검색 결과가 없으면 빠른 선택 지역들을 보여줌
          showQuickLocations(query);
        }
      } else {
        throw new Error('Search API error');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('검색 타임아웃');
        setSearchResults([]);
        alert('검색 시간이 초과되었습니다. 다시 시도해주세요.');
      } else {
        console.error('위치 검색 오류:', error);
        // 오류 시 빠른 선택 지역들을 보여줌
        showQuickLocations(query);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 실패 시 빠른 선택 지역들 표시
  const showQuickLocations = (query) => {
    const quickLocations = [
      { place_name: 'KT 판교지사', address_name: '경기 성남시 분당구 판교역로 235', x: '127.1086', y: '37.4016', type: 'office' },
      { place_name: '강남역', address_name: '서울 강남구 테헤란로 152', x: '127.0276', y: '37.4979', type: 'station' },
      { place_name: '서울역', address_name: '서울 중구 한강대로 405', x: '126.9720', y: '37.5547', type: 'station' },
      { place_name: '명동', address_name: '서울 중구 명동길', x: '126.9997', y: '37.5663', type: 'shopping' },
      { place_name: '부산역', address_name: '부산 동구 중앙대로 206', x: '129.0422', y: '35.1158', type: 'station' },
      { place_name: '인천국제공항', address_name: '인천 중구 공항로 272', x: '126.4406', y: '37.4691', type: 'airport' }
    ];
    
    // 검색어와 일치하는 것들만 필터링
    const filtered = quickLocations.filter(location => 
      location.place_name.toLowerCase().includes(query.toLowerCase()) || 
      location.address_name.includes(query)
    );
    
    setSearchResults(filtered.length > 0 ? filtered : []);
  };

  // 역지오코딩 - 좌표를 주소로 변환
  const reverseGeocode = async (lat, lng) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ko,en&addressdetails=1&zoom=18`,
        { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'BusAlimi/1.0'
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.address) {
          const addr = data.address;
          const addressParts = [];
          
          if (addr.state) addressParts.push(addr.state);
          if (addr.city || addr.county) addressParts.push(addr.city || addr.county);
          if (addr.borough || addr.district) addressParts.push(addr.borough || addr.district);
          if (addr.neighbourhood || addr.suburb) addressParts.push(addr.neighbourhood || addr.suburb);
          if (addr.road) addressParts.push(addr.road);
          
          const formattedAddress = addressParts.length > 0 
            ? addressParts.join(' ') 
            : data.display_name;
          
          return formattedAddress || '선택한 위치';
        }
        
        return data.display_name || '선택한 위치';
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('역지오코딩 타임아웃');
      } else {
        console.error('역지오코딩 오류:', error);
      }
    }
    
    return `선택한 위치 (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  };

  // 위치 선택 처리
  const handleLocationSelect = async (lat, lng, name = null, resultIndex = null) => {
    let locationName = name;
    
    // 이름이 제공되지 않은 경우 (지도 클릭 등) 역지오코딩으로 주소 찾기
    if (!name) {
      locationName = await reverseGeocode(lat, lng);
    }
    
    setSelectedLocation({ lat, lng, name: locationName });
    setMapCenter([lat, lng]);
    setMapZoom(16);
    
    // 검색 결과에서 선택한 경우 해당 인덱스 저장 (검색 결과는 유지)
    if (resultIndex !== null) {
      setSelectedResultIndex(resultIndex);
    } else {
      // 지도 클릭인 경우 검색 결과 초기화
      setSearchResults([]);
      setSearchQuery('');
      setSelectedResultIndex(null);
    }
  };

  // 위치 업데이트 저장
  const handleSaveLocation = async () => {
    if (!user?.id) return;

    try {
      await busAPI.updateUserLocation(user.id, selectedLocation.lat, selectedLocation.lng, selectedLocation.name);
      onLocationUpdate({
        ...user,
        currentLat: selectedLocation.lat,
        currentLng: selectedLocation.lng,
        currentLocationName: selectedLocation.name,
        locationUpdatedAt: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('위치 업데이트 오류:', error);
      alert('위치 업데이트에 실패했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden" style={{ height: '85vh' }}>
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">위치 설정</h2>
              <p className="text-blue-100 text-sm mt-1">원하는 위치를 선택하거나 검색해보세요</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100 shadow-md"
            >
              <span className="text-xl text-gray-600 font-bold">×</span>
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 사이드바 - 검색 패널 */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* 검색 섹션 */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">위치 검색</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="주소나 장소명을 입력하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchLocation(searchQuery)}
                  className="w-full pl-5 pr-16 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-base font-medium bg-white shadow-sm"
                />
                <button
                  onClick={() => searchLocation(searchQuery)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-200 font-medium"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>검색</span>
                  )}
                </button>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                전국 실시간 검색 • 예: 강남역, 부산역, 판교
              </div>
            </div>



            {/* 검색 결과 */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {isLoading ? (
                                  <div className="text-center py-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-gray-600 font-medium mb-1">실제 위치를 검색 중...</div>
                  <div className="text-xs text-gray-400">OpenStreetMap에서 검색하고 있습니다</div>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <span className="text-blue-800 font-semibold">
                        {searchResults.length}개의 검색 결과
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => handleLocationSelect(
                          parseFloat(result.y),
                          parseFloat(result.x),
                          result.place_name,
                          index
                        )}
                        className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg ${
                          selectedResultIndex === index 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-blue-50 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-lg text-gray-900 mb-2">{result.place_name}</div>
                            <div className="text-sm text-gray-600 leading-relaxed mb-2">{result.address_name}</div>
                            {result.type && (
                              <div>
                                <span className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full font-medium">
                                  {result.type}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            {selectedResultIndex === index ? (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">✓</span>
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery && !isLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">-</span>
                  </div>
                  <div className="text-gray-700 font-semibold text-lg mb-3">검색 결과가 없습니다</div>
                  <div className="text-gray-500 leading-relaxed">
                    다른 키워드로 검색해보세요<br />
                    <span className="text-sm text-gray-400 mt-2 block">※ 실시간 OpenStreetMap 검색</span>
                  </div>
                </div>
              ) : !searchQuery ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-sm font-medium">검색</span>
                  </div>
                  <div className="text-gray-700 font-semibold text-lg mb-3">위치를 검색해보세요</div>
                  <div className="text-gray-500 leading-relaxed">
                    주소나 장소명을 입력하거나<br />
                    지도에서 직접 클릭하세요<br />
                    <span className="text-sm text-gray-400 mt-2 block">※ 전국 실시간 검색 지원</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* 지도 영역 */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 relative overflow-hidden">
              {isMapLoaded ? (
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
                >
                  <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                  <MapClickHandler onLocationSelect={handleLocationSelect} />
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="text-gray-600 font-medium">지도 로딩 중...</div>
                    <div className="text-sm text-gray-400 mt-1">잠시만 기다려주세요</div>
                  </div>
                </div>
              )}
            </div>

            {/* 선택된 위치 정보 카드 */}
            <div className="bg-white border-t border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">선택된 위치</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-semibold text-gray-900 mb-2">{selectedLocation.name}</div>
                    <div className="text-sm text-gray-600 mb-3 leading-relaxed">
                      위도: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedLocation.lat.toFixed(6)}</span>
                      <br />
                      경도: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedLocation.lng.toFixed(6)}</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            설정한 위치는 다음 로그인 시에도 유지됩니다
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              취소
            </button>
            <button
              onClick={handleSaveLocation}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              위치 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}