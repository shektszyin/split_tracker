export type User = 'User A' | 'User B';

export type Category = string;

export interface CategoryItem {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  paidBy: User;
  date: string;
}

export interface SummaryStats {
  total: number;
  totalA: number;
  totalB: number;
  settlement: {
    debtor: User;
    creditor: User;
    amount: number;
  };
}
