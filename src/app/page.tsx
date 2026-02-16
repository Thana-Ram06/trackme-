import Hero from "@/components/Hero";
import MoneyOverviewSection from "@/components/MoneyOverviewSection";

export default function Home() {
  return (
    <div className="page">
      <Hero />

      <MoneyOverviewSection />

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

      <footer className="site-footer">
        <span>Track.me · A tiny tool for knowing what&apos;s next.</span>
        <div className="site-footer-links">
          <a href="#features">Features</a>
          <span className="site-footer-sep">|</span>
          <span>
            Made by{" "}
            <a
              href="https://x.com/tr_dev06"
              target="_blank"
              rel="noreferrer noopener"
              className="site-footer-x"
            >
              Thana Ram
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
