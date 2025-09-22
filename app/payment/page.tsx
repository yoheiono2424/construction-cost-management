'use client';

import Layout from '@/app/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { useEffect } from 'react';

interface PaymentItem {
  id: string;
  supplier: string;
  invoiceNumbers: string[];
  totalAmount: number;
  site: string;
  dueDate: string;
  status: 'pending' | 'exported' | 'paid';
  bankInfo: {
    bankName: string;
    branchName: string;
    accountType: string;
    accountNumber: string;
    accountHolder: string;
  };
}

export default function PaymentPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [selectedMonth, setSelectedMonth] = useState('2025-02');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);

  const [payments] = useState<PaymentItem[]>([
    {
      id: '1',
      supplier: '株式会社A建設',
      invoiceNumbers: ['INV-2025-001', 'INV-2025-002'],
      totalAmount: 3850000,
      site: 'B工場増築工事',
      dueDate: '2025/02/15',
      status: 'pending',
      bankInfo: {
        bankName: 'みずほ銀行',
        branchName: '東京営業部',
        accountType: '普通',
        accountNumber: '1234567',
        accountHolder: 'カブシキガイシャエーケンセツ'
      }
    },
    {
      id: '2',
      supplier: 'B工業株式会社',
      invoiceNumbers: ['B-202501-123'],
      totalAmount: 880000,
      site: 'C店舗新装工事',
      dueDate: '2025/02/14',
      status: 'exported',
      bankInfo: {
        bankName: '三菱UFJ銀行',
        branchName: '新宿支店',
        accountType: '普通',
        accountNumber: '7654321',
        accountHolder: 'ビーコウギョウカブシキガイシャ'
      }
    },
    {
      id: '3',
      supplier: 'C商事株式会社',
      invoiceNumbers: ['C-2501-45', 'C-2501-46'],
      totalAmount: 4400000,
      site: 'A工事現場改修工事',
      dueDate: '2025/02/10',
      status: 'pending',
      bankInfo: {
        bankName: '三井住友銀行',
        branchName: '渋谷支店',
        accountType: '当座',
        accountNumber: '2468135',
        accountHolder: 'シーショウジカブシキガイシャ'
      }
    },
    {
      id: '4',
      supplier: 'D建材株式会社',
      invoiceNumbers: ['D-25-001'],
      totalAmount: 550000,
      site: 'D住宅リフォーム',
      dueDate: '2025/02/08',
      status: 'paid',
      bankInfo: {
        bankName: 'りそな銀行',
        branchName: '池袋支店',
        accountType: '普通',
        accountNumber: '9876543',
        accountHolder: 'ディーケンザイカブシキガイシャ'
      }
    },
    {
      id: '5',
      supplier: 'E設備株式会社',
      invoiceNumbers: ['E-202501', 'E-202502'],
      totalAmount: 6600000,
      site: 'E施設改修工事',
      dueDate: '2025/01/31',
      status: 'pending',
      bankInfo: {
        bankName: 'みずほ銀行',
        branchName: '品川支店',
        accountType: '普通',
        accountNumber: '5555555',
        accountHolder: 'イーセツビカブシキガイシャ'
      }
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSelectAll = () => {
    if (selectedItems.length === payments.filter(p => p.status === 'pending').length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(payments.filter(p => p.status === 'pending').map(p => p.id));
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleExportCSV = () => {
    // CSV出力処理
    console.log('Exporting CSV for items:', selectedItems);
    setShowExportModal(false);
    setSelectedItems([]);
    // 実際はステータスを'exported'に変更
  };

  const handleExportBankData = () => {
    // 銀行振込データ出力処理
    console.log('Exporting bank data for items:', selectedItems);
    alert('全銀フォーマットでデータを出力しました');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">未処理</span>;
      case 'exported':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">CSV出力済</span>;
      case 'paid':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">支払済み</span>;
      default:
        return null;
    }
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.totalAmount, 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.totalAmount, 0);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">支払管理</h1>
          <p className="text-sm text-gray-600 mt-1">月次支払の管理とデータ出力</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">今月の支払予定</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ¥{pendingAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">未処理分</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">支払済み</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ¥{paidAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">完了分</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">合計金額</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ¥{totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">全支払</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">支払件数</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {payments.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">取引先数</p>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">対象月</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setShowExportModal(true)}
                disabled={selectedItems.length === 0}
                className={`px-4 py-2 rounded-md ${
                  selectedItems.length > 0
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                CSVエクスポート ({selectedItems.length}件)
              </button>
              <button
                onClick={handleExportBankData}
                disabled={selectedItems.length === 0}
                className={`px-4 py-2 rounded-md ${
                  selectedItems.length > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                振込データ作成
              </button>
            </div>
          </div>
        </div>

        {/* 支払一覧 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === payments.filter(p => p.status === 'pending').length && payments.filter(p => p.status === 'pending').length > 0}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  取引先
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求書番号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  現場
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支払期限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  銀行情報
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLInputElement).type !== 'checkbox') {
                      router.push(`/payment/${payment.id}`);
                    }
                  }}
                >
                  <td className="px-6 py-4">
                    {payment.status === 'pending' && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(payment.id)}
                        onChange={() => handleSelectItem(payment.id)}
                        className="rounded border-gray-300"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.supplier}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {payment.invoiceNumbers.join(', ')}
                      {payment.invoiceNumbers.length > 1 && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({payment.invoiceNumbers.length}件)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.site}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ¥{payment.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${new Date(payment.dueDate) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                      {payment.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-600">
                      <div>{payment.bankInfo.bankName} {payment.bankInfo.branchName}</div>
                      <div>{payment.bankInfo.accountType} {payment.bankInfo.accountNumber}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {payments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">支払データがありません</p>
            </div>
          )}
        </div>

        {/* 重複チェック通知 */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">重複チェック結果</h3>
              <p className="mt-1 text-sm text-yellow-700">
                請求書番号 INV-2025-001 が複数の支払リストに含まれています。確認してください。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSVエクスポート確認モーダル */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">CSVエクスポート確認</h3>
            <p className="text-sm text-gray-600 mb-4">
              選択した{selectedItems.length}件の支払データをCSV形式でエクスポートします。
              エクスポート後、ステータスが「CSV出力済み」に変更されます。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                エクスポート
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}