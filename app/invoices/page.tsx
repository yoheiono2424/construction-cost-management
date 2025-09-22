'use client';

import Layout from '@/app/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/app/stores/authStore';
import { useEffect } from 'react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  site: string;
  amount: number;
  invoiceDate: string;
  dueDate: string;
  status: 'unconfirmed' | 'confirmed' | 'paid' | 'overdue';
  ocrStatus: 'pending' | 'completed' | 'error';
}

export default function InvoicesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [viewMode, setViewMode] = useState<'month' | 'all'>('month');
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2025-001',
      supplier: '株式会社A建設',
      site: 'B工場増築工事',
      amount: 1650000,
      invoiceDate: '2025/01/15',
      dueDate: '2025/02/15',
      status: 'confirmed',
      ocrStatus: 'completed'
    },
    {
      id: '2',
      invoiceNumber: 'B-202501-123',
      supplier: 'B工業株式会社',
      site: 'C店舗新装工事',
      amount: 880000,
      invoiceDate: '2025/01/14',
      dueDate: '2025/02/14',
      status: 'paid',
      ocrStatus: 'completed'
    },
    {
      id: '3',
      invoiceNumber: 'C-2501-45',
      supplier: 'C商事株式会社',
      site: 'A工事現場改修工事',
      amount: 2200000,
      invoiceDate: '2025/01/10',
      dueDate: '2025/02/10',
      status: 'confirmed',
      ocrStatus: 'completed'
    },
    {
      id: '4',
      invoiceNumber: 'D-25-001',
      supplier: 'D建材株式会社',
      site: 'D住宅リフォーム',
      amount: 550000,
      invoiceDate: '2025/01/08',
      dueDate: '2025/02/08',
      status: 'unconfirmed',
      ocrStatus: 'pending'
    },
    {
      id: '5',
      invoiceNumber: 'E-202501',
      supplier: 'E設備株式会社',
      site: 'E施設改修工事',
      amount: 3300000,
      invoiceDate: '2025/01/05',
      dueDate: '2025/01/31',
      status: 'overdue',
      ocrStatus: 'completed'
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.site.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unconfirmed':
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">未確認</span>;
      case 'confirmed':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">確認済み</span>;
      case 'paid':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">支払済み</span>;
      case 'overdue':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">期限超過</span>;
      default:
        return null;
    }
  };

  const getOcrStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">処理中</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">完了</span>;
      case 'error':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">エラー</span>;
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
            <h1 className="text-2xl font-bold text-gray-900">請求書一覧</h1>
            <p className="text-sm text-gray-600 mt-1">請求書の管理と支払状況の確認</p>
          </div>
          <div className="space-x-2">
            <Link
              href="/invoices/upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              アップロード
            </Link>
            <Link
              href="/invoices/check"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              確認・修正
            </Link>
          </div>
        </div>

        {/* 表示モード切り替え */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-md ${
                  viewMode === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                月別表示
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-md ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                まとめて表示
              </button>
            </div>
            {viewMode === 'month' && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
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
                <option value="unconfirmed">未確認</option>
                <option value="confirmed">確認済み</option>
                <option value="paid">支払済み</option>
                <option value="overdue">期限超過</option>
              </select>
            </div>
          </div>
        </div>

        {/* 月別表示 */}
        {viewMode === 'month' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    請求書番号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    取引先
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    現場
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OCR状況
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/invoices/${invoice.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.site}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">¥{invoice.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.invoiceDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.dueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOcrStatusBadge(invoice.ocrStatus)}
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
        )}

        {/* まとめて表示 */}
        {viewMode === 'all' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    請求書番号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    取引先
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    現場
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OCR状況
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/invoices/${invoice.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.site}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">¥{invoice.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.invoiceDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.dueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOcrStatusBadge(invoice.ocrStatus)}
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
        )}
      </div>
    </Layout>
  );
}