"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type AddSubscriptionFormProps = {
  userId: string;
  onError: (message: string) => void;
};

export default function AddSubscriptionForm({
  userId,
  onError,
}: AddSubscriptionFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        renewalDate,
        createdAt: serverTimestamp(),
      });
      setName("");
      setPrice("");
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
      <div className="field-group">
        <label className="field-label" htmlFor="sub-renewal">
          Renewal date
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
