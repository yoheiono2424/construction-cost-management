'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  supplier: string;
  projectName: string;
  projectId: string;
  status: 'unconfirmed' | 'confirmed' | 'approved' | 'paid';
  imageUrl?: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  budgetInfo: {
    category: string;
    budgetAmount: number;
    usedAmount: number;
    remainingAmount: number;
  };
}

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [invoice] = useState<InvoiceDetail>({
    id: resolvedParams.id,
    invoiceNumber: 'INV-2025-001',
    issueDate: '2025/01/15',
    dueDate: '2025/02/15',
    supplier: '株式会社A建設',
    projectName: 'B工場増築工事',
    projectId: '2',
    status: 'confirmed',
    imageUrl: '/invoice-sample.jpg',
    items: [
      {
        id: '1',
        name: 'セメント（25kg）',
        quantity: 100,
        unitPrice: 1500,
        amount: 150000
      },
      {
        id: '2',
        name: '鉄筋（D16）',
        quantity: 500,
        unitPrice: 2000,
        amount: 1000000
      },
      {
        id: '3',
        name: '型枠材料一式',
        quantity: 1,
        unitPrice: 350000,
        amount: 350000
      }
    ],
    subtotal: 1500000,
    tax: 150000,
    totalAmount: 1650000,
    budgetInfo: {
      category: '材料費',
      budgetAmount: 15000000,
      usedAmount: 8500000,
      remainingAmount: 6500000
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unconfirmed':
        return <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded">未確認</span>;
      case 'confirmed':
        return <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">確認済み</span>;
      case 'approved':
        return <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">承認済み</span>;
      case 'paid':
        return <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded">支払済み</span>;
      default:
        return null;
    }
  };

  const handleEdit = () => {
    router.push(`/invoices/${invoice.id}/edit`);
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
              <h1 className="text-2xl font-bold text-gray-900">請求書詳細</h1>
              <p className="text-sm text-gray-600 mt-1">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {(invoice.status === 'unconfirmed' || invoice.status === 'confirmed') && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                編集
              </button>
            )}
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              PDFダウンロード
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：請求書画像 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">請求書画像</h2>
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[600px] flex items-center justify-center">
              {invoice.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={invoice.imageUrl} alt="請求書" className="max-w-full h-auto" />
                </>
              ) : (
                <p className="text-gray-500">画像プレビューエリア</p>
              )}
            </div>
          </div>

          {/* 右側：請求書情報 */}
          <div className="space-y-6">
            {/* 基本情報 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">請求書番号</p>
                  <p className="font-medium">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ステータス</p>
                  <div className="mt-1">{getStatusBadge(invoice.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">発行日</p>
                  <p className="font-medium">{invoice.issueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">支払期限</p>
                  <p className="font-medium">{invoice.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">仕入先</p>
                  <p className="font-medium">{invoice.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">関連工事</p>
                  <p className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                     onClick={() => router.push(`/budgets/${invoice.projectId}`)}>
                    {invoice.projectName}
                  </p>
                </div>
              </div>
            </div>

            {/* 明細情報 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">明細情報</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">品名</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">数量</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">単価</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">金額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 text-sm">{item.name}</td>
                        <td className="px-3 py-2 text-sm text-right">{item.quantity.toLocaleString()}</td>
                        <td className="px-3 py-2 text-sm text-right">¥{item.unitPrice.toLocaleString()}</td>
                        <td className="px-3 py-2 text-sm text-right font-medium">¥{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-sm text-right">小計</td>
                      <td className="px-3 py-2 text-sm text-right font-medium">¥{invoice.subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-sm text-right">消費税（10%）</td>
                      <td className="px-3 py-2 text-sm text-right font-medium">¥{invoice.tax.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-3 py-2 text-sm text-right font-semibold">合計</td>
                      <td className="px-3 py-2 text-sm text-right font-bold text-lg">¥{invoice.totalAmount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* 予算との照合 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">予算との照合</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">実行予算書の費目</span>
                  <span className="font-medium">{invoice.budgetInfo.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">予算額</span>
                  <span className="font-medium">¥{invoice.budgetInfo.budgetAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">累計実績額</span>
                  <span className="font-medium">¥{invoice.budgetInfo.usedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">今回請求額</span>
                  <span className="font-medium text-blue-600">¥{invoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">予算残額</span>
                    <span className={`font-medium ${
                      invoice.budgetInfo.remainingAmount - invoice.totalAmount < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ¥{(invoice.budgetInfo.remainingAmount - invoice.totalAmount).toLocaleString()}
                    </span>
                  </div>
                  {invoice.budgetInfo.remainingAmount - invoice.totalAmount < 0 && (
                    <div className="mt-2 p-2 bg-red-50 rounded-md">
                      <p className="text-sm text-red-800 font-medium">⚠️ 予算超過警告</p>
                      <p className="text-xs text-red-600 mt-1">
                        この請求により予算を{Math.abs(invoice.budgetInfo.remainingAmount - invoice.totalAmount).toLocaleString()}円超過します
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 予算消化率プログレスバー */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">予算消化率</span>
                  <span className="font-medium">
                    {Math.round(((invoice.budgetInfo.usedAmount + invoice.totalAmount) / invoice.budgetInfo.budgetAmount) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (invoice.budgetInfo.usedAmount + invoice.totalAmount) / invoice.budgetInfo.budgetAmount > 1
                        ? 'bg-red-600'
                        : (invoice.budgetInfo.usedAmount + invoice.totalAmount) / invoice.budgetInfo.budgetAmount > 0.8
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{
                      width: `${Math.min(100, ((invoice.budgetInfo.usedAmount + invoice.totalAmount) / invoice.budgetInfo.budgetAmount) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}