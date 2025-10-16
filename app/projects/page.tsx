'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/app/components/Layout';
import { useAuthStore } from '@/app/stores/authStore';

// 工事データ型定義
type ProjectStatus = '準備中' | '進行中' | '完了' | '保留';
type OrderType = '国' | '県' | '市' | '';
type ContractType = '一般' | '指名' | '';

interface Project {
  // 基本情報
  id: number;
  no: number;
  projectNumber: string;
  progress: number; // 進捗率（0-100）
  orderReceiver: string; // 受注者
  performanceScore?: number; // 成績評定点

  // 発注区分
  orderType: OrderType; // 国・県・市
  contractType: ContractType; // 一般・指名
  industry: string; // 業種
  department: string; // 部署
  responsibleDivision: string; // 担当課
  supervisor: string; // 監督員

  // 工事詳細
  projectTitle: string; // 工事名称
  projectName: string; // 工事名
  location: string; // 工事場所
  projectContent: string; // 工事内容

  // 契約・工期情報
  contractDate: string; // 契約日
  startDate: string; // 工期（自）
  bufferPeriod?: number; // 余裕工期（日数）
  endDate: string; // 工期（至）
  periodChange?: string; // 工期変更
  inspectionDate?: string; // 検査日

  // 金額情報（税込み）
  contractAmount: number; // 受注金額
  changeAmount?: number; // 増減金額
  finalAmount?: number; // 最終金額

  // 体制・進捗情報
  documentManager?: string; // 書類担当
  chiefEngineer?: string; // 主任技術者
  siteAgent?: string; // 現場代理人
  qualityInspector?: string; // 品質証明員
  constructionTeam?: string; // 施工班
  budgetStatus?: string; // 実行予算

  // システム用
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
}

// サンプルデータ
const dummyProjects: Project[] = [
  {
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
  },
  {
    id: 2,
    no: 2,
    projectNumber: 'PJ-2025-002',
    progress: 30,
    orderReceiver: '永伸建設株式会社',
    performanceScore: 80,
    orderType: '県',
    contractType: '指名',
    industry: '建築一式',
    department: '建設部',
    responsibleDivision: '建築課',
    supervisor: '伊藤監督',
    projectTitle: '令和7年度',
    projectName: '△△マンション改修工事',
    location: '神奈川県横浜市△△区2-3-4',
    projectContent: '外壁改修及び防水工事一式',
    contractDate: '2025-03-10',
    startDate: '2025-03-15',
    bufferPeriod: 20,
    endDate: '2025-09-30',
    periodChange: '',
    inspectionDate: '2025-10-10',
    contractAmount: 85000000,
    changeAmount: 5000000,
    finalAmount: 90000000,
    documentManager: '渡辺五郎',
    chiefEngineer: '中村六郎',
    siteAgent: '小林七郎',
    qualityInspector: '加藤八郎',
    constructionTeam: 'B班',
    budgetStatus: '作成済み',
    status: '進行中',
    createdAt: '2025-03-10',
    updatedAt: '2025-10-02',
  },
  {
    id: 3,
    no: 3,
    projectNumber: 'PJ-2025-003',
    progress: 0,
    orderReceiver: '永伸建設株式会社',
    orderType: '国',
    contractType: '一般',
    industry: '土木一式',
    department: '建設部',
    responsibleDivision: '土木課',
    supervisor: '斎藤監督',
    projectTitle: '令和7年度',
    projectName: '××工場増築工事',
    location: '埼玉県川口市××3-4-5',
    projectContent: '鉄骨造倉庫増築工事一式',
    contractDate: '2025-04-20',
    startDate: '2025-05-01',
    bufferPeriod: 45,
    endDate: '2026-03-31',
    periodChange: '',
    contractAmount: 220000000,
    finalAmount: 220000000,
    documentManager: '松本九郎',
    chiefEngineer: '井上十郎',
    siteAgent: '木村十一郎',
    budgetStatus: '未作成',
    status: '準備中',
    createdAt: '2025-04-20',
    updatedAt: '2025-10-02',
  },
];

