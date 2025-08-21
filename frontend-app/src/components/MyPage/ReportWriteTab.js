'use client';

import { useState } from 'react';
import { REPORT_TYPE_OPTIONS } from '@/utils/constants';

export default function ReportWriteTab({ user, onSubmitReport }) {
  const [newReport, setNewReport] = useState({
    title: '',
    content: '',
    email: user?.email || '',
    reportType: 'SKIP_STOP'
  });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

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
      await onSubmitReport(newReport);
      
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

  return (
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
              {REPORT_TYPE_OPTIONS.map((option) => (
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
}
