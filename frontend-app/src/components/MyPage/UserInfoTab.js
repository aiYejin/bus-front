'use client';

import { useState } from 'react';
import { UserIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function UserInfoTab({ 
  user, 
  onUserUpdate, 
  emailNotification, 
  setEmailNotification,
  pushNotification,
  setPushNotification,
  onDeleteAccount 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    email: user?.email || '',
    createdAt: user?.createdAt || new Date().toISOString()
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleSave = async () => {
    try {
      await onUserUpdate(userInfo);
      setIsEditing(false);
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
    }
  };

  const handleCancel = () => {
    setUserInfo({
      username: user?.username || '',
      email: user?.email || '',
      createdAt: user?.createdAt || new Date().toISOString()
    });
    setIsEditing(false);
  };

  const handlePushNotificationToggle = () => {
    if (pushNotification) {
      if (confirm('푸시 알림을 끄면 버스 도착 알림을 받을 수 없습니다.\n정말 끄시겠습니까?')) {
        setPushNotification(false);
      }
    } else {
      setPushNotification(true);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!confirm('정말로 계정을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      setIsDeletingAccount(true);
      await onDeleteAccount(deletePassword);
    } catch (error) {
      console.error('계정 삭제 실패:', error);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 회원 정보 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">회원 정보</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <PencilIcon className="w-4 h-4" />
              <span>수정</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{userInfo.username}</h3>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사용자명
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userInfo.username}
                    onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    placeholder="사용자명을 입력하세요"
                  />
                ) : (
                  <p className="text-gray-900">{userInfo.username}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    placeholder="이메일을 입력하세요"
                  />
                ) : (
                  <p className="text-gray-900">{userInfo.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  가입일
                </label>
                <p className="text-gray-900">
                  {new Date(userInfo.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 text-sm font-medium"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                저장
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 계정 설정 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">계정 설정</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">이메일 알림</h4>
              <p className="text-sm text-gray-500">중요한 알림을 이메일로 받습니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailNotification}
                onChange={() => setEmailNotification(!emailNotification)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">푸시 알림</h4>
              <p className="text-sm text-gray-500">실시간 알림을 받습니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={pushNotification}
                onChange={handlePushNotificationToggle}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 계정 삭제 */}
      <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-6">
        <h2 className="text-xl font-semibold text-red-900 mb-4">계정 삭제</h2>
        <p className="text-sm text-red-700 mb-4">
          계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
        </p>
        <div className="space-y-3">
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-600"
          />
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeletingAccount}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeletingAccount ? '삭제 중...' : '계정 삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}
