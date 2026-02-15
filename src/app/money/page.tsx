"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MoneyOverview from "@/components/MoneyOverview";

export default function MoneyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?redirect=/money");
      return;
    }
  }, [user, loading, router]);

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
    <div className="dashboard money-page">
      <div className="dashboard-inner">
        <Link href="/" className="dashboard-back">
          ← Back to Home
        </Link>
        <header className="dashboard-header">
          <h1 className="dashboard-title">Money Overview</h1>
          <p className="dashboard-subtitle">
            Track income and expenses. See monthly and yearly totals.
          </p>
        </header>

        <section className="dashboard-panel dashboard-panel-money-wrap">
          <MoneyOverview userId={user.uid} onError={setToast} />
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
