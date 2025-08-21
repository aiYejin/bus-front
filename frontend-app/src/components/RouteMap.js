'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// react-leaflet 컴포넌트들을 동적 import
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });

export default function RouteMap({ stations = [], routeLines = [], routeName }) {
  const [error, setError] = useState(null);

  // Leaflet CSS 및 아이콘 설정
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const setupLeaflet = async () => {
        try {
          // CSS 동적 로드
          if (!document.querySelector('link[href*="leaflet.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = '';
            document.head.appendChild(link);
          }

          const L = (await import('leaflet')).default;
          
          // 기본 아이콘 문제 해결
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          });
        } catch (error) {
          console.log('Leaflet 설정 오류:', error);
        }
      };
      
      setupLeaflet();
    }
  }, []);

  // 지도 중심점 계산
  const getMapCenter = () => {
    if (stations.length > 0) {
      const avgLat = stations.reduce((sum, station) => sum + station.lat, 0) / stations.length;
      const avgLng = stations.reduce((sum, station) => sum + station.lng, 0) / stations.length;
      return [avgLat, avgLng];
    }
    return [37.5665, 126.9780]; // 기본값 (서울 시청)
  };

  // 노선 라인 좌표 계산
  const getRouteLinePoints = () => {
    if (routeLines && routeLines.length > 0) {
      const sortedLines = [...routeLines].sort((a, b) => a.lineSeq - b.lineSeq);
      return sortedLines.map(line => [line.lat, line.lng]);
    }
    return [];
  };

  // 지도 bounds 자동 조정 컴포넌트
  const AutoFitBounds = ({ stations, routeLines }) => {
    const map = useMap();
    
    React.useEffect(() => {
      if (!map) return;
      
      const allPoints = [];
      
      // 정류장 좌표 추가
      stations.forEach(station => {
        if (station.lat && station.lng) {
          allPoints.push([station.lat, station.lng]);
        }
      });
      
      // 노선 라인 좌표 추가
      routeLines.forEach(line => {
        if (line.lat && line.lng) {
          allPoints.push([line.lat, line.lng]);
        }
      });
      
      if (allPoints.length > 0) {
        try {
          // 단순히 bounds 계산
          const lats = allPoints.map(point => point[0]);
          const lngs = allPoints.map(point => point[1]);
          
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          
          // 패딩 추가
          const latPadding = (maxLat - minLat) * 0.1;
          const lngPadding = (maxLng - minLng) * 0.1;
          
          map.fitBounds([
            [minLat - latPadding, minLng - lngPadding],
            [maxLat + latPadding, maxLng + lngPadding]
          ], { 
            maxZoom: 15 
          });
        } catch (error) {
          console.log('fitBounds 오류:', error);
        }
      }
    }, [map, stations, routeLines]);
    
    return null;
  };

  // 커스텀 정류장 아이콘 생성
  const createStationIcon = (index) => {
    if (typeof window === 'undefined') return null;
    
    try {
      const L = require('leaflet');
      return L.divIcon({
        className: 'bus-station-marker',
        html: `
          <div style="
            background: white;
            border: 3px solid #dc2626;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: #dc2626;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    } catch (error) {
      return null;
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          노선 지도 - {routeName}
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div>
              <p className="text-yellow-800 font-medium">지도를 표시할 수 없습니다</p>
              <p className="text-yellow-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const center = getMapCenter();
  const routeLinePoints = getRouteLinePoints();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        노선 지도 - {routeName}
      </h2>
      
      <div className="h-96 rounded-lg overflow-hidden border">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          boxZoom={true}
          keyboard={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* 자동 bounds 조정 */}
          <AutoFitBounds stations={stations} routeLines={routeLines} />
          
          {/* 노선 라인 */}
          {routeLinePoints.length > 0 && (
            <Polyline 
              positions={routeLinePoints} 
              color="#dc2626" 
              weight={4} 
              opacity={0.8}
            />
          )}
          
          {/* 정류장 마커 */}
          {stations.map((station, index) => (
            <Marker 
              key={`${station.stationId}-${index}`}
              position={[station.lat, station.lng]}
              icon={createStationIcon(index)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <strong>{station.stationName}</strong><br/>
                  <small>정류장 번호: {station.arsId || '정보없음'}</small><br/>
                  <small>순서: {station.stationSeq}</small>
                  {station.centerYn === 'Y' && <br/>}
                  {station.centerYn === 'Y' && <span className="text-orange-600">중앙차로</span>}
                  {station.turnYn === 'Y' && <br/>}
                  {station.turnYn === 'Y' && <span className="text-red-600">회차</span>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-red-600"></div>
            <span>노선 경로</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white border-2 border-red-600 rounded-full flex items-center justify-center text-xs font-bold text-red-600">1</div>
            <span>정류장 (순서)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
