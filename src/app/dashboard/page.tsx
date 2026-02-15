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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import AddSubscriptionForm from "@/components/AddSubscriptionForm";
import SubscriptionList from "@/components/SubscriptionList";
import EmptyState from "@/components/EmptyState";
import MoneyOverview from "@/components/MoneyOverview";
import DashboardErrorBoundary from "@/components/DashboardErrorBoundary";
import type { Subscription } from "@/types/subscription";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const resetIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
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
      (err) => {
        console.error("Dashboard subscriptions error:", err);
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

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const showToast = (message: string) => {
    setToast(message);
  };

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
    <DashboardErrorBoundary>
      <div className="dashboard">
        <div className="dashboard-inner">
          <Link href="/" className="dashboard-back">
          ← Back to Home
        </Link>
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Signed in as {user.email ?? "your account"}.
          </p>
          <div className="dashboard-account-row">
            <span className="dashboard-metric-pill">
              {user.displayName ?? "User"}
            </span>
            <button
              type="button"
              className="btn btn-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <section className="dashboard-panel dashboard-panel-form">
          <h2 className="dashboard-panel-title">Your subscriptions</h2>
          <p className="dashboard-panel-subtitle">
            Add and track your recurring subscriptions.
          </p>
          <AddSubscriptionForm userId={user.uid} onError={showToast} />
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

        <section className="dashboard-panel dashboard-panel-money-wrap">
          <MoneyOverview userId={user.uid} onError={showToast} />
        </section>
      </div>

      {toast && (
        <div className="dashboard-toast" role="alert">
          {toast}
        </div>
      )}
    </div>
    </DashboardErrorBoundary>
  );
}
