'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/app/stores/authStore';
import Layout from '@/app/components/Layout';

interface BudgetListItem {
  id: string;
  projectName: string;
  client: string;
  assignee: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  varianceRate: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  grossProfitRate: number;
}

export default function BudgetsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [budgets] = useState<BudgetListItem[]>([
    {
      id: '1',
      projectName: 'A工事現場改修工事',
      client: '株式会社A建設',
      assignee: '山田太郎',
      budgetAmount: 12000000,
      actualAmount: 11500000,
      variance: -500000,
      varianceRate: -4.2,
      status: 'approved',
      createdAt: '2025-01-10',
      updatedAt: '2025-01-15',
      grossProfitRate: 25.5,
    },
    {
      id: '2',
      projectName: 'B工場増築工事',
      client: 'B工業株式会社',
      assignee: '鈴木一郎',
      budgetAmount: 45000000,
      actualAmount: 0,
      variance: 0,
      varianceRate: 0,
      status: 'pending_approval',
      createdAt: '2025-01-18',
      updatedAt: '2025-01-18',
      grossProfitRate: 28.0,
    },
    {
      id: '3',
      projectName: 'C店舗新装工事',
      client: 'C商事株式会社',
      assignee: '佐藤花子',
      budgetAmount: 8500000,
      actualAmount: 9200000,
      variance: 700000,
      varianceRate: 8.2,
      status: 'approved',
      createdAt: '2024-12-20',
      updatedAt: '2025-01-05',
      grossProfitRate: 22.3,
    },
    {
      id: '4',
      projectName: 'D住宅リフォーム',
      client: '個人顧客D様',
      assignee: '田中次郎',
      budgetAmount: 5500000,
      actualAmount: 5450000,
      variance: -50000,
      varianceRate: -0.9,
      status: 'approved',
      createdAt: '2024-11-15',
      updatedAt: '2024-12-30',
      grossProfitRate: 30.2,
    },
    {
      id: '5',
      projectName: 'E施設改修工事',
      client: 'E管理株式会社',
      assignee: '山田太郎',
      budgetAmount: 23000000,
      actualAmount: 0,
      variance: 0,
      varianceRate: 0,
      status: 'draft',
      createdAt: '2025-01-19',
      updatedAt: '2025-01-19',
      grossProfitRate: 26.8,
    },
  ]);

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          budget.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">下書き</span>;
      case 'pending_approval':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">承認待ち</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">承認済み</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">却下</span>;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">実行予算書一覧</h1>
            <p className="text-sm text-gray-600 mt-1">予実管理</p>
          </div>
          <Link
            href="/budgets/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            新規作成
          </Link>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">検索</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="工事名または受注先で検索"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべて</option>
                <option value="draft">下書き</option>
                <option value="pending_approval">承認待ち</option>
                <option value="approved">承認済み</option>
                <option value="rejected">却下</option>
              </select>
            </div>
          </div>
        </div>

        {/* 一覧テーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工事名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  受注先
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  担当者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  予算
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  実績
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  差異
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  粗利率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  更新日
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBudgets.map((budget) => (
                <tr
                  key={budget.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/budgets/${budget.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {budget.projectName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{budget.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{budget.assignee}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ¥{budget.budgetAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {budget.actualAmount > 0 ? `¥${budget.actualAmount.toLocaleString()}` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {budget.variance !== 0 ? (
                      <div className={`text-sm font-medium ${budget.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {budget.variance > 0 ? '+' : ''}¥{budget.variance.toLocaleString()}
                        <span className="text-xs ml-1">({budget.varianceRate > 0 ? '+' : ''}{budget.varianceRate}%)</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{budget.grossProfitRate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(budget.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{budget.updatedAt}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBudgets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">該当する実行予算書がありません</p>
            </div>
          )}
        </div>

        {/* ページネーション */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            全{filteredBudgets.length}件を表示
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              前へ
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              次へ
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}