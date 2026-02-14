"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

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

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Signed in as {user.email ?? "your account"}.
        </p>
        <div className="dashboard-metrics">
          <div className="dashboard-metric-pill">
            {user.displayName ?? "User"}
          </div>
          <div className="dashboard-metric-pill">{user.email ?? ""}</div>
        </div>
      </header>

      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2 className="dashboard-panel-title">Account</h2>
          </div>
          <p className="dashboard-panel-subtitle">
            You are logged in. Your subscription data is stored under your
            account.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </section>
      </div>
    </div>
  );
}
