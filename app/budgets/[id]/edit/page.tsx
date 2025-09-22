'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import Layout from '@/app/components/Layout';

interface BudgetItem {
  id: string;
  name: string;
  specification: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  supplier: string;
  remarks: string;
}

export default function BudgetEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Next.js 15でparamsをアンラップ
  const resolvedParams = use(params);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // 基本情報
  const [projectInfo, setProjectInfo] = useState({
    projectName: 'A工場新築工事',
    client: '○○工業株式会社',
    location: '東京都新宿区○○1-2-3',
    periodStart: '2025-02-01',
    periodEnd: '2025-06-30',
    contractAmount: 50000000,
    status: 'pending_approval' as const,
  });

  // 各費目のデータ（既存データを読み込む想定）
  const [materials, setMaterials] = useState<BudgetItem[]>([
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
    },
  ]);

  const [labor, setLabor] = useState<BudgetItem[]>([
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
    },
  ]);

  const [outsourcing, setOutsourcing] = useState<BudgetItem[]>([
    {
      id: '5',
      name: '足場工事',
      specification: '枠組足場',
      unit: '式',
      quantity: 1,
      unitPrice: 800000,
      subtotal: 800000,
      supplier: '○○足場',
      remarks: '',
    },
    {
      id: '6',
      name: '防水工事',
      specification: 'アスファルト防水',
      unit: '㎡',
      quantity: 200,
      unitPrice: 8500,
      subtotal: 1700000,
      supplier: '△△防水',
      remarks: '',
    },
  ]);

  const [expenses, setExpenses] = useState<BudgetItem[]>([
    {
      id: '7',
      name: '仮設費',
      specification: '一式',
      unit: '式',
      quantity: 1,
      unitPrice: 500000,
      subtotal: 500000,
      supplier: '',
      remarks: '',
    },
    {
      id: '8',
      name: '諸経費',
      specification: '一式',
      unit: '式',
      quantity: 1,
      unitPrice: 300000,
      subtotal: 300000,
      supplier: '',
      remarks: '',
    },
  ]);

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
    value: string | number
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
    const revenue = projectInfo.contractAmount;
    return revenue - calculateGrandTotal();
  };

  const calculateGrossProfitRate = () => {
    const revenue = projectInfo.contractAmount;
    if (revenue === 0) return 0;
    return (calculateGrossProfit() / revenue) * 100;
  };

  const handleSave = (status: 'draft' | 'pending_approval') => {
    console.log('保存:', {
      projectInfo,
      materials,
      labor,
      outsourcing,
      expenses,
      status
    });
    router.push(`/budgets/${resolvedParams.id}`);
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

  // 権限チェック
  const canEdit = projectInfo.status === 'draft' ||
                  projectInfo.status === 'pending_approval' ||
                  (user?.role === 'admin' && projectInfo.status === 'approved');

  if (!canEdit) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">この実行予算書は編集できません。</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">実行予算書編集</h1>

        {/* ステータス表示 */}
        {projectInfo.status === 'pending_approval' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              この実行予算書は承認待ちです。編集後は再度承認申請が必要です。
            </p>
          </div>
        )}

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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">受注先</label>
              <input
                type="text"
                value={projectInfo.client}
                onChange={(e) => setProjectInfo({ ...projectInfo, client: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">工事場所</label>
              <input
                type="text"
                value={projectInfo.location}
                onChange={(e) => setProjectInfo({ ...projectInfo, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">請負金額</label>
              <input
                type="number"
                value={projectInfo.contractAmount}
                onChange={(e) => setProjectInfo({ ...projectInfo, contractAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
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
              <span>合計（原価）</span>
              <span>¥{Math.floor(calculateGrandTotal()).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>請負金額</span>
              <span className="font-medium">¥{projectInfo.contractAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>粗利益</span>
              <span className={`font-medium ${calculateGrossProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ¥{Math.floor(calculateGrossProfit()).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span>粗利率</span>
              <span className={`font-medium ${calculateGrossProfitRate() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrossProfitRate().toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push(`/budgets/${resolvedParams.id}`)}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={() => handleSave('draft')}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            下書き保存
          </button>
          <button
            onClick={() => handleSave('pending_approval')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            保存して承認申請
          </button>
        </div>
      </div>
    </Layout>
  );
}