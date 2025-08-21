'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// RouteMapClient를 완전히 클라이언트 사이드에서만 로드
const RouteMapClient = dynamic(() => import('./RouteMapClient'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">노선 지도</h2>
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        지도 로딩중...
      </div>
    </div>
  )
});

export default function RouteMap({ stations = [], routeLines = [], routeName }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">노선 지도</h2>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          지도 로딩중...
        </div>
      </div>
    );
  }

  return <RouteMapClient stations={stations} routeLines={routeLines} routeName={routeName} />;
}