'use client';

import Layout from '@/app/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { useEffect } from 'react';

interface ProjectItem {
  id: string;
  project: string;
  item: string; // 品目（AI OCR解析）
  amount: number;
  category: 'material' | 'outsourcing' | 'expense'; // AI判別結果
}

interface InvoiceData {
  id: string;
  fileName: string;
  imageUrl?: string;
  supplier: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  projectItems: ProjectItem[]; // 現場別明細
  totalAmount: number; // 税抜合計
  status: 'pending' | 'confirmed';
}

export default function InvoiceCheckPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState<InvoiceData | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [searchingRowIndex, setSearchingRowIndex] = useState<number | null>(null);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');

  // ダミーデータ：複数の請求書
  const [invoices] = useState<InvoiceData[]>([
    {
      id: '1',
      fileName: '請求書_A建設_2025年1月.pdf',
      imageUrl: '/invoice-sample-1.jpg',
      supplier: '株式会社A建設',
      invoiceNumber: 'INV-2025-001',
      invoiceDate: '2025-01-15',
      dueDate: '2025-02-15',
      projectItems: [
        { id: '1', project: 'B工場増築工事', item: '基礎材料', amount: 1000000, category: 'material' },
        { id: '2', project: 'C店舗新装工事', item: '基礎工事', amount: 500000, category: 'outsourcing' },
      ],
      totalAmount: 1500000,
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
      projectItems: [
        { id: '1', project: 'C店舗新装工事', item: '外構工事', amount: 800000, category: 'outsourcing' },
      ],
      totalAmount: 800000,
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
      projectItems: [
        { id: '1', project: 'D住宅リフォーム', item: 'コンクリート', amount: 300000, category: 'material' },
        { id: '2', project: 'A工事現場改修工事', item: '交通費', amount: 150000, category: 'expense' },
      ],
      totalAmount: 450000,
      status: 'pending'
    },
  ]);

  const [projectOptions] = useState([
    'A工事現場改修工事',
    'B工場増築工事',
    'C店舗新装工事',
    'D住宅リフォーム',
    'E施設改修工事',
  ]);

  // 費目ごとの品目リスト（モックデータ）
  const itemsByCategory = {
    material: ['基礎材料', '鉄筋', 'コンクリート', '型枠材', '左官材料', '外構材料', '設備材料', 'その他材料'],
    outsourcing: ['基礎工事', '鉄筋工事', '型枠工事', 'コンクリート工事', '左官工事', '外構工事', '設備工事', 'その他工事'],
    expense: ['交通費', '宿泊費', '通信費', '事務用品費', 'その他経費']
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (invoices.length > 0) {
      setFormData({ ...invoices[currentIndex] });
    }
  }, [currentIndex, invoices]);

  const handleNext = () => {
    if (currentIndex < invoices.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };


  const handleInputChange = (field: string, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleProjectItemChange = (index: number, field: string, value: string | number) => {
    if (formData) {
      const newItems = [...formData.projectItems];
      newItems[index] = { ...newItems[index], [field]: value };

      // 合計金額を再計算
      const total = newItems.reduce((sum, item) => sum + Number(item.amount), 0);

      setFormData({ ...formData, projectItems: newItems, totalAmount: total });
    }
  };

  const handleAddProjectItem = () => {
    if (formData && formData.projectItems.length < 20) {
      const newItem: ProjectItem = {
        id: Date.now().toString(),
        project: projectOptions[0],
        item: itemsByCategory.material[0], // 初期値：材料費の最初の品目
        amount: 0,
        category: 'material'
      };
      setFormData({
        ...formData,
        projectItems: [...formData.projectItems, newItem]
      });
    }
  };

  const handleRemoveProjectItem = (index: number) => {
    if (formData && formData.projectItems.length > 1) {
      const newItems = formData.projectItems.filter((_, i) => i !== index);
      const total = newItems.reduce((sum, item) => sum + Number(item.amount), 0);
      setFormData({ ...formData, projectItems: newItems, totalAmount: total });
    }
  };

  const handleOpenProjectSearch = (index: number) => {
    setSearchingRowIndex(index);
    setProjectSearchTerm('');
    setIsProjectModalOpen(true);
  };

  const handleSelectProject = (projectName: string) => {
    if (searchingRowIndex !== null && formData) {
      handleProjectItemChange(searchingRowIndex, 'project', projectName);
    }
    setIsProjectModalOpen(false);
    setSearchingRowIndex(null);
    setProjectSearchTerm('');
  };

  const filteredProjects = projectOptions.filter(project =>
    project.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );

  if (!isAuthenticated || !formData) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">請求書確認・修正</h1>
          <p className="text-sm text-gray-600 mt-1">
            {currentIndex + 1} / {invoices.length} - {formData.fileName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：画像プレビュー */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">請求書画像</h2>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[600px] flex items-center justify-center">
              {formData.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.imageUrl} alt="請求書" className="max-w-full h-auto" />
              ) : (
                <p className="text-gray-400">画像プレビュー</p>
              )}
            </div>
          </div>

          {/* 右側：編集フォーム */}
          <div className="space-y-6">
            {/* 基本情報 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    請求書番号
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    仕入れ先
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      発行日
                    </label>
                    <input
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      支払期限
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 現場別明細 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  現場別明細 <span className="text-blue-600 text-sm">(AI OCR解析)</span>
                </h2>
                <button
                  onClick={handleAddProjectItem}
                  disabled={formData.projectItems.length >= 20}
                  className={`px-3 py-1 text-sm rounded-md ${
                    formData.projectItems.length >= 20
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  + 行を追加
                </button>
              </div>

              <div className="space-y-3">
                {formData.projectItems.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex gap-2 items-end flex-wrap">
                        <div className="flex-1 min-w-[160px]">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            現場名
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={item.project}
                              onChange={(e) => handleProjectItemChange(index, 'project', e.target.value)}
                              className="w-full px-2 py-2 pr-9 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="現場名"
                            />
                            <button
                              type="button"
                              onClick={() => handleOpenProjectSearch(index)}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-1.5 py-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                              title="現場を検索"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="w-24">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            分類
                          </label>
                          <select
                            value={item.category}
                            onChange={(e) => {
                              const newCategory = e.target.value as 'material' | 'outsourcing' | 'expense';
                              const newItems = [...formData.projectItems];
                              newItems[index] = {
                                ...newItems[index],
                                category: newCategory,
                                item: itemsByCategory[newCategory][0] // 分類変更時、最初の品目を自動選択
                              };
                              const total = newItems.reduce((sum, item) => sum + Number(item.amount), 0);
                              setFormData({ ...formData, projectItems: newItems, totalAmount: total });
                            }}
                            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="material">材料費</option>
                            <option value="outsourcing">外注費</option>
                            <option value="expense">諸経費</option>
                          </select>
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            品目
                          </label>
                          <select
                            value={item.item}
                            onChange={(e) => handleProjectItemChange(index, 'item', e.target.value)}
                            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {itemsByCategory[item.category].map((itemName) => (
                              <option key={itemName} value={itemName}>
                                {itemName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-28">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            金額（税抜）
                          </label>
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => handleProjectItemChange(index, 'amount', Number(e.target.value))}
                            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="w-10">
                          <button
                            onClick={() => handleRemoveProjectItem(index)}
                            disabled={formData.projectItems.length === 1}
                            className={`w-full px-2 py-2 text-sm rounded-md ${
                              formData.projectItems.length === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">合計金額（税抜）</span>
                  <span className="text-lg font-bold text-gray-900">
                    ¥{formData.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-xs text-blue-800">
                  <strong>AI費目分類について:</strong> AIが自動判別した費目が初期値として設定されています。必要に応じてドロップダウンから手動で変更できます。
                </p>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex justify-between items-center">
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
              {currentIndex < invoices.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  次へ →
                </button>
              ) : (
                <button
                  onClick={() => router.push('/invoices')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  完了
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 現場検索モーダル */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">現場を選択</h3>
                <button
                  onClick={() => {
                    setIsProjectModalOpen(false);
                    setSearchingRowIndex(null);
                    setProjectSearchTerm('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* 検索フィールド */}
              <div className="mb-4">
                <input
                  type="text"
                  value={projectSearchTerm}
                  onChange={(e) => setProjectSearchTerm(e.target.value)}
                  placeholder="現場名で検索..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* 現場リスト */}
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                {filteredProjects.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredProjects.map((project) => (
                      <button
                        key={project}
                        onClick={() => handleSelectProject(project)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors focus:bg-blue-100 focus:outline-none"
                      >
                        <div className="text-sm font-medium text-gray-900">{project}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    該当する現場が見つかりません
                  </div>
                )}
              </div>

              {/* 閉じるボタン */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setIsProjectModalOpen(false);
                    setSearchingRowIndex(null);
                    setProjectSearchTerm('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
