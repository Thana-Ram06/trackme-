"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BillingCycle } from "@/types/subscription";

type AddSubscriptionFormProps = {
  userId: string;
};

export default function AddSubscriptionForm({
  userId,
}: AddSubscriptionFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [nextRenewalDate, setNextRenewalDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !amount || !nextRenewalDate) {
      setError("Please fill in every field.");
      return;
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount should be a positive number.");
      return;
    }

    if (!db) {
      setError("Service unavailable. Check your configuration.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const subscriptionsRef = collection(
        db,
        "users",
        userId,
        "subscriptions",
      );

      await addDoc(subscriptionsRef, {
        name: name.trim(),
        amount: parsedAmount,
        billingCycle,
        nextRenewalDate,
        createdAt: serverTimestamp(),
      });

      setName("");
      setAmount("");
      setNextRenewalDate("");
      setBillingCycle("monthly");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Unable to save subscription. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="field-label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Spotify, Figma, domain, ..."
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="9.99"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="billingCycle">
            Billing
          </label>
          <select
            id="billingCycle"
            value={billingCycle}
            onChange={(event) =>
              setBillingCycle(event.target.value as BillingCycle)
            }
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="nextRenewal">
          Next renewal date
        </label>
        <input
          id="nextRenewal"
          type="date"
          value={nextRenewalDate}
          onChange={(event) => setNextRenewalDate(event.target.value)}
        />
        <p className="field-help">
          We&apos;ll sort your list by this date so the next charge is always at
          the top.
        </p>
      </div>

      <div className="form-footer">
        <div>
          {error ? (
            <p className="field-error">{error}</p>
          ) : (
            <p className="field-help">
              You can always edit or delete items later.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Add subscription"}
        </button>
      </div>
    </form>
  );
}

