"use client";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Subscription } from "@/types/subscription";

type SubscriptionListProps = {
  userId: string;
  subscriptions: Subscription[];
};

function formatPrice(price: number): string {
  if (Number.isNaN(price)) return "$0";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
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
                {formatPrice(sub.price)} · Renews {formatDate(sub.renewalDate)}
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
