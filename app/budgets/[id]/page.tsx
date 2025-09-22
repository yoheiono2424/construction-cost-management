'use client';

import Layout from '@/app/components/Layout';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/app/stores/authStore';

interface BudgetDetailItem {
  id: string;
  name: string;
  specification: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  supplier: string;
  remarks: string;
  // 実績データ
  actualQuantity?: number;
  actualUnitPrice?: number;
  actualSubtotal?: number;
  actualSupplier?: string;
}

export default function BudgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [viewMode, setViewMode] = useState<'budget' | 'comparison'>('budget');

  // Next.js 15でparamsをアンラップ
  const resolvedParams = use(params);

  // サンプルデータ（実際はAPIから取得）
  const [budget] = useState({
    id: resolvedParams.id,
    projectName: 'A工場新築工事',
    customer: '○○工業株式会社',
    period: '2025/02/01 〜 2025/06/30',
    contractAmount: 50000000,
    status: 'pending_approval' as const,
    createdBy: '山田太郎',
    createdAt: '2025/01/19',
    sections: {
      materials: [
        {
          id: '1',
          name: 'コンクリート',
          specification: '21-15-20',
          unit: 'm³',
          quantity: 100,
          unitPrice: 15000,
          subtotal: 1500000,
          supplier: '○○建材',
          remarks: '',
          actualQuantity: 98,
          actualUnitPrice: 15500,
          actualSubtotal: 1519000,
          actualSupplier: '○○建材',
        },
        {
          id: '2',
          name: '鉄筋',
          specification: 'D13',
          unit: 't',
          quantity: 20,
          unitPrice: 120000,
          subtotal: 2400000,
          supplier: '△△鋼材',
          remarks: '',
          actualQuantity: 21,
          actualUnitPrice: 118000,
          actualSubtotal: 2478000,
          actualSupplier: '△△鋼材',
        },
      ] as BudgetDetailItem[],
      labor: [
        {
          id: '3',
          name: '型枠工',
          specification: '一般',
          unit: '人日',
          quantity: 50,
          unitPrice: 25000,
          subtotal: 1250000,
          supplier: '',
          remarks: '',
          actualQuantity: 52,
          actualUnitPrice: 25000,
          actualSubtotal: 1300000,
          actualSupplier: '',
        },
        {
          id: '4',
          name: '鉄筋工',
          specification: '一般',
          unit: '人日',
          quantity: 40,
          unitPrice: 28000,
          subtotal: 1120000,
          supplier: '',
          remarks: '',
          actualQuantity: 38,
          actualUnitPrice: 28000,
          actualSubtotal: 1064000,
          actualSupplier: '',
        },
      ] as BudgetDetailItem[],
      outsourcing: [
        {
          id: '5',
          name: '電気工事',
          specification: '一式',
          unit: '式',
          quantity: 1,
          unitPrice: 8500000,
          subtotal: 8500000,
          supplier: '○○電設',
          remarks: '',
          actualQuantity: 1,
          actualUnitPrice: 8700000,
          actualSubtotal: 8700000,
          actualSupplier: '○○電設',
        },
        {
          id: '6',
          name: '配管工事',
          specification: '一式',
          unit: '式',
          quantity: 1,
          unitPrice: 6500000,
          subtotal: 6500000,
          supplier: '△△設備',
          remarks: '',
          actualQuantity: 1,
          actualUnitPrice: 6300000,
          actualSubtotal: 6300000,
          actualSupplier: '△△設備',
        },
      ] as BudgetDetailItem[],
      expenses: [
        {
          id: '7',
          name: '現場管理費',
          specification: '',
          unit: '式',
          quantity: 1,
          unitPrice: 3000000,
          subtotal: 3000000,
          supplier: '',
          remarks: '',
          actualQuantity: 1,
          actualUnitPrice: 3100000,
          actualSubtotal: 3100000,
          actualSupplier: '',
        },
        {
          id: '8',
          name: '諸経費',
          specification: '',
          unit: '式',
          quantity: 1,
          unitPrice: 2000000,
          subtotal: 2000000,
          supplier: '',
          remarks: '',
          actualQuantity: 1,
          actualUnitPrice: 2050000,
          actualSubtotal: 2050000,
          actualSupplier: '',
        },
      ] as BudgetDetailItem[],
    },
  });

  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');

  const calculateSectionTotal = (items: BudgetDetailItem[], type: 'budget' | 'actual' = 'budget') => {
    return items.reduce((sum, item) => {
      if (type === 'actual') {
        return sum + (item.actualSubtotal || 0);
      }
      return sum + item.subtotal;
    }, 0);
  };

  const calculateTotal = (type: 'budget' | 'actual' = 'budget') => {
    return (
      calculateSectionTotal(budget.sections.materials, type) +
      calculateSectionTotal(budget.sections.labor, type) +
      calculateSectionTotal(budget.sections.outsourcing, type) +
      calculateSectionTotal(budget.sections.expenses, type)
    );
  };

  const calculateTax = (type: 'budget' | 'actual' = 'budget') => {
    return calculateTotal(type) * 0.1;
  };

  const calculateGrandTotal = (type: 'budget' | 'actual' = 'budget') => {
    return calculateTotal(type) + calculateTax(type);
  };

  const calculateVariance = (budget: number, actual: number) => {
    return actual - budget;
  };

  const calculateVarianceRate = (budget: number, actual: number) => {
    if (budget === 0) return 0;
    return ((actual - budget) / budget) * 100;
  };

  const handleApprove = () => {
    console.log('承認:', approvalComment);
    setShowApprovalDialog(false);
    router.push('/budgets');
  };

  const handleReject = () => {
    console.log('却下:', approvalComment);
    setShowApprovalDialog(false);
    router.push('/budgets');
  };

  const renderBudgetSection = (title: string, items: BudgetDetailItem[]) => {
    const total = calculateSectionTotal(items, 'budget');

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold">{title}</h3>
          <div className="text-sm">
            <span>小計: ¥{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-t-2 border-b-2 border-gray-300">
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">品名</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700">規格</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-700">単位</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-700">数量</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-700">単価</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-700">小計</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-700">備考</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 text-sm">{item.name}</td>
                  <td className="px-2 py-2 text-sm">{item.specification}</td>
                  <td className="px-2 py-2 text-sm text-center">{item.unit}</td>
                  <td className="px-2 py-2 text-sm text-right">{item.quantity.toLocaleString()}</td>
                  <td className="px-2 py-2 text-sm text-right">¥{item.unitPrice.toLocaleString()}</td>
                  <td className="px-2 py-2 text-sm text-right font-medium">¥{item.subtotal.toLocaleString()}</td>
                  <td className="px-2 py-2 text-sm">{item.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2">
                <td colSpan={5} className="px-2 py-2 text-right text-sm font-semibold">
                  計
                </td>
                <td className="px-2 py-2 text-right text-sm font-semibold">
                  ¥{total.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderComparisonSection = (title: string, items: BudgetDetailItem[]) => {
    const budgetTotal = calculateSectionTotal(items, 'budget');
    const actualTotal = calculateSectionTotal(items, 'actual');
    const variance = calculateVariance(budgetTotal, actualTotal);
    const varianceRate = calculateVarianceRate(budgetTotal, actualTotal);

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold">{title}</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span>予算: ¥{budgetTotal.toLocaleString()}</span>
            <span>実績: ¥{actualTotal.toLocaleString()}</span>
            <span className={variance > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
              差異: {variance > 0 ? '+' : ''}¥{variance.toLocaleString()} ({varianceRate > 0 ? '+' : ''}{varianceRate.toFixed(1)}%)
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-t-2 border-b-2 border-gray-300">
                <th rowSpan={2} className="px-2 py-2 text-left text-xs font-medium text-gray-700 border-r">品名</th>
                <th rowSpan={2} className="px-2 py-2 text-left text-xs font-medium text-gray-700 border-r">規格</th>
                <th rowSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-700 border-r">単位</th>
                <th colSpan={3} className="px-2 py-1 text-center text-xs font-medium text-gray-700 bg-blue-50 border-r">実行予算（計画）</th>
                <th colSpan={4} className="px-2 py-1 text-center text-xs font-medium text-gray-700 bg-green-50 border-r">原価実績（実績）</th>
                <th rowSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-700">差異</th>
              </tr>
              <tr className="border-b border-gray-300">
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 bg-blue-50 border-r">数量</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 bg-blue-50 border-r">単価</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 bg-blue-50 border-r">小計</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 bg-green-50 border-r">数量</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 bg-green-50 border-r">単価</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 bg-green-50 border-r">小計</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 bg-green-50 border-r">仕入先</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => {
                const variance = calculateVariance(item.subtotal, item.actualSubtotal || 0);
                const varianceRate = calculateVarianceRate(item.subtotal, item.actualSubtotal || 0);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-sm border-r">{item.name}</td>
                    <td className="px-2 py-2 text-sm border-r">{item.specification}</td>
                    <td className="px-2 py-2 text-sm text-center border-r">{item.unit}</td>
                    <td className="px-2 py-2 text-sm text-right bg-blue-50 border-r">{item.quantity.toLocaleString()}</td>
                    <td className="px-2 py-2 text-sm text-right bg-blue-50 border-r">¥{item.unitPrice.toLocaleString()}</td>
                    <td className="px-2 py-2 text-sm text-right font-medium bg-blue-50 border-r">¥{item.subtotal.toLocaleString()}</td>
                    <td className="px-2 py-2 text-sm text-right bg-green-50 border-r">
                      {item.actualQuantity ? item.actualQuantity.toLocaleString() : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-right bg-green-50 border-r">
                      {item.actualUnitPrice ? `¥${item.actualUnitPrice.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-right font-medium bg-green-50 border-r">
                      {item.actualSubtotal ? `¥${item.actualSubtotal.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm bg-green-50 border-r">{item.actualSupplier || '-'}</td>
                    <td className={`px-2 py-2 text-sm text-right font-medium ${variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : ''}`}>
                      {item.actualSubtotal ? (
                        <>
                          {variance > 0 ? '+' : ''}¥{variance.toLocaleString()}
                          <br />
                          <span className="text-xs">({varianceRate > 0 ? '+' : ''}{varianceRate.toFixed(1)}%)</span>
                        </>
                      ) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2">
                <td colSpan={3} className="px-2 py-2 text-right text-sm font-semibold border-r">
                  計
                </td>
                <td colSpan={3} className="px-2 py-2 text-right text-sm font-semibold bg-blue-100 border-r">
                  ¥{budgetTotal.toLocaleString()}
                </td>
                <td colSpan={4} className="px-2 py-2 text-right text-sm font-semibold bg-green-100 border-r">
                  ¥{actualTotal.toLocaleString()}
                </td>
                <td className={`px-2 py-2 text-right text-sm font-semibold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {variance > 0 ? '+' : ''}¥{variance.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  const budgetGrandTotal = calculateGrandTotal('budget');
  const actualGrandTotal = calculateGrandTotal('actual');
  const totalVariance = calculateVariance(budgetGrandTotal, actualGrandTotal);
  const totalVarianceRate = calculateVarianceRate(budgetGrandTotal, actualGrandTotal);

  return (
    <Layout>
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">実行予算書・原価管理</h1>
          <Link
            href="/budgets"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            一覧に戻る
          </Link>
        </div>

        {/* ステータスバー */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">ステータス：</span>
                {budget.status === 'pending_approval' && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    承認待ち
                  </span>
                )}
                {budget.status === 'approved' && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    承認済み
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">予算消化率：</span>
                <span className={`text-sm font-semibold ${totalVarianceRate > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {((actualGrandTotal / budgetGrandTotal) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              作成者: {budget.createdBy} | 作成日: {budget.createdAt}
            </div>
          </div>
        </div>

        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">基本情報</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">工事名</p>
              <p className="text-sm font-medium">{budget.projectName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">発注先</p>
              <p className="text-sm font-medium">{budget.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">工期</p>
              <p className="text-sm font-medium">{budget.period}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">請負金額</p>
              <p className="text-sm font-medium">¥{budget.contractAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* 表示モード切替 */}
          <div className="mt-4 flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">表示モード：</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('budget')}
                className={`px-4 py-2 text-sm rounded-md ${
                  viewMode === 'budget'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                予算のみ
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-4 py-2 text-sm rounded-md ${
                  viewMode === 'comparison'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                予実対比
              </button>
            </div>
          </div>
        </div>

        {/* 費目別明細 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold">実行予算書</h2>
            {viewMode === 'budget' && (budget.status === 'draft' || budget.status === 'pending_approval' || (user?.role === 'admin' && budget.status === 'approved')) && (
              <button
                onClick={() => router.push(`/budgets/${budget.id}/edit`)}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                編集
              </button>
            )}
          </div>

          {viewMode === 'comparison' ? (
            <>
              {renderComparisonSection('材料費', budget.sections.materials)}
              {renderComparisonSection('労務費', budget.sections.labor)}
              {renderComparisonSection('外注費', budget.sections.outsourcing)}
              {renderComparisonSection('諸経費', budget.sections.expenses)}
            </>
          ) : (
            <>
              {renderBudgetSection('材料費', budget.sections.materials)}
              {renderBudgetSection('労務費', budget.sections.labor)}
              {renderBudgetSection('外注費', budget.sections.outsourcing)}
              {renderBudgetSection('諸経費', budget.sections.expenses)}
            </>
          )}

          {/* サマリー */}
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <h3 className="text-md font-semibold mb-4">サマリー</h3>
            <div className={viewMode === 'comparison' ? "grid grid-cols-3 gap-8" : "grid grid-cols-1 max-w-md"}>
              <div>
                <h4 className="text-sm font-medium text-blue-700 mb-2">実行予算（計画）</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>材料費</span>
                    <span>¥{calculateSectionTotal(budget.sections.materials, 'budget').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>労務費</span>
                    <span>¥{calculateSectionTotal(budget.sections.labor, 'budget').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>外注費</span>
                    <span>¥{calculateSectionTotal(budget.sections.outsourcing, 'budget').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>諸経費</span>
                    <span>¥{calculateSectionTotal(budget.sections.expenses, 'budget').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t pt-1">
                    <span>小計</span>
                    <span>¥{calculateTotal('budget').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>消費税(10%)</span>
                    <span>¥{Math.floor(calculateTax('budget')).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t pt-1">
                    <span>合計</span>
                    <span className="text-blue-600">¥{Math.floor(budgetGrandTotal).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {viewMode === 'comparison' && (
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2">原価実績（実績）</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>材料費</span>
                    <span>¥{calculateSectionTotal(budget.sections.materials, 'actual').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>労務費</span>
                    <span>¥{calculateSectionTotal(budget.sections.labor, 'actual').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>外注費</span>
                    <span>¥{calculateSectionTotal(budget.sections.outsourcing, 'actual').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>諸経費</span>
                    <span>¥{calculateSectionTotal(budget.sections.expenses, 'actual').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t pt-1">
                    <span>小計</span>
                    <span>¥{calculateTotal('actual').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>消費税(10%)</span>
                    <span>¥{Math.floor(calculateTax('actual')).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t pt-1">
                    <span>合計</span>
                    <span className="text-green-600">¥{Math.floor(actualGrandTotal).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              )}

              {viewMode === 'comparison' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">差異分析</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>材料費</span>
                    <span className={calculateVariance(calculateSectionTotal(budget.sections.materials, 'budget'), calculateSectionTotal(budget.sections.materials, 'actual')) > 0 ? 'text-red-600' : 'text-green-600'}>
                      {calculateVariance(calculateSectionTotal(budget.sections.materials, 'budget'), calculateSectionTotal(budget.sections.materials, 'actual')) > 0 ? '+' : ''}
                      ¥{calculateVariance(calculateSectionTotal(budget.sections.materials, 'budget'), calculateSectionTotal(budget.sections.materials, 'actual')).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>労務費</span>
                    <span className={calculateVariance(calculateSectionTotal(budget.sections.labor, 'budget'), calculateSectionTotal(budget.sections.labor, 'actual')) > 0 ? 'text-red-600' : 'text-green-600'}>
                      {calculateVariance(calculateSectionTotal(budget.sections.labor, 'budget'), calculateSectionTotal(budget.sections.labor, 'actual')) > 0 ? '+' : ''}
                      ¥{calculateVariance(calculateSectionTotal(budget.sections.labor, 'budget'), calculateSectionTotal(budget.sections.labor, 'actual')).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>外注費</span>
                    <span className={calculateVariance(calculateSectionTotal(budget.sections.outsourcing, 'budget'), calculateSectionTotal(budget.sections.outsourcing, 'actual')) > 0 ? 'text-red-600' : 'text-green-600'}>
                      {calculateVariance(calculateSectionTotal(budget.sections.outsourcing, 'budget'), calculateSectionTotal(budget.sections.outsourcing, 'actual')) > 0 ? '+' : ''}
                      ¥{calculateVariance(calculateSectionTotal(budget.sections.outsourcing, 'budget'), calculateSectionTotal(budget.sections.outsourcing, 'actual')).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>諸経費</span>
                    <span className={calculateVariance(calculateSectionTotal(budget.sections.expenses, 'budget'), calculateSectionTotal(budget.sections.expenses, 'actual')) > 0 ? 'text-red-600' : 'text-green-600'}>
                      {calculateVariance(calculateSectionTotal(budget.sections.expenses, 'budget'), calculateSectionTotal(budget.sections.expenses, 'actual')) > 0 ? '+' : ''}
                      ¥{calculateVariance(calculateSectionTotal(budget.sections.expenses, 'budget'), calculateSectionTotal(budget.sections.expenses, 'actual')).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t pt-1">
                    <span>小計</span>
                    <span className={calculateVariance(calculateTotal('budget'), calculateTotal('actual')) > 0 ? 'text-red-600' : 'text-green-600'}>
                      {calculateVariance(calculateTotal('budget'), calculateTotal('actual')) > 0 ? '+' : ''}
                      ¥{calculateVariance(calculateTotal('budget'), calculateTotal('actual')).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>消費税</span>
                    <span className={calculateVariance(Math.floor(calculateTax('budget')), Math.floor(calculateTax('actual'))) > 0 ? 'text-red-600' : 'text-green-600'}>
                      {calculateVariance(Math.floor(calculateTax('budget')), Math.floor(calculateTax('actual'))) > 0 ? '+' : ''}
                      ¥{calculateVariance(Math.floor(calculateTax('budget')), Math.floor(calculateTax('actual'))).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t pt-1">
                    <span>合計</span>
                    <span className={totalVariance > 0 ? 'text-red-600' : 'text-green-600'}>
                      {totalVariance > 0 ? '+' : ''}¥{Math.floor(totalVariance).toLocaleString()}
                      <span className="text-sm ml-1">({totalVarianceRate > 0 ? '+' : ''}{totalVarianceRate.toFixed(1)}%)</span>
                    </span>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-between mb-8">
          <div className="space-x-2">
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              印刷
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Excelエクスポート
            </button>
          </div>
          {user?.role === 'admin' && budget.status === 'pending_approval' && (
            <div className="space-x-2">
              <button
                onClick={() => setShowApprovalDialog(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                承認
              </button>
              <button
                onClick={() => setShowApprovalDialog(true)}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                却下
              </button>
            </div>
          )}
        </div>

        {/* 承認ダイアログ */}
        {showApprovalDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">承認コメント</h3>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="コメントを入力（任意）"
              />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  却下する
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  承認する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}