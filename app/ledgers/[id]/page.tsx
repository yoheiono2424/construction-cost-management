'use client';

import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';

// モックデータ
const mockLedger = {
  id: '1',
  projectCode: 'C455-00',
  projectName: '○○ビル新築工事',
  startDate: '2023/01/01',
  endDate: '2025/09/30',
  createdDate: '2025/10/02',
  contractAmount: 1000000,
  totalCost: 1000000,
  tax: 100000,
  totalWithTax: 1100000,
  progressRate: 0,
  details: [
    // 明細データは打ち合わせ後に決定
  ]
};

export default function LedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // paramsは将来的にデータ取得で使用予定（現在はモックデータのため未使用）
  void params;

  return (
    <Layout>
      <div className="p-8">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← 戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-900">工事台帳</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            PDF出力
          </button>
        </div>

        {/* 台帳本体 */}
        <div className="bg-white rounded-lg shadow p-8">
          {/* 上部情報 */}
          <div className="flex justify-between mb-6 items-start">
            {/* 左上：工事情報テーブル */}
            <div className="border border-gray-900" style={{ width: '400px' }}>
              <table className="w-full text-xs">
                <tbody>
                  {/* 工事番号・工事名 */}
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100" style={{ width: '25%' }}>工事番号</td>
                    <td className="border-r border-gray-900 px-2 py-1" style={{ width: '25%' }}>{mockLedger.projectCode}</td>
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100" style={{ width: '15%' }}>TEL</td>
                    <td className="px-2 py-1" style={{ width: '35%' }}></td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100">工事名</td>
                    <td className="px-2 py-1" colSpan={3}>見本</td>
                  </tr>
                  {/* 工事場所 */}
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100">工事場所</td>
                    <td className="px-2 py-1" colSpan={3}></td>
                  </tr>
                  {/* 発注者 */}
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100">発注者</td>
                    <td className="px-2 py-1" colSpan={3}>個人様</td>
                  </tr>
                  {/* 予定工期 */}
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100">予定工期</td>
                    <td className="px-2 py-1" colSpan={3}>
                      <span className="mr-8">年　月　日　〜</span>
                      <span>年　月　日</span>
                    </td>
                  </tr>
                  {/* 実際工期 */}
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100">実際工期</td>
                    <td className="px-2 py-1" colSpan={3}>
                      <span className="mr-8">年　月　日　〜</span>
                      <span>年　月　日</span>
                    </td>
                  </tr>
                  {/* 現場担当者・営業担当者 */}
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100">現場担当者</td>
                    <td className="border-r border-gray-900 px-2 py-1"></td>
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100">営業担当者</td>
                    <td className="px-2 py-1"></td>
                  </tr>
                  {/* 備考 */}
                  <tr>
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100">備考</td>
                    <td className="px-2 py-1" colSpan={3}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 実行予算テーブル */}
            <div className="border border-gray-900" style={{ width: '220px' }}>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center" style={{ width: '45%' }}>材料費</td>
                    <td className="px-2 py-1 text-center" style={{ width: '55%' }}>0</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">労務費</td>
                    <td className="px-2 py-1 text-center">0</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">外注費</td>
                    <td className="px-2 py-1 text-center">0</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">経費</td>
                    <td className="px-2 py-1 text-center">0</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">計</td>
                    <td className="px-2 py-1 text-center">0</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">原価</td>
                    <td className="px-2 py-1 text-center">0</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">消費税</td>
                    <td className="px-2 py-1 text-center">0</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">粗利</td>
                    <td className="px-2 py-1 text-center">0</td>
                  </tr>
                  <tr>
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">粗利率</td>
                    <td className="px-2 py-1 text-center">
                      <span>0</span>
                      <span className="ml-2">%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 契約金額テーブル */}
            <div className="border border-gray-900" style={{ width: '220px' }}>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center" style={{ width: '50%' }}>契約日</td>
                    <td className="px-2 py-1 font-medium bg-gray-100 text-center" style={{ width: '50%' }}>契約金額</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 text-center">R07/09/01</td>
                    <td className="px-2 py-1 text-right">1,000,000</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="px-2 py-1" colSpan={2} style={{ height: '28px' }}></td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="px-2 py-1" colSpan={2} style={{ height: '28px' }}></td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">税抜合計</td>
                    <td className="px-2 py-1 text-right">1,000,000</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">消費税</td>
                    <td className="px-2 py-1 text-right">100,000</td>
                  </tr>
                  <tr>
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">税込合計</td>
                    <td className="px-2 py-1 text-right">1,100,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 入金履歴テーブル */}
            <div className="border border-gray-900" style={{ width: '280px' }}>
              <table className="w-full text-xs">
                <tbody>
                  {/* ヘッダー行 */}
                  <tr className="border-b border-gray-900">
                    <td className="px-2 py-1 font-medium bg-gray-100 text-center" colSpan={2}>入金履歴</td>
                  </tr>
                  {/* 空行×6 */}
                  {[...Array(6)].map((_, index) => (
                    <tr key={index} className="border-b border-gray-900">
                      <td className="border-r border-gray-900 px-2 py-1" style={{ width: '50%', height: '28px' }}></td>
                      <td className="px-2 py-1" style={{ width: '50%', height: '28px' }}></td>
                    </tr>
                  ))}
                  {/* 入金合計行 */}
                  <tr>
                    <td className="border-r border-gray-900 px-2 py-1 font-medium bg-gray-100 text-center">入金合計</td>
                    <td className="px-2 py-1 text-right">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 明細テーブル（大きなグリッド） */}
          <div className="border border-gray-900 mt-8">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-900">
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '6%' }}>日付</th>
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '10%' }}>工種名</th>
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '12%' }}>仕入先名</th>
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '18%' }}>名　　称</th>
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '12%' }}>仕　　様</th>
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '7%' }}>数　量</th>
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '5%' }}>単位</th>
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '8%' }}>材料費</th>
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '8%' }}>労務費</th>
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '8%' }}>外注費</th>
                  <th className="border-r border-gray-900 px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '8%' }}>経　費</th>
                  <th className="px-2 py-2 font-medium bg-gray-100 text-center" style={{ width: '8%' }}>合　計</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(30)].map((_, index) => (
                  <tr key={index} className={`border-b border-gray-900 ${index % 2 === 1 ? 'bg-gray-200' : ''}`}>
                    <td className="border-r border-gray-900 px-2 py-1.5" style={{ height: '32px' }}></td>
                    <td className="border-r border-gray-900 px-2 py-1.5"></td>
                    <td className="border-r border-gray-900 px-2 py-1.5"></td>
                    <td className="border-r border-gray-900 px-2 py-1.5"></td>
                    <td className="border-r border-gray-900 px-2 py-1.5"></td>
                    <td className="border-r border-gray-900 px-2 py-1.5"></td>
                    <td className="border-r border-gray-900 px-2 py-1.5"></td>
                    <td className="border-r border-gray-900 px-2 py-1.5"></td>
                    <td className="border-r border-gray-900 px-2 py-1.5"></td>
                    <td className="border-r border-gray-900 px-2 py-1.5"></td>
                    <td className="border-r border-gray-900 px-2 py-1.5"></td>
                    <td className="px-2 py-1.5"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
