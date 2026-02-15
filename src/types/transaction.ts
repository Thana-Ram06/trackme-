export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: string;
  /** ISO date string from Firestore timestamp */
  date: string;
  createdAt?: string;
};
