'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/utils/dateFormatter';
import { getReportTypeLabel } from '@/utils/constants';

export default function ReportHistoryTab({ 
  reports, 
  isLoadingReports, 
  onLoadReports 
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">신고 내역</h2>
          <button
            onClick={onLoadReports}
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
}
