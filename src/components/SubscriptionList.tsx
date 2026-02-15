"use client";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrencySymbol } from "@/lib/constants";
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

export default function SubscriptionList({
  userId,
  subscriptions,
}: SubscriptionListProps) {
  const handleDelete = async (id: string) => {
    if (!db) return;
    const ref = doc(db, "users", userId, "subscriptions", id);
    await deleteDoc(ref);
  };

  if (!subscriptions.length) return null;

  return (
    <div className="subscription-list">
      <div className="subscription-grid">
        {subscriptions.map((sub) => (
          <article key={sub.id} className="subscription-card">
            <div className="subscription-main">
              <div className="subscription-name">{sub.name}</div>
              <div className="subscription-meta">
                {formatPrice(sub.price, sub.currency)} · Renews {formatDate(sub.renewalDate)}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-delete"
              onClick={() => handleDelete(sub.id)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
