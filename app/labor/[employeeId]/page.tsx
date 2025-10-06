'use client';

import { use, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/app/components/Layout';

// ダミーデータ
const dummyEmployeeData = {
  '1': {
    id: '1',
    name: '山田太郎',
    records: [
      // 2025年9月のデータ
      {
        id: 'r1',
        projectName: '○○ビル新築工事',
        date: '2025-09-01',
        days: 1.0,
        description: '基礎工事',
        cost: 15000,
      },
      {
        id: 'r2',
        projectName: '○○ビル新築工事',
        date: '2025-09-02',
        days: 1.0,
        description: '基礎工事',
        cost: 15000,
      },
      {
        id: 'r3',
        projectName: '△△マンション改修工事',
        date: '2025-09-05',
        days: 0.5,
        description: '外壁補修',
        cost: 7500,
      },
      {
        id: 'r4',
        projectName: '□□工場建設工事',
        date: '2025-09-10',
        days: 2.0,
        description: '鉄骨組立',
        cost: 30000,
      },
      {
        id: 'r5',
        projectName: '○○ビル新築工事',
        date: '2025-09-15',
        days: 1.0,
        description: '型枠組立',
        cost: 15000,
      },
      // 2025年10月のデータ
      {
        id: 'r6',
        projectName: '○○ビル新築工事',
        date: '2025-10-01',
        days: 1.0,
        description: 'コンクリート打設',
        cost: 15000,
      },
      {
        id: 'r7',
        projectName: '○○ビル新築工事',
        date: '2025-10-03',
        days: 1.0,
        description: 'コンクリート打設',
        cost: 15000,
      },
      {
        id: 'r8',
        projectName: '□□工場建設工事',
        date: '2025-10-08',
        days: 1.5,
        description: '鉄骨溶接',
        cost: 22500,
      },
      {
        id: 'r9',
        projectName: '○○ビル新築工事',
        date: '2025-10-12',
        days: 1.0,
        description: '型枠解体',
        cost: 15000,
      },
      {
        id: 'r10',
        projectName: '□□工場建設工事',
        date: '2025-10-18',
        days: 0.5,
        description: '検査立会',
        cost: 7500,
      },
    ],
  },
  '2': {
    id: '2',
    name: '佐藤花子',
    records: [
      // 2025年9月のデータ
      {
        id: 'r11',
        projectName: '○○ビル新築工事',
        date: '2025-09-03',
        days: 1.0,
        description: '配管工事',
        cost: 15000,
      },
      {
        id: 'r12',
        projectName: '△△マンション改修工事',
        date: '2025-09-07',
        days: 1.5,
        description: '内装仕上げ',
        cost: 22500,
      },
      {
        id: 'r13',
        projectName: '○○ビル新築工事',
        date: '2025-09-10',
        days: 1.0,
        description: '配管接続',
        cost: 15000,
      },
      // 2025年10月のデータ
      {
        id: 'r14',
        projectName: '△△マンション改修工事',
        date: '2025-10-05',
        days: 1.0,
        description: '電気配線',
        cost: 15000,
      },
      {
        id: 'r15',
        projectName: '△△マンション改修工事',
        date: '2025-10-12',
        days: 1.0,
        description: '照明器具取付',
        cost: 15000,
      },
    ],
  },
  '3': {
    id: '3',
    name: '鈴木一郎',
    records: [
      // 2025年9月のデータ
      {
        id: 'r16',
        projectName: '□□工場建設工事',
        date: '2025-09-02',
        days: 1.0,
        description: '重機オペレーター',
        cost: 15000,
      },
      {
        id: 'r17',
        projectName: '□□工場建設工事',
        date: '2025-09-04',
        days: 1.0,
        description: '重機オペレーター',
        cost: 15000,
      },
      {
        id: 'r18',
        projectName: '○○ビル新築工事',
        date: '2025-09-08',
        days: 1.0,
        description: '掘削作業',
        cost: 15000,
      },
      {
        id: 'r19',
        projectName: '△△マンション改修工事',
        date: '2025-09-11',
        days: 1.0,
        description: '解体作業',
        cost: 15000,
      },
      {
        id: 'r20',
        projectName: '□□工場建設工事',
        date: '2025-09-16',
        days: 1.0,
        description: '整地作業',
        cost: 15000,
      },
    ],
  },
  '4': {
    id: '4',
    name: '田中美咲',
    records: [
      // 2025年10月のデータ
      {
        id: 'r21',
        projectName: '○○ビル新築工事',
        date: '2025-10-02',
        days: 1.0,
        description: '現場管理',
        cost: 15000,
      },
      {
        id: 'r22',
        projectName: '○○ビル新築工事',
        date: '2025-10-07',
        days: 1.0,
        description: '品質検査',
        cost: 15000,
      },
      {
        id: 'r23',
        projectName: '□□工場建設工事',
        date: '2025-10-10',
        days: 1.0,
        description: '安全巡視',
        cost: 15000,
      },
      {
        id: 'r24',
        projectName: '○○ビル新築工事',
        date: '2025-10-15',
        days: 0.5,
        description: '工程会議',
        cost: 7500,
      },
      {
        id: 'r25',
        projectName: '△△マンション改修工事',
        date: '2025-10-20',
        days: 1.0,
        description: '現場管理',
        cost: 15000,
      },
    ],
  },
};

interface PageProps {
  params: Promise<{ employeeId: string }>;
}

function LaborDetailContent({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const employeeId = resolvedParams.employeeId;

  // URLパラメータから月を取得、なければデフォルト値
  const monthFromUrl = searchParams.get('month') || '2025-09';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(monthFromUrl);

  // URLパラメータが変更されたら selectedMonth を更新
  useEffect(() => {
    const month = searchParams.get('month');
    if (month) {
      setSelectedMonth(month);
    }
  }, [searchParams]);

  // 従業員データ取得
  const employeeData = dummyEmployeeData[employeeId as keyof typeof dummyEmployeeData];

  if (!employeeData) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <p className="text-gray-500">従業員が見つかりません</p>
            <button
              onClick={() => router.push(`/labor?month=${selectedMonth}`)}
              className="mt-4 text-blue-600 hover:text-blue-900"
            >
              ← 労務管理一覧に戻る
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // フィルタリング
  const filteredRecords = employeeData.records.filter((record) => {
    const matchesSearch = record.projectName.includes(searchTerm) || record.description.includes(searchTerm);
    const matchesMonth = record.date.startsWith(selectedMonth);
    return matchesSearch && matchesMonth;
  });

  // 合計計算
  const totalDays = filteredRecords.reduce((sum, record) => sum + record.days, 0);
  const totalCost = filteredRecords.reduce((sum, record) => sum + record.cost, 0);

  return (
    <Layout>
      <div className="p-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/labor?month=${selectedMonth}`)}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 戻る
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{employeeData.name} の労務履歴</h1>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">月選択</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
              <input
                type="text"
                placeholder="現場名・作業内容で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">稼働記録数</p>
            <p className="text-3xl font-bold text-gray-900">{filteredRecords.length}件</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">合計労働日数</p>
            <p className="text-3xl font-bold text-blue-600">{totalDays.toFixed(1)}日</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">合計労務費</p>
            <p className="text-3xl font-bold text-green-600">¥{totalCost.toLocaleString()}</p>
          </div>
        </div>

        {/* 労務履歴テーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  現場名（工事名）
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作業内容
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  労務費
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.projectName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{record.description}</div>
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

          {filteredRecords.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              該当する労務記録が見つかりません
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function LaborDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="p-8">読み込み中...</div>}>
      <LaborDetailContent params={params} />
    </Suspense>
  );
}
