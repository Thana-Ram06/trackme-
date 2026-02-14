import Hero from "@/components/Hero";

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
        </div>
      </section>

      <section id="why" className="section">
        <div className="section-header">
          <h2 className="section-title">Why another tracker?</h2>
          <p className="section-description">
            Because most &ldquo;subscription managers&rdquo; feel like dashboards
            for teams. Track.me is for one person, on a quiet evening, deciding
            what still matters.
          </p>
        </div>
        <div className="why-grid">
          <div className="why-panel">
            <h3 className="feature-title">Designed for calm</h3>
            <ul className="why-list">
              <li>Dark by default, gentle light mode when you want it.</li>
              <li>Large type and generous spacing for long days.</li>
              <li>No clutter, badges, or growth hacks.</li>
            </ul>
          </div>
          <div className="why-panel">
            <h3 className="feature-title">Own your numbers</h3>
            <p className="why-note">
              Track.me uses Firebase Auth and Firestore directly from your browser.
              There&apos;s no custom backend; you can inspect every document
              yourself. If you ever outgrow it, your data is already portable.
            </p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>Track.me · A tiny tool for knowing what&apos;s next.</span>
        <div className="site-footer-links">
          <a href="#features">Features</a>
          <a href="#why">Why</a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            Deploy on Vercel
          </a>
        </div>
      </footer>
    </div>
  );
}
