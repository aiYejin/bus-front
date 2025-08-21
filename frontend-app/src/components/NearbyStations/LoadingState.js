'use client';

export default function LoadingState({ compact = false }) {
  if (compact) {
    return (
      <div className="flex justify-center items-center py-4 flex-1">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 text-sm">주변 정류장을 찾는 중...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">주변 정류장을 찾는 중...</span>
    </div>
  );
}
