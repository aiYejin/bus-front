'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { userAPI, reportAPI } from '@/services/api';
import { 
  UserIcon, 
  PencilIcon, 
  ChevronRightIcon,
  TrashIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// 분할된 탭 컴포넌트들 import
import UserInfoTab from '@/components/MyPage/UserInfoTab';
import PasswordChangeTab from '@/components/MyPage/PasswordChangeTab';
import ReportHistoryTab from '@/components/MyPage/ReportHistoryTab';
import ReportWriteTab from '@/components/MyPage/ReportWriteTab';

export default function MyPage() {
  const { user, handleLogout, updateUserInfo } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('info');
  
  // 알림 설정 상태
  const [pushNotification, setPushNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  
  // 신고 관련 상태
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // 신고 내역 로드
  const loadReports = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoadingReports(true);
      const response = await reportAPI.getUserReports(user.id);
      setReports(response.data);
    } catch (error) {
      console.error('신고 내역 로드 실패:', error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  // 신고 내역 로드 (탭 변경 시)
  useEffect(() => {
    if (activeTab === 'reportHistory') {
      loadReports();
    }
  }, [activeTab, user?.id]);

  const handleLogoutClick = () => {
    handleLogout();
    router.push('/');
  };

  // 사용자 정보 업데이트 핸들러
  const handleUserUpdate = async (userInfo) => {
    await userAPI.updateUser(user.id, {
      username: userInfo.username,
      email: userInfo.email
    });
    
    updateUserInfo({
      ...user,
      username: userInfo.username,
      email: userInfo.email
    });
    
    alert('사용자 정보가 수정되었습니다.');
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = async (passwordData) => {
    await userAPI.changePassword(user.id, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  // 계정 삭제 핸들러
  const handleDeleteAccount = async (password) => {
    await userAPI.deleteAccount(user.id, password);
    alert('계정이 삭제되었습니다.');
    handleLogout();
    router.push('/');
  };

  // 신고 제출 핸들러
  const handleSubmitReport = async (reportData) => {
    await reportAPI.addReport({
      userId: user.id,
      title: reportData.title,
      content: reportData.content,
      email: reportData.email,
      reportType: reportData.reportType
    });
  };

  // 컨텐츠 렌더링 함수
  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <UserInfoTab 
            user={user}
            onUserUpdate={handleUserUpdate}
            emailNotification={emailNotification}
            setEmailNotification={setEmailNotification}
            pushNotification={pushNotification}
            setPushNotification={setPushNotification}
            onDeleteAccount={handleDeleteAccount}
          />
        );
      case 'modify':
        return (
          <PasswordChangeTab 
            onPasswordChange={handlePasswordChange}
          />
        );
      case 'reportHistory':
        return (
          <ReportHistoryTab 
            reports={reports}
            isLoadingReports={isLoadingReports}
            onLoadReports={loadReports}
          />
        );
      case 'reportWrite':
        return (
          <ReportWriteTab 
            user={user}
            onSubmitReport={handleSubmitReport}
          />
        );
      default:
        return (
          <UserInfoTab 
            user={user}
            onUserUpdate={handleUserUpdate}
            emailNotification={emailNotification}
            setEmailNotification={setEmailNotification}
            pushNotification={pushNotification}
            setPushNotification={setPushNotification}
            onDeleteAccount={handleDeleteAccount}
          />
        );
    }
  };



  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 사이드바 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">마이페이지</h1>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'info'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="font-medium">정보 조회</span>
                    <ChevronRightIcon className="w-4 h-4 ml-auto" />
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('modify')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'modify'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <PencilIcon className="w-5 h-5" />
                    <span className="font-medium">비밀번호 변경</span>
                    <ChevronRightIcon className="w-4 h-4 ml-auto" />
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reportHistory')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'reportHistory'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    <span className="font-medium">신고 내역</span>
                    <ChevronRightIcon className="w-4 h-4 ml-auto" />
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reportWrite')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'reportWrite'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span className="font-medium">신고 작성</span>
                    <ChevronRightIcon className="w-4 h-4 ml-auto" />
                  </button>
                </nav>

                <div className="mt-8 pt-6 border-t">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                    <span className="font-medium">로그아웃</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}