'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';

// 労務費入力の1行
interface LaborEntry {
  id: string;
  projectName: string;
  days: number;
  description: string;
}

// ダミーの工事一覧データ
const dummyProjects = [
  '○○ビル新築工事',
  '△△マンション改修工事',
  '□□工場建設工事',
  '××商業施設改装工事',
  '◇◇住宅新築工事',
];

// ダミーの従業員一覧
const dummyEmployees = [
  { id: '1', name: '山田太郎' },
  { id: '2', name: '佐藤花子' },
  { id: '3', name: '鈴木一郎' },
  { id: '4', name: '田中美咲' },
];

export default function NewLaborEntryPage() {
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [targetMonth, setTargetMonth] = useState('2025-09');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [searchingRowId, setSearchingRowId] = useState<string | null>(null);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');

  // 初期状態で1行追加
  const [entries, setEntries] = useState<LaborEntry[]>([
    { id: '1', projectName: '', days: 0, description: '' },
  ]);

  // 行追加
  const addRow = () => {
    if (entries.length >= 50) {
      alert('最大50行まで追加できます');
      return;
    }
    const newId = String(entries.length + 1);
    setEntries([...entries, { id: newId, projectName: '', days: 0, description: '' }]);
  };

  // 行削除
  const removeRow = (id: string) => {
    if (entries.length === 1) {
      alert('最低1行は必要です');
      return;
    }
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  // 入力値変更
  const updateEntry = (id: string, field: keyof LaborEntry, value: string | number) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // 合計計算
  const totalDays = entries.reduce((sum, entry) => sum + entry.days, 0);
  const totalCost = totalDays * 15000;

  // 保存処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!selectedEmployee) {
      alert('従業員を選択してください');
      return;
    }

    const hasEmptyProject = entries.some((entry) => !entry.projectName);
    if (hasEmptyProject) {
      alert('すべての行で現場名を選択してください');
      return;
    }

    const hasZeroDays = entries.some((entry) => entry.days <= 0);
    if (hasZeroDays) {
      alert('すべての行で日数を入力してください');
      return;
    }

    // 保存処理（将来的にバックエンド連携）
    console.log('保存データ:', {
      employeeId: selectedEmployee,
      targetMonth,
      entries,
      totalDays,
      totalCost,
    });

    alert('労務費を登録しました');
    router.push('/labor');
  };

  const handleCancel = () => {
    router.push('/labor');
  };

  const handleOpenProjectSearch = (id: string) => {
    setSearchingRowId(id);
    setProjectSearchTerm('');
    setIsProjectModalOpen(true);
  };

  const handleSelectProject = (projectName: string) => {
    if (searchingRowId !== null) {
      updateEntry(searchingRowId, 'projectName', projectName);
    }
    setIsProjectModalOpen(false);
    setSearchingRowId(null);
    setProjectSearchTerm('');
  };

  const filteredProjects = dummyProjects.filter(project =>
    project.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 戻る
            </button>
            <h1 className="text-2xl font-bold text-gray-900">新規労務費入力</h1>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              ℹ️ 従業員の月次労務費を一括入力します。現場名はプルダウンから選択し、日数は0.5日刻みで入力してください。
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 基本情報カード */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* 従業員選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  従業員 <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {dummyEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 対象月 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  対象月 <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  required
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 労務費入力テーブル */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">労務費明細</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      現場名（工事名） <span className="text-red-500">*</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      日数 <span className="text-red-500">*</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作業内容
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      労務費（自動計算）
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry, index) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={entry.projectName}
                            onChange={(e) => updateEntry(entry.id, 'projectName', e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="現場名"
                          />
                          <button
                            type="button"
                            onClick={() => handleOpenProjectSearch(entry.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                            title="現場を検索"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          required
                          min="0.5"
                          step="0.5"
                          value={entry.days || ''}
                          onChange={(e) => updateEntry(entry.id, 'days', parseFloat(e.target.value) || 0)}
                          placeholder="1.0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={entry.description}
                          onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                          placeholder="作業内容を入力"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ¥{(entry.days * 15000).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => removeRow(entry.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={6} className="px-4 py-3">
                      <button
                        type="button"
                        onClick={addRow}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        + 行を追加
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 合計表示 */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-end gap-8">
                <div className="text-right">
                  <p className="text-sm text-gray-600">合計日数</p>
                  <p className="text-xl font-bold text-blue-600">{totalDays.toFixed(1)}日</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">合計労務費</p>
                  <p className="text-xl font-bold text-green-600">¥{totalCost.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-2 text-right text-sm text-gray-500">
                単価：¥15,000/日（固定）
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              登録
            </button>
          </div>
        </form>
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
                    setSearchingRowId(null);
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
                    setSearchingRowId(null);
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
