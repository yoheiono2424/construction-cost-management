'use client';

import Layout from '@/app/components/Layout';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

// 型定義
type ProjectStatus = '準備中' | '進行中' | '完了' | '保留';
type OrderType = '国' | '県' | '市' | '';
type ContractType = '一般' | '指名' | '';

interface Project {
  id: number;
  no: number;
  projectNumber: string;
  progress: number;
  orderReceiver: string;
  performanceScore?: number;
  orderType: OrderType;
  contractType: ContractType;
  industry: string;
  department: string;
  responsibleDivision: string;
  supervisor: string;
  projectTitle: string;
  projectName: string;
  location: string;
  projectContent: string;
  contractDate: string;
  startDate: string;
  bufferPeriod?: number;
  endDate: string;
  periodChange?: string;
  inspectionDate?: string;
  contractAmount: number;
  changeAmount?: number;
  finalAmount?: number;
  documentManager?: string;
  chiefEngineer?: string;
  siteAgent?: string;
  qualityInspector?: string;
  constructionTeam?: string;
  budgetStatus?: string;
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
}

// サンプルデータ
const dummyProject: Project = {
  id: 1,
  no: 1,
  projectNumber: 'PJ-2025-001',
  progress: 50,
  orderReceiver: '永伸建設株式会社',
  performanceScore: 75,
  orderType: '市',
  contractType: '一般',
  industry: '土木一式',
  department: '建設部',
  responsibleDivision: '建設課',
  supervisor: '田中監督',
  projectTitle: '令和7年度',
  projectName: '○○ビル新築工事',
  location: '東京都渋谷区○○1-2-3',
  projectContent: 'RC造5階建て新築工事一式',
  contractDate: '2025-03-25',
  startDate: '2025-04-01',
  bufferPeriod: 30,
  endDate: '2025-12-31',
  periodChange: '',
  inspectionDate: '2026-01-15',
  contractAmount: 150000000,
  changeAmount: 0,
  finalAmount: 150000000,
  documentManager: '山田太郎',
  chiefEngineer: '佐藤次郎',
  siteAgent: '鈴木三郎',
  qualityInspector: '高橋四郎',
  constructionTeam: 'A班',
  budgetStatus: '作成済み',
  status: '進行中',
  createdAt: '2025-03-25',
  updatedAt: '2025-10-02',
};

export default function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const _resolvedParams = use(params); // 将来のために保持
  const [formData, setFormData] = useState<Project>(dummyProject);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    field: keyof Project,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // 実際はAPIで保存処理
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    router.push(`/projects/${formData.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Layout>
      <div className="p-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">工事編集</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 基本情報セクション */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">基本情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NO <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.no}
                  onChange={(e) => handleChange('no', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  工事番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectNumber}
                  onChange={(e) => handleChange('projectNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  進捗率 (0-100) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => handleChange('progress', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ステータス <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="準備中">準備中</option>
                  <option value="進行中">進行中</option>
                  <option value="完了">完了</option>
                  <option value="保留">保留</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  受注者 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.orderReceiver}
                  onChange={(e) => handleChange('orderReceiver', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  成績評定点
                </label>
                <input
                  type="number"
                  value={formData.performanceScore || ''}
                  onChange={(e) => handleChange('performanceScore', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 発注区分セクション */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">発注区分</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  発注元
                </label>
                <select
                  value={formData.orderType}
                  onChange={(e) => handleChange('orderType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  <option value="国">国</option>
                  <option value="県">県</option>
                  <option value="市">市</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  契約形態
                </label>
                <select
                  value={formData.contractType}
                  onChange={(e) => handleChange('contractType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  <option value="一般">一般</option>
                  <option value="指名">指名</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  業種 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  部署 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  担当課 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.responsibleDivision}
                  onChange={(e) => handleChange('responsibleDivision', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  監督員 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.supervisor}
                  onChange={(e) => handleChange('supervisor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* 工事詳細セクション */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">工事詳細</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  工事名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => handleChange('projectTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  工事名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleChange('projectName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  工事場所 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  工事内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.projectContent}
                  onChange={(e) => handleChange('projectContent', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* 契約・工期セクション */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">契約・工期情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  契約日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.contractDate}
                  onChange={(e) => handleChange('contractDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  工期（自） <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  余裕工期（日数）
                </label>
                <input
                  type="number"
                  value={formData.bufferPeriod || ''}
                  onChange={(e) => handleChange('bufferPeriod', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  工期（至） <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  工期変更
                </label>
                <input
                  type="text"
                  value={formData.periodChange || ''}
                  onChange={(e) => handleChange('periodChange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  検査日
                </label>
                <input
                  type="date"
                  value={formData.inspectionDate || ''}
                  onChange={(e) => handleChange('inspectionDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 金額セクション */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">金額情報（税込み）</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  受注金額 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.contractAmount}
                  onChange={(e) => handleChange('contractAmount', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  増減金額
                </label>
                <input
                  type="number"
                  value={formData.changeAmount || ''}
                  onChange={(e) => handleChange('changeAmount', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  最終金額
                </label>
                <input
                  type="number"
                  value={formData.finalAmount || ''}
                  onChange={(e) => handleChange('finalAmount', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 体制・進捗セクション */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">体制・進捗情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  書類担当
                </label>
                <input
                  type="text"
                  value={formData.documentManager || ''}
                  onChange={(e) => handleChange('documentManager', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主任技術者
                </label>
                <input
                  type="text"
                  value={formData.chiefEngineer || ''}
                  onChange={(e) => handleChange('chiefEngineer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  現場代理人
                </label>
                <input
                  type="text"
                  value={formData.siteAgent || ''}
                  onChange={(e) => handleChange('siteAgent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  品質証明員
                </label>
                <input
                  type="text"
                  value={formData.qualityInspector || ''}
                  onChange={(e) => handleChange('qualityInspector', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  施工班
                </label>
                <input
                  type="text"
                  value={formData.constructionTeam || ''}
                  onChange={(e) => handleChange('constructionTeam', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  実行予算
                </label>
                <input
                  type="text"
                  value={formData.budgetStatus || ''}
                  onChange={(e) => handleChange('budgetStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 保存ボタン（下部にも配置） */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
