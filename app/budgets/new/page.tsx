'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import Layout from '@/app/components/Layout';
import { BudgetItem } from '@/app/types/budget';

export default function NewBudgetPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    client: '',
    location: '',
    periodStart: '',
    periodEnd: '',
  });

  const [materials, setMaterials] = useState<BudgetItem[]>([]);
  const [labor, setLabor] = useState<BudgetItem[]>([]);
  const [outsourcing, setOutsourcing] = useState<BudgetItem[]>([]);
  const [expenses, setExpenses] = useState<BudgetItem[]>([]);

  const addItem = (section: 'materials' | 'labor' | 'outsourcing' | 'expenses') => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      name: '',
      specification: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      subtotal: 0,
      supplier: '',
      remarks: '',
    };

    switch (section) {
      case 'materials':
        setMaterials([...materials, newItem]);
        break;
      case 'labor':
        setLabor([...labor, newItem]);
        break;
      case 'outsourcing':
        setOutsourcing([...outsourcing, newItem]);
        break;
      case 'expenses':
        setExpenses([...expenses, newItem]);
        break;
    }
  };

  const updateItem = (
    section: 'materials' | 'labor' | 'outsourcing' | 'expenses',
    id: string,
    field: keyof BudgetItem,
    value: any
  ) => {
    const updateFunction = (items: BudgetItem[]) =>
      items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.subtotal = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      });

    switch (section) {
      case 'materials':
        setMaterials(updateFunction);
        break;
      case 'labor':
        setLabor(updateFunction);
        break;
      case 'outsourcing':
        setOutsourcing(updateFunction);
        break;
      case 'expenses':
        setExpenses(updateFunction);
        break;
    }
  };

  const removeItem = (section: 'materials' | 'labor' | 'outsourcing' | 'expenses', id: string) => {
    const removeFunction = (items: BudgetItem[]) => items.filter(item => item.id !== id);

    switch (section) {
      case 'materials':
        setMaterials(removeFunction);
        break;
      case 'labor':
        setLabor(removeFunction);
        break;
      case 'outsourcing':
        setOutsourcing(removeFunction);
        break;
      case 'expenses':
        setExpenses(removeFunction);
        break;
    }
  };

  const calculateSectionTotal = (items: BudgetItem[]) => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateTotal = () => {
    return (
      calculateSectionTotal(materials) +
      calculateSectionTotal(labor) +
      calculateSectionTotal(outsourcing) +
      calculateSectionTotal(expenses)
    );
  };

  const calculateTax = () => {
    return calculateTotal() * 0.1;
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const calculateGrossProfit = () => {
    // 仮の売上高（実行予算の1.3倍と仮定）
    const revenue = calculateGrandTotal() * 1.3;
    return revenue - calculateGrandTotal();
  };

  const calculateGrossProfitRate = () => {
    const revenue = calculateGrandTotal() * 1.3;
    return (calculateGrossProfit() / revenue) * 100;
  };

  const handleSubmit = (status: 'draft' | 'pending_approval') => {
    console.log('保存:', { projectInfo, materials, labor, outsourcing, expenses, status });
    router.push('/budgets');
  };

  const renderItemTable = (
    title: string,
    items: BudgetItem[],
    section: 'materials' | 'labor' | 'outsourcing' | 'expenses'
  ) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          type="button"
          onClick={() => addItem(section)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          行を追加
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">品名</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">規格</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">単位</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">単価</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">小計</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">仕入先</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">備考</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(section, item.id, 'name', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.specification}
                    onChange={(e) => updateItem(section, item.id, 'specification', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => updateItem(section, item.id, 'unit', e.target.value)}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(section, item.id, 'quantity', Number(e.target.value))}
                    className="w-24 px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(section, item.id, 'unitPrice', Number(e.target.value))}
                    className="w-28 px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-3 py-2">
                  <span className="text-sm font-medium">¥{item.subtotal.toLocaleString()}</span>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.supplier}
                    onChange={(e) => updateItem(section, item.id, 'supplier', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => updateItem(section, item.id, 'remarks', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => removeItem(section, item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-4 text-center text-gray-500">
                  データがありません
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={5} className="px-3 py-2 text-right font-semibold">小計</td>
              <td className="px-3 py-2 font-semibold">¥{calculateSectionTotal(items).toLocaleString()}</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">実行予算書作成</h1>

        {/* 見積書アップロード */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">見積書アップロード（OCR読み取り）</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mb-4">
              <span className="text-4xl">📄</span>
            </div>
            <p className="text-gray-600 mb-2">見積書をドラッグ&ドロップ</p>
            <p className="text-sm text-gray-500">または</p>
            <button
              onClick={() => router.push('/estimates/check')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ファイルを選択
            </button>
            <p className="mt-2 text-xs text-gray-500">PDF, JPG, PNG対応（最大10MB）</p>
          </div>
        </div>

        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">工事名</label>
              <input
                type="text"
                value={projectInfo.projectName}
                onChange={(e) => setProjectInfo({ ...projectInfo, projectName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="○○工事"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">受注先</label>
              <input
                type="text"
                value={projectInfo.client}
                onChange={(e) => setProjectInfo({ ...projectInfo, client: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="株式会社○○"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">工事場所</label>
              <input
                type="text"
                value={projectInfo.location}
                onChange={(e) => setProjectInfo({ ...projectInfo, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="東京都○○区"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">工期（自）</label>
                <input
                  type="date"
                  value={projectInfo.periodStart}
                  onChange={(e) => setProjectInfo({ ...projectInfo, periodStart: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">工期（至）</label>
                <input
                  type="date"
                  value={projectInfo.periodEnd}
                  onChange={(e) => setProjectInfo({ ...projectInfo, periodEnd: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 費目別入力 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {renderItemTable('材料費', materials, 'materials')}
          {renderItemTable('労務費', labor, 'labor')}
          {renderItemTable('外注費', outsourcing, 'outsourcing')}
          {renderItemTable('諸経費', expenses, 'expenses')}
        </div>

        {/* サマリー */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">サマリー</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span>材料費</span>
              <span className="font-medium">¥{calculateSectionTotal(materials).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>労務費</span>
              <span className="font-medium">¥{calculateSectionTotal(labor).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>外注費</span>
              <span className="font-medium">¥{calculateSectionTotal(outsourcing).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>諸経費</span>
              <span className="font-medium">¥{calculateSectionTotal(expenses).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b font-semibold">
              <span>小計</span>
              <span>¥{calculateTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>消費税（10%）</span>
              <span className="font-medium">¥{Math.floor(calculateTax()).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b text-lg font-bold">
              <span>合計</span>
              <span>¥{Math.floor(calculateGrandTotal()).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>粗利益</span>
              <span className="font-medium">¥{Math.floor(calculateGrossProfit()).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>粗利率</span>
              <span className="font-medium">{calculateGrossProfitRate().toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push('/budgets')}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={() => handleSubmit('draft')}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            下書き保存
          </button>
          <button
            onClick={() => handleSubmit('pending_approval')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            承認申請
          </button>
        </div>
      </div>
    </Layout>
  );
}