'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { busAPI, recentAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import FavoriteButton from '@/components/FavoriteButton';

export default function RouteDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const routeId = params.routeId;
  const { user } = useAuth();
  const [routeDetail, setRouteDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRouteDetail = async () => {
      if (!routeId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await busAPI.getRouteDetail(routeId);
        setRouteDetail(response.data);
        
        // 검색을 통해 들어온 경우에만 최근 검색에 추가
        const isFromSearch = searchParams.get('from') === 'search';
        if (isFromSearch && user?.id && response.data) {
          try {
            await recentAPI.addRecent({
              userId: user.id,
              entityType: 'ROUTE',
              refId: response.data.routeId,
              refName: response.data.routeName,
              additionalInfo: `${response.data.startStationName} ↔ ${response.data.endStationName}`
            });
          } catch (err) {
            console.error('최근 검색 추가 실패:', err);
          }
        }
      } catch (err) {
        console.error('노선 상세정보 조회 실패:', err);
        setError('노선 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteDetail();
  }, [routeId, searchParams, user?.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">노선 정보를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!routeDetail) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">노선 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 노선 기본 정보 */}
                     <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-4">
                 <h1 className="text-3xl font-bold text-gray-900">{routeDetail.routeName}</h1>
                 <FavoriteButton 
                   type="ROUTE"
                   refId={routeDetail.routeId}
                   refName={routeDetail.routeName}
                   additionalInfo={`${routeDetail.startStationName} ↔ ${routeDetail.endStationName}`}
                 />
               </div>
               <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                 {routeDetail.routeTypeName}
               </div>
             </div>
            
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">노선 정보</h3>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">기점:</span>
                     <span className="font-semibold text-gray-900">{routeDetail.startStationName}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">종점:</span>
                     <span className="font-semibold text-gray-900">{routeDetail.endStationName}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">운영구역:</span>
                     <span className="font-semibold text-gray-900">{routeDetail.regionName}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">운수사:</span>
                     <span className="font-semibold text-gray-900">{routeDetail.companyName}</span>
                   </div>
                 </div>
               </div>
               
               <div>
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">운행 시간</h3>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">상행 첫차:</span>
                     <span className="font-semibold text-gray-900">{routeDetail.upFirstTime}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">상행 막차:</span>
                     <span className="font-semibold text-gray-900">{routeDetail.upLastTime}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">하행 첫차:</span>
                     <span className="font-semibold text-gray-900">{routeDetail.downFirstTime}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">하행 막차:</span>
                     <span className="font-semibold text-gray-900">{routeDetail.downLastTime}</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>

                     {/* 정류장 목록 */}
           <div className="bg-white rounded-lg shadow-sm border p-6">
             <h2 className="text-xl font-semibold text-gray-800 mb-4">
               정류장 목록 ({routeDetail.stations ? routeDetail.stations.length : 0}개)
             </h2>
             
             {routeDetail.stations && routeDetail.stations.length > 0 ? (
                               <div className="relative">
                  <div className="space-y-0">
                    {routeDetail.stations.map((station, index) => (
                      <div
                        key={station.stationId}
                        className="relative flex items-center py-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => window.location.href = `/station/${station.stationId}`}
                      >
                        {/* 세로 라인 - 첫 번째는 아래쪽만, 마지막은 위쪽만, 중간은 전체 */}
                        <div className={`absolute left-6 w-0.5 bg-red-500 ${
                          index === 0 ? 'top-1/2 bottom-0' : // 첫 번째: 아래쪽만
                          index === routeDetail.stations.length - 1 ? 'top-0 bottom-1/2' : // 마지막: 위쪽만
                          'top-0 bottom-0' // 중간: 전체
                        }`}></div>
                        
                        {/* 화살표 아이콘 */}
                        <div className="absolute left-4 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center z-10">
                          <svg className="w-2 h-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                       
                       {/* 정류장 정보 */}
                       <div className="ml-12 flex-1">
                         <div className="font-semibold text-gray-900 text-lg">{station.stationName}</div>
                         <div className="text-sm text-gray-600 mt-1">
                           {station.mobileNo || '정보없음'}
                         </div>
                       </div>
                       
                       {/* 추가 정보 배지 */}
                       <div className="flex space-x-2">
                         {station.centerYn === 'Y' && (
                           <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                             중앙차로
                           </span>
                         )}
                         {station.turnYn === 'Y' && (
                           <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                             회차
                           </span>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             ) : (
               <div className="text-center text-gray-500 py-8">
                 정류장 정보가 없습니다.
               </div>
             )}
           </div>
        </div>
      </div>
    </Layout>
  );
}
