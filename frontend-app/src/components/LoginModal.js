'use client';

import { useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import Image from 'next/image';  // Image import 추가


export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
          setShowPassword(false);
          setFormData({ email: '', password: '' });
          setError('');
        }
      }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
        const response = await authAPI.login(formData);
        if (response.data.userId) {
            // 토큰 대신 사용자 정보 저장
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('email', response.data.email);

            onLoginSuccess();
            onClose();
        }
        } catch (err) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } finally {
        setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* 헤더 */}
            <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
            >
                ×
            </button>
            </div>

            {/* 본문 */}
            <div className="p-6">
            <p className="text-gray-600 mb-4">계정 정보를 입력해주세요</p>
            
            <form onSubmit={handleSubmit}>
            {/* 이메일 입력 */}
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
            </label>
            <div className="relative">
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
            </div>

            {/* 비밀번호 입력 */}
            <div className="mb-6">
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
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <Image
                    src={showPassword ? '/closeeye.png' : '/openeye.png'}
                    alt={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    width={30}
                    height={30}
                    className="text-gray-400"
                    />
                </button>
            </div>
            </div>

                {/* 에러 메시지 */}
                {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
                )}

                {/* 추가 옵션 */}
                <div className="flex justify-between items-center mb-6">
                    <label className="flex items-center">
                        <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2"
                        />
                        <span className="text-sm text-gray-600">로그인 유지</span>
                    </label>
                    <div className="flex items-center space-x-4">
                        <button
                        type="button"
                        className="text-sm text-gray-600 hover:text-gray-800"
                        >
                        비밀번호 찾기
                        </button>
                        <button
                        type="button"
                        className="text-sm text-gray-600 hover:text-gray-800"
                        >
                        회원가입
                        </button>
                    </div>
                </div>

                {/* 로그인 버튼 */}
                <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                {isLoading ? '로그인 중...' : '로그인'}
                </button>
            </form>
            </div>
        </div>
        </div>
    );
}