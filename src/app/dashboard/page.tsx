"use client";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import AddSubscriptionForm from "@/components/AddSubscriptionForm";
import SubscriptionList from "@/components/SubscriptionList";
import EmptyState from "@/components/EmptyState";
import type { Subscription } from "@/types/subscription";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

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
              renewalDate: (data.renewalDate as string) ?? "",
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
    <div className="dashboard">
      <div className="dashboard-inner">
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
      </div>

      {toast && (
        <div className="dashboard-toast" role="alert">
          {toast}
        </div>
      )}
    </div>
  );
}
