/** Renewal cycle options for subscription form. Stored as renewalInterval in Firestore. */
export const RENEWAL_CYCLES = [
  { value: "1 Month", months: 1 },
  { value: "2 Months", months: 2 },
  { value: "3 Months", months: 3 },
  { value: "4 Months", months: 4 },
  { value: "5 Months", months: 5 },
  { value: "6 Months", months: 6 },
  { value: "11 Months", months: 11 },
  { value: "1 Year", months: 12 },
  { value: "2 Years", months: 24 },
  { value: "3 Years", months: 36 },
] as const;

/** Top 10 currencies: code and symbol. Stored as currency in Firestore. */
export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "INR", symbol: "₹" },
  { code: "GBP", symbol: "£" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
  { code: "SGD", symbol: "S$" },
  { code: "AED", symbol: "د.إ" },
  { code: "JPY", symbol: "¥" },
  { code: "PKR", symbol: "₨" },
] as const;

export function getCurrencySymbol(code: string): string {
  const c = CURRENCIES.find((x) => x.code === code);
  return c?.symbol ?? code;
}

/** Add months to a date (handles month overflow). Returns YYYY-MM-DD. */
export function addMonthsToDate(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}
