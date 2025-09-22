'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';
import { useAuthStore } from '@/app/stores/authStore';

interface PaymentDetail {
  id: string;
  supplier: string;
  invoices: {
    id: string;
    number: string;
    amount: number;
    issueDate: string;
    dueDate: string;
  }[];
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
  paymentHistory: {
    date: string;
    action: string;
    user: string;
  }[];
}

export default function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuthStore();

  const [payment] = useState<PaymentDetail>({
    id: resolvedParams.id,
    supplier: '株式会社A建設',
    invoices: [
      {
        id: '1',
        number: 'INV-2025-001',
        amount: 1650000,
        issueDate: '2025/01/15',
        dueDate: '2025/02/15'
      },
      {
        id: '2',
        number: 'INV-2025-002',
        amount: 2200000,
        issueDate: '2025/01/20',
        dueDate: '2025/02/15'
      }
    ],
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
    },
    paymentHistory: [
      {
        date: '2025/01/20',
        action: '支払リスト登録',
        user: '山田太郎'
      },
      {
        date: '2025/01/22',
        action: 'CSVエクスポート',
        user: '鈴木一郎'
      }
    ]
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">未処理</span>;
      case 'exported':
        return <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">CSV出力済</span>;
      case 'paid':
        return <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded">支払済み</span>;
      default:
        return null;
    }
  };

  const handleExportCSV = () => {
    alert('CSV形式でエクスポートしました');
  };

  const handleExportBank = () => {
    alert('全銀フォーマットで出力しました');
  };

  const handleMarkAsPaid = () => {
    alert('支払済みとして記録しました');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              ← 戻る
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">支払詳細</h1>
              <p className="text-sm text-gray-600 mt-1">{payment.supplier}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {payment.status === 'pending' && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  CSVエクスポート
                </button>
                <button
                  onClick={handleExportBank}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  振込データ作成
                </button>
              </>
            )}
            {payment.status === 'exported' && (
              <button
                onClick={handleMarkAsPaid}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                支払済みにする
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：支払情報 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本情報 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">支払情報</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">取引先</p>
                  <p className="font-medium">{payment.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ステータス</p>
                  <div className="mt-1">{getStatusBadge(payment.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">関連現場</p>
                  <p className="font-medium">{payment.site}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">支払期限</p>
                  <p className={`font-medium ${new Date(payment.dueDate) < new Date() ? 'text-red-600' : ''}`}>
                    {payment.dueDate}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">合計金額</p>
                  <p className="text-2xl font-bold text-gray-900">¥{payment.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* 請求書一覧 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">対象請求書</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">請求書番号</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">金額</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">発行日</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">支払期限</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payment.invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-3 py-2 text-sm">
                          <button
                            onClick={() => router.push(`/invoices/${invoice.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {invoice.number}
                          </button>
                        </td>
                        <td className="px-3 py-2 text-sm text-right font-medium">
                          ¥{invoice.amount.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm text-right">{invoice.issueDate}</td>
                        <td className="px-3 py-2 text-sm text-right">{invoice.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2">
                    <tr>
                      <td className="px-3 py-2 text-sm font-semibold">合計</td>
                      <td className="px-3 py-2 text-sm text-right font-bold text-lg">
                        ¥{payment.totalAmount.toLocaleString()}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* 履歴 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">処理履歴</h2>
              <div className="space-y-3">
                {payment.paymentHistory.map((history, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{history.action}</p>
                      <p className="text-xs text-gray-500">{history.user}</p>
                    </div>
                    <p className="text-sm text-gray-600">{history.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：銀行情報 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">振込先情報</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">銀行名</p>
                  <p className="font-medium">{payment.bankInfo.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">支店名</p>
                  <p className="font-medium">{payment.bankInfo.branchName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">口座種別</p>
                  <p className="font-medium">{payment.bankInfo.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">口座番号</p>
                  <p className="font-medium">{payment.bankInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">口座名義</p>
                  <p className="font-medium text-sm">{payment.bankInfo.accountHolder}</p>
                </div>
              </div>

              <div className="mt-6 p-3 bg-blue-50 rounded-md">
                <p className="text-xs text-blue-800">
                  <strong>振込時の注意:</strong><br />
                  口座名義はカタカナで入力してください。
                </p>
              </div>
            </div>

            {/* 支払方法 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">支払方法</h2>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    defaultChecked
                    className="mr-2"
                  />
                  <span className="text-sm">銀行振込</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="check"
                    className="mr-2"
                  />
                  <span className="text-sm">小切手</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    className="mr-2"
                  />
                  <span className="text-sm">現金</span>
                </label>
              </div>
            </div>

            {/* メモ */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">メモ</h2>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows={4}
                placeholder="支払に関するメモを入力..."
              />
              <button className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}