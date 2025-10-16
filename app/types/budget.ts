export interface BudgetItem {
  id: string;
  name: string;
  specification: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  supplier: string;
  remarks: string;
}

export interface BudgetSection {
  materials: BudgetItem[];
  labor: BudgetItem[];
  outsourcing: BudgetItem[];
  expenses: BudgetItem[];
}

// 実行予算書のステータス（2回の承認フロー対応）
export type BudgetStatus =
  // 第1回承認フロー関連
  | 'draft'                    // 下書き
  | 'pending_manager'          // 承認待ち（管理部長）
  | 'pending_director'         // 承認待ち（常務）
  | 'pending_president'        // 承認待ち（社長）
  | 'rejected'                 // 却下
  // 工事進行中
  | 'in_progress'              // 進行中
  // 第2回承認フロー関連
  | 'final_pending_manager'    // 最終承認待ち（管理部長）
  | 'final_pending_director'   // 最終承認待ち（常務）
  | 'final_pending_president'  // 最終承認待ち（社長）
  | 'final_rejected'           // 最終却下
  // 完了
  | 'completed'                // 完了
  // 変更申請関連
  | 'change_request';          // 変更申請中

export interface Budget {
  id: string;
  projectName: string;
  client: string;
  location: string;
  period: {
    start: string;
    end: string;
  };
  totalAmount: number;
  sections: BudgetSection;
  tax: number;
  grossProfit: number;
  grossProfitRate: number;
  status: BudgetStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}