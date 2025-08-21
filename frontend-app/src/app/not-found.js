import Link from 'next/link';
import { FaBus, FaHome } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FaBus className="text-6xl text-gray-400 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">페이지를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <FaHome className="mr-2" />
            홈으로 돌아가기
          </Link>
          
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <FaBus className="mr-2" />
            대시보드로 가기
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>문제가 지속되면 관리자에게 문의해주세요.</p>
        </div>
      </div>
    </div>
  );
}
