'use client';

import { useAuthStore } from '@/app/stores/authStore';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

// 実行予算書の承認ステータス
type ApprovalStatus = '下書き' | '承認待ち（部長）' | '承認待ち（常務）' | '承認待ち（社長）' | '承認済み' | '却下';

// 承認待ち実行予算書の型定義
interface PendingBudget {
  id: number;
  projectId: number;
  projectNumber: string;
  projectName: string;
  applicant: string;
  applicationDate: string;
  status: ApprovalStatus;
}

// モックデータ：承認待ち実行予算書
const mockPendingBudgets: PendingBudget[] = [
  {
    id: 1,
    projectId: 1,
    projectNumber: 'PJ-2025-001',
    projectName: '○○ビル新築工事',
    applicant: '高橋五郎',
    applicationDate: '2025-09-28',
    status: '承認待ち（部長）',
  },
  {
    id: 2,
    projectId: 2,
    projectNumber: 'PJ-2025-002',
    projectName: '△△マンション改修工事',
    applicant: '高橋五郎',
    applicationDate: '2025-09-30',
    status: '承認待ち（部長）',
  },
  {
    id: 3,
    projectId: 3,
    projectNumber: 'PJ-2025-003',
    projectName: '××工場増築工事',
    applicant: '田中花子',
    applicationDate: '2025-10-01',
    status: '承認待ち（常務）',
  },
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ウィンドウサイズの監視
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初期設定
    handleResize();

    // リサイズイベントリスナー
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 承認待ち件数の計算
  const getPendingApprovalsCount = () => {
    if (!user) return 0;

    switch (user.role) {
      case '部長':
        return mockPendingBudgets.filter(b => b.status === '承認待ち（部長）').length;
      case '常務':
        return mockPendingBudgets.filter(b => b.status === '承認待ち（常務）').length;
      case '社長':
        return mockPendingBudgets.filter(b => b.status === '承認待ち（社長）').length;
      default:
        return 0;
    }
  };

  const pendingCount = getPendingApprovalsCount();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    {
      name: '承認待ち',
      href: '/approvals',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      allowedRoles: ['社長', '常務', '部長'],
    },
    {
      name: '工事一覧',
      href: '/projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      allowedRoles: ['社長', '常務', '部長', '管理者', '案件登録者', '現場メンバー'],
    },
    {
      name: '労務管理',
      href: '/labor',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      allowedRoles: ['社長', '常務', '部長', '管理者'],
    },
    {
      name: '請求・支払管理',
      href: '/invoices',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      allowedRoles: ['社長', '常務', '部長', '管理者'],
    },
    {
      name: 'スタッフ管理',
      href: '/staff',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      allowedRoles: ['社長', '常務', '部長', '管理者'],
    },
  ];

  // 権限に応じたメニューフィルタリング
  const getFilteredNavigation = () => {
    // 権限チェック
    const roleFiltered = navigation.filter((item) =>
      item.allowedRoles.includes(user?.role || '')
    );

    // 承認者（社長・常務・部長）+ スマホ表示（768px以下）の場合は2つのメニューのみ
    const isApprover = ['社長', '常務', '部長'].includes(user?.role || '');
    if (isApprover && isMobile) {
      return roleFiltered.filter((item) =>
        ['承認待ち', '工事一覧'].includes(item.name)
      );
    }

    return roleFiltered;
  };

  const filteredNavigation = getFilteredNavigation();

  const isActive = (href: string) => {
    if (href === '/projects' && pathname?.startsWith('/projects')) {
      return true;
    }
    if (href === '/labor' && pathname?.startsWith('/labor')) {
      return true;
    }
    if (href === '/staff' && pathname?.startsWith('/staff')) {
      return true;
    }
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 min-w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out shadow-lg flex-shrink-0`}>
        <div className="flex flex-col h-full">
          {/* ロゴ/タイトル */}
          <div className="flex items-center h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-xl font-bold text-white">原価管理システム</h1>
          </div>

          {/* ユーザー情報 */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">ログイン中</p>
            <p className="text-gray-900 font-medium">{user?.name}</p>
            {user?.role && (
              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded font-medium ${
                user.role === '社長' ? 'bg-purple-100 text-purple-800' :
                user.role === '常務' ? 'bg-indigo-100 text-indigo-800' :
                user.role === '部長' ? 'bg-blue-100 text-blue-800' :
                user.role === '管理者' ? 'bg-green-100 text-green-800' :
                user.role === '案件登録者' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
            )}
          </div>

          {/* ナビゲーション */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {/* 承認待ちバッジ（承認待ちメニューと工事一覧に表示） */}
                {(item.name === '承認待ち' || item.name === '工事一覧') && pendingCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* ログアウトボタン */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </aside>

      {/* モバイル用オーバーレイ */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col">
        {/* モバイル用ヘッダー */}
        <header className="md:hidden bg-white shadow">
          <div className="px-4 h-16 flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <span className="text-xl">☰</span>
            </button>
            <h1 className="ml-3 text-lg font-semibold">原価管理システム</h1>
          </div>
        </header>

        {/* ページコンテンツ */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}