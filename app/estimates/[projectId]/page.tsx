'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';
import { Estimate, EstimateItem, EstimateStatus } from '@/app/types/estimate';

// サンプル工事データ（工事一覧から取得する想定）
const mockProject = {
  id: '1',
  projectNumber: 'PJ-2025-001',
  projectName: '○○ビル新築工事',
  location: '東京都渋谷区○○1-2-3',
  client: '株式会社○○建設',
};

// サンプル見積書データ（既存見積書がある場合）
const mockEstimate: Estimate | null = null; // null = 新規作成

// 過去の見積書リスト（サンプル）
const mockPastEstimates = [
  {
    id: 'est-1',
    projectId: '2',
    projectName: '△△マンション改修工事',
    estimateNumber: 'EST-2025-001',
    createdAt: '2025-09-15',
    total: 85000000,
  },
  {
    id: 'est-2',
    projectId: '3',
    projectName: '××工場増築工事',
    estimateNumber: 'EST-2025-002',
    createdAt: '2025-09-20',
    total: 120000000,
  },
];

type TabType = 'materials' | 'labor' | 'outsourcing';

export default function EstimatePage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;

  // 見積書データの状態管理
  const [estimate, setEstimate] = useState<Estimate>(
    mockEstimate || {
      id: '',
      projectId: projectId,
      estimateNumber: `EST-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      validUntil: '',
      status: 'draft',
      remarks: '',
      materials: [],
      labor: [],
      outsourcing: [],
      expenses: [],
      materialsTotal: 0,
      laborTotal: 0,
      outsourcingTotal: 0,
      expensesTotal: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
    }
  );

  const [activeTab, setActiveTab] = useState<TabType>('materials');
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 見積書が新規か既存かを判定
  const isNewEstimate = !mockEstimate;

  // タブの日本語名
  const tabNames = {
    materials: '材料費',
    labor: '労務費',
    outsourcing: '外注費',
  };

  // 基本情報の変更
  const handleBasicInfoChange = (field: string, value: string) => {
    setEstimate((prev) => ({ ...prev, [field]: value }));
  };

  // 明細行の追加
  const addRow = (section: TabType) => {
    const newItem: EstimateItem = {
      id: `item-${Date.now()}`,
      name: '',
      specification: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      subtotal: 0,
    };
    setEstimate((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  // 明細行の削除
  const removeRow = (section: TabType, id: string) => {
    setEstimate((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  // 明細項目の更新
  const updateItem = (section: TabType, id: string, field: keyof EstimateItem, value: string | number) => {
    setEstimate((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // 小計を自動計算
          if (field === 'quantity' || field === 'unitPrice') {
            updated.subtotal = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      }),
    }));
  };

  // 金額の再計算
  const recalculateTotals = () => {
    const materialsTotal = estimate.materials.reduce((sum, item) => sum + item.subtotal, 0);
    const laborTotal = estimate.labor.reduce((sum, item) => sum + item.subtotal, 0);
    const outsourcingTotal = estimate.outsourcing.reduce((sum, item) => sum + item.subtotal, 0);
    const expensesTotal = 0; // 諸経費は見積書では使用しない
    const subtotal = materialsTotal + laborTotal + outsourcingTotal; // 諸経費を含めない
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;

    setEstimate((prev) => ({
      ...prev,
      materialsTotal,
      laborTotal,
      outsourcingTotal,
      expensesTotal,
      subtotal,
      tax,
      total,
    }));
  };

  // 明細が変更されたら金額を再計算
  useState(() => {
    recalculateTotals();
  });

  // 過去の見積書からコピー
  const handleCopyFromPast = (pastEstimateId: string) => {
    // 実際はAPIから過去の見積書を取得してコピー
    alert(`見積書 ${pastEstimateId} のデータをコピーしました（実装予定）`);
    setIsCopyModalOpen(false);
  };

  // 保存処理
  const handleSave = async (status?: EstimateStatus) => {
    setIsSaving(true);
    const saveData = {
      ...estimate,
      status: status || estimate.status,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    // 実際はAPIで保存
    console.log('保存データ:', saveData);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    alert('見積書を保存しました');
  };

  // PDF出力
  const handlePdfExport = () => {
    alert('PDF出力機能は実装予定です');
  };

  // 実行予算書へ反映
  const handleReflectToBudget = () => {
    if (estimate.status !== 'confirmed') {
      alert('確定済みの見積書のみ実行予算書に反映できます');
      return;
    }

    if (confirm('この見積書を実行予算書に反映しますか？\n\n※ 材料費・労務費・外注費が反映されます。')) {
      // 実際は実行予算書へデータをコピーするAPI呼び出し
      const reflectData = {
        materials: estimate.materials,
        labor: estimate.labor,
        outsourcing: estimate.outsourcing,
      };
      console.log('実行予算書へ反映:', reflectData);
      setEstimate((prev) => ({ ...prev, status: 'reflected' }));
      alert('実行予算書に反映しました\n\n反映された費目：\n・材料費\n・労務費\n・外注費');
    }
  };

  // ステータスバッジの色
  const getStatusBadge = (status: EstimateStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'reflected':
        return 'bg-green-100 text-green-800';
    }
  };

  // ステータスの日本語名
  const getStatusLabel = (status: EstimateStatus) => {
    switch (status) {
      case 'draft':
        return '下書き';
      case 'confirmed':
        return '確定';
      case 'reflected':
        return '実行予算へ反映済み';
    }
  };

  return (
    <Layout>
      <div className="p-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNewEstimate ? '見積書作成' : '見積書編集'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {mockProject.projectName}
            </p>
          </div>
          <div className="flex gap-3">
            {!isNewEstimate && (
              <>
                <button
                  onClick={handlePdfExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  PDF出力
                </button>
                {estimate.status === 'confirmed' && (
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={handleReflectToBudget}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                      実行予算書へ反映
                    </button>
                    <p className="text-xs text-gray-500">※材料費・労務費・外注費のみ反映</p>
                  </div>
                )}
              </>
            )}
            <button
              onClick={() => router.push('/projects')}
              className="px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              ← 戻る
            </button>
          </div>
        </div>

        {/* 2カラムレイアウト */}
        <div className="flex gap-6">
          {/* 左側：入力フォーム */}
          <div className="w-1/2 space-y-6">
            {/* 基本情報セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                見積書番号
              </label>
              <input
                type="text"
                value={estimate.estimateNumber}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                見積日
              </label>
              <input
                type="date"
                value={estimate.createdAt}
                onChange={(e) => handleBasicInfoChange('createdAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                有効期限
              </label>
              <input
                type="date"
                value={estimate.validUntil}
                onChange={(e) => handleBasicInfoChange('validUntil', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ステータス
              </label>
              <div className="flex items-center h-10">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(estimate.status)}`}>
                  {getStatusLabel(estimate.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 工事情報セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">工事情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">工事番号</p>
              <p className="text-sm font-medium">{mockProject.projectNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">工事名</p>
              <p className="text-sm font-medium">{mockProject.projectName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">工事場所</p>
              <p className="text-sm font-medium">{mockProject.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">受注先</p>
              <p className="text-sm font-medium">{mockProject.client}</p>
            </div>
          </div>
        </div>

        {/* 過去の見積もりからコピーボタン */}
        <div className="mb-6">
          <button
            onClick={() => setIsCopyModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            📋 過去の見積もりからコピー
          </button>
        </div>

        {/* 明細入力セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">見積明細</h2>

          {/* タブ */}
          <div className="flex border-b mb-4">
            {(Object.keys(tabNames) as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tabNames[tab]}
              </button>
            ))}
          </div>

          {/* 明細テーブル */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">NO</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">品名</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">規格</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">数量</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">単位</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">単価</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">小計</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase w-16">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estimate[activeTab].map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-3 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(activeTab, item.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="品名"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={item.specification}
                        onChange={(e) => updateItem(activeTab, item.id, 'specification', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="規格"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(activeTab, item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(activeTab, item.id, 'unit', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="単位"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        value={item.unitPrice || ''}
                        onChange={(e) => updateItem(activeTab, item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-3 py-3 text-sm font-medium">
                      ¥{item.subtotal.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => removeRow(activeTab, item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
                {/* 合計行 */}
                {estimate[activeTab].length > 0 && (
                  <tr className="bg-gray-50 border-t-2 border-gray-300">
                    <td colSpan={6} className="px-3 py-3 text-sm font-semibold text-right">
                      {tabNames[activeTab]}合計
                    </td>
                    <td className="px-3 py-3 text-sm font-bold text-blue-600">
                      ¥{(activeTab === 'materials' ? estimate.materialsTotal : activeTab === 'labor' ? estimate.laborTotal : estimate.outsourcingTotal).toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 行追加ボタン */}
          <div className="mt-4">
            <button
              onClick={() => addRow(activeTab)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              + 行を追加
            </button>
          </div>
        </div>

        {/* 備考セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">備考</h2>
          <textarea
            value={estimate.remarks}
            onChange={(e) => handleBasicInfoChange('remarks', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="備考を入力してください"
          />
        </div>

        {/* サマリーセクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">金額サマリー</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-900 font-medium">小計</span>
              <span className="font-bold">¥{estimate.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">消費税（10%）</span>
              <span className="font-medium">¥{estimate.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t-2">
              <span className="text-xl font-bold text-gray-900">合計金額</span>
              <span className="text-2xl font-bold text-blue-600">¥{estimate.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

            {/* アクションボタン */}
            <div className="flex justify-end gap-3">
              {isNewEstimate ? (
                <>
                  <button
                    onClick={() => handleSave('draft')}
                    disabled={isSaving}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
                  >
                    {isSaving ? '保存中...' : '下書き保存'}
                  </button>
                  <button
                    onClick={() => handleSave('confirmed')}
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isSaving ? '保存中...' : '確定'}
                  </button>
                </>
              ) : (
                <>
                  <select
                    value={estimate.status}
                    onChange={(e) => setEstimate((prev) => ({ ...prev, status: e.target.value as EstimateStatus }))}
                    disabled={estimate.status === 'reflected'}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="draft">下書き</option>
                    <option value="confirmed">確定</option>
                    {estimate.status === 'reflected' && <option value="reflected">実行予算へ反映済み</option>}
                  </select>
                  <button
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isSaving ? '保存中...' : '保存'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 右側：見積書プレビュー（A4サイズ固定） */}
          <div className="w-1/2 sticky top-8 self-start">
            <div className="bg-white shadow-lg" style={{ width: '210mm', minHeight: '297mm', padding: '15mm' }}>

              {/* ヘッダー部分 */}
              <div className="mb-2">
                {/* 見積書タイトル - 中央 */}
                <h1 className="text-center text-2xl font-bold mb-6">見積書</h1>

                {/* 2カラムレイアウト：発注者情報（左）、日付・受注者情報・印鑑（右） */}
                <div className="flex justify-between">
                  {/* 左側：発注者情報 */}
                  <div className="text-sm" style={{ width: '48%' }}>
                    <div className="font-bold text-base mb-2">{mockProject.client} 御中</div>
                    <div className="text-xs mb-1">123-4567</div>
                    <div className="text-xs mb-1">東京都千代田区丸の内1-1-1</div>
                    <div className="text-xs">代表取締役 山田 太郎</div>
                  </div>

                  {/* 右側：日付情報 + 受注者情報 */}
                  <div style={{ width: '48%' }}>
                    {/* 日付情報 */}
                    <div className="text-xs mb-6 pl-16">
                      <div className="mb-1 flex justify-between">
                        <span>見積書番号</span>
                        <span>{estimate.estimateNumber}</span>
                      </div>
                      <div className="mb-1 flex justify-between">
                        <span>見積日</span>
                        <span>{estimate.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>有効期限</span>
                        <span>{estimate.validUntil || '2025-11-30'}</span>
                      </div>
                    </div>

                    {/* 受注者情報 */}
                    <div className="text-xs mt-12 pl-16">
                      <div className="font-bold text-sm mb-2">株式会社永伸</div>
                      <div className="mb-1">860-0074</div>
                      <div className="mb-1">熊本県熊本市西区出町1-3</div>
                      <div>代表取締役 德永 公紀</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 本文部分 */}
              <div className="mb-6">
                <p className="text-sm mb-4">下記の通り見積致します。</p>

                {/* 件名 */}
                <div className="mb-4">
                  <div className="text-sm">
                    <span className="inline-block w-16">件名</span>
                    <span className="font-semibold">{mockProject.projectName}</span>
                  </div>
                </div>

                {/* 金額サマリー表 */}
                <table className="border-collapse text-xs mb-6" style={{ width: '50%' }}>
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-1 text-left">小計</th>
                      <th className="border border-gray-300 px-2 py-1 text-left">消費税</th>
                      <th className="border border-gray-300 px-2 py-1 text-left">見積金額合計(税込)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                        {estimate.subtotal.toLocaleString()}円
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                        {estimate.tax.toLocaleString()}円
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right font-bold">
                        {estimate.total.toLocaleString()}円
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 材料費明細 */}
              {estimate.materials.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2 bg-blue-50 px-2 py-1 rounded">【材料費】</h4>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-2 py-1 text-left">品名</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">規格</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">数量</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">単位</th>
                        <th className="border border-gray-300 px-2 py-1 text-right">単価</th>
                        <th className="border border-gray-300 px-2 py-1 text-right">小計</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimate.materials.map((item) => (
                        <tr key={item.id}>
                          <td className="border border-gray-300 px-2 py-1">{item.name || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1">{item.specification || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            {item.unit}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            ¥{item.unitPrice.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                            ¥{item.subtotal.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {/* 合計行 */}
                      <tr className="bg-gray-50 border-t-2 border-gray-300">
                        <td colSpan={5} className="border border-gray-300 px-2 py-1 text-right font-semibold">
                          材料費合計
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right font-bold text-blue-600">
                          ¥{estimate.materialsTotal.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* 労務費明細 */}
              {estimate.labor.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2 bg-green-50 px-2 py-1 rounded">【労務費】</h4>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-2 py-1 text-left">品名</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">規格</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">数量</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">単位</th>
                        <th className="border border-gray-300 px-2 py-1 text-right">単価</th>
                        <th className="border border-gray-300 px-2 py-1 text-right">小計</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimate.labor.map((item) => (
                        <tr key={item.id}>
                          <td className="border border-gray-300 px-2 py-1">{item.name || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1">{item.specification || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            {item.unit}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            ¥{item.unitPrice.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                            ¥{item.subtotal.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {/* 合計行 */}
                      <tr className="bg-gray-50 border-t-2 border-gray-300">
                        <td colSpan={5} className="border border-gray-300 px-2 py-1 text-right font-semibold">
                          労務費合計
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right font-bold text-blue-600">
                          ¥{estimate.laborTotal.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* 外注費明細 */}
              {estimate.outsourcing.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2 bg-orange-50 px-2 py-1 rounded">【外注費】</h4>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-2 py-1 text-left">品名</th>
                        <th className="border border-gray-300 px-2 py-1 text-left">規格</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">数量</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">単位</th>
                        <th className="border border-gray-300 px-2 py-1 text-right">単価</th>
                        <th className="border border-gray-300 px-2 py-1 text-right">小計</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimate.outsourcing.map((item) => (
                        <tr key={item.id}>
                          <td className="border border-gray-300 px-2 py-1">{item.name || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1">{item.specification || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            {item.unit}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            ¥{item.unitPrice.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                            ¥{item.subtotal.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {/* 合計行 */}
                      <tr className="bg-gray-50 border-t-2 border-gray-300">
                        <td colSpan={5} className="border border-gray-300 px-2 py-1 text-right font-semibold">
                          外注費合計
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right font-bold text-blue-600">
                          ¥{estimate.outsourcingTotal.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* 金額サマリー */}
              <div className="mt-6 pt-4 border-t-2 border-gray-300">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">小計</span>
                    <span className="font-bold">¥{estimate.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">消費税（10%）</span>
                    <span className="font-medium">¥{estimate.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-gray-400">
                    <span className="text-lg font-bold text-gray-900">合計金額</span>
                    <span className="text-xl font-bold text-blue-600">¥{estimate.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 備考 */}
              <div className="mt-6">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">備考</h4>
                <div className="border border-gray-300 px-2 py-2 text-xs text-gray-700 whitespace-pre-wrap" style={{ minHeight: '60px' }}>
                  {estimate.remarks}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 過去の見積もりからコピーモーダル */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">過去の見積もりを選択</h3>
                <button
                  onClick={() => setIsCopyModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">工事名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">見積書番号</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">作成日</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">合計金額</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockPastEstimates.map((past) => (
                    <tr key={past.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{past.projectName}</td>
                      <td className="px-4 py-3 text-sm">{past.estimateNumber}</td>
                      <td className="px-4 py-3 text-sm">{past.createdAt}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        ¥{past.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleCopyFromPast(past.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          コピー
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {mockPastEstimates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  過去の見積書がありません
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsCopyModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
