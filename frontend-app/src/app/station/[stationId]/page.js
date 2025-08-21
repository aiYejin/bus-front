'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { busAPI, recentAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import FavoriteButton from '@/components/FavoriteButton';

export default function StationDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const stationId = params.stationId;
  const { user } = useAuth();
  const [stationDetail, setStationDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStationDetail = async () => {
      if (!stationId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await busAPI.getStationDetail(stationId);
        setStationDetail(response.data);
        
        // 검색을 통해 들어온 경우에만 최근 검색에 추가
        const isFromSearch = searchParams.get('from') === 'search';
        if (isFromSearch && user?.id && response.data) {
          try {
            await recentAPI.addRecent({
              userId: user.id,
              entityType: 'STOP',
              refId: response.data.stationId,
              refName: response.data.stationName,
              additionalInfo: `ARS: ${response.data.arsId || '정보없음'}`
            });
          } catch (err) {
            console.error('최근 검색 추가 실패:', err);
          }
        }
      } catch (err) {
        console.error('정류장 상세정보 조회 실패:', err);
        setError('정류장 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStationDetail();
  }, [stationId, searchParams, user?.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">정류장 정보를 불러오는 중...</p>
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

  if (!stationDetail) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">정류장 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 정류장 기본 정보 */}
                     <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-4">
                 <h1 className="text-3xl font-bold text-gray-900">{stationDetail.stationName}</h1>
                 <FavoriteButton 
                   type="STOP"
                   refId={stationDetail.stationId}
                   refName={stationDetail.stationName}
                   additionalInfo={`ARS: ${stationDetail.arsId || '정보없음'}`}
                 />
               </div>
               <div className="flex space-x-2">
                 {stationDetail.centerYn === 'Y' && (
                   <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                     중앙차로
                   </div>
                 )}
                 <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                   정류장
                 </div>
               </div>
             </div>
            
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">정류장 정보</h3>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">ARS 번호:</span>
                     <span className="font-semibold text-gray-900">{stationDetail.arsId || '정보없음'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">지역:</span>
                     <span className="font-semibold text-gray-900">{stationDetail.regionName}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">위도:</span>
                     <span className="font-semibold text-gray-900">{stationDetail.lat}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-700 font-medium">경도:</span>
                     <span className="font-semibold text-gray-900">{stationDetail.lng}</span>
                   </div>
                 </div>
               </div>
               
               <div>
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">실시간 정보</h3>
                 <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                   <span className="text-sm text-green-600 font-medium">실시간 업데이트</span>
                 </div>
                 <div className="mt-2 text-sm text-gray-700">
                   도착 정보가 실시간으로 업데이트됩니다.
                 </div>
               </div>
             </div>
          </div>

          {/* 도착 정보 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              도착 정보 ({stationDetail.arrivals ? stationDetail.arrivals.length : 0}개 노선)
            </h2>
            
            {stationDetail.arrivals && stationDetail.arrivals.length > 0 ? (
              <div className="space-y-4">
                {stationDetail.arrivals.map((arrival, index) => (
                                     <div
                     key={`${arrival.routeId}-${index}`}
                     className="p-4 bg-gray-50 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                     onClick={() => window.location.href = `/route/${arrival.routeId}`}
                   >
                                         <div className="flex items-center justify-between mb-3">
                                               <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{arrival.routeName}</h3>
                          <span className="text-sm text-blue-600 font-medium">
                            {arrival.routeId}
                          </span>
                        </div>
                       <div className="flex items-center space-x-2">
                         {/* 운행 상태 표시 */}
                         <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                           (arrival.flag1 === 'Y' || arrival.flag2 === 'Y') 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-red-100 text-red-800'
                         }`}>
                           <div className={`w-2 h-2 rounded-full ${
                             (arrival.flag1 === 'Y' || arrival.flag2 === 'Y') 
                               ? 'bg-green-500' 
                               : 'bg-red-500'
                           }`}></div>
                           <span>{(arrival.flag1 === 'Y' || arrival.flag2 === 'Y') ? '운행중' : '운행종료'}</span>
                         </div>
                       </div>
                     </div>
                    
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* 운행중이지만 버스 정보가 없는 경우 */}
                       {(arrival.flag1 === 'Y' || arrival.flag2 === 'Y') && 
                        arrival.remainMin1 === null && arrival.remainMin2 === null && (
                         <div className="col-span-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                           <div className="text-center">
                             <div className="flex items-center justify-center space-x-2 mb-2">
                             </div>
                             <span className="text-gray-600 text-m">버스 정보 없음</span>
                           </div>
                         </div>
                       )}
                       
                                               {/* 첫 번째 버스 */}
                        {arrival.remainMin1 !== null && (
                          <div 
                            className={`p-3 rounded border ${
                              arrival.flag1 === 'Y' ? 'bg-white' : 'bg-gray-100'
                            }`}
                          >
                           <div className="flex items-center justify-between mb-2">
                             <span className="text-sm font-medium text-gray-700">첫 번째 버스</span>
                             <div className="flex items-center space-x-2">
                               {/* 운행 상태 */}
                               <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                 arrival.flag1 === 'Y' 
                                   ? 'bg-green-100 text-green-800' 
                                   : 'bg-red-100 text-red-800'
                               }`}>
                                 <div className={`w-1.5 h-1.5 rounded-full ${
                                   arrival.flag1 === 'Y' ? 'bg-green-500' : 'bg-red-500'
                                 }`}></div>
                                 <span>{arrival.flag1 === 'Y' ? '운행중' : '운행종료'}</span>
                               </div>
                                                               {/* 혼잡도 */}
                                {arrival.congestion1 && arrival.flag1 === 'Y' && (
                                  <span className={`text-xs font-medium ${
                                    arrival.congestion1 === '여유' ? 'text-green-600' :
                                    arrival.congestion1 === '보통' ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    {arrival.congestion1}
                                  </span>
                                )}
                             </div>
                           </div>
                           {arrival.flag1 === 'Y' ? (
                             <div className="space-y-1 text-sm">
                               <div className="flex justify-between">
                                 <span className="text-gray-700 font-medium">도착까지:</span>
                                 <span className="font-semibold text-blue-600 text-lg">{arrival.remainMin1}분</span>
                               </div>
                                                               {arrival.remainStops1 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">현재 위치:</span>
                                    <span className="font-medium text-gray-800">{arrival.remainStops1}번째 전</span>
                                  </div>
                                )}
                                {arrival.plateNo1 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">차량번호:</span>
                                    <span className="font-medium text-gray-800">{arrival.plateNo1}</span>
                                  </div>
                                )}
                             </div>
                           ) : (
                             <div className="text-center py-2">
                               <span className="text-gray-500 text-sm">운행 종료</span>
                             </div>
                           )}
                         </div>
                       )}
                       
                                               {/* 두 번째 버스 */}
                        {arrival.remainMin2 !== null && (
                          <div 
                            className={`p-3 rounded border ${
                              arrival.flag2 === 'Y' ? 'bg-white' : 'bg-gray-100'
                            }`}
                          >
                           <div className="flex items-center justify-between mb-2">
                             <span className="text-sm font-medium text-gray-700">두 번째 버스</span>
                             <div className="flex items-center space-x-2">
                               {/* 운행 상태 */}
                               <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                 arrival.flag2 === 'Y' 
                                   ? 'bg-green-100 text-green-800' 
                                   : 'bg-red-100 text-red-800'
                               }`}>
                                 <div className={`w-1.5 h-1.5 rounded-full ${
                                   arrival.flag2 === 'Y' ? 'bg-green-500' : 'bg-red-500'
                                 }`}></div>
                                 <span>{arrival.flag2 === 'Y' ? '운행중' : '운행종료'}</span>
                               </div>
                                                               {/* 혼잡도 */}
                                {arrival.congestion2 && arrival.flag2 === 'Y' && (
                                  <span className={`text-xs font-medium ${
                                    arrival.congestion2 === '여유' ? 'text-green-600' :
                                    arrival.congestion2 === '보통' ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    {arrival.congestion2}
                                  </span>
                                )}
                             </div>
                           </div>
                           {arrival.flag2 === 'Y' ? (
                             <div className="space-y-1 text-sm">
                               <div className="flex justify-between">
                                 <span className="text-gray-700 font-medium">도착까지:</span>
                                 <span className="font-semibold text-blue-600 text-lg">{arrival.remainMin2}분</span>
                               </div>
                                                               {arrival.remainStops2 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">현재 위치:</span>
                                    <span className="font-medium text-gray-800">{arrival.remainStops2}번째 전</span>
                                  </div>
                                )}
                                {arrival.plateNo2 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">차량번호:</span>
                                    <span className="font-medium text-gray-800">{arrival.plateNo2}</span>
                                  </div>
                                )}
                             </div>
                           ) : (
                             <div className="text-center py-2">
                               <span className="text-gray-500 text-sm">운행 종료</span>
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                현재 도착 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
