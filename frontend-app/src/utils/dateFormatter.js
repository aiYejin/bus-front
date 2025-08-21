/**
 * 날짜 포맷 관련 유틸리티 함수들
 */

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 날짜를 간단한 한국어 형식으로 포맷팅 (년-월-일만)
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDateOnly = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};

/**
 * 상대적 시간 표현 (예: "3분 전", "1시간 전")
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} 상대적 시간 문자열
 */
export const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return '방금 전';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  }
  
  return formatDateOnly(dateString);
};
