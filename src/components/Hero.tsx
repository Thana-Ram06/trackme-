"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { getCurrencySymbol } from "@/lib/constants";
import type { Subscription } from "@/types/subscription";

function getDueDate(s: Subscription): string {
  return s.nextDueDate || s.renewalDate || "";
}

function isInCurrentMonth(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function Hero() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [renewalsLoading, setRenewalsLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) {
      setAllSubscriptions([]);
      setRenewalsLoading(false);
      return;
    }
    const subsRef = collection(db, "users", user.uid, "subscriptions");
    const q = query(subsRef, orderBy("renewalDate", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => {
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
          } as Subscription;
        });
        setAllSubscriptions(list);
        setRenewalsLoading(false);
      },
      (err) => {
        console.error("Hero subscriptions snapshot error:", err);
        setRenewalsLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const handleGetStarted = () => {
    if (loading) return;
    if (user) {
      router.push("/subscriptions");
    } else {
      router.push("/login");
    }
  };

  const handleLearnMore = () => {
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const dueThisMonthOrOverdue = allSubscriptions.filter((s) => {
    const due = getDueDate(s);
    if (!due) return false;
    const inCurrentMonth = isInCurrentMonth(due);
    const overdue = due < today && !s.isPaidThisCycle;
    return inCurrentMonth || overdue;
  });
  const overdueOnly = allSubscriptions.filter((s) => {
    const due = getDueDate(s);
    return due && due < today && !s.isPaidThisCycle;
  });

  const totalDueByCurrency: Record<string, number> = {};
  dueThisMonthOrOverdue.forEach((s) => {
    const code = s.currency ?? "USD";
    totalDueByCurrency[code] = (totalDueByCurrency[code] ?? 0) + s.price;
  });
  const totalOverdueByCurrency: Record<string, number> = {};
  overdueOnly.forEach((s) => {
    const code = s.currency ?? "USD";
    totalOverdueByCurrency[code] = (totalOverdueByCurrency[code] ?? 0) + s.price;
  });

  const dueParts = Object.entries(totalDueByCurrency).map(
    ([code, sum]) =>
      getCurrencySymbol(code) +
      sum.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  );
  const overdueParts = Object.entries(totalOverdueByCurrency).map(
    ([code, sum]) =>
      getCurrencySymbol(code) +
      sum.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  );

  const hasDue = dueThisMonthOrOverdue.length > 0;
  const hasOverdue = overdueOnly.length > 0;

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-main">
          <div className="hero-badge">
            <span className="hero-dot" />
            <span>Never be surprised by a renewal again.</span>
          </div>

          <h1 className="hero-heading">
            Track subscriptions. Know what&apos;s coming.
          </h1>

          {/* <p className="hero-subtitle">
            Track.me helps you manage subscriptions, track monthly expenses, record
            income, and understand your money flow — all in one calm, focused space.
          </p> */}

          <p className="hero-subsubtitle">
            See what&apos;s renewing, what&apos;s paid, what&apos;s due soon, and how your
            spending compares month to month.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-lg btn-primary"
              onClick={handleGetStarted}
            >
              {user ? "Open Subscriptions" : "Get started"}
            </button>
            <button
              type="button"
              className="btn btn-lg btn-ghost"
              onClick={handleLearnMore}
            >
              Learn more
            </button>
          </div>

          <div className="hero-renewal-card" aria-hidden="true">
            <div className="hero-renewal-title">This month&apos;s renewals</div>
            {renewalsLoading ? (
              <div className="hero-renewal-amount">…</div>
            ) : !hasDue ? (
              <div className="hero-renewal-amount hero-renewal-amount--muted">
                No renewals this month
              </div>
            ) : (
              <>
                <div className="hero-renewal-amount">
                  {dueThisMonthOrOverdue.length} {dueThisMonthOrOverdue.length === 1 ? "renewal" : "renewals"} · {dueParts.join(" · ")} due
                </div>
                {hasOverdue && overdueParts.length > 0 && (
                  <div className="hero-renewal-caption hero-renewal-caption--overdue">
                    {overdueParts.join(" · ")} overdue
                  </div>
                )}
              </>
            )}
          </div>

          <div className="hero-meta">
            <span>Private by default. Your data stays in your own account.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

