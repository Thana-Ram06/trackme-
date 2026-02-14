"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    await loginWithGoogle();
    router.push("/dashboard");
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

  if (user) {
    return null;
  }

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-main">
          <h1 className="hero-heading">Sign in</h1>
          <p className="hero-subtitle">
            Use your Google account to access your subscriptions.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <button
              type="button"
              className="btn btn-lg btn-primary"
              onClick={handleSignIn}
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
