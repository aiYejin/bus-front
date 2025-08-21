import axios from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// API 함수들
export const authAPI = {
  // 로그인
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  
  // 회원가입
  signup: (userData) => apiClient.post('/api/auth/signup', userData),
};

export const busAPI = {
  // 통합 검색 (노선/정류장)
  search: (query) => apiClient.get('/api/search', { params: { q: query } }),
  
  // 정류장 상세 정보 (도착 정보 포함)
  getStationDetail: (stationId) => apiClient.get(`/api/stations/${stationId}/detail`),
  
  // 노선 상세 정보 (정류장 목록 포함)
  getRouteDetail: (routeId) => apiClient.get(`/api/routes/${routeId}/detail`),
  
  // 주변 정류장 검색
  getStationsAround: (lat, lng) => apiClient.get('/api/stations/around', { 
    params: { x: lng, y: lat } 
  }),
  
  // 사용자 위치 업데이트
  updateUserLocation: (userId, lat, lng) => apiClient.put(`/api/users/${userId}/location`, null, {
    params: { lat, lng }
  }),
};

export const favoriteAPI = {
  // 즐겨찾기 목록 조회
  getFavorites: (userId) => apiClient.get('/api/favorites', { params: { userId } }),
  
  // 즐겨찾기 추가
  addFavorite: (favoriteData) => apiClient.post('/api/favorites', favoriteData),
  
  // 즐겨찾기 삭제
  removeFavorite: (favoriteId, userId) => apiClient.delete(`/api/favorites/${favoriteId}`, {
    params: { userId }
  }),
};

export const recentAPI = {
  // 최근 검색 목록 조회
  getRecents: (userId) => apiClient.get('/api/recents', { params: { userId } }),
  
  // 최근 검색 추가
  addRecent: (recentData) => apiClient.post('/api/recents', recentData),
  
  // 최근 검색 삭제
  removeRecent: (recentId) => apiClient.delete(`/api/recents/${recentId}`),
};

export const notificationAPI = {
  // 알림 목록 조회
  getNotifications: () => apiClient.get('/api/notifications'),
  
  // 알림 읽음 처리
  markAsRead: (notificationId) => apiClient.put(`/api/notifications/${notificationId}/read`),
  
  // 알림 삭제
  deleteNotification: (notificationId) => apiClient.delete(`/api/notifications/${notificationId}`),
};

export const reportAPI = {
  // 버스 신고
  reportBus: (reportData) => apiClient.post('/api/bus-reports', reportData),
  
  // 신고 목록 조회
  getReports: () => apiClient.get('/api/bus-reports'),
};

export default apiClient;