<<<<<<< HEAD
export type User = string;
=======
export type User = 'User A' | 'User B';
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1

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
<<<<<<< HEAD
}
=======
}
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1
