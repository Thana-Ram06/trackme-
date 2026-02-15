import Hero from "@/components/Hero";
import MoneyOverviewSection from "@/components/MoneyOverviewSection";

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="page">
      <Hero />

      <section id="features" className="section">
        <div className="section-header">
          <h2 className="section-title">A calm surface over your subscriptions</h2>
          <p className="section-description">
            Track.me is intentionally small. It&apos;s here to answer one question:
            &ldquo;What is about to renew?&rdquo;
          </p>
        </div>
        <div className="section-grid">
          <article className="feature-card">
            <h3 className="feature-title">One focused list</h3>
            <p className="feature-body">
              See every recurring charge in one clean view. No widgets, no graphs,
              no made-up analytics.
            </p>
          </article>
          <article className="feature-card">
            <h3 className="feature-title">Gentle awareness</h3>
            <p className="feature-body">
              Sort by upcoming renewal date so you always know what&apos;s coming
              up before your card gets hit.
            </p>
          </article>
          <article className="feature-card">
            <h3 className="feature-title">Yours, not ours</h3>
            <p className="feature-body">
              Data lives in your own Firebase project. Track.me just gives you a
              thoughtful interface on top.
            </p>
          </article>
          <article className="feature-card">
            <h3 className="feature-title">Smart Payment Tracking</h3>
            <p className="feature-body">
              Mark subscriptions as paid, see what&apos;s due, and get notified 5 days
              before renewal.
            </p>
          </article>
          <article className="feature-card">
            <h3 className="feature-title">Monthly Money Overview</h3>
            <p className="feature-body">
              Track your income and expenses each month and instantly see your net
              balance.
            </p>
          </article>
          <article className="feature-card">
            <h3 className="feature-title">Yearly Insights</h3>
            <p className="feature-body">
              View last month&apos;s data or your full year summary to understand your
              total earnings and spending.
            </p>
          </article>
        </div>
      </section>

      <MoneyOverviewSection />

      <footer className="site-footer">
        <span>Track.me · A tiny tool for knowing what&apos;s next.</span>
        <div className="site-footer-links">
          <a href="#features">Features</a>
          <span className="site-footer-sep">|</span>
          <a
            href="https://x.com/anoinv"
            target="_blank"
            rel="noreferrer noopener"
            className="site-footer-x"
          >
            Made by me
            <span className="site-footer-x-icon" aria-hidden="true">
              <XIcon />
            </span>
          </a>
        </div>
      </footer>
    </div>
  );
}
