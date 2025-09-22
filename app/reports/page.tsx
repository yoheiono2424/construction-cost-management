'use client';

import Layout from '@/app/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyProjectData {
  projectId: string;
  projectName: string;
  budget: number;
  actual: number;
  variance: number;
  varianceRate: number;
  profitRate: number;
  status: 'on_track' | 'warning' | 'over_budget';
}

interface MonthlyTrendData {
  month: string;
  totalBudget: number;
  totalActual: number;
  profitRate: number;
  consumptionRate: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(1);

  // ダミーデータ：月次トレンドデータ（過去12ヶ月）
  const [monthlyTrends] = useState<MonthlyTrendData[]>([
    { month: '2024/02', totalBudget: 45000000, totalActual: 42000000, profitRate: 24.5, consumptionRate: 93.3 },
    { month: '2024/03', totalBudget: 52000000, totalActual: 48500000, profitRate: 25.2, consumptionRate: 93.3 },
    { month: '2024/04', totalBudget: 38000000, totalActual: 39200000, profitRate: 22.8, consumptionRate: 103.2 },
    { month: '2024/05', totalBudget: 61000000, totalActual: 58000000, profitRate: 26.1, consumptionRate: 95.1 },
    { month: '2024/06', totalBudget: 55000000, totalActual: 52300000, profitRate: 25.5, consumptionRate: 95.1 },
    { month: '2024/07', totalBudget: 48000000, totalActual: 49500000, profitRate: 23.9, consumptionRate: 103.1 },
    { month: '2024/08', totalBudget: 42000000, totalActual: 41000000, profitRate: 24.8, consumptionRate: 97.6 },
    { month: '2024/09', totalBudget: 58000000, totalActual: 55000000, profitRate: 26.3, consumptionRate: 94.8 },
    { month: '2024/10', totalBudget: 63000000, totalActual: 61500000, profitRate: 25.8, consumptionRate: 97.6 },
    { month: '2024/11', totalBudget: 51000000, totalActual: 52000000, profitRate: 24.2, consumptionRate: 102.0 },
    { month: '2024/12', totalBudget: 68000000, totalActual: 65000000, profitRate: 26.5, consumptionRate: 95.6 },
    { month: '2025/01', totalBudget: 72000000, totalActual: 45000000, profitRate: 27.2, consumptionRate: 62.5 },
  ]);

  // ダミーデータ：選択月のプロジェクト別データ
  const [monthlyProjects] = useState<MonthlyProjectData[]>([
    {
      projectId: '1',
      projectName: 'A工事現場改修工事',
      budget: 12000000,
      actual: 11500000,
      variance: -500000,
      varianceRate: -4.2,
      profitRate: 25.5,
      status: 'on_track',
    },
    {
      projectId: '2',
      projectName: 'B工場増築工事',
      budget: 45000000,
      actual: 20000000,
      variance: -25000000,
      varianceRate: -55.6,
      profitRate: 28.0,
      status: 'on_track',
    },
    {
      projectId: '3',
      projectName: 'C店舗新装工事',
      budget: 8500000,
      actual: 9200000,
      variance: 700000,
      varianceRate: 8.2,
      profitRate: 22.3,
      status: 'over_budget',
    },
    {
      projectId: '4',
      projectName: 'D住宅リフォーム',
      budget: 5500000,
      actual: 4300000,
      variance: -1200000,
      varianceRate: -21.8,
      profitRate: 30.2,
      status: 'on_track',
    },
    {
      projectId: '5',
      projectName: 'E施設改修工事',
      budget: 1000000,
      actual: 0,
      variance: -1000000,
      varianceRate: -100,
      profitRate: 26.8,
      status: 'on_track',
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // 集計データの計算
  const currentMonthData = monthlyTrends[monthlyTrends.length - 1];
  const previousMonthData = monthlyTrends[monthlyTrends.length - 2];

  const totalBudgetSum = monthlyProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalActualSum = monthlyProjects.reduce((sum, p) => sum + p.actual, 0);
  const totalVariance = totalActualSum - totalBudgetSum;
  const totalVarianceRate = totalBudgetSum > 0 ? (totalVariance / totalBudgetSum) * 100 : 0;

  // 前月比の計算
  const monthOverMonthBudget = previousMonthData
    ? ((currentMonthData.totalBudget - previousMonthData.totalBudget) / previousMonthData.totalBudget) * 100
    : 0;
  const monthOverMonthActual = previousMonthData
    ? ((currentMonthData.totalActual - previousMonthData.totalActual) / previousMonthData.totalActual) * 100
    : 0;


  // カスタムツールチップ
  interface TooltipPayload {
    color: string;
    name: string;
    value: number;
  }

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ¥{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">順調</span>;
      case 'warning':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">注意</span>;
      case 'over_budget':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">超過</span>;
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
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">月次予実レポート</h1>
              <p className="text-sm text-gray-600 mt-1">全プロジェクトの予算と実績の分析</p>
            </div>
            {/* 月選択 */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={2024}>2024年</option>
                <option value={2025}>2025年</option>
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}月
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">今月の予算合計</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ¥{totalBudgetSum.toLocaleString()}
            </p>
            <p className={`text-xs mt-2 ${monthOverMonthBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              前月比 {monthOverMonthBudget >= 0 ? '+' : ''}{monthOverMonthBudget.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">今月の実績合計</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ¥{totalActualSum.toLocaleString()}
            </p>
            <p className={`text-xs mt-2 ${monthOverMonthActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              前月比 {monthOverMonthActual >= 0 ? '+' : ''}{monthOverMonthActual.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">予算消化率</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {currentMonthData.consumptionRate.toFixed(1)}%
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    currentMonthData.consumptionRate > 100 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(currentMonthData.consumptionRate, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">平均利益率</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {currentMonthData.profitRate.toFixed(1)}%
            </p>
            <p className={`text-xs mt-2 ${
              currentMonthData.profitRate - previousMonthData.profitRate >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              前月比 {currentMonthData.profitRate - previousMonthData.profitRate >= 0 ? '+' : ''}
              {(currentMonthData.profitRate - previousMonthData.profitRate).toFixed(1)}pt
            </p>
          </div>
        </div>

        {/* グラフエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 月次推移グラフ */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">予実推移（12ヶ月）</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `¥${(value / 1000000).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalBudget"
                  stroke="#3B82F6"
                  name="予算"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="totalActual"
                  stroke="#10B981"
                  name="実績"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 利益率推移グラフ */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">利益率推移（12ヶ月）</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="profitRate"
                  stroke="#F59E0B"
                  name="利益率"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* プロジェクト別詳細テーブル */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">プロジェクト別予実対比（{selectedYear}年{selectedMonth}月）</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">プロジェクト名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">予算</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">実績</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">差異</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">差異率</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">利益率</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状態</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyProjects.map((project) => (
                  <tr key={project.projectId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{project.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{project.actual.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      project.variance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {project.variance > 0 ? '+' : ''}¥{project.variance.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      project.varianceRate > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {project.varianceRate > 0 ? '+' : ''}{project.varianceRate.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.profitRate.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr className="font-semibold">
                  <td className="px-6 py-4 text-sm text-gray-900">合計</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ¥{totalBudgetSum.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ¥{totalActualSum.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    totalVariance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {totalVariance > 0 ? '+' : ''}¥{totalVariance.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    totalVarianceRate > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {totalVarianceRate > 0 ? '+' : ''}{totalVarianceRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {currentMonthData.profitRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}