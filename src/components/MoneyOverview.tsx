"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Transaction } from "@/types/transaction";
import TransactionModal from "@/components/TransactionModal";
import type { TransactionType } from "@/types/transaction";

type TabId = "this-month" | "last-month" | "this-year";

function getTransactionDate(t: Transaction): Date {
  const d = t.date;
  if (typeof d === "string") {
    const parsed = new Date(d);
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  }
  return new Date(0);
}

function isInMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

function isInYear(date: Date, year: number): boolean {
  return date.getFullYear() === year;
}

function getTotals(
  transactions: Transaction[],
  tab: TabId
): {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savings: number;
} {
  const now = new Date();
  let filtered: Transaction[] = [];

  if (tab === "this-month") {
    filtered = transactions.filter((t) =>
      isInMonth(getTransactionDate(t), now.getFullYear(), now.getMonth())
    );
  } else if (tab === "last-month") {
    const lastMonth = now.getMonth() - 1;
    const year = lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = lastMonth < 0 ? lastMonth + 12 : lastMonth;
    filtered = transactions.filter((t) =>
      isInMonth(getTransactionDate(t), year, month)
    );
  } else {
    filtered = transactions.filter((t) =>
      isInYear(getTransactionDate(t), now.getFullYear())
    );
  }

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    netBalance,
    savings: netBalance,
  };
}

type MoneyOverviewProps = {
  userId: string;
  onError: (message: string) => void;
};

export default function MoneyOverview({
  userId,
  onError,
}: MoneyOverviewProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("this-month");
  const [modalType, setModalType] = useState<TransactionType | null>(null);

  useEffect(() => {
    if (!userId || !db) {
      setLoading(false);
      return;
    }
    const ref = collection(db, "users", userId, "transactions");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();
          const dateVal = data.date;
          let dateStr = "";
          if (dateVal?.toDate) {
            dateStr = dateVal.toDate().toISOString().slice(0, 10);
          } else if (typeof dateVal === "string") {
            dateStr = dateVal;
          }
          return {
            id: doc.id,
            type: (data.type as TransactionType) ?? "expense",
            title: (data.title as string) ?? "",
            amount: Number(data.amount ?? 0),
            category: (data.category as string) ?? "",
            date: dateStr,
            createdAt: data.createdAt?.toString?.(),
          } satisfies Transaction;
        });
        setTransactions(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [userId]);

  const totals = getTotals(transactions, tab);

  const formatMoney = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  return (
    <section className="dashboard-panel dashboard-panel-money">
      <h2 className="dashboard-panel-title">Money Overview</h2>
      <p className="dashboard-panel-subtitle">
        Track income and expenses by month or year.
      </p>

      <div className="money-actions">
        <button
          type="button"
          className="btn btn-add-income"
          onClick={() => setModalType("income")}
        >
          + Add Income
        </button>
        <button
          type="button"
          className="btn btn-add-expense"
          onClick={() => setModalType("expense")}
        >
          + Add Expense
        </button>
      </div>

      <div className="money-tabs">
        <button
          type="button"
          className={"money-tab" + (tab === "this-month" ? " money-tab--active" : "")}
          onClick={() => setTab("this-month")}
        >
          This Month
        </button>
        <button
          type="button"
          className={"money-tab" + (tab === "last-month" ? " money-tab--active" : "")}
          onClick={() => setTab("last-month")}
        >
          Last Month
        </button>
        <button
          type="button"
          className={"money-tab" + (tab === "this-year" ? " money-tab--active" : "")}
          onClick={() => setTab("this-year")}
        >
          This Year
        </button>
      </div>

      <div className="money-card">
        {loading ? (
          <div className="money-card-loading">Loading…</div>
        ) : (
          <>
            <div className="money-row money-row--income">
              <span className="money-label">Income</span>
              <span className="money-value money-value--income">
                {formatMoney(totals.totalIncome)}
              </span>
            </div>
            <div className="money-row money-row--expense">
              <span className="money-label">Expense</span>
              <span className="money-value money-value--expense">
                {formatMoney(totals.totalExpense)}
              </span>
            </div>
            <div className="money-row money-row--balance">
              <span className="money-label">
                {tab === "this-year" ? "Savings" : "Balance"}
              </span>
              <span className="money-value money-value--balance">
                {formatMoney(totals.netBalance)}
              </span>
            </div>
          </>
        )}
      </div>

      {modalType && (
        <TransactionModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          type={modalType}
          userId={userId}
          onSuccess={() => {}}
          onError={onError}
        />
      )}
    </section>
  );
}
