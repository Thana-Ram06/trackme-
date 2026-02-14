export type BillingCycle = "monthly" | "yearly";

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  nextRenewalDate: string;
  createdAt?: string;
};

