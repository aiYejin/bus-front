'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import LoginModal from '@/components/LoginModal';
import Image from 'next/image';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ q: searchQuery });
      if (searchType !== 'all') {
        params.append('type', searchType);
      }
      window.location.href = `/search?${params.toString()}`;
    }
  };

  const handleLoginSuccess = () => {
    // 로그인 성공 후 처리
    window.location.reload();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* 메인 검색 섹션 */}
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="w-full max-w-2xl">
            {/* 로고 및 제목 */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-1">
                <Image 
                  src="/bluelogo.png" 
                  alt="BusAlimi Logo" 
                  width={100} 
                  height={100} 
                  className="mr-1"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                버스와 정류장을 검색하세요
              </h2>
              <p className="text-gray-600">
                버스 번호, 정류장 이름, ARS 번호로 빠르게 찾아보세요
              </p>
            </div>

            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="예: 472 (버스), 강남역 (정류장), 02215 (ARS)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-6 py-4 text-lg text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-semibold transition-colors"
                  >
                    검색
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* 추가 기능 안내 섹션 */}
        <div className="bg-gray-200 border-t">
          <div className="max-w-4xl mx-auto px-4 py-40">
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                더 많은 기능을 이용해보세요!
              </h3>
              <p className="text-gray-600 mb-4">
                즐겨찾기 관리, 알림 설정, 검색 기록 등의 기능이 제공됩니다
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-blue-500 text-white px-8 py-4 rounded-md text-base font-medium hover:bg-blue-600 inline-block mb-4"
                >
                  로그인하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 로그인 모달 */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </Layout>
  );
}