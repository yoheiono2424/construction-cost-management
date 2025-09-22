'use client';

import { useAuthStore } from '@/app/stores/authStore';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    {
      name: 'ダッシュボード',
      href: '/dashboard',
      icon: '📊',
    },
    {
      name: '実行予算書',
      href: '/budgets',
      icon: '📋',
    },
    {
      name: '請求書管理',
      href: '/invoices',
      icon: '📄',
    },
    {
      name: '支払管理',
      href: '/payment',
      icon: '💳',
    },
    {
      name: '予実レポート',
      href: '/reports',
      icon: '📈',
    },
    {
      name: 'ユーザー管理',
      href: '/users',
      icon: '👥',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/budgets' && pathname?.startsWith('/budgets')) {
      return true;
    }
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out shadow-lg`}>
        <div className="flex flex-col h-full">
          {/* ロゴ/タイトル */}
          <div className="flex items-center h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-xl font-bold text-white">原価管理システム</h1>
          </div>

          {/* ユーザー情報 */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">ログイン中</p>
            <p className="text-gray-900 font-medium">{user?.name}</p>
            {user?.role === 'admin' && (
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded font-medium">
                管理者
              </span>
            )}
          </div>

          {/* ナビゲーション */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* ログアウトボタン */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <span className="mr-3 text-lg">🚪</span>
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