'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const features = [
    {
      title: '실시간 버스 정보',
      description: '실시간으로 버스 위치와 도착 시간을 확인하세요.',
      icon: '🚌',
      href: '/search'
    },
    {
      title: '즐겨찾기',
      description: '자주 이용하는 버스 노선을 즐겨찾기에 추가하세요.',
      icon: '⭐',
      href: '/favorites'
    },
    {
      title: '최근 검색',
      description: '최근에 검색한 버스 정보를 빠르게 확인하세요.',
      icon: '🕒',
      href: '/recents'
    },
    {
      title: '알림 서비스',
      description: '버스 도착 알림을 받아보세요.',
      icon: '🔔',
      href: '/notifications'
    }
  ];

  return (
    <Layout>
      <div className="relative">
        {/* 히어로 섹션 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                버스알리미
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                실시간 버스 정보로 스마트한 이동을 경험하세요
              </p>
              
              {/* 검색 폼 */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="flex shadow-lg rounded-lg overflow-hidden">
                  <input
                    type="text"
                    placeholder="버스 노선번호 또는 정류장명을 입력하세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-6 py-4 text-gray-900 text-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 px-8 py-4 text-gray-900 font-semibold transition-colors"
                  >
                    검색
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 기능 소개 섹션 */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                주요 기능
              </h2>
              <p className="text-lg text-gray-600">
                버스알리미가 제공하는 다양한 서비스를 확인해보세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Link
                  key={index}
                  href={feature.href}
                  className="group block p-6 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 빠른 링크 섹션 */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                빠른 접근
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link
                href="/search"
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  버스 검색
                </h3>
                <p className="text-gray-600">
                  노선번호나 정류장명으로 버스를 검색하세요
                </p>
              </Link>

              <Link
                href="/favorites"
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-3xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  즐겨찾기
                </h3>
                <p className="text-gray-600">
                  자주 이용하는 버스 노선을 관리하세요
                </p>
              </Link>

              <Link
                href="/notifications"
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  알림 설정
                </h3>
                <p className="text-gray-600">
                  버스 도착 알림을 설정하세요
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
