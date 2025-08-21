'use client';

import { useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showFindPassword, setShowFindPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [findPasswordData, setFindPasswordData] = useState({
        email: '',
        username: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setShowPassword(false);
            setShowConfirmPassword(false);
            setFormData({ username: '', email: '', password: '', confirmPassword: '' });
            setFindPasswordData({ email: '', username: '' });
            setError('');
            setShowSuccessMessage(false);
            setShowFindPassword(false);
        } else {
            // 모달이 닫힐 때 로그인 모드로 초기화
            setIsLoginMode(true);
            setShowFindPassword(false);
            setFormData({ username: '', email: '', password: '', confirmPassword: '' });
            setFindPasswordData({ email: '', username: '' });
            setError('');
            setShowSuccessMessage(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!isLoginMode && formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            setIsLoading(false);
            return;
        }

        try {
            if (isLoginMode) {
                // 로그인
                const response = await authAPI.login({
                    email: formData.email,
                    password: formData.password
                });
                if (response.data.userId) {
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('email', response.data.email);
                    localStorage.setItem('createdAt', response.data.createdAt);
                    
                    // user 객체 생성하여 전달
                    const userData = {
                        id: parseInt(response.data.userId), // 안전하게 숫자로 변환
                        username: response.data.username,
                        email: response.data.email,
                        createdAt: response.data.createdAt
                    };
                    const returnUrl = onLoginSuccess(userData);
                    onClose();
                    
                    // 리다이렉트 처리: returnUrl이 있으면 해당 위치로, 없으면 대시보드로
                    if (returnUrl) {
                        router.push(returnUrl);
                    } else {
                        router.push('/dashboard');
                    }
                }
            } else {
                // 회원가입
                const response = await authAPI.signup({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });
                if (response.data.userId) {
                    setShowSuccessMessage(true);
                }
            }
        } catch (err) {
            if (isLoginMode) {
                setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            } else {
                setError('이미 가입된 이메일입니다');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFindPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 입력값 정리 (공백 제거, 이메일 소문자 변환)
            const cleanedData = {
                email: findPasswordData.email.trim().toLowerCase(),
                username: findPasswordData.username.trim()
            };
            

            
            const response = await authAPI.findPassword(cleanedData);
            setShowSuccessMessage(true);
        } catch (err) {
            console.error('비밀번호 찾기 에러:', err);
            setError('해당 정보로 가입된 계정이 없습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessMessage(false);
        if (showFindPassword) {
            setShowFindPassword(false);
            setIsLoginMode(true);
        } else {
            setIsLoginMode(true);
        }
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        setFindPasswordData({ email: '', username: '' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFindPasswordChange = (e) => {
        setFindPasswordData({
            ...findPasswordData,
            [e.target.name]: e.target.value
        });
    };

    const switchMode = () => {
        setIsLoginMode(!isLoginMode);
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        setError('');
    };

    const openFindPassword = () => {
        setShowFindPassword(true);
        setError('');
    };

    const closeFindPassword = () => {
        setShowFindPassword(false);
        setFindPasswordData({ email: '', username: '' });
        setError('');
    };

    if (!isOpen) return null;

    // 성공 메시지 팝업
    if (showSuccessMessage) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9999 }}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                    <div className="p-6 text-center">
                        <div className="mb-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {showFindPassword ? '비밀번호 찾기 요청이 완료되었습니다!' : '회원가입이 완료되었습니다!'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {showFindPassword 
                                ? '입력하신 이메일로 비밀번호 재설정 안내를 발송했습니다.' 
                                : '이제 로그인하여 서비스를 이용하세요'
                            }
                        </p>
                        <button
                            onClick={handleSuccessClose}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            {showFindPassword ? '로그인으로 돌아가기' : '로그인하기'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 비밀번호 찾기 모달
    if (showFindPassword) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9999 }}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                    {/* 헤더 */}
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-900">
                            비밀번호 찾기
                        </h2>
                        <button
                            onClick={closeFindPassword}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* 본문 */}
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">
                            가입한 이메일과 사용자명을 입력해주세요
                        </p>
                        
                        <form onSubmit={handleFindPassword}>
                            {/* 사용자명 입력 */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    사용자명
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={findPasswordData.username}
                                    onChange={handleFindPasswordChange}
                                    placeholder="사용자명을 입력하세요"
                                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                                    required
                                />
                            </div>

                            {/* 이메일 입력 */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    이메일
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={findPasswordData.email}
                                    onChange={handleFindPasswordChange}
                                    placeholder="이메일을 입력하세요"
                                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                                    required
                                />
                            </div>

                            {/* 에러 메시지 */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            {/* 제출 버튼 */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? '처리 중...' : '비밀번호 찾기'}
                            </button>

                            {/* 로그인으로 돌아가기 */}
                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={closeFindPassword}
                                    className="text-sm text-gray-600 hover:text-blue-600"
                                >
                                    로그인으로 돌아가기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* 헤더 */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isLoginMode ? '로그인' : '회원가입'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* 본문 */}
                <div className="p-6">
                    <p className="text-gray-600 mb-4">
                        {isLoginMode ? '계정 정보를 입력해주세요' : '정보를 입력하세요'}
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        {/* 회원가입 모드일 때만 사용자명 표시 */}
                        {!isLoginMode && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    사용자명
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="사용자명을 입력하세요"
                                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                                    required
                                />
                            </div>
                        )}

                        {/* 이메일 입력 */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                이메일
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="이메일을 입력하세요"
                                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                                required
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                비밀번호
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="비밀번호를 입력하세요"
                                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                                    required
                                />
                            </div>
                        </div>

                        {/* 회원가입 모드일 때만 비밀번호 확인 표시 */}
                        {!isLoginMode && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    비밀번호 확인
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="비밀번호를 다시 입력하세요"
                                        className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* 에러 메시지 */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {/* 로그인 모드일 때만 추가 옵션 표시 */}
                        {isLoginMode && (
                            <div className="flex justify-between items-center mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-600">로그인 유지</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={openFindPassword}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                    비밀번호 찾기
                                </button>
                            </div>
                        )}

                        {/* 제출 버튼 */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading 
                                ? (isLoginMode ? '로그인 중...' : '회원가입 중...') 
                                : (isLoginMode ? '로그인' : '회원가입')
                            }
                        </button>

                        {/* 모드 전환 버튼 */}
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={switchMode}
                                className="text-sm text-gray-600 hover:text-blue-600"
                            >
                                {isLoginMode 
                                    ? '계정이 없으신가요? 회원가입' 
                                    : '이미 계정이 있으신가요? 로그인'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}