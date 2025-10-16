// 見積書明細アイテム
export interface EstimateItem {
  id: string;
  name: string; // 品名
  specification: string; // 規格
  unit: string; // 単位
  quantity: number; // 数量
  unitPrice: number; // 単価
  subtotal: number; // 小計（自動計算）
}

// 見積書の4費目セクション
export interface EstimateSection {
  materials: EstimateItem[]; // 材料費
  labor: EstimateItem[]; // 労務費
  outsourcing: EstimateItem[]; // 外注費
  expenses: EstimateItem[]; // 諸経費
}

// 見積書のステータス
export type EstimateStatus = 'draft' | 'confirmed' | 'reflected';

// 見積書メインデータ
export interface Estimate {
  id: string;
  projectId: string;
  estimateNumber: string; // 見積書番号（例：EST-2025-001）
  createdAt: string; // 作成日
  updatedAt: string; // 更新日
  validUntil?: string; // 有効期限
  status: EstimateStatus; // 下書き / 確定 / 実行予算へ反映済み
  remarks?: string; // 備考

  // 明細データ
  materials: EstimateItem[];
  labor: EstimateItem[];
  outsourcing: EstimateItem[];
  expenses: EstimateItem[];

  // 金額サマリー（自動計算）
  materialsTotal: number;
  laborTotal: number;
  outsourcingTotal: number;
  expensesTotal: number;
  subtotal: number; // 小計
  tax: number; // 消費税
  total: number; // 合計
}
