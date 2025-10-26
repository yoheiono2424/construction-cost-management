'use client';

import Layout from '@/app/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { useEffect } from 'react';

type StaffRole = '社長' | '常務' | '部長' | '管理者' | '案件登録者' | '現場メンバー';
type Department = '建設' | '経理';

interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  department: Department;
  lastLogin?: string;
  createdAt: string;
}

export default function StaffPage() {
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // 権限チェック：現場メンバーはアクセス不可
  useEffect(() => {
    if (!currentUser || currentUser.role === '現場メンバー') {
      router.push('/projects');
    }
  }, [currentUser, router]);

  const [staffList] = useState<Staff[]>([
    {
      id: '1',
      name: '山田太郎',
      email: 'yamada@example.com',
      role: '社長',
      department: '建設',
      lastLogin: '2025/01/19 10:30',
      createdAt: '2024/04/01',
    },
    {
      id: '2',
      name: '佐藤花子',
      email: 'sato@example.com',
      role: '常務',
      department: '建設',
      lastLogin: '2025/01/19 09:15',
      createdAt: '2024/04/15',
    },
    {
      id: '3',
      name: '鈴木三郎',
      email: 'suzuki@example.com',
      role: '部長',
      department: '建設',
      lastLogin: '2025/01/18 16:45',
      createdAt: '2024/05/01',
    },
    {
      id: '4',
      name: '田中花子',
      email: 'tanaka@example.com',
      role: '管理者',
      department: '経理',
      lastLogin: '2025/01/17 14:20',
      createdAt: '2024/06/01',
    },
    {
      id: '5',
      name: '高橋五郎',
      email: 'takahashi@example.com',
      role: '案件登録者',
      department: '建設',
      lastLogin: '2025/01/19 13:15',
      createdAt: '2024/07/01',
    },
    {
      id: '6',
      name: '伊藤六郎',
      email: 'ito@example.com',
      role: '現場メンバー',
      department: '建設',
      lastLogin: '2024/12/20 11:30',
      createdAt: '2024/08/01',
    },
  ]);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: '現場メンバー' as StaffRole,
    department: '建設' as Department,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // 管理者権限チェック（社長・常務・部長・管理者が編集可能）
  const canManageStaff = currentUser?.role === '社長' ||
                         currentUser?.role === '常務' ||
                         currentUser?.role === '部長' ||
                         currentUser?.role === '管理者';

  const filteredStaffList = staffList.filter(staff => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleAddStaff = () => {
    console.log('Adding staff:', newStaff);
    setShowAddModal(false);
    setNewStaff({
      name: '',
      email: '',
      password: '',
      role: '現場メンバー',
      department: '建設',
    });
  };

  const handleEditStaff = () => {
    console.log('Editing staff:', selectedStaff);
    setShowEditModal(false);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (confirm('このスタッフを削除してもよろしいですか？')) {
      console.log('Deleting staff:', staffId);
    }
  };

  const getRoleBadge = (role: StaffRole) => {
    const colors: Record<StaffRole, string> = {
      '社長': 'bg-purple-100 text-purple-800',
      '常務': 'bg-indigo-100 text-indigo-800',
      '部長': 'bg-blue-100 text-blue-800',
      '管理者': 'bg-green-100 text-green-800',
      '案件登録者': 'bg-yellow-100 text-yellow-800',
      '現場メンバー': 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded ${colors[role]}`}>
        {role}
      </span>
    );
  };

  const getDepartmentBadge = (department: Department) => {
    return department === '建設' ? (
      <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">建設</span>
    ) : (
      <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded">経理</span>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">スタッフ管理</h1>
            <p className="text-sm text-gray-600 mt-1">スタッフの管理と権限設定</p>
          </div>
          {canManageStaff && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              スタッフ追加
            </button>
          )}
        </div>

        {/* 権限不足の警告 */}
        {!canManageStaff && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ 閲覧のみ可能です。スタッフの編集・削除には管理者権限が必要です。
            </p>
          </div>
        )}

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">検索</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="名前、メール、部署で検索"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">権限</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべて</option>
                <option value="社長">社長</option>
                <option value="常務">常務</option>
                <option value="部長">部長</option>
                <option value="管理者">管理者</option>
                <option value="案件登録者">案件登録者</option>
                <option value="現場メンバー">現場メンバー</option>
              </select>
            </div>
          </div>
        </div>

        {/* スタッフ一覧 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  スタッフ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メールアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部署
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  権限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終ログイン
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {staff.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                        <div className="text-xs text-gray-500">ID: {staff.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getDepartmentBadge(staff.department)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(staff.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.lastLogin || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {canManageStaff ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedStaff(staff);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            削除
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStaffList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">該当するスタッフがありません</p>
            </div>
          )}
        </div>
      </div>

      {/* スタッフ追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">新規スタッフ追加</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">初期パスワード</label>
                <input
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">部署</label>
                <select
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value as Department })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="建設">建設</option>
                  <option value="経理">経理</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">権限</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as StaffRole })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="社長">社長</option>
                  <option value="常務">常務</option>
                  <option value="部長">部長</option>
                  <option value="管理者">管理者</option>
                  <option value="案件登録者">案件登録者</option>
                  <option value="現場メンバー">現場メンバー</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddStaff}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* スタッフ編集モーダル */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">スタッフ編集</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                <input
                  type="text"
                  defaultValue={selectedStaff.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                <input
                  type="email"
                  defaultValue={selectedStaff.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">部署</label>
                <select
                  defaultValue={selectedStaff.department}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="建設">建設</option>
                  <option value="経理">経理</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">権限</label>
                <select
                  defaultValue={selectedStaff.role}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="社長">社長</option>
                  <option value="常務">常務</option>
                  <option value="部長">部長</option>
                  <option value="管理者">管理者</option>
                  <option value="案件登録者">案件登録者</option>
                  <option value="現場メンバー">現場メンバー</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleEditStaff}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                更新
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}