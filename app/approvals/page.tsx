'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';
import { useAuthStore } from '@/app/stores/authStore';
import { BudgetStatus } from '@/app/types/budget';

// 承認待ち実行予算書の型定義
interface PendingBudget {
  id: number;
  projectId: number;
  projectNumber: string;
  projectName: string;
  applicant: string; // 申請者
  applicationDate: string; // 申請日
  status: BudgetStatus;
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
    status: 'pending_manager',
  },
  {
    id: 2,
    projectId: 2,
    projectNumber: 'PJ-2025-002',
    projectName: '△△マンション改修工事',
    applicant: '高橋五郎',
    applicationDate: '2025-09-30',
    status: 'pending_manager',
  },
  {
    id: 3,
    projectId: 3,
    projectNumber: 'PJ-2025-003',
    projectName: '××工場増築工事',
    applicant: '田中花子',
    applicationDate: '2025-10-01',
    status: 'pending_president',
  },
  {
    id: 4,
    projectId: 4,
    projectNumber: 'PJ-2025-004',
    projectName: '□□駅前再開発工事',
    applicant: '佐藤次郎',
    applicationDate: '2025-10-02',
    status: 'final_pending_president',
  },
  {
    id: 5,
    projectId: 5,
    projectNumber: 'PJ-2025-005',
    projectName: '◇◇病院建設工事',
    applicant: '鈴木三郎',
    applicationDate: '2025-10-03',
    status: 'final_pending_manager',
  },
];

export default function ApprovalsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  // 権限チェック：管理部長・常務・社長のみアクセス可
  useEffect(() => {
    if (!user || !['社長', '常務', '管理部長'].includes(user.role)) {
      router.push('/projects');
    }
  }, [user, router]);

  // 権限に応じた承認待ちリストのフィルタリング（第1回・第2回承認フロー対応）
  const getFilteredBudgets = () => {
    if (!user) return [];

    let filtered = mockPendingBudgets;

    // 権限別のフィルタリング（第1回・第2回承認フローの両方）
    switch (user.role) {
      case '管理部長':
        filtered = filtered.filter(b =>
          b.status === 'pending_manager' || b.status === 'final_pending_manager'
        );
        break;
      case '常務':
        filtered = filtered.filter(b =>
          b.status === 'pending_director' || b.status === 'final_pending_director'
        );
        break;
      case '社長':
        filtered = filtered.filter(b =>
          b.status === 'pending_president' || b.status === 'final_pending_president'
        );
        break;
      default:
        return []; // メンバー・経理は承認権限なし
    }

    // 検索フィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        b =>
          b.projectName.includes(searchTerm) ||
          b.projectNumber.includes(searchTerm)
      );
    }

    return filtered;
  };

  const filteredBudgets = getFilteredBudgets();

  // ステータスの日本語ラベル取得
  const getStatusLabel = (status: BudgetStatus): string => {
    switch (status) {
      case 'draft': return '下書き';
      case 'pending_manager': return '承認待ち（管理部長）';
      case 'pending_director': return '承認待ち（常務）';
      case 'pending_president': return '承認待ち（社長）';
      case 'rejected': return '却下';
      case 'in_progress': return '進行中';
      case 'final_pending_manager': return '最終承認待ち（管理部長）';
      case 'final_pending_director': return '最終承認待ち（常務）';
      case 'final_pending_president': return '最終承認待ち（社長）';
      case 'final_rejected': return '最終却下';
      case 'completed': return '完了';
      case 'change_request': return '変更申請中';
      default: return status;
    }
  };

  // ステータスバッジのスタイル取得（12種類対応）
  const getStatusBadge = (status: BudgetStatus): string => {
    switch (status) {
      // 第1回承認フロー
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending_manager':
      case 'pending_director':
      case 'pending_president':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      // 工事進行中
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      // 第2回承認フロー（最終承認）
      case 'final_pending_manager':
      case 'final_pending_director':
      case 'final_pending_president':
        return 'bg-orange-100 text-orange-800';
      case 'final_rejected':
        return 'bg-red-100 text-red-800';
      // 完了
      case 'completed':
        return 'bg-green-100 text-green-800';
      // 変更申請
      case 'change_request':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="p-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            {/* 戻るボタン（PC表示のみ） */}
            <button
              onClick={() => router.push('/projects')}
              className="hidden md:block mr-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">承認待ち実行予算書</h1>
              <p className="text-sm text-gray-600 mt-1">あなたの承認が必要な実行予算書の一覧</p>
            </div>
          </div>

          {/* 検索 */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="工事名・工事番号で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 承認待ち一覧 - PC表示（テーブル） */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NO
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工事番号
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工事名
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請者
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請日
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBudgets.map((budget, index) => (
                <tr
                  key={budget.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {budget.projectNumber}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {budget.projectName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {budget.applicant}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {budget.applicationDate}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(budget.status)}`}>
                      {getStatusLabel(budget.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2 justify-center">
                      <Link
                        href={`/projects/${budget.projectId}`}
                        className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                      >
                        詳細
                      </Link>
                      <Link
                        href={`/budgets/${budget.projectId}`}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        実行予算書
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* データがない場合 */}
          {filteredBudgets.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">現在承認待ちの案件はありません</p>
            </div>
          )}
        </div>

        {/* 承認待ち一覧 - スマホ表示（カード） */}
        <div className="md:hidden space-y-4">
          {filteredBudgets.map((budget) => (
            <div key={budget.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {budget.projectName}
                  </h3>
                  <p className="text-sm text-gray-600">{budget.projectNumber}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusBadge(budget.status)}`}>
                  {getStatusLabel(budget.status)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">申請者</span>
                  <span className="font-medium text-gray-900">{budget.applicant}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">申請日</span>
                  <span className="font-medium text-gray-900">{budget.applicationDate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/budgets/${budget.projectId}`}
                  className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors text-center"
                >
                  実行予算書を確認
                </Link>
              </div>
            </div>
          ))}

          {/* データがない場合 */}
          {filteredBudgets.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">現在承認待ちの案件はありません</p>
            </div>
          )}
        </div>

        {/* 件数表示 */}
        {filteredBudgets.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-700">
              全 <span className="font-medium">{filteredBudgets.length}</span> 件の承認待ち案件
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
