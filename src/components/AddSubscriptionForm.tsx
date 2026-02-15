"use client";

import { FormEvent, useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RENEWAL_CYCLES, CURRENCIES, addMonthsToDate } from "@/lib/constants";

type AddSubscriptionFormProps = {
  userId: string;
  onError: (message: string) => void;
};

export default function AddSubscriptionForm({
  userId,
  onError,
}: AddSubscriptionFormProps) {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [price, setPrice] = useState("");
  const [renewalInterval, setRenewalInterval] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!renewalInterval) return;
    const today = new Date().toISOString().slice(0, 10);
    const cycle = RENEWAL_CYCLES.find((c) => c.value === renewalInterval);
    if (cycle) setRenewalDate(addMonthsToDate(today, cycle.months));
  }, [renewalInterval]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !price || !renewalDate) {
      onError("Please fill in every field.");
      return;
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      onError("Price should be a positive number.");
      return;
    }

    if (!db) {
      onError("Service unavailable. Check your configuration.");
      return;
    }

    setSubmitting(true);

    try {
      const subscriptionsRef = collection(db, "users", userId, "subscriptions");
      await addDoc(subscriptionsRef, {
        name: name.trim(),
        price: parsedPrice,
        currency: currency || "USD",
        renewalInterval: renewalInterval || null,
        renewalDate,
        createdAt: serverTimestamp(),
      });
      setName("");
      setPrice("");
      setRenewalInterval("");
      setRenewalDate("");
    } catch {
      onError("Could not save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form form-dashboard" onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="field-label" htmlFor="sub-name">
          Subscription name
        </label>
        <input
          id="sub-name"
          type="text"
          placeholder="e.g. Netflix, Figma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="field-row">
        <div className="field-group">
          <label className="field-label" htmlFor="sub-currency">
            Currency
          </label>
          <select
            id="sub-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} {c.symbol}
              </option>
            ))}
          </select>
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="sub-price">
            Price
          </label>
          <input
            id="sub-price"
            type="number"
            min="0"
            step="0.01"
            placeholder="9.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="sub-interval">
          Renewal cycle
        </label>
        <select
          id="sub-interval"
          value={renewalInterval}
          onChange={(e) => setRenewalInterval(e.target.value)}
        >
          <option value="">Select interval</option>
          {RENEWAL_CYCLES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.value}
            </option>
          ))}
        </select>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="sub-renewal">
          Next renewal date
        </label>
        <input
          id="sub-renewal"
          type="date"
          value={renewalDate}
          onChange={(e) => setRenewalDate(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-add-sub"
        disabled={submitting}
      >
        {submitting ? "Adding…" : "Add subscription"}
      </button>
    </form>
  );
}
