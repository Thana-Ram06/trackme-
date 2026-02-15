"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function MoneyOverviewSection() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleOpenMoney = () => {
    if (loading) return;
    if (user) {
      router.push("/money");
    } else {
      router.push("/login?redirect=/money");
    }
  };

  return (
    <section id="money" className="section section-money-cta">
      <div className="section-header">
        <h2 className="section-title">Track your money. See the full picture.</h2>
        <p className="section-description">
          Record income, expenses, and monthly totals. Know exactly where your
          money goes.
        </p>
      </div>
      <div className="section-money-cta-actions">
        <button
          type="button"
          className="btn btn-lg btn-primary"
          onClick={handleOpenMoney}
          disabled={loading}
        >
          Open Money Overview
        </button>
      </div>
    </section>
  );
}
