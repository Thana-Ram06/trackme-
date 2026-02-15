"use client";

import { FormEvent, useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "@/lib/transactionCategories";
import type { TransactionType } from "@/types/transaction";

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  userId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function TransactionModal({
  isOpen,
  onClose,
  type,
  userId,
  onSuccess,
  onError,
}: TransactionModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(
    type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
  );
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [submitting, setSubmitting] = useState(false);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (isOpen) {
      setCategory(
        type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
      );
    }
  }, [isOpen, type]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || !date) {
      onError("Please fill in title, amount, and date.");
      return;
    }
    const num = Number(amount);
    if (Number.isNaN(num) || num < 0) {
      onError("Amount must be a positive number.");
      return;
    }
    if (!db) {
      onError("Service unavailable.");
      return;
    }

    setSubmitting(true);
    try {
      const collectionName = type === "income" ? "incomes" : "expenses";
      const ref = collection(db, "users", userId, collectionName);
      const dateAtMidnight = new Date(date + "T00:00:00");
      const docRef = await addDoc(ref, {
        title: title.trim(),
        amount: num,
        category,
        date: Timestamp.fromDate(dateAtMidnight),
        createdAt: serverTimestamp(),
      });
      if (!docRef?.id) {
        throw new Error("Write did not return document id");
      }
      setTitle("");
      setAmount("");
      setCategory(categories[0]);
      setDate(new Date().toISOString().slice(0, 10));
      onSuccess();
      onClose();
    } catch (err) {
      console.error("TransactionModal save error:", err);
      const msg =
        err instanceof Error
          ? (err.message || "Could not save. Please try again.")
          : "Could not save. Please try again.";
      onError(msg.length > 80 ? "Could not save. Check console or try again." : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const label = type === "income" ? "Add Income" : "Add Expense";

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-modal-title"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="transaction-modal-title" className="modal-title">
            {label}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form form-transaction">
          <div className="field-group">
            <label className="field-label" htmlFor="tx-title">
              Title
            </label>
            <input
              id="tx-title"
              type="text"
              placeholder="e.g. Salary, Groceries"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="tx-amount">
              Amount
            </label>
            <input
              id="tx-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="tx-category">
              Category
            </label>
            <select
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="tx-date">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-transaction-submit"
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
