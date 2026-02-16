"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import AddSubscriptionForm from "@/components/AddSubscriptionForm";
import SubscriptionList from "@/components/SubscriptionList";
import EmptyState from "@/components/EmptyState";
import type { Subscription } from "@/types/subscription";

export default function SubscriptionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const resetIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?redirect=/subscriptions");
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !db) {
      setListLoading(false);
      return;
    }
    const subsRef = collection(db, "users", user.uid, "subscriptions");
    const q = query(subsRef, orderBy("renewalDate", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(
          (d: QueryDocumentSnapshot<DocumentData>) => {
            const data = d.data();
            return {
              id: d.id,
              name: (data.name as string) ?? "",
              price: Number(data.price ?? 0),
              currency: (data.currency as string) ?? "USD",
              renewalDate: (data.renewalDate as string) ?? "",
              renewalInterval: (data.renewalInterval as string) ?? undefined,
              nextDueDate: (data.nextDueDate as string) ?? undefined,
              isPaidThisCycle: data.isPaidThisCycle === true,
              lastPaidDate: (data.lastPaidDate as string) ?? undefined,
              createdAt: data.createdAt?.toString?.(),
            } satisfies Subscription;
          }
        );
        setSubscriptions(list);
        setListLoading(false);
      },
      () => {
        setListLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user || !db || subscriptions.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const firestore = db;
    subscriptions.forEach(async (sub) => {
      const due = sub.nextDueDate || sub.renewalDate;
      if (due && due < today && sub.isPaidThisCycle && !resetIdsRef.current.has(sub.id)) {
        resetIdsRef.current.add(sub.id);
        const docRef = doc(firestore, "users", user.uid, "subscriptions", sub.id);
        await updateDoc(docRef, { isPaidThisCycle: false });
      }
    });
  }, [user, subscriptions, db]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div>Loading…</div>
        <div className="loading-dot-row" aria-hidden="true">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard">
      <div className="dashboard-inner">
        <section className="dashboard-panel dashboard-panel-form">
          <h2 className="dashboard-panel-title">Your subscriptions</h2>
          <p className="dashboard-panel-subtitle">
            Add and track your recurring subscriptions.
          </p>
          <AddSubscriptionForm userId={user.uid} onError={setToast} />
        </section>

        <section className="dashboard-panel dashboard-panel-list">
          <h2 className="dashboard-panel-title">Subscriptions</h2>
          <p className="dashboard-panel-subtitle">
            {listLoading
              ? "Loading…"
              : `${subscriptions.length} ${subscriptions.length === 1 ? "item" : "items"}`}
          </p>
          {listLoading ? null : subscriptions.length === 0 ? (
            <EmptyState />
          ) : (
            <SubscriptionList userId={user.uid} subscriptions={subscriptions} />
          )}
        </section>
      </div>

      {toast && (
        <div className="dashboard-toast" role="alert">
          {toast}
        </div>
      )}
    </div>
  );
}

