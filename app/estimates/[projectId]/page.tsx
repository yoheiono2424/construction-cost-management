'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';
import { Estimate, EstimateItem, EstimateStatus, PreviewMode } from '@/app/types/estimate';

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
    estimateNumber: 'EST-20250915-001',
    createdAt: '2025-09-15',
    total: 85000000,
  },
  {
    id: 'est-2',
    projectId: '3',
    projectName: '××工場増築工事',
    estimateNumber: 'EST-20250920-001',
    createdAt: '2025-09-20',
    total: 120000000,
  },
];

type TabType = 'materials' | 'laborAndConstruction';

export default function EstimatePage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;

  // 見積番号の自動生成（作成日ベース：EST-YYYYMMDD-XXX）
  const generateEstimateNumber = () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const seqNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `EST-${dateStr}-${seqNum}`;
  };

  // 見積書データの状態管理
  const [estimate, setEstimate] = useState<Estimate>(
    mockEstimate || {
      id: '',
      projectId: projectId,
      estimateNumber: generateEstimateNumber(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      validUntil: '',
      status: 'draft',
      remarks: '',
      materials: [],
      laborAndConstruction: [],
      materialsTotal: 0,
      laborAndConstructionTotal: 0,
      subtotal: 0,
      discount: 0,
      discountLabel: '値引き',
      discountedSubtotal: 0,
      tax: 0,
      total: 0,
    }
  );

  const [activeTab, setActiveTab] = useState<TabType>('materials');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('breakdown');
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 見積書が新規か既存かを判定
  const isNewEstimate = !mockEstimate;

  // タブの日本語名
  const tabNames = {
    materials: '材料費',
    laborAndConstruction: '工事費および人件費（労務費）',
  };

  // 基本情報の変更
  const handleBasicInfoChange = (field: string, value: string | number) => {
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
      isSubcontracting: false,
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
  const updateItem = (section: TabType, id: string, field: keyof EstimateItem, value: string | number | boolean) => {
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
  const recalculateTotals = useCallback(() => {
    const materialsTotal = estimate.materials.reduce((sum, item) => sum + item.subtotal, 0);
    const laborAndConstructionTotal = estimate.laborAndConstruction.reduce((sum, item) => sum + item.subtotal, 0);
    const subtotal = materialsTotal + laborAndConstructionTotal;
    const discount = estimate.discount || 0;
    const discountedSubtotal = subtotal - discount;
    const tax = Math.floor(discountedSubtotal * 0.1);
    const total = discountedSubtotal + tax;

    setEstimate((prev) => ({
      ...prev,
      materialsTotal,
      laborAndConstructionTotal,
      subtotal,
      discountedSubtotal,
      tax,
      total,
    }));
  }, [estimate.materials, estimate.laborAndConstruction, estimate.discount]);

  // 明細が変更されたら金額を再計算
  useEffect(() => {
    recalculateTotals();
  }, [recalculateTotals]);

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
    alert('工事内訳書を保存しました');
  };

  // PDF出力（工事内訳書）
  const handleBreakdownPdfExport = () => {
    alert('工事内訳書PDF出力機能は実装予定です');
  };

  // PDF出力（見積書）
  const handleQuotePdfExport = () => {
    alert('見積書PDF出力機能は実装予定です');
  };

  // 実行予算書へ反映
  const handleReflectToBudget = () => {
    if (estimate.status !== 'confirmed') {
      alert('確定済みの工事内訳書のみ実行予算書に反映できます');
      return;
    }

    if (confirm('この工事内訳書を実行予算書に反映しますか？\n\n※ 外注費用チェックに応じて材料費・労務費・外注費に自動分類されます。')) {
      // 実際は実行予算書へデータをコピーするAPI呼び出し
      const materialItems = estimate.materials.filter(item => !item.isSubcontracting);
      const materialSubcontracting = estimate.materials.filter(item => item.isSubcontracting);
      const laborItems = estimate.laborAndConstruction.filter(item => !item.isSubcontracting);
      const laborSubcontracting = estimate.laborAndConstruction.filter(item => item.isSubcontracting);

      const reflectData = {
        materials: materialItems,
        labor: laborItems,
        outsourcing: [...materialSubcontracting, ...laborSubcontracting],
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
      <div className="p-8 min-w-[1600px]">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/projects')}
              className="px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              ← 戻る
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isNewEstimate ? '工事内訳書作成' : '工事内訳書編集'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {mockProject.projectName}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {!isNewEstimate && (
              <>
                <button
                  onClick={handleBreakdownPdfExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  工事内訳書PDF
                </button>
                <button
                  onClick={handleQuotePdfExport}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  見積書PDF
                </button>
                {estimate.status === 'confirmed' && (
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={handleReflectToBudget}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                      実行予算書へ反映
                    </button>
                    <p className="text-xs text-gray-500">※外注費用☑に応じて分類</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 2カラムレイアウト */}
        <div className="flex gap-6">
          {/* 左側：入力フォーム */}
          <div className="w-3/5 min-w-[960px] space-y-6">
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
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">明細入力</h2>

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

          {/* 外注費用チェックボックスの説明 */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              💡 <strong>外注費用☑について：</strong> チェックを入れた項目は、実行予算書への反映時に「外注費」として分類されます。
            </p>
            <p className="text-xs text-blue-700 mt-1">
              ※ 材料費タブ：☑OFF→材料費、☑ON→外注費 ／ 工事費および人件費タブ：☑OFF→労務費、☑ON→外注費
            </p>
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
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">外注費用</th>
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
                      <input
                        type="checkbox"
                        checked={item.isSubcontracting}
                        onChange={(e) => updateItem(activeTab, item.id, 'isSubcontracting', e.target.checked)}
                        className="w-4 h-4 text-orange-600 focus:ring-2 focus:ring-orange-500"
                      />
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
                      ¥{(activeTab === 'materials' ? estimate.materialsTotal : estimate.laborAndConstructionTotal).toLocaleString()}
                    </td>
                    <td colSpan={2}></td>
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

        {/* 値引き入力セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">値引き</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-24">値引き名称</label>
              <input
                type="text"
                value={estimate.discountLabel}
                onChange={(e) => handleBasicInfoChange('discountLabel', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="値引き"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-24">値引き額</label>
              <input
                type="number"
                value={estimate.discount || ''}
                onChange={(e) => handleBasicInfoChange('discount', parseFloat(e.target.value) || 0)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              <span className="text-sm text-gray-600">円</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ※ 値引き時の実行予算書への反映方法は、お客様と相談の上で決定します
          </p>
        </div>

        {/* サマリーセクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">金額サマリー</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-900 font-medium">合計（税別）</span>
              <span className="font-bold">¥{estimate.subtotal.toLocaleString()}</span>
            </div>
            {estimate.discount > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-medium">{estimate.discountLabel}</span>
                  <span className="font-bold text-red-600">-¥{estimate.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-medium">値引後小計</span>
                  <span className="font-bold">¥{estimate.discountedSubtotal.toLocaleString()}</span>
                </div>
              </>
            )}
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

          {/* 右側：プレビュー（2タブ切り替え） */}
          <div className="w-2/5 min-w-[616px] sticky top-8 self-start">
            {/* プレビュータブ */}
            <div className="flex border-b mb-4 bg-white shadow-sm">
              <button
                onClick={() => setPreviewMode('breakdown')}
                className={`flex-1 px-6 py-3 font-medium transition-colors ${
                  previewMode === 'breakdown'
                    ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                工事内訳書
              </button>
              <button
                onClick={() => setPreviewMode('quote')}
                className={`flex-1 px-6 py-3 font-medium transition-colors ${
                  previewMode === 'quote'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                見積書
              </button>
            </div>

            {/* プレビュー内容（A4サイズ固定） */}
            <div className="bg-white shadow-lg" style={{ width: '210mm', minHeight: '297mm', padding: '15mm' }}>

              {/* 工事内訳書プレビュー */}
              {previewMode === 'breakdown' && (
                <>
                  {/* タイトル */}
                  <h1 className="text-center text-2xl font-bold mb-6">工事内訳書</h1>

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
                              <td className="border border-gray-300 px-2 py-1 text-center">{item.quantity}</td>
                              <td className="border border-gray-300 px-2 py-1 text-center">{item.unit}</td>
                              <td className="border border-gray-300 px-2 py-1 text-right">¥{item.unitPrice.toLocaleString()}</td>
                              <td className="border border-gray-300 px-2 py-1 text-right font-medium">¥{item.subtotal.toLocaleString()}</td>
                            </tr>
                          ))}
                          {/* 合計行 */}
                          <tr className="bg-gray-50 border-t-2 border-gray-300">
                            <td colSpan={5} className="border border-gray-300 px-2 py-1 text-right font-semibold">材料費合計</td>
                            <td className="border border-gray-300 px-2 py-1 text-right font-bold text-blue-600">¥{estimate.materialsTotal.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 工事費および人件費明細 */}
                  {estimate.laborAndConstruction.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-gray-900 mb-2 bg-green-50 px-2 py-1 rounded">【工事費および人件費】</h4>
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
                          {estimate.laborAndConstruction.map((item) => (
                            <tr key={item.id}>
                              <td className="border border-gray-300 px-2 py-1">{item.name || '-'}</td>
                              <td className="border border-gray-300 px-2 py-1">{item.specification || '-'}</td>
                              <td className="border border-gray-300 px-2 py-1 text-center">{item.quantity}</td>
                              <td className="border border-gray-300 px-2 py-1 text-center">{item.unit}</td>
                              <td className="border border-gray-300 px-2 py-1 text-right">¥{item.unitPrice.toLocaleString()}</td>
                              <td className="border border-gray-300 px-2 py-1 text-right font-medium">¥{item.subtotal.toLocaleString()}</td>
                            </tr>
                          ))}
                          {/* 合計行 */}
                          <tr className="bg-gray-50 border-t-2 border-gray-300">
                            <td colSpan={5} className="border border-gray-300 px-2 py-1 text-right font-semibold">工事費および人件費合計</td>
                            <td className="border border-gray-300 px-2 py-1 text-right font-bold text-blue-600">¥{estimate.laborAndConstructionTotal.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* 見積書プレビュー */}
              {previewMode === 'quote' && (
                <>
                  {/* ヘッダー部分 */}
                  <div className="mb-2">
                    {/* 見積書タイトル - 中央 */}
                    <h1 className="text-center text-2xl font-bold mb-6">見積書</h1>

                    {/* 2カラムレイアウト：発注者情報（左）、日付・受注者情報（右） */}
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
                    <table className="border-collapse text-xs mb-6" style={{ width: '70%' }}>
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-2 py-1 text-left">合計（税別）</th>
                          {estimate.discount > 0 && (
                            <>
                              <th className="border border-gray-300 px-2 py-1 text-left">{estimate.discountLabel}</th>
                              <th className="border border-gray-300 px-2 py-1 text-left">値引後小計</th>
                            </>
                          )}
                          <th className="border border-gray-300 px-2 py-1 text-left">消費税</th>
                          <th className="border border-gray-300 px-2 py-1 text-left">合計金額(税込)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                            {estimate.subtotal.toLocaleString()}円
                          </td>
                          {estimate.discount > 0 && (
                            <>
                              <td className="border border-gray-300 px-2 py-1 text-right font-medium text-red-600">
                                {estimate.discount.toLocaleString()}円
                              </td>
                              <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                                {estimate.discountedSubtotal.toLocaleString()}円
                              </td>
                            </>
                          )}
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

                  {/* 明細表（費目ごとの合計金額） */}
                  <div className="mb-6">
                    <table className="w-full text-xs border-collapse" style={{ tableLayout: 'fixed' }}>
                      <colgroup>
                        <col style={{ width: '50%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '20%' }} />
                      </colgroup>
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-2 py-1 text-left">費目</th>
                          <th className="border border-gray-300 px-2 py-1 text-center">数量</th>
                          <th className="border border-gray-300 px-2 py-1 text-center">単位</th>
                          <th className="border border-gray-300 px-2 py-1 text-right">金額</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          let displayedRows = 0;

                          return (
                            <>
                              {/* 材料費の行（金額が0円より大きい場合のみ表示） */}
                              {estimate.materialsTotal > 0 && (
                                <>
                                  {(() => { displayedRows++; return null; })()}
                                  <tr>
                                    <td className="border border-gray-300 px-2 py-1">材料費</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">1</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">式</td>
                                    <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                                      ¥{estimate.materialsTotal.toLocaleString()}
                                    </td>
                                  </tr>
                                </>
                              )}
                              {/* 工事費および人件費の行（金額が0円より大きい場合のみ表示） */}
                              {estimate.laborAndConstructionTotal > 0 && (
                                <>
                                  {(() => { displayedRows++; return null; })()}
                                  <tr>
                                    <td className="border border-gray-300 px-2 py-1">工事費および人件費</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">1</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">式</td>
                                    <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                                      ¥{estimate.laborAndConstructionTotal.toLocaleString()}
                                    </td>
                                  </tr>
                                </>
                              )}
                              {/* 値引きの行（値引き額が入力されている場合のみ） */}
                              {estimate.discount > 0 && (
                                <>
                                  {(() => { displayedRows++; return null; })()}
                                  <tr>
                                    <td className="border border-gray-300 px-2 py-1">{estimate.discountLabel}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">1</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">式</td>
                                    <td className="border border-gray-300 px-2 py-1 text-right font-medium text-red-600">
                                      -¥{estimate.discount.toLocaleString()}
                                    </td>
                                  </tr>
                                </>
                              )}
                              {/* 空行（10行になるように調整） */}
                              {Array.from({ length: 10 - displayedRows }).map((_, index) => (
                                <tr key={`empty-${index}`}>
                                  <td className="border border-gray-300 px-2 py-1">{'\u00A0'}</td>
                                  <td className="border border-gray-300 px-2 py-1 text-center">{'\u00A0'}</td>
                                  <td className="border border-gray-300 px-2 py-1 text-center">{'\u00A0'}</td>
                                  <td className="border border-gray-300 px-2 py-1 text-right">{'\u00A0'}</td>
                                </tr>
                              ))}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>

                  {/* 備考 */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">備考</h4>
                    <div className="border border-gray-300 px-2 py-2 text-xs text-gray-700 whitespace-pre-wrap" style={{ minHeight: '60px' }}>
                      {estimate.remarks}
                    </div>
                  </div>
                </>
              )}
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
