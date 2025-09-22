'use client';

import Layout from '@/app/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { useEffect } from 'react';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceData {
  id: string;
  fileName: string;
  imageUrl?: string;
  supplier: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  items: InvoiceItem[];
  project: string;
  status: 'pending' | 'confirmed';
}

export default function InvoiceCheckPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState<InvoiceData | null>(null);

  // ダミーデータ：複数の請求書
  const [invoices] = useState<InvoiceData[]>([
    {
      id: '1',
      fileName: '請求書_A建設_2025年1月.pdf',
      imageUrl: '/invoice-sample-1.jpg', // ダミー画像URL
      supplier: '株式会社A建設',
      invoiceNumber: 'INV-2025-001',
      invoiceDate: '2025-01-15',
      dueDate: '2025-02-15',
      amount: 1500000,
      taxAmount: 150000,
      totalAmount: 1650000,
      items: [
        { description: '型枠工事', quantity: 100, unitPrice: 5000, amount: 500000 },
        { description: '鉄筋工事', quantity: 50, unitPrice: 12000, amount: 600000 },
        { description: '生コンクリート', quantity: 10, unitPrice: 40000, amount: 400000 },
      ],
      project: 'B工場増築工事',
      status: 'pending'
    },
    {
      id: '2',
      fileName: '請求書_B工業_2025年1月.pdf',
      imageUrl: '/invoice-sample-2.jpg',
      supplier: 'B工業株式会社',
      invoiceNumber: 'B-202501-123',
      invoiceDate: '2025-01-14',
      dueDate: '2025-02-14',
      amount: 800000,
      taxAmount: 80000,
      totalAmount: 880000,
      items: [
        { description: '配管工事', quantity: 1, unitPrice: 500000, amount: 500000 },
        { description: '電気工事', quantity: 1, unitPrice: 300000, amount: 300000 },
      ],
      project: 'C店舗新装工事',
      status: 'pending'
    },
    {
      id: '3',
      fileName: '請求書_C商事_2025年1月.pdf',
      imageUrl: '/invoice-sample-3.jpg',
      supplier: 'C商事株式会社',
      invoiceNumber: 'C-20250115',
      invoiceDate: '2025-01-12',
      dueDate: '2025-02-12',
      amount: 450000,
      taxAmount: 45000,
      totalAmount: 495000,
      items: [
        { description: '建材一式', quantity: 1, unitPrice: 450000, amount: 450000 },
      ],
      project: 'D住宅リフォーム',
      status: 'pending'
    },
  ]);

  const [projectOptions] = useState([
    'A工事現場改修工事',
    'B工場増築工事',
    'C店舗新装工事',
    'D住宅リフォーム',
    'E施設改修工事'
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (invoices.length > 0) {
      setFormData(invoices[currentIndex]);
    }
  }, [currentIndex, invoices]);

  const handleNext = () => {
    if (currentIndex < invoices.length - 1) {
      // 現在のデータを保存（実際の実装では保存処理）
      setCurrentIndex(currentIndex + 1);
    } else {
      // 全て完了したら一覧画面へ
      router.push('/invoices');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleConfirmAndNext = () => {
    // 確認処理（実際の実装では保存処理）
    console.log('確認完了:', formData);
    handleNext();
  };

  const handleSkip = () => {
    // スキップして次へ
    handleNext();
  };

  const updateFormData = (field: keyof InvoiceData, value: string | number | InvoiceItem[]) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };


  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">請求書確認・修正</h1>
            <p className="text-sm text-gray-600 mt-1">
              OCR読み取り結果を確認・修正します（{currentIndex + 1}/{invoices.length}件）
            </p>
          </div>
          <div className="text-sm text-gray-600">
            処理中: <span className="font-semibold">{formData?.fileName}</span>
          </div>
        </div>

        {formData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左側：請求書画像 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">請求書画像</h2>
              </div>
              <div className="p-6">
                <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl text-gray-400 mb-4">📄</div>
                    <p className="text-gray-600 font-medium">{formData.fileName}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formData.imageUrl ? '画像プレビューエリア' : '画像未設定'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className={`px-4 py-2 rounded-md ${
                      currentIndex === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    ← 前の請求書
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    スキップ
                  </button>
                </div>
              </div>
            </div>

            {/* 右側：確認・編集フォーム */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">読み取り結果の確認・編集</h2>
              </div>
              <div className="p-6 space-y-4">
                {/* 基本情報 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      請求書番号
                    </label>
                    <input
                      type="text"
                      value={formData.invoiceNumber}
                      onChange={(e) => updateFormData('invoiceNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      請求日
                    </label>
                    <input
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) => updateFormData('invoiceDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    取引先名
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => updateFormData('supplier', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    現場（プロジェクト）振り分け <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => updateFormData('project', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {projectOptions.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>

                {/* 品目明細 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    品目・内容
                  </label>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">品目</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">数量</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">単価</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">金額</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => {
                                  const newItems = [...formData.items];
                                  newItems[index].description = e.target.value;
                                  updateFormData('items', newItems);
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newItems = [...formData.items];
                                  newItems[index].quantity = Number(e.target.value);
                                  newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
                                  updateFormData('items', newItems);
                                }}
                                className="w-20 px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => {
                                  const newItems = [...formData.items];
                                  newItems[index].unitPrice = Number(e.target.value);
                                  newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
                                  updateFormData('items', newItems);
                                }}
                                className="w-24 px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              ¥{item.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 金額情報 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      金額（税抜）
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => updateFormData('amount', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      消費税額
                    </label>
                    <input
                      type="number"
                      value={formData.taxAmount}
                      onChange={(e) => updateFormData('taxAmount', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      合計金額（税込）
                    </label>
                    <input
                      type="number"
                      value={formData.totalAmount}
                      onChange={(e) => updateFormData('totalAmount', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    支払期日
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => updateFormData('dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* アクションボタン */}
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => router.push('/invoices/upload')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleConfirmAndNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {currentIndex < invoices.length - 1 ? '確認して次へ →' : '確認して完了'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* プログレスバー */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>処理進捗</span>
            <span>{currentIndex + 1} / {invoices.length} 件完了</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / invoices.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}