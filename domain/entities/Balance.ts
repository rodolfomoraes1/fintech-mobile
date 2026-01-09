export interface Balance {
  id: string;
  userId: string;
  currentBalance: number;
  date: string;
  createdAt: string;
}

export interface CreateBalanceInput {
  userId: string;
  currentBalance: number;
}
