"use client";

import { useEffect, useRef, useState } from "react";
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

const parseTransactionDate = (dateVal: unknown): string => {
  if (!dateVal) return "";
  if (typeof (dateVal as { toDate?: () => Date }).toDate === "function") {
    return (dateVal as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
  }
  if (typeof dateVal === "string") return dateVal;
  return "";
};

export default function MoneyOverview({
  userId,
  onError,
}: MoneyOverviewProps) {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("this-month");
  const [modalType, setModalType] = useState<TransactionType | null>(null);
  const loadedRef = useRef({ incomes: false, expenses: false });

  useEffect(() => {
    if (!userId || !db) {
      setLoading(false);
      return;
    }
    loadedRef.current = { incomes: false, expenses: false };
    const incomesRef = collection(db, "users", userId, "incomes");
    const expensesRef = collection(db, "users", userId, "expenses");
    const qIncomes = query(incomesRef, orderBy("createdAt", "desc"));
    const qExpenses = query(expensesRef, orderBy("createdAt", "desc"));

    const checkDone = (key: "incomes" | "expenses") => {
      loadedRef.current[key] = true;
      if (loadedRef.current.incomes && loadedRef.current.expenses) {
        setLoading(false);
      }
    };

    const unsubIncomes = onSnapshot(
      qIncomes,
      (snapshot) => {
        const list: Transaction[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            type: "income" as const,
            title: (data.title as string) ?? "",
            amount: Number(data.amount ?? 0),
            category: (data.category as string) ?? "",
            date: parseTransactionDate(data.date),
            createdAt: data.createdAt?.toString?.(),
          };
        });
        setIncomes(list);
        checkDone("incomes");
      },
      (err) => {
        console.error("MoneyOverview incomes error:", err);
        checkDone("incomes");
      }
    );

    const unsubExpenses = onSnapshot(
      qExpenses,
      (snapshot) => {
        const list: Transaction[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: "exp-" + d.id,
            type: "expense" as const,
            title: (data.title as string) ?? "",
            amount: Number(data.amount ?? 0),
            category: (data.category as string) ?? "",
            date: parseTransactionDate(data.date),
            createdAt: data.createdAt?.toString?.(),
          };
        });
        setExpenses(list);
        checkDone("expenses");
      },
      (err) => {
        console.error("MoneyOverview expenses error:", err);
        checkDone("expenses");
      }
    );

    return () => {
      unsubIncomes();
      unsubExpenses();
    };
  }, [userId]);

  const transactions = [...incomes, ...expenses];

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
