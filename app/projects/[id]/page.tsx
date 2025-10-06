'use client';

import Layout from '@/app/components/Layout';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const _resolvedParams = use(params); // 将来のために保持
  const project = dummyProject; // 実際はAPIから取得

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case '準備中':
        return 'bg-gray-100 text-gray-800';
      case '進行中':
        return 'bg-blue-100 text-blue-800';
      case '完了':
        return 'bg-green-100 text-green-800';
      case '保留':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="p-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">工事詳細</h1>
          <div className="flex gap-3">
            <Link
              href={`/projects/${project.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              編集
            </Link>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ← 戻る
            </button>
          </div>
        </div>

        {/* 基本情報セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">基本情報</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">NO</p>
              <p className="text-sm font-medium">{project.no}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">工事番号</p>
              <p className="text-sm font-medium">{project.projectNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">進捗率</p>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">ステータス</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">受注者</p>
              <p className="text-sm font-medium">{project.orderReceiver}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">成績評定点</p>
              <p className="text-sm font-medium">{project.performanceScore || '-'}</p>
            </div>
          </div>
        </div>

        {/* 発注区分セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">発注区分</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">発注元</p>
              <p className="text-sm font-medium">{project.orderType || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">契約形態</p>
              <p className="text-sm font-medium">{project.contractType || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">業種</p>
              <p className="text-sm font-medium">{project.industry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">部署</p>
              <p className="text-sm font-medium">{project.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">担当課</p>
              <p className="text-sm font-medium">{project.responsibleDivision}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">監督員</p>
              <p className="text-sm font-medium">{project.supervisor}</p>
            </div>
          </div>
        </div>

        {/* 工事詳細セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">工事詳細</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">工事名称</p>
              <p className="text-sm font-medium">{project.projectTitle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">工事名</p>
              <p className="text-sm font-medium">{project.projectName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">工事場所</p>
              <p className="text-sm font-medium">{project.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">工事内容</p>
              <p className="text-sm font-medium">{project.projectContent}</p>
            </div>
          </div>
        </div>

        {/* 契約・工期セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">契約・工期情報</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">契約日</p>
              <p className="text-sm font-medium">{project.contractDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">工期（自）</p>
              <p className="text-sm font-medium">{project.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">余裕工期</p>
              <p className="text-sm font-medium">{project.bufferPeriod ? `${project.bufferPeriod}日` : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">工期（至）</p>
              <p className="text-sm font-medium">{project.endDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">工期変更</p>
              <p className="text-sm font-medium">{project.periodChange || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">検査日</p>
              <p className="text-sm font-medium">{project.inspectionDate || '-'}</p>
            </div>
          </div>
        </div>

        {/* 金額セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">金額情報（税込み）</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">受注金額</p>
              <p className="text-lg font-bold text-gray-900">¥{project.contractAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">増減金額</p>
              <p className="text-lg font-bold text-gray-900">
                {project.changeAmount ? `¥${project.changeAmount.toLocaleString()}` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">最終金額</p>
              <p className="text-lg font-bold text-blue-600">
                ¥{(project.finalAmount || project.contractAmount).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 体制・進捗セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">体制・進捗情報</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">書類担当</p>
              <p className="text-sm font-medium">{project.documentManager || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">主任技術者</p>
              <p className="text-sm font-medium">{project.chiefEngineer || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">現場代理人</p>
              <p className="text-sm font-medium">{project.siteAgent || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">品質証明員</p>
              <p className="text-sm font-medium">{project.qualityInspector || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">施工班</p>
              <p className="text-sm font-medium">{project.constructionTeam || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">実行予算</p>
              <p className="text-sm font-medium">{project.budgetStatus || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
