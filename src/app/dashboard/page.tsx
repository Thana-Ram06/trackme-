\"use client\";

import Link from \"next/link\";
import { useRouter } from \"next/navigation\";
import { useEffect } from \"react\";
import { useAuth } from \"@/context/AuthContext\";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(\"/login?redirect=/dashboard\");
      return;
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push(\"/\");
  };

  if (loading) {
    return (
      <div className=\"dashboard-loading\">
        <div>Loading…</div>
        <div className=\"loading-dot-row\" aria-hidden=\"true\">
          <div className=\"loading-dot\" />
          <div className=\"loading-dot\" />
          <div className=\"loading-dot\" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className=\"dashboard\">
      <div className=\"dashboard-inner\">
        <Link href=\"/\" className=\"dashboard-back\">
          ← Back to Home
        </Link>
        <header className=\"dashboard-header\">
          <h1 className=\"dashboard-title\">Dashboard</h1>
          <p className=\"dashboard-subtitle\">
            Signed in as {user.email ?? \"your account\"}.
          </p>
          <div className=\"dashboard-account-row\">
            <span className=\"dashboard-metric-pill\">
              {user.displayName ?? \"User\"}
            </span>
            <button
              type=\"button\"
              className=\"btn btn-logout\"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <section className=\"dashboard-panel\">
          <h2 className=\"dashboard-panel-title\">Your account</h2>
          <p className=\"dashboard-panel-subtitle\">
            Manage your Track.me account and open your subscription or money views.
          </p>
          <div className=\"dashboard-account-row\">
            <Link href=\"/subscriptions\" className=\"btn btn-sm btn-ghost\">
              Open subscriptions
            </Link>
            <Link href=\"/money\" className=\"btn btn-sm btn-ghost\">
              Open money overview
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

