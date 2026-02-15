"use client";

import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrencySymbol, addMonthsToDate, getMonthsFromInterval } from "@/lib/constants";
import type { Subscription } from "@/types/subscription";

type SubscriptionListProps = {
  userId: string;
  subscriptions: Subscription[];
};

function formatPrice(price: number, currencyCode?: string): string {
  if (Number.isNaN(price)) return getCurrencySymbol(currencyCode ?? "USD") + "0";
  const symbol = getCurrencySymbol(currencyCode ?? "USD");
  return symbol + price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDDMMYYYY(dateString: string): string {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function getDueDate(sub: Subscription): string {
  return sub.nextDueDate || sub.renewalDate || "";
}

export default function SubscriptionList({
  userId,
  subscriptions,
}: SubscriptionListProps) {
  const today = new Date().toISOString().slice(0, 10);

  const handleDelete = async (id: string) => {
    if (!db) return;
    const ref = doc(db, "users", userId, "subscriptions", id);
    await deleteDoc(ref);
  };

  const handleMarkPaid = async (sub: Subscription) => {
    if (!db) return;
    const docRef = doc(db, "users", userId, "subscriptions", sub.id);
    const months = getMonthsFromInterval(sub.renewalInterval);
    const nextRenewalDate = addMonthsToDate(today, months);
    await updateDoc(docRef, {
      isPaidThisCycle: true,
      lastPaidDate: today,
      nextDueDate: nextRenewalDate,
      renewalDate: nextRenewalDate,
      status: "paid",
    });
  };

  if (!subscriptions.length) return null;

  return (
    <div className="subscription-list">
      <div className="subscription-grid">
        {subscriptions.map((sub) => {
          const dueDate = getDueDate(sub);
          const isOverdue = dueDate && today > dueDate && !sub.isPaidThisCycle;
          const isDueSoon = (() => {
            if (!dueDate || isOverdue || sub.isPaidThisCycle) return false;
            const due = new Date(dueDate);
            const todayDate = new Date(today);
            const diffDays = Math.ceil((due.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 5;
          })();

          return (
            <article key={sub.id} className="subscription-card">
              <div className="subscription-main">
                <div className="subscription-row">
                  <span className="subscription-name">{sub.name}</span>
                  {sub.isPaidThisCycle && (
                    <span className="subscription-badge subscription-badge--paid">Paid</span>
                  )}
                  {isDueSoon && (
                    <span className="subscription-badge subscription-badge--soon">Due soon</span>
                  )}
                  {isOverdue && (
                    <span className="subscription-badge subscription-badge--due">
                      Overdue since {formatDDMMYYYY(dueDate)}
                    </span>
                  )}
                </div>
                <div className="subscription-meta">
                  {formatPrice(sub.price, sub.currency)} · Next due {formatDate(dueDate)}
                </div>
                {isOverdue && (
                  <div className="subscription-expiring subscription-expiring--overdue">
                    Next due date: {formatDDMMYYYY(dueDate)}
                  </div>
                )}
              </div>
              <div className="subscription-actions">
                {!sub.isPaidThisCycle && (
                  <button
                    type="button"
                    className="btn btn-mark-paid"
                    onClick={() => handleMarkPaid(sub)}
                  >
                    Mark as Paid
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-delete"
                  onClick={() => handleDelete(sub.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
