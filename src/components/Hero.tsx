"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { getCurrencySymbol } from "@/lib/constants";
import type { Subscription } from "@/types/subscription";

function isInCurrentMonth(dateStr: string): boolean {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function Hero() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [monthRenewals, setMonthRenewals] = useState<Subscription[]>([]);
  const [renewalsLoading, setRenewalsLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) {
      setMonthRenewals([]);
      setRenewalsLoading(false);
      return;
    }
    const subsRef = collection(db, "users", user.uid, "subscriptions");
    const q = query(subsRef, orderBy("renewalDate", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
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
      const dueDate = (s: Subscription) => s.nextDueDate || s.renewalDate || "";
      setMonthRenewals(list.filter((s) => isInCurrentMonth(dueDate(s))));
      setRenewalsLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleGetStarted = () => {
    if (loading) return;
    if (user) {
      router.push("/dashboard");
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

  const totalByCurrency: Record<string, number> = {};
  monthRenewals.forEach((s) => {
    const code = s.currency ?? "USD";
    totalByCurrency[code] = (totalByCurrency[code] ?? 0) + s.price;
  });
  const totalParts = Object.entries(totalByCurrency).map(
    ([code, sum]) => getCurrencySymbol(code) + sum.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  );

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
              {user ? "Open dashboard" : "Get started"}
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
            ) : monthRenewals.length === 0 ? (
              <>
                <div className="hero-renewal-amount hero-renewal-amount--muted">No renewals this month</div>
              </>
            ) : (
              <>
                <div className="hero-renewal-amount">{totalParts.join(" · ")}</div>
                <div className="hero-renewal-caption">{monthRenewals.length} {monthRenewals.length === 1 ? "renewal" : "renewals"}</div>
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