type ProjectType = '公共工事' | '民間工事';

// 実行予算書の承認ステータス
type ApprovalStatus = '下書き' | '承認待ち（管理部長）' | '承認待ち（常務）' | '承認待ち（社長）' | '承認済み' | '却下';

// 承認待ち実行予算書の型定義
interface PendingBudget {
  id: number;
  projectId: number;
  projectNumber: string;
  projectName: string;
  applicant: string; // 申請者
  applicationDate: string; // 申請日
  status: ApprovalStatus;
}

// モックデータ：承認待ち実行予算書
const mockPendingBudgets: PendingBudget[] = [
  {
    id: 1,
    projectId: 1,
    projectNumber: 'PJ-2025-001',
    projectName: '○○ビル新築工事',
    applicant: '高橋五郎',
    applicationDate: '2025-09-28',
    status: '承認待ち（管理部長）',
  },
  {
    id: 2,
    projectId: 2,
    projectNumber: 'PJ-2025-002',
    projectName: '△△マンション改修工事',
    applicant: '高橋五郎',
    applicationDate: '2025-09-30',
    status: '承認待ち（管理部長）',
  },
  {
    id: 3,
    projectId: 3,
    projectNumber: 'PJ-2025-003',
    projectName: '××工場増築工事',
    applicant: '田中花子',
    applicationDate: '2025-10-01',
    status: '承認待ち（社長）',
  },
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | '全て'>('全て');
  const [projectType, setProjectType] = useState<ProjectType>('公共工事');
  const { user } = useAuthStore();

  // 承認待ち件数の計算
  const getPendingApprovalsCount = () => {
    if (!user) return 0;

    // ユーザーの権限に応じて承認待ち件数を計算
    switch (user.role) {
      case '管理部長':
        return mockPendingBudgets.filter(b => b.status === '承認待ち（管理部長）').length;
      case '常務':
        return mockPendingBudgets.filter(b => b.status === '承認待ち（常務）').length;
      case '社長':
        return mockPendingBudgets.filter(b => b.status === '承認待ち（社長）').length;
      default:
        return 0; // メンバー・経理は承認権限なし
    }
  };

  const pendingCount = getPendingApprovalsCount();
  const shouldShowBanner = pendingCount > 0;

  // フィルタリング処理
  const filteredProjects = dummyProjects.filter((project) => {
    const matchesSearch =
      project.projectName.includes(searchTerm) ||
      project.projectNumber.includes(searchTerm) ||
      project.orderReceiver.includes(searchTerm);
    const matchesStatus = statusFilter === '全て' || project.status === statusFilter;
    // 現在は全てを公共工事として表示（将来的にprojectTypeフィールドで判定）
    return matchesSearch && matchesStatus;
  });

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
      <div className="p-4 md:p-8">
        {/* ヘッダー */}
        <div className="mb-4 md:mb-6">
          {/* PC表示 */}
          <div className="hidden md:flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">工事一覧</h1>
              <p className="text-sm text-gray-600 mt-1">工事情報の管理と各機能へのアクセス</p>
            </div>
            {/* メンバー以外はボタンを表示 */}
            {user?.role !== 'メンバー' && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    alert(`フィルター適用後の${filteredProjects.length}件の工事台帳をダウンロードします。\n\n※この機能は将来実装予定です。`);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  工事台帳一括ダウンロード
                </button>
                <Link
                  href="/projects/new"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + 新規工事登録
                </Link>
              </div>
            )}
          </div>

          {/* スマホ表示 */}
          <div className="md:hidden mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-2">工事一覧</h1>
            {/* メンバー・承認者（社長・常務・管理部長）以外はボタンを表示 */}
            {user?.role !== 'メンバー' && !['社長', '常務', '管理部長'].includes(user?.role || '') && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    alert(`フィルター適用後の${filteredProjects.length}件の工事台帳をダウンロードします。\n\n※この機能は将来実装予定です。`);
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  工事台帳一括ダウンロード
                </button>
                <Link
                  href="/projects/new"
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  + 新規工事登録
                </Link>
              </div>
            )}
          </div>

          {/* 承認待ちバナー */}
          {shouldShowBanner && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600 mr-2 md:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      承認待ち {pendingCount}件
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      あなたの承認が必要な実行予算書があります
                    </p>
                  </div>
                </div>
                <Link
                  href="/approvals"
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  確認する
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* タブ */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setProjectType('公共工事')}
              className={`flex-1 md:flex-none px-4 md:px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                projectType === '公共工事'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              公共工事
            </button>
            <button
              onClick={() => setProjectType('民間工事')}
              className={`flex-1 md:flex-none px-4 md:px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                projectType === '民間工事'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              民間工事
            </button>
          </div>

          {/* 検索・フィルター */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="工事名、工事番号、発注者で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '全て')}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="全て">全てのステータス</option>
                <option value="準備中">準備中</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
                <option value="保留">保留</option>
              </select>
            </div>
          </div>
        </div>

        {/* 工事一覧 - PC表示（テーブル） */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NO
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工事番号
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工事名
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  受注者
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工期
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  受注金額
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  進捗率
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '1%' }}>
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.no}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {project.projectNumber}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {project.projectName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.orderReceiver}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.startDate} 〜 {project.endDate}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    ¥{project.contractAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500" style={{ width: '1%' }}>
                    <div className="flex gap-2 justify-start">
                      <Link
                        href={`/projects/${project.id}`}
                        className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors whitespace-nowrap"
                      >
                        詳細
                      </Link>
                      <Link
                        href={`/budgets/${project.id}`}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors whitespace-nowrap"
                      >
                        実行予算書
                      </Link>
                      <Link
                        href={`/estimates/${project.id}`}
                        className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors whitespace-nowrap"
                      >
                        見積書
                      </Link>
                      {/* メンバー以外は工事台帳ボタンを表示 */}
                      {user?.role !== 'メンバー' && (
                        <Link
                          href={`/ledgers/${project.id}`}
                          className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors whitespace-nowrap"
                        >
                          工事台帳
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* データがない場合 */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">該当する工事が見つかりません</p>
            </div>
          )}
        </div>

        {/* 工事一覧 - スマホ表示（カード） */}
        <div className="md:hidden space-y-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-4">
              {/* 工事名とステータス */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {project.projectName}
                  </h3>
                  <p className="text-sm text-gray-600">{project.projectNumber}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              {/* 基本情報 */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">受注者</span>
                  <span className="font-medium text-gray-900">{project.orderReceiver}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">受注金額</span>
                  <span className="font-medium text-gray-900">¥{project.contractAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">工期</span>
                  <span className="font-medium text-gray-900 text-right text-xs">{project.startDate} 〜 {project.endDate}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">進捗率</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 操作ボタン */}
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href={`/projects/${project.id}`}
                  className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors text-center"
                >
                  詳細
                </Link>
                <Link
                  href={`/budgets/${project.id}`}
                  className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors text-center"
                >
                  実行予算書
                </Link>
                <Link
                  href={`/estimates/${project.id}`}
                  className="px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors text-center"
                >
                  見積書
                </Link>
              </div>
            </div>
          ))}

          {/* データがない場合 */}
          {filteredProjects.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">該当する工事が見つかりません</p>
            </div>
          )}
        </div>

        {/* ページネーション（将来的に実装） */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            全 <span className="font-medium">{filteredProjects.length}</span> 件中{' '}
            <span className="font-medium">{filteredProjects.length}</span> 件を表示
          </p>
          <div className="flex gap-2">
            {/* ページネーションボタンは将来的に実装 */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
