'use client';

import Layout from '@/app/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/app/stores/authStore';
import { useEffect } from 'react';

interface Invoice {
  id: string;
  type: 'construction' | 'other'; // 工事請求書 or その他請求書
  invoiceNumber: string;
  qualifiedInvoiceNumber: string;
  supplier: string;
  siteName?: string;      // 工事請求書の場合（現場名）
  projectName?: string;   // その他請求書の場合（案件名）
  amount: number;
  invoiceDate: string;
  dueDate: string;
  status: 'pending' | 'exported' | 'overdue';
}

export default function InvoicesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<'all' | 'construction' | 'other'>('all');
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dueDateFrom, setDueDateFrom] = useState('');
  const [dueDateTo, setDueDateTo] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);

  // 権限チェック：現場メンバーはアクセス不可
  useEffect(() => {
    if (!user || user.role === '現場メンバー') {
      router.push('/projects');
    }
  }, [user, router]);

  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      type: 'construction',
      invoiceNumber: 'INV-2025-001',
      qualifiedInvoiceNumber: 'T1234567890123',
      supplier: '株式会社A建設',
      siteName: 'B工場増築工事',
      amount: 1650000,
      invoiceDate: '2025/01/15',
      dueDate: '2025/02/15',
      status: 'pending',
    },
    {
      id: '2',
      type: 'construction',
      invoiceNumber: 'B-202501-123',
      qualifiedInvoiceNumber: 'T9876543210987',
      supplier: 'B工業株式会社',
      siteName: 'C店舗新装工事',
      amount: 880000,
      invoiceDate: '2025/01/14',
      dueDate: '2025/02/14',
      status: 'exported',
    },
    {
      id: '3',
      type: 'construction',
      invoiceNumber: 'C-2501-45',
      qualifiedInvoiceNumber: 'T5555666677778',
      supplier: 'C商事株式会社',
      siteName: 'A工事現場改修工事',
      amount: 2200000,
      invoiceDate: '2025/01/10',
      dueDate: '2025/02/10',
      status: 'pending',
    },
    {
      id: '4',
      type: 'construction',
      invoiceNumber: 'D-25-001',
      qualifiedInvoiceNumber: 'T1111222233334',
      supplier: 'D建材株式会社',
      siteName: 'D住宅リフォーム',
      amount: 550000,
      invoiceDate: '2025/01/08',
      dueDate: '2025/02/08',
      status: 'pending',
    },
    {
      id: '5',
      type: 'construction',
      invoiceNumber: 'E-202501',
      qualifiedInvoiceNumber: 'T9999888877776',
      supplier: 'E設備株式会社',
      siteName: 'E施設改修工事',
      amount: 3300000,
      invoiceDate: '2025/01/05',
      dueDate: '2025/01/31',
      status: 'overdue',
    },
    {
      id: '6',
      type: 'other',
      invoiceNumber: 'CAR-2025-001',
      qualifiedInvoiceNumber: 'T1234567890999',
      supplier: '株式会社Fカーリース',
      projectName: '営業車両リース',
      amount: 450000,
      invoiceDate: '2025/01/12',
      dueDate: '2025/02/12',
      status: 'pending',
    },
    {
      id: '7',
      type: 'other',
      invoiceNumber: 'OUT-2025-123',
      qualifiedInvoiceNumber: 'T9876543210111',
      supplier: 'G運送株式会社',
      projectName: '物流業務委託',
      amount: 320000,
      invoiceDate: '2025/01/09',
      dueDate: '2025/02/09',
      status: 'pending',
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const filteredInvoices = invoices.filter(invoice => {
    // タブフィルター
    const matchesTab = selectedTab === 'all' || invoice.type === selectedTab;

    const matchesSearch =
      invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.siteName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (invoice.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    // 対象月フィルター
    let matchesMonth = true;
    if (selectedMonth) {
      const invoiceDate = new Date(invoice.dueDate);
      const [year, month] = selectedMonth.split('-');
      matchesMonth = invoiceDate.getFullYear() === parseInt(year) &&
                     invoiceDate.getMonth() === parseInt(month) - 1;
    }

    // 支払期限フィルター（対象月内での日付絞り込み）
    let matchesDueDate = true;
    if (dueDateFrom || dueDateTo) {
      const invoiceDueDate = new Date(invoice.dueDate);
      if (dueDateFrom) {
        const fromDate = new Date(dueDateFrom);
        matchesDueDate = matchesDueDate && invoiceDueDate >= fromDate;
      }
      if (dueDateTo) {
        const toDate = new Date(dueDateTo);
        matchesDueDate = matchesDueDate && invoiceDueDate <= toDate;
      }
    }

    return matchesTab && matchesSearch && matchesStatus && matchesMonth && matchesDueDate;
  });

  // チェックボックス選択機能
  const handleSelectAll = () => {
    if (selectedItems.length === filteredInvoices.filter(i => i.status === 'pending').length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInvoices.filter(i => i.status === 'pending').map(i => i.id));
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleExportCSV = () => {
    // CSV出力処理
    console.log('Exporting CSV for items:', selectedItems);
    setShowExportModal(false);
    setSelectedItems([]);
    // 実際はステータスを'exported'に変更
  };

  // 統計カード計算
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = filteredInvoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const exportedAmount = filteredInvoices.filter(i => i.status === 'exported').reduce((sum, i) => sum + i.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">未処理</span>;
      case 'exported':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">CSV出力済</span>;
      case 'overdue':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">期限超過</span>;
      default:
        return null;
    }
  };


  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">請求・支払管理</h1>
            <p className="text-sm text-gray-600 mt-1">請求書の管理と支払データの出力</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/invoices/upload?type=construction"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              工事請求書アップロード
            </Link>
            <Link
              href="/invoices/upload?type=other"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              その他請求書アップロード
            </Link>
          </div>
        </div>

        {/* タブ */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-6 py-3 font-medium transition-all ${
              selectedTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setSelectedTab('construction')}
            className={`px-6 py-3 font-medium transition-all ${
              selectedTab === 'construction'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            工事
          </button>
          <button
            onClick={() => setSelectedTab('other')}
            className={`px-6 py-3 font-medium transition-all ${
              selectedTab === 'other'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            その他
          </button>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">未処理</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              ¥{pendingAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">未処理分</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">CSV出力済み</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              ¥{exportedAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">出力済み分</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">合計金額</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ¥{totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">全請求書</p>
          </div>
        </div>

        {/* フィルター・CSVエクスポート */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">対象月</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">支払期限（開始）</label>
                <input
                  type="date"
                  value={dueDateFrom}
                  onChange={(e) => setDueDateFrom(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">支払期限（終了）</label>
                <input
                  type="date"
                  value={dueDateTo}
                  onChange={(e) => setDueDateTo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <button
                onClick={() => setShowExportModal(true)}
                disabled={selectedItems.length === 0}
                className={`px-4 py-2 rounded-md ${
                  selectedItems.length > 0
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                CSVエクスポート ({selectedItems.length}件)
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">検索</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="請求書番号、取引先、現場名で検索"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">すべて</option>
                <option value="pending">未処理</option>
                <option value="exported">CSV出力済</option>
                <option value="overdue">期限超過</option>
              </select>
            </div>
          </div>
        </div>

        {/* 請求書一覧テーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === filteredInvoices.filter(i => i.status === 'pending').length && filteredInvoices.filter(i => i.status === 'pending').length > 0}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  種別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求書番号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  適格請求番号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  取引先
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  現場名/案件名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支払期限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLInputElement).type !== 'checkbox') {
                      router.push(`/invoices/${invoice.id}`);
                    }
                  }}
                >
                  <td className="px-6 py-4">
                    {invoice.status === 'pending' && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(invoice.id)}
                        onChange={() => handleSelectItem(invoice.id)}
                        className="rounded border-gray-300"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      invoice.type === 'construction'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {invoice.type === 'construction' ? '工事' : 'その他'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.qualifiedInvoiceNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.type === 'construction' ? invoice.siteName : invoice.projectName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">¥{invoice.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.invoiceDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${new Date(invoice.dueDate) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                      {invoice.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">該当する請求書がありません</p>
            </div>
          )}
        </div>

        {/* CSVエクスポート確認モーダル */}
        {showExportModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CSVエクスポート確認</h3>
              <p className="text-sm text-gray-600 mb-4">
                選択した{selectedItems.length}件の請求書データをCSV形式でエクスポートします。
                エクスポート後、ステータスが「CSV出力済み」に変更されます。
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  エクスポート
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}