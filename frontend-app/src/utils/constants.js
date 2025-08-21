/**
 * 애플리케이션 전체에서 사용되는 상수들
 */

// 기본 위치 정보
export const DEFAULT_LOCATION = {
  lat: 37.4016,
  lng: 127.1086,
  name: 'KT 판교지사'
};

// 신고 타입 옵션
export const REPORT_TYPE_OPTIONS = [
  { value: 'SKIP_STOP', label: '무정차' },
  { value: 'BROKEN_STATION', label: '정류장 고장' },
  { value: 'DANGEROUS_DRIVING', label: '난폭운전' },
  { value: 'LATE_BUS', label: '지연버스' },
  { value: 'CROWDED_BUS', label: '과다혼잡' },
  { value: 'OTHER', label: '기타' }
];

// 신고 타입 라벨 조회 함수
export const getReportTypeLabel = (type) => {
  const option = REPORT_TYPE_OPTIONS.find(opt => opt.value === type);
  return option ? option.label : type;
};

// 빠른 선택 지역들
export const QUICK_LOCATIONS = [
  { place_name: 'KT 판교지사', address_name: '경기 성남시 분당구 판교역로 235', x: '127.1086', y: '37.4016', type: 'office' },
  { place_name: '강남역', address_name: '서울 강남구 테헤란로 152', x: '127.0276', y: '37.4979', type: 'station' },
  { place_name: '서울역', address_name: '서울 중구 한강대로 405', x: '126.9720', y: '37.5547', type: 'station' },
  { place_name: '명동', address_name: '서울 중구 명동길', x: '126.9997', y: '37.5663', type: 'shopping' },
  { place_name: '부산역', address_name: '부산 동구 중앙대로 206', x: '129.0422', y: '35.1158', type: 'station' },
  { place_name: '인천국제공항', address_name: '인천 중구 공항로 272', x: '126.4406', y: '37.4691', type: 'airport' }
];

// API 타임아웃 설정
export const API_TIMEOUTS = {
  LOCATION_SEARCH: 10000, // 10초
  REVERSE_GEOCODING: 5000, // 5초
  DEFAULT: 8000 // 8초
};

// 지도 설정
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 15,
  SELECTED_ZOOM: 16,
  LEAFLET_CSS_URL: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  TILE_LAYER_URL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  TILE_LAYER_ATTRIBUTION: '&copy; OpenStreetMap contributors'
};

// Leaflet 마커 아이콘 설정
export const LEAFLET_ICON_CONFIG = {
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
};
