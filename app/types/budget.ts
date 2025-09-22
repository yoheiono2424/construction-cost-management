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
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}