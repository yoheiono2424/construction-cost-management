'use client';

import Layout from '@/app/components/Layout';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
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
  // プロジェクトIDに応じて異なるデータを設定
  const getBudgetData = () => {
    switch (resolvedParams.id) {
      case '1':
        return {
          id: resolvedParams.id,
          projectName: '○○ビル新築工事',
          customer: '○○工業株式会社',
          period: '2025/04/01 〜 2025/12/31',
          contractAmount: 150000000,
          status: 'pending_manager' as 'draft' | 'pending_manager' | 'pending_director' | 'pending_president' | 'approved' | 'rejected',
          createdBy: '高橋五郎',
          createdAt: '2025/09/28',
        };
      case '2':
        return {
          id: resolvedParams.id,
          projectName: '△△マンション改修工事',
          customer: '△△不動産株式会社',
          period: '2025/03/15 〜 2025/09/30',
          contractAmount: 85000000,
          status: 'pending_manager' as 'draft' | 'pending_manager' | 'pending_director' | 'pending_president' | 'approved' | 'rejected',
          createdBy: '高橋五郎',
          createdAt: '2025/09/30',
        };
      case '3':
        return {
          id: resolvedParams.id,
          projectName: '××工場増築工事',
          customer: '××製造株式会社',
          period: '2025/05/01 〜 2026/03/31',
          contractAmount: 220000000,
          status: 'pending_president' as 'draft' | 'pending_manager' | 'pending_director' | 'pending_president' | 'approved' | 'rejected',
          createdBy: '田中花子',
          createdAt: '2025/10/01',
        };
      default:
        return {
          id: resolvedParams.id,
          projectName: 'A工場新築工事',
          customer: '○○工業株式会社',
          period: '2025/02/01 〜 2025/06/30',
          contractAmount: 50000000,
          status: 'draft' as 'draft' | 'pending_manager' | 'pending_director' | 'pending_president' | 'approved' | 'rejected',
          createdBy: '山田太郎',
          createdAt: '2025/01/19',
        };
    }
  };

  const [budget] = useState({
    ...getBudgetData(),
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
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');

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

  // 承認申請ボタンの処理
  const handleSubmitForApproval = () => {
    console.log('承認申請を送信しました');
    // TODO: ステータスを'pending_manager'に更新
    router.push('/budgets');
  };

  // 承認ボタンの表示制御
  const canApprove = () => {
    if (!user) return false;

    if (budget.status === 'pending_manager' && user.role === '管理部長') return true;
    if (budget.status === 'pending_director' && user.role === '常務') return true;
    if (budget.status === 'pending_president' && user.role === '社長') return true;

    return false;
  };

  // 承認申請ボタンの表示制御
  const canSubmitForApproval = () => {
    if (!user) return false;
    return budget.status === 'draft' && (user.role === 'メンバー' || user.role === '経理');
  };

  // スマホ用：カード形式表示（予算のみ）
  const renderBudgetSectionMobile = (title: string, items: BudgetDetailItem[]) => {
    const total = calculateSectionTotal(items, 'budget');

    return (
      <div className="mb-6">
        <div className="mb-3 pb-2 border-b-2 border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          {/* 予算のみの1カラム表示 */}
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-gray-600 text-xs mb-1">予算合計</div>
            <div className="font-semibold text-gray-900 text-base">¥{total.toLocaleString()}</div>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <h4 className="font-semibold text-gray-900 px-4 py-3 bg-gray-50 border-b border-gray-200">
                {item.name}
              </h4>

              {/* 予算セクション（青背景） */}
              <div className="bg-blue-50 px-4 py-3">
                <div className="text-xs font-semibold text-blue-900 mb-2">予算</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">規格:</span>
                    <span className="ml-1 text-gray-900">{item.specification}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">単位:</span>
                    <span className="ml-1 text-gray-900">{item.unit}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">数量:</span>
                    <span className="ml-1 text-gray-900">{item.quantity.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">単価:</span>
                    <span className="ml-1 text-gray-900">¥{item.unitPrice.toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-700">小計</span>
                  <span className="text-base font-bold text-gray-900">¥{item.subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* 備考 */}
              {item.remarks && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                  <span className="text-xs font-medium text-gray-600">備考:</span>
                  <span className="ml-1 text-xs text-gray-700">{item.remarks}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // PC用：テーブル形式表示（予算のみ）
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

  // スマホ用：予実対比をカード形式で表示
  const renderComparisonSectionMobile = (title: string, items: BudgetDetailItem[]) => {
    const budgetTotal = calculateSectionTotal(items, 'budget');
    const actualTotal = calculateSectionTotal(items, 'actual');
    const variance = calculateVariance(budgetTotal, actualTotal);

    return (
      <div className="mb-6">
        <div className="mb-3 pb-2 border-b-2 border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-blue-50 p-2 rounded">
              <div className="text-gray-600 mb-1">予算</div>
              <div className="font-semibold text-gray-900">¥{budgetTotal.toLocaleString()}</div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="text-gray-600 mb-1">実績</div>
              <div className="font-semibold text-gray-900">¥{actualTotal.toLocaleString()}</div>
            </div>
            <div className={`p-2 rounded ${variance > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className="text-gray-600 mb-1">差異</div>
              <div className={`font-semibold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {variance > 0 ? '+' : ''}¥{variance.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {items.map((item) => {
            const itemVariance = calculateVariance(item.subtotal, item.actualSubtotal || 0);
            const itemVarianceRate = calculateVarianceRate(item.subtotal, item.actualSubtotal || 0);
            return (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{item.name}</h4>

                {/* 予算 */}
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <div className="text-xs font-semibold text-blue-700 mb-2">予算（計画）</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">規格:</span>
                      <span className="ml-2 text-gray-900">{item.specification}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">単位:</span>
                      <span className="ml-2 text-gray-900">{item.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">数量:</span>
                      <span className="ml-2 text-gray-900">{item.quantity.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">単価:</span>
                      <span className="ml-2 text-gray-900">¥{item.unitPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center bg-blue-50 p-2 rounded">
                    <span className="text-sm font-semibold text-gray-700">小計</span>
                    <span className="text-base font-bold text-gray-900">¥{item.subtotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* 実績 */}
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <div className="text-xs font-semibold text-green-700 mb-2">実績</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">数量:</span>
                      <span className="ml-2 text-gray-900">{item.actualQuantity ? item.actualQuantity.toLocaleString() : '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">単価:</span>
                      <span className="ml-2 text-gray-900">{item.actualUnitPrice ? `¥${item.actualUnitPrice.toLocaleString()}` : '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">仕入先:</span>
                      <span className="ml-2 text-gray-900">{item.actualSupplier || '-'}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center bg-green-50 p-2 rounded">
                    <span className="text-sm font-semibold text-gray-700">小計</span>
                    <span className="text-base font-bold text-gray-900">
                      {item.actualSubtotal ? `¥${item.actualSubtotal.toLocaleString()}` : '-'}
                    </span>
                  </div>
                </div>

                {/* 差異 */}
                {item.actualSubtotal && (
                  <div className={`p-2 rounded ${itemVariance > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">差異</span>
                      <div className="text-right">
                        <div className={`text-base font-bold ${itemVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {itemVariance > 0 ? '+' : ''}¥{itemVariance.toLocaleString()}
                        </div>
                        <div className={`text-xs ${itemVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ({itemVarianceRate > 0 ? '+' : ''}{itemVarianceRate.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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

  const budgetGrandTotal = calculateGrandTotal('budget');
  const actualGrandTotal = calculateGrandTotal('actual');
  const totalVarianceRate = calculateVarianceRate(budgetGrandTotal, actualGrandTotal);

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <Layout>
      <div className="max-w-full mx-auto px-4">
        {/* ヘッダー - PC表示 */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">実行予算書・原価管理</h1>
          <div className="flex items-center gap-3">
            {/* 承認申請ボタン（下書き状態でメンバー・経理のみ表示） */}
            {canSubmitForApproval() && (
              <button
                onClick={handleSubmitForApproval}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                承認申請
              </button>
            )}

            {/* 承認/却下ボタン（承認待ち状態で該当の承認者のみ表示） */}
            {canApprove() && (
              <>
                <button
                  onClick={() => {
                    setApprovalAction('approve');
                    setShowApprovalDialog(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  承認する
                </button>
                <button
                  onClick={() => {
                    setApprovalAction('reject');
                    setShowApprovalDialog(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  却下する
                </button>
              </>
            )}

            {/* PDFエクスポートボタン（メンバー以外に表示） */}
            {user?.role !== 'メンバー' && (
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                PDF Export
              </button>
            )}

            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ← 戻る
            </button>
          </div>
        </div>

        {/* ヘッダー - スマホ表示 */}
        <div className="md:hidden mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-3">実行予算書・原価管理</h1>

          {/* 承認/却下ボタン（社長用・スマホ） */}
          {canApprove() && (
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => {
                  setApprovalAction('approve');
                  setShowApprovalDialog(true);
                }}
                className="flex-1 px-6 py-3 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700"
              >
                承認する
              </button>
              <button
                onClick={() => {
                  setApprovalAction('reject');
                  setShowApprovalDialog(true);
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white text-base font-semibold rounded-lg hover:bg-red-700"
              >
                却下する
              </button>
            </div>
          )}

          {/* 承認申請ボタン（スマホ） */}
          {canSubmitForApproval() && (
            <button
              onClick={handleSubmitForApproval}
              className="w-full px-6 py-3 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700 mb-3"
            >
              承認申請
            </button>
          )}
        </div>

        {/* ステータスバー - PC表示 */}
        <div className="hidden md:block bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">ステータス：</span>
                {budget.status === 'draft' && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    下書き
                  </span>
                )}
                {budget.status === 'pending_manager' && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    承認待ち（管理部長）
                  </span>
                )}
                {budget.status === 'pending_director' && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    承認待ち（常務）
                  </span>
                )}
                {budget.status === 'pending_president' && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    承認待ち（社長）
                  </span>
                )}
                {budget.status === 'approved' && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    承認済み
                  </span>
                )}
                {budget.status === 'rejected' && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    却下
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

        {/* ステータスバー - スマホ表示 */}
        <div className="md:hidden bg-white rounded-lg shadow p-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ステータス</span>
              {budget.status === 'draft' && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  下書き
                </span>
              )}
              {budget.status === 'pending_manager' && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  承認待ち（管理部長）
                </span>
              )}
              {budget.status === 'pending_director' && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  承認待ち（常務）
                </span>
              )}
              {budget.status === 'pending_president' && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  承認待ち（社長）
                </span>
              )}
              {budget.status === 'approved' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  承認済み
                </span>
              )}
              {budget.status === 'rejected' && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  却下
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">予算消化率</span>
              <span className={`text-sm font-semibold ${totalVarianceRate > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {((actualGrandTotal / budgetGrandTotal) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t">
              作成者: {budget.createdBy} | 作成日: {budget.createdAt}
            </div>
          </div>
        </div>

        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 border-b pb-2">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div>
              <p className="text-xs md:text-sm text-gray-600">工事名</p>
              <p className="text-sm md:text-sm font-medium">{budget.projectName}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">発注先</p>
              <p className="text-sm md:text-sm font-medium">{budget.customer}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">工期</p>
              <p className="text-sm md:text-sm font-medium">{budget.period}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">請負金額</p>
              <p className="text-sm md:text-sm font-medium">¥{budget.contractAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* 表示モード切替 */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
            <span className="text-sm font-medium text-gray-700">表示モード</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('budget')}
                className={`flex-1 md:flex-none px-4 py-2 text-sm rounded-md ${
                  viewMode === 'budget'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                予算のみ
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`flex-1 md:flex-none px-4 py-2 text-sm rounded-md ${
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
            <div className="flex items-center gap-2">
              {/* 編集ボタン（社長以外に表示） */}
              {viewMode === 'budget' && user?.role !== '社長' && (budget.status === 'draft' || budget.status === 'pending_manager' || budget.status === 'pending_director' || budget.status === 'pending_president' || (['常務', '管理部長'].includes(user?.role || '') && budget.status === 'approved')) && (
                <button
                  onClick={() => router.push(`/budgets/${budget.id}/edit`)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  編集
                </button>
              )}
            </div>
          </div>

          {/* サマリー（PC表示：両モードで上部に表示） */}
          <div className="hidden md:block mb-8 pb-6 border-b-2 border-gray-300">
            <h3 className="text-md font-semibold mb-4">サマリー</h3>
            {viewMode === 'comparison' ? (
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <h4 className="text-sm font-medium text-blue-700 mb-2">実行予算（計画）</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>請負額</span>
                      <span>¥{budget.contractAmount.toLocaleString()}</span>
                    </div>
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
                      <span>原価計</span>
                      <span>¥{calculateTotal('budget').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>利益</span>
                      <span className="text-blue-600">¥{(budget.contractAmount - calculateTotal('budget')).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>利率</span>
                      <span className="text-blue-600">{((budget.contractAmount - calculateTotal('budget')) / budget.contractAmount * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-2">最終原価（実施）</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>変更額</span>
                      <span>¥{budget.contractAmount.toLocaleString()}</span>
                    </div>
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
                      <span>原価計</span>
                      <span>¥{calculateTotal('actual').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>利益</span>
                      <span className="text-green-600">¥{(budget.contractAmount - calculateTotal('actual')).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>利率</span>
                      <span className="text-green-600">{((budget.contractAmount - calculateTotal('actual')) / budget.contractAmount * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">増減（差異）</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>請負額</span>
                      <span>¥0</span>
                    </div>
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
                      <span>原価計</span>
                      <span className={calculateVariance(calculateTotal('budget'), calculateTotal('actual')) > 0 ? 'text-red-600' : 'text-green-600'}>
                        {calculateVariance(calculateTotal('budget'), calculateTotal('actual')) > 0 ? '+' : ''}
                        ¥{calculateVariance(calculateTotal('budget'), calculateTotal('actual')).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>利益</span>
                      <span className={calculateVariance(budget.contractAmount - calculateTotal('budget'), budget.contractAmount - calculateTotal('actual')) > 0 ? 'text-green-600' : 'text-red-600'}>
                        {calculateVariance(budget.contractAmount - calculateTotal('budget'), budget.contractAmount - calculateTotal('actual')) > 0 ? '+' : ''}
                        ¥{calculateVariance(budget.contractAmount - calculateTotal('budget'), budget.contractAmount - calculateTotal('actual')).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>利率</span>
                      <span className={calculateVariance(budget.contractAmount - calculateTotal('budget'), budget.contractAmount - calculateTotal('actual')) > 0 ? 'text-green-600' : 'text-red-600'}>
                        {(calculateVariance(budget.contractAmount - calculateTotal('budget'), budget.contractAmount - calculateTotal('actual')) / budget.contractAmount * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 max-w-md">
                <div>
                  <h4 className="text-sm font-medium text-blue-700 mb-2">実行予算（計画）</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>請負額</span>
                      <span>¥{budget.contractAmount.toLocaleString()}</span>
                    </div>
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
                      <span>原価計</span>
                      <span>¥{calculateTotal('budget').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>利益</span>
                      <span className="text-blue-600">¥{(budget.contractAmount - calculateTotal('budget')).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>利率</span>
                      <span className="text-blue-600">{((budget.contractAmount - calculateTotal('budget')) / budget.contractAmount * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* サマリー（スマホ表示：両モードで上部に表示） */}
          <div className="md:hidden mb-6 pb-4 border-b-2 border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">サマリー</h3>
            {viewMode === 'comparison' ? (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">実行予算（計画）</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">請負額</span>
                      <span className="font-medium text-gray-900">¥{budget.contractAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">材料費</span>
                      <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.materials, 'budget').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">労務費</span>
                      <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.labor, 'budget').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">外注費</span>
                      <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.outsourcing, 'budget').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">諸経費</span>
                      <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.expenses, 'budget').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t border-blue-200 pt-2 mt-2">
                      <span className="text-gray-800">原価計</span>
                      <span className="text-gray-900">¥{calculateTotal('budget').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-800">利益</span>
                      <span className="text-blue-700">¥{(budget.contractAmount - calculateTotal('budget')).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-800">利率</span>
                      <span className="text-blue-700">{((budget.contractAmount - calculateTotal('budget')) / budget.contractAmount * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-3">最終原価（実施）</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">変更額</span>
                      <span className="font-medium text-gray-900">¥{budget.contractAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">材料費</span>
                      <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.materials, 'actual').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">労務費</span>
                      <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.labor, 'actual').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">外注費</span>
                      <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.outsourcing, 'actual').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">諸経費</span>
                      <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.expenses, 'actual').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t border-green-200 pt-2 mt-2">
                      <span className="text-gray-800">原価計</span>
                      <span className="text-gray-900">¥{calculateTotal('actual').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-800">利益</span>
                      <span className="text-green-700">¥{(budget.contractAmount - calculateTotal('actual')).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-800">利率</span>
                      <span className="text-green-700">{((budget.contractAmount - calculateTotal('actual')) / budget.contractAmount * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">増減（差異）</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">請負額</span>
                      <span className="font-medium text-gray-900">¥0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">材料費</span>
                      <span className={`font-medium ${calculateVariance(calculateSectionTotal(budget.sections.materials, 'budget'), calculateSectionTotal(budget.sections.materials, 'actual')) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {calculateVariance(calculateSectionTotal(budget.sections.materials, 'budget'), calculateSectionTotal(budget.sections.materials, 'actual')) > 0 ? '+' : ''}
                        ¥{calculateVariance(calculateSectionTotal(budget.sections.materials, 'budget'), calculateSectionTotal(budget.sections.materials, 'actual')).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">労務費</span>
                      <span className={`font-medium ${calculateVariance(calculateSectionTotal(budget.sections.labor, 'budget'), calculateSectionTotal(budget.sections.labor, 'actual')) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {calculateVariance(calculateSectionTotal(budget.sections.labor, 'budget'), calculateSectionTotal(budget.sections.labor, 'actual')) > 0 ? '+' : ''}
                        ¥{calculateVariance(calculateSectionTotal(budget.sections.labor, 'budget'), calculateSectionTotal(budget.sections.labor, 'actual')).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">外注費</span>
                      <span className={`font-medium ${calculateVariance(calculateSectionTotal(budget.sections.outsourcing, 'budget'), calculateSectionTotal(budget.sections.outsourcing, 'actual')) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {calculateVariance(calculateSectionTotal(budget.sections.outsourcing, 'budget'), calculateSectionTotal(budget.sections.outsourcing, 'actual')) > 0 ? '+' : ''}
                        ¥{calculateVariance(calculateSectionTotal(budget.sections.outsourcing, 'budget'), calculateSectionTotal(budget.sections.outsourcing, 'actual')).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">諸経費</span>
                      <span className={`font-medium ${calculateVariance(calculateSectionTotal(budget.sections.expenses, 'budget'), calculateSectionTotal(budget.sections.expenses, 'actual')) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {calculateVariance(calculateSectionTotal(budget.sections.expenses, 'budget'), calculateSectionTotal(budget.sections.expenses, 'actual')) > 0 ? '+' : ''}
                        ¥{calculateVariance(calculateSectionTotal(budget.sections.expenses, 'budget'), calculateSectionTotal(budget.sections.expenses, 'actual')).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t border-gray-300 pt-2 mt-2">
                      <span className="text-gray-800">原価計</span>
                      <span className={`${calculateVariance(calculateTotal('budget'), calculateTotal('actual')) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {calculateVariance(calculateTotal('budget'), calculateTotal('actual')) > 0 ? '+' : ''}
                        ¥{calculateVariance(calculateTotal('budget'), calculateTotal('actual')).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-800">利益</span>
                      <span className={`${calculateVariance(budget.contractAmount - calculateTotal('budget'), budget.contractAmount - calculateTotal('actual')) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculateVariance(budget.contractAmount - calculateTotal('budget'), budget.contractAmount - calculateTotal('actual')) > 0 ? '+' : ''}
                        ¥{calculateVariance(budget.contractAmount - calculateTotal('budget'), budget.contractAmount - calculateTotal('actual')).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-800">利率</span>
                      <span className={`${calculateVariance(budget.contractAmount - calculateTotal('budget'), budget.contractAmount - calculateTotal('actual')) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(calculateVariance(budget.contractAmount - calculateTotal('budget'), budget.contractAmount - calculateTotal('actual')) / budget.contractAmount * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">実行予算（計画）</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">請負額</span>
                    <span className="font-medium text-gray-900">¥{budget.contractAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">材料費</span>
                    <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.materials, 'budget').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">労務費</span>
                    <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.labor, 'budget').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">外注費</span>
                    <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.outsourcing, 'budget').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">諸経費</span>
                    <span className="font-medium text-gray-900">¥{calculateSectionTotal(budget.sections.expenses, 'budget').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t border-blue-200 pt-2 mt-2">
                    <span className="text-gray-800">原価計</span>
                    <span className="text-gray-900">¥{calculateTotal('budget').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-800">利益</span>
                    <span className="text-blue-700">¥{(budget.contractAmount - calculateTotal('budget')).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-800">利率</span>
                    <span className="text-blue-700">{((budget.contractAmount - calculateTotal('budget')) / budget.contractAmount * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 費目別テーブル */}
          {viewMode === 'comparison' ? (
            <>
              {/* PC表示 - 予実対比 */}
              <div className="hidden md:block">
                {renderComparisonSection('材料費', budget.sections.materials)}
                {renderComparisonSection('労務費', budget.sections.labor)}
                {renderComparisonSection('外注費', budget.sections.outsourcing)}
                {renderComparisonSection('諸経費', budget.sections.expenses)}
              </div>

              {/* スマホ表示 - 予実対比 */}
              <div className="md:hidden">
                {renderComparisonSectionMobile('材料費', budget.sections.materials)}
                {renderComparisonSectionMobile('労務費', budget.sections.labor)}
                {renderComparisonSectionMobile('外注費', budget.sections.outsourcing)}
                {renderComparisonSectionMobile('諸経費', budget.sections.expenses)}

                {/* 承認/却下ボタン（スマホ・予実対比モード） */}
                {canApprove() && (
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => {
                        setApprovalAction('approve');
                        setShowApprovalDialog(true);
                      }}
                      className="flex-1 px-6 py-3 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700"
                    >
                      承認する
                    </button>
                    <button
                      onClick={() => {
                        setApprovalAction('reject');
                        setShowApprovalDialog(true);
                      }}
                      className="flex-1 px-6 py-3 bg-red-600 text-white text-base font-semibold rounded-lg hover:bg-red-700"
                    >
                      却下する
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* PC表示 */}
              <div className="hidden md:block">
                {renderBudgetSection('材料費', budget.sections.materials)}
                {renderBudgetSection('労務費', budget.sections.labor)}
                {renderBudgetSection('外注費', budget.sections.outsourcing)}
                {renderBudgetSection('諸経費', budget.sections.expenses)}
              </div>

              {/* スマホ表示 */}
              <div className="md:hidden">
                {renderBudgetSectionMobile('材料費', budget.sections.materials)}
                {renderBudgetSectionMobile('労務費', budget.sections.labor)}
                {renderBudgetSectionMobile('外注費', budget.sections.outsourcing)}
                {renderBudgetSectionMobile('諸経費', budget.sections.expenses)}

                {/* 承認/却下ボタン（スマホ・予算のみモード） */}
                {canApprove() && (
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => {
                        setApprovalAction('approve');
                        setShowApprovalDialog(true);
                      }}
                      className="flex-1 px-6 py-3 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700"
                    >
                      承認する
                    </button>
                    <button
                      onClick={() => {
                        setApprovalAction('reject');
                        setShowApprovalDialog(true);
                      }}
                      className="flex-1 px-6 py-3 bg-red-600 text-white text-base font-semibold rounded-lg hover:bg-red-700"
                    >
                      却下する
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* 承認/却下ダイアログ */}
        {showApprovalDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {approvalAction === 'approve' ? '承認コメント' : '却下理由'}
              </h3>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder={approvalAction === 'approve' ? 'コメントを入力（任意）' : '却下理由を入力（任意）'}
              />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowApprovalDialog(false);
                    setApprovalComment('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  キャンセル
                </button>
                {approvalAction === 'approve' ? (
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    承認する
                  </button>
                ) : (
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    却下する
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}