// 見積書明細アイテム
export interface EstimateItem {
  id: string;
  name: string; // 品名
  specification: string; // 規格
  unit: string; // 単位
  quantity: number; // 数量
  unitPrice: number; // 単価
  subtotal: number; // 小計（自動計算）
  isSubcontracting: boolean; // 外注費用フラグ（実行予算書への反映時に使用）
}

// プレビューモード（工事内訳書 or 見積書）
export type PreviewMode = 'breakdown' | 'quote';

// 見積書のステータス
export type EstimateStatus = 'draft' | 'confirmed' | 'reflected';

// 見積書メインデータ（工事内訳書ベース）
export interface Estimate {
  id: string;
  projectId: string;
  estimateNumber: string; // 見積書番号（例：EST-20251024-001）
  createdAt: string; // 作成日
  updatedAt: string; // 更新日
  validUntil?: string; // 有効期限
  status: EstimateStatus; // 下書き / 確定 / 実行予算へ反映済み
  remarks?: string; // 備考

  // 明細データ（2費目のみ）
  materials: EstimateItem[]; // 材料費
  laborAndConstruction: EstimateItem[]; // 工事費および人件費（労務費）

  // 金額サマリー（自動計算）
  materialsTotal: number;
  laborAndConstructionTotal: number;
  subtotal: number; // 小計
  discount: number; // 値引き
  discountLabel: string; // 値引き名称（デフォルト：値引き）
  discountedSubtotal: number; // 値引後小計
  tax: number; // 消費税
  total: number; // 合計
}
