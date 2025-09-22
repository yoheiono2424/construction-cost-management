'use client';

import Layout from '@/app/components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/stores/authStore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const [stats] = useState({
    thisMonthInvoices: 45,
    paidInvoices: 28,
    paymentRate: 62.2,
    totalBudget: 125000000,
    actualCost: 98500000,
  });

  const pendingApprovals = [
    { id: 1, name: 'B工場増築工事', date: '2025/01/18', amount: 45000000 },
    { id: 2, name: 'F倉庫建築工事', date: '2025/01/17', amount: 28000000 },
    { id: 3, name: 'G事務所改装', date: '2025/01/16', amount: 12000000 },
  ];

  const overBudgetProjects = [
    { id: 1, name: 'H商業施設改装', budget: 35000000, actual: 42000000, overAmount: 7000000, overRate: 20 },
    { id: 2, name: 'I工場設備更新', budget: 18000000, actual: 20500000, overAmount: 2500000, overRate: 13.9 },
    { id: 3, name: 'J店舗リニューアル', budget: 12000000, actual: 13200000, overAmount: 1200000, overRate: 10 },
    { id: 4, name: 'K倉庫拡張工事', budget: 25000000, actual: 26800000, overAmount: 1800000, overRate: 7.2 },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">ダッシュボード</h1>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">今月の支払い件数</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.thisMonthInvoices}</p>
            <p className="text-sm text-gray-500 mt-2">請求書件数</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">支払い済み件数</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.paidInvoices}</p>
            <p className="text-sm text-gray-500 mt-2">CSVエクスポート済み</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">支払い率</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.paymentRate}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.paidInvoices}件 / {stats.thisMonthInvoices}件
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 承認待ち */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
              <h2 className="text-lg font-semibold text-gray-900">⏳ 承認待ち</h2>
            </div>
            <div className="p-6">
              {pendingApprovals.length > 0 ? (
                <div className="space-y-4">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ¥{item.amount.toLocaleString()}
                        </p>
                        <Link
                          href={`/budgets/${item.id}`}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          詳細を見る
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">承認待ちの項目はありません</p>
              )}
            </div>
          </div>

          {/* 予算超過案件 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <h2 className="text-lg font-semibold text-gray-900">⚠️ 予算超過案件</h2>
            </div>
            <div className="p-6">
              {overBudgetProjects.length > 0 ? (
                <div className="space-y-4">
                  {overBudgetProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{project.name}</p>
                        <div className="mt-1 flex items-center space-x-3">
                          <span className="text-xs text-gray-500">
                            予算: ¥{project.budget.toLocaleString()}
                          </span>
                          <span className="text-xs text-red-600 font-medium">
                            実績: ¥{project.actual.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-600">
                          +¥{project.overAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-red-500">
                          超過率: {project.overRate}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">予算超過案件はありません</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}