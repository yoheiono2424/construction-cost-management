'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SimpleInvoiceData {
  id: string;
  fileName: string;
  imageUrl?: string;
  supplier: string;
  invoiceNumber: string;
  qualifiedInvoiceNumber: string;
  projectName: string;  // 案件名
  amount: number;
  invoiceDate: string;
  dueDate: string;
  status: 'pending' | 'confirmed';
}

export default function SimpleCheck() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // ダミーデータ：その他請求書
  const [invoices] = useState<SimpleInvoiceData[]>([
    {
      id: '1',
      fileName: '請求書_Fカーリース_2025年1月.pdf',
      imageUrl: '/invoice-sample-other-1.jpg',
      supplier: '株式会社Fカーリース',
      invoiceNumber: 'CAR-2025-001',
      qualifiedInvoiceNumber: 'T1234567890999',
      projectName: '営業車両リース',
      amount: 450000,
      invoiceDate: '2025-01-12',
      dueDate: '2025-02-12',
      status: 'pending',
    },
    {
      id: '2',
      fileName: '請求書_G運送_2025年1月.pdf',
      imageUrl: '/invoice-sample-other-2.jpg',
      supplier: 'G運送株式会社',
      invoiceNumber: 'OUT-2025-123',
      qualifiedInvoiceNumber: 'T9876543210111',
      projectName: '物流業務委託',
      amount: 320000,
      invoiceDate: '2025-01-09',
      dueDate: '2025-02-09',
      status: 'pending',
    },
  ]);

  const [formData, setFormData] = useState<SimpleInvoiceData>(invoices[currentIndex]);

  const handleNext = () => {
    if (currentIndex < invoices.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setFormData(invoices[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setFormData(invoices[prevIndex]);
    }
  };

  const handleInputChange = (field: keyof SimpleInvoiceData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    console.log('保存:', formData);
    alert('保存しました');
  };

  const handleComplete = () => {
    console.log('すべて完了');
    router.push('/invoices');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">その他請求書確認</h1>
        <p className="text-sm text-gray-600 mt-1">
          {currentIndex + 1} / {invoices.length} - {formData.fileName}
        </p>
      </div>

      {/* 2カラムレイアウト */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側：画像プレビュー */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">請求書プレビュー</h2>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center" style={{ minHeight: '600px' }}>
            {formData.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={formData.imageUrl} alt="請求書" className="max-w-full h-auto" />
            ) : (
              <p className="text-gray-500">画像が読み込まれていません</p>
            )}
          </div>
        </div>

        {/* 右側：確認・編集フォーム */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報確認</h2>

          <div className="space-y-4">
            {/* 取引先 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">取引先</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 請求書番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">請求書番号</label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 適格請求番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">適格請求番号</label>
              <input
                type="text"
                value={formData.qualifiedInvoiceNumber}
                onChange={(e) => handleInputChange('qualifiedInvoiceNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 案件名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">案件名</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 営業車両リース"
              />
            </div>

            {/* 金額 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">金額（税抜）</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 請求日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">請求日</label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 支払期限 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">支払期限</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-md ${
                currentIndex === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              ← 前へ
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              保存
            </button>

            {currentIndex < invoices.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                次へ →
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                完了
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
