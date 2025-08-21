'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import NotificationToast from '@/components/NotificationToast';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import useNotificationChecker from '@/hooks/useNotificationChecker';

export default function Layout({ children }) {
    const { isLoggedIn, user, isLoading, isAuthModalOpen, openAuthModal, closeAuthModal, handleLoginSuccess, handleLogout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    
    // 전역 알림 Toast 상태
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    
    // 전역 알림 체크
    useNotificationChecker();

    // 알림 Toast 이벤트 리스너
    useEffect(() => {
        const handleShowNotification = (event) => {
            setToastMessage(event.detail);
            setShowToast(true);
        };

        window.addEventListener('showNotification', handleShowNotification);
        return () => window.removeEventListener('showNotification', handleShowNotification);
    }, []);

    const handleLogoutClick = () => {
        handleLogout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
        {/* 전역 알림 Toast */}
        <NotificationToast
            message={toastMessage}
            isVisible={showToast}
            onClose={() => setShowToast(false)}
        />
        
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                {/* 로고 */}
                <div className="flex items-center">
                <img 
                    src="/logo.png" 
                    alt="BusAlimi Logo" 
                    className="w-8 h-8 mr-2"
                />
                <Link href="/" className="text-xl font-bold text-blue-600">
                    BusAlimi
                </Link>
                </div>



                {/* 사용자 메뉴 */}
                <div className="flex items-center space-x-4">
                {isLoading ? (
                    <div className="flex items-center space-x-5">
                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ) : isLoggedIn ? (
                    <div className="flex items-center space-x-5">
                    <span className="text-gray-700 text-sm font-medium">
                        {user?.username || '사용자'} 님
                    </span>
                    <button
                        onClick={() => {
                            if (pathname === '/mypage') {
                                window.location.reload();
                            } else {
                                router.push('/mypage');
                            }
                        }}
                        className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                    >
                        마이페이지
                    </button>
                    <button
                        onClick={handleLogoutClick}
                        className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                    >
                        로그아웃
                    </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-5">
                    <button
                        onClick={() => openAuthModal(pathname)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                        로그인
                    </button>
                    </div>
                )}
                </div>
            </div>
            </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main>
            {children}
        </main>

        {/* 푸터 */}
        <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500 text-sm">
                © 2024 BusAlimi. All rights reserved.
            </div>
            </div>
        </footer>

        {/* Auth 모달 */}
        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={closeAuthModal}
            onLoginSuccess={handleLoginSuccess}
        />
        </div>
    );
}