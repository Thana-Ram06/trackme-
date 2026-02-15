export type Subscription = {
  id: string;
  name: string;
  price: number;
  currency?: string;
  renewalDate: string;
  renewalInterval?: string;
  /** Next payment due date (YYYY-MM-DD). When set, used for "due" logic. */
  nextDueDate?: string;
  /** True when user has marked this cycle as paid. */
  isPaidThisCycle?: boolean;
  /** Last paid date (YYYY-MM-DD). */
  lastPaidDate?: string;
  createdAt?: string;
};
