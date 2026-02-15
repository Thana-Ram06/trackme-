export type Subscription = {
  id: string;
  name: string;
  price: number;
  currency?: string;
  renewalDate: string;
  renewalInterval?: string;
  createdAt?: string;
};
