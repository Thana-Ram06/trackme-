"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Hero() {
  const { user, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (loading) return;
    if (user) {
      router.push("/dashboard");
      return;
    }

    await loginWithGoogle();
    router.push("/dashboard");
  };

  const handleLearnMore = () => {
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

          <p className="hero-subtitle">
            Track.me is a calm little place for your recurring costs. See what&apos;s
            renewing next, and decide what still earns its keep.
          </p>

          <p className="hero-subsubtitle">
            No dashboards full of fake charts. Just a focused list that stays out of
            your way until you need it.
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
            <div className="hero-renewal-amount">$0</div>
            <div className="hero-renewal-caption">until you add</div>
          </div>

          <div className="hero-meta">
            <span>Private by default. Your data stays in your own account.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

