'use client';

import Layout from '@/app/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { useEffect } from 'react';

interface EstimateData {
  fileName: string;
  projectName: string;
  client: string;
  location: string;
  periodStart: string;
  periodEnd: string;
  items: {
    category: string;
    name: string;
    specification: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    supplier?: string;
  }[];
  totalAmount: number;
}

export default function EstimateCheckPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [estimateData, setEstimateData] = useState<EstimateData>({
    fileName: '見積書_A工事現場改修工事.pdf',
    projectName: 'A工事現場改修工事',
    client: '株式会社A建設',
    location: '東京都新宿区',
    periodStart: '2025-02-01',
    periodEnd: '2025-05-31',
    items: [
      { category: '材料費', name: 'コンクリート', specification: '25-18-20', unit: 'm³', quantity: 50, unitPrice: 15000, amount: 750000, supplier: 'A建材' },
      { category: '材料費', name: '鉄筋', specification: 'D13', unit: 't', quantity: 5, unitPrice: 120000, amount: 600000, supplier: 'B鋼材' },
      { category: '労務費', name: '型枠工', specification: '一般', unit: '人日', quantity: 20, unitPrice: 25000, amount: 500000 },
      { category: '労務費', name: '鉄筋工', specification: '一般', unit: '人日', quantity: 15, unitPrice: 28000, amount: 420000 },
      { category: '外注費', name: '足場工事', specification: '枠組足場', unit: '式', quantity: 1, unitPrice: 800000, amount: 800000, supplier: 'C足場' },
      { category: '諸経費', name: '仮設費', specification: '一式', unit: '式', quantity: 1, unitPrice: 300000, amount: 300000 },
      { category: '諸経費', name: '諸経費', specification: '一式', unit: '式', quantity: 1, unitPrice: 200000, amount: 200000 },
    ],
    totalAmount: 3570000,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const updateField = (field: keyof EstimateData, value: string | number | EstimateItem[]) => {
    setEstimateData({
      ...estimateData,
      [field]: value
    });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...estimateData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
    }
    setEstimateData({
      ...estimateData,
      items: newItems,
      totalAmount: newItems.reduce((sum, item) => sum + item.amount, 0)
    });
  };

  const handleConfirm = () => {
    // 確認処理（実際の実装では保存処理）
    console.log('見積書データ確認完了:', estimateData);
    // 実行予算書作成画面へ戻る（データを引き継ぐ想定）
    router.push('/budgets/new');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">見積書確認・修正</h1>
          <p className="text-sm text-gray-600 mt-1">
            OCR読み取り結果を確認し、実行予算書作成に進みます
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：見積書画像 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">見積書画像</h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl text-gray-400 mb-4">📋</div>
                  <p className="text-gray-600 font-medium">{estimateData.fileName}</p>
                  <p className="text-sm text-gray-500 mt-2">見積書プレビューエリア</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：確認・編集フォーム */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">読み取り結果の確認・編集</h2>
            </div>
            <div className="p-6 space-y-4 max-h-[700px] overflow-y-auto">
              {/* 基本情報 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    工事名
                  </label>
                  <input
                    type="text"
                    value={estimateData.projectName}
                    onChange={(e) => updateField('projectName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    受注先
                  </label>
                  <input
                    type="text"
                    value={estimateData.client}
                    onChange={(e) => updateField('client', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    工事場所
                  </label>
                  <input
                    type="text"
                    value={estimateData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      工期（自）
                    </label>
                    <input
                      type="date"
                      value={estimateData.periodStart}
                      onChange={(e) => updateField('periodStart', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      工期（至）
                    </label>
                    <input
                      type="date"
                      value={estimateData.periodEnd}
                      onChange={(e) => updateField('periodEnd', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 費目明細 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  費目明細
                </label>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">費目</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">品名</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">規格</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">単位</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">数量</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">単価</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">金額</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {estimateData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">
                            <span className="text-xs font-medium text-gray-600">{item.category}</span>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(index, 'name', e.target.value)}
                              className="w-full px-1 py-1 text-sm border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.specification}
                              onChange={(e) => updateItem(index, 'specification', e.target.value)}
                              className="w-full px-1 py-1 text-sm border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => updateItem(index, 'unit', e.target.value)}
                              className="w-16 px-1 py-1 text-sm border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                              className="w-16 px-1 py-1 text-sm border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                              className="w-20 px-1 py-1 text-sm border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            ¥{item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={6} className="px-3 py-2 text-right font-semibold text-gray-900">
                          合計
                        </td>
                        <td className="px-3 py-2 font-semibold text-gray-900">
                          ¥{estimateData.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => router.push('/budgets/new')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  確認して実行予算書作成へ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}