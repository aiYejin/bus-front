'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { userAPI, reportAPI } from '@/services/api';
import { 
  UserIcon, 
  PencilIcon, 
  ExclamationTriangleIcon,
  ChevronRightIcon,
  TrashIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function MyPage() {
  const { user, handleLogout, updateUserInfo } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    email: user?.email || '',
    createdAt: user?.createdAt || new Date().toISOString()
  });
  const [pushNotification, setPushNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  
  // 비밀번호 변경 상태
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // 계정 삭제 상태
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 신고 관련 상태
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    content: '',
    email: user?.email || '',
    reportType: 'SKIP_STOP'
  });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // 신고 타입 옵션
  const reportTypeOptions = [
    { value: 'SKIP_STOP', label: '무정차' },
    { value: 'BROKEN_STATION', label: '정류장 고장' },
    { value: 'DANGEROUS_DRIVING', label: '난폭운전' },
    { value: 'LATE_BUS', label: '지연버스' },
    { value: 'CROWDED_BUS', label: '과다혼잡' },
    { value: 'OTHER', label: '기타' }
  ];

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

  // 사용자 정보 동기화
  useEffect(() => {
    if (user) {
      setUserInfo({
        username: user.username || '',
        email: user.email || '',
        createdAt: user.createdAt || new Date().toISOString()
      });
      setNewReport(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user]);

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

  const handleSave = async () => {
    try {
      await userAPI.updateUser(user.id, {
        username: userInfo.username,
        email: userInfo.email
      });
      
      // AuthContext의 사용자 정보 업데이트
      updateUserInfo({
        ...user,
        username: userInfo.username,
        email: userInfo.email
      });
      
      // 성공 메시지
      alert('사용자 정보가 수정되었습니다.');
      setIsEditing(false);
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
      alert(error.response?.data?.message || '사용자 정보 수정에 실패했습니다.');
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
      // 푸시 알림을 끄려고 할 때 확인 팝업
      if (confirm('푸시 알림을 끄면 버스 도착 알림을 받을 수 없습니다.\n정말 끄시겠습니까?')) {
        setPushNotification(false);
      }
    } else {
      setPushNotification(true);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
      setIsChangingPassword(true);
      await userAPI.changePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      alert('비밀번호가 변경되었습니다.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      alert(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsChangingPassword(false);
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
      await userAPI.deleteAccount(user.id, deletePassword);
      
      alert('계정이 삭제되었습니다.');
      handleLogout();
      router.push('/');
    } catch (error) {
      console.error('계정 삭제 실패:', error);
      alert(error.response?.data?.message || '계정 삭제에 실패했습니다.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!newReport.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!newReport.email.trim()) {
      alert('답변 받을 이메일을 입력해주세요.');
      return;
    }

    if (!newReport.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmittingReport(true);
      await reportAPI.addReport({
        userId: user.id,
        title: newReport.title,
        content: newReport.content,
        email: newReport.email,
        reportType: newReport.reportType
      });
      
      alert('신고가 제출되었습니다.');
      setNewReport({
        title: '',
        content: '',
        email: user?.email || '',
        reportType: 'SKIP_STOP'
      });
    } catch (error) {
      console.error('신고 제출 실패:', error);
      alert(error.response?.data?.message || '신고 제출에 실패했습니다.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeLabel = (type) => {
    const option = reportTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  const renderInfoTab = () => (
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

  const renderModifyTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">비밀번호 변경</h2>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">비밀번호 변경</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                  placeholder="새 비밀번호를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>
              <button 
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportHistoryTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">신고 내역</h2>
          <button
            onClick={loadReports}
            disabled={isLoadingReports}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
          >
            <DocumentTextIcon className="w-4 h-4" />
            <span>{isLoadingReports ? '로딩 중...' : '새로고침'}</span>
          </button>
        </div>
        
        {isLoadingReports ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">신고 내역을 불러오는 중...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">신고 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{report.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{report.content}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {getReportTypeLabel(report.reportType)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderReportWriteTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">신고 작성</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              신고 유형
            </label>
            <select 
              value={newReport.reportType}
              onChange={(e) => setNewReport({...newReport, reportType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            >
              {reportTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
                     <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               제목
             </label>
             <input
               type="text"
               value={newReport.title}
               onChange={(e) => setNewReport({...newReport, title: e.target.value})}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
               placeholder="신고 제목을 입력하세요"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               답변 받을 이메일
             </label>
             <input
               type="email"
               value={newReport.email}
               onChange={(e) => setNewReport({...newReport, email: e.target.value})}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
               placeholder="답변을 받을 이메일을 입력하세요"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               내용
             </label>
             <textarea
               rows={6}
               value={newReport.content}
               onChange={(e) => setNewReport({...newReport, content: e.target.value})}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
               placeholder="신고 내용을 자세히 작성해주세요"
             />
           </div>
          <button 
            onClick={handleSubmitReport}
            disabled={isSubmittingReport}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmittingReport ? '제출 중...' : '신고 제출'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return renderInfoTab();
      case 'modify':
        return renderModifyTab();
      case 'reportHistory':
        return renderReportHistoryTab();
      case 'reportWrite':
        return renderReportWriteTab();
      default:
        return renderInfoTab();
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