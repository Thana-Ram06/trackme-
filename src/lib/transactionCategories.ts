export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
] as const;

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Subscription",
  "Health",
  "Other",
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
