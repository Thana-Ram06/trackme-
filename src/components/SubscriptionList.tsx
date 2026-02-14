import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Subscription } from "@/types/subscription";

type SubscriptionListProps = {
  userId: string;
  subscriptions: Subscription[];
};

function formatAmount(amount: number): string {
  if (Number.isNaN(amount)) return "$0";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return dateString;
  }
  return parsed.toLocaleDateString(undefined, {
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
    const ref = doc(db, "users", userId, "subscriptions", id);
    await deleteDoc(ref);
  };

  if (!subscriptions.length) {
    return null;
  }

  return (
    <div>
      <div className="subscription-list-header">
        <span>All subscriptions</span>
        <span className="subscription-count">
          {subscriptions.length}{" "}
          {subscriptions.length === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="subscription-grid">
        {subscriptions.map((sub) => (
          <article key={sub.id} className="subscription-card">
            <div className="subscription-main">
              <div className="subscription-name">{sub.name}</div>
              <div className="subscription-meta">
                Next renewal · {formatDate(sub.nextRenewalDate)}
              </div>
            </div>
            <div className="subscription-billing">
              <div className="subscription-amount">
                {formatAmount(sub.amount)}
              </div>
              <div className="subscription-frequency">
                {sub.billingCycle === "monthly" ? "per month" : "per year"}
              </div>
            </div>
            <div className="subscription-actions">
              <button
                type="button"
                className="btn btn-sm btn-ghost-danger"
                onClick={() => handleDelete(sub.id)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

