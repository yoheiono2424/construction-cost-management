'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/app/components/Layout';
import Link from 'next/link';
import { useAuthStore } from '@/app/stores/authStore';

// 従業員の月別稼働データ
const dummyLaborRecords = [
  // 山田太郎のデータ
  { employeeId: '1', employeeName: '山田太郎', month: '2025-09', days: 22.5, cost: 337500, projectCount: 3 },
  { employeeId: '1', employeeName: '山田太郎', month: '2025-10', days: 20.0, cost: 300000, projectCount: 2 },
  // 佐藤花子のデータ
  { employeeId: '2', employeeName: '佐藤花子', month: '2025-09', days: 18.0, cost: 270000, projectCount: 2 },
  { employeeId: '2', employeeName: '佐藤花子', month: '2025-10', days: 15.5, cost: 232500, projectCount: 1 },
  // 鈴木一郎のデータ
  { employeeId: '3', employeeName: '鈴木一郎', month: '2025-09', days: 25.0, cost: 375000, projectCount: 4 },
  // 田中美咲のデータ
  { employeeId: '4', employeeName: '田中美咲', month: '2025-10', days: 20.5, cost: 307500, projectCount: 3 },
];

function LaborManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  // 権限チェック：現場メンバーはアクセス不可
  useEffect(() => {
    if (!user || user.role === '現場メンバー') {
      router.push('/projects');
    }
  }, [user, router]);

  // URLパラメータから月を取得、なければデフォルト値
  const monthFromUrl = searchParams.get('month') || '2025-10';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(monthFromUrl);

  // URLパラメータが変更されたら selectedMonth を更新
  useEffect(() => {
    const month = searchParams.get('month');
    if (month) {
      setSelectedMonth(month);
    }
  }, [searchParams]);

  // 選択月でフィルタリング（その月に稼働した従業員のみ）
  const monthFilteredRecords = dummyLaborRecords.filter(
    (record) => record.month === selectedMonth
  );

  // 検索フィルター
  const filteredEmployees = monthFilteredRecords.filter((record) =>
    record.employeeName.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="p-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">労務管理</h1>
              <p className="text-sm text-gray-600 mt-1">従業員の稼働状況と労務費の管理</p>
            </div>
            <Link
              href="/labor/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 新規労務費入力
            </Link>
          </div>
        </div>

        {/* 対象月選択と検索バー */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">対象月</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
              <input
                type="text"
                placeholder="従業員名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 従業員一覧テーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  従業員名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  稼働現場数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  トータル労働日数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  合計労務費
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((record) => (
                <tr
                  key={`${record.employeeId}-${record.month}`}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/labor/${record.employeeId}?month=${record.month}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.projectCount}件</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.days.toFixed(1)}日</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ¥{record.cost.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              該当する従業員が見つかりません
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function LaborManagementPage() {
  return (
    <Suspense fallback={<div className="p-8">読み込み中...</div>}>
      <LaborManagementContent />
    </Suspense>
  );
}
