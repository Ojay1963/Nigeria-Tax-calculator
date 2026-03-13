import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard } from "../api/http";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [adminStats, setAdminStats] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (user?.role !== "admin" || !token) {
      return;
    }

    getAdminDashboard(token)
      .then(response => {
        setAdminStats(response);
      })
      .catch(error => {
        setStatus(error.message);
      });
  }, [token, user?.role]);

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Dashboard"
        title="Your account workspace"
        copy="Use this page as the signed-in home for your account. It is ready for user profile details now and can expand into saved scenarios, team workflows, and admin reporting."
        aside={
          <div className="hero-note-card">
            <strong>Signed in as</strong>
            <p>{user?.email}</p>
          </div>
        }
      />

      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Profile"
            title="Account details"
            copy="This section confirms the authenticated user state coming from the backend."
          />
          <div className="support-grid">
            <div className="feature-card">
              <h3>Name</h3>
              <p>{user?.name || "Not available"}</p>
            </div>
            <div className="feature-card">
              <h3>Email</h3>
              <p>{user?.email}</p>
            </div>
            <div className="feature-card">
              <h3>Role</h3>
              <p>{user?.role}</p>
            </div>
            <div className="feature-card">
              <h3>Verification</h3>
              <p>{user?.isVerified ? "Verified" : "Pending verification"}</p>
            </div>
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="Quick actions"
            title="Where to go next"
            copy="The dashboard should point users into the most common post-login tasks."
          />
          <div className="support-grid">
            <Link className="feature-card feature-link-card" to="/calculator">
              <h3>Run calculations</h3>
              <p>Open PAYE and company tax tools.</p>
            </Link>
            <Link className="feature-card feature-link-card" to="/guide">
              <h3>Review assumptions</h3>
              <p>Check the guide and source notes.</p>
            </Link>
            <Link className="feature-card feature-link-card" to="/contact">
              <h3>Send support request</h3>
              <p>Contact the team from your signed-in session.</p>
            </Link>
          </div>
        </div>
      </section>

      {user?.role === "admin" ? (
        <section className="content-card">
          <SectionHeading
            eyebrow="Admin"
            title="Admin summary"
            copy="If the backend has live data and MongoDB configured, admin metrics appear here."
          />
          {adminStats?.count ? null : null}
          <div className="support-grid dashboard-grid">
            <div className="feature-card">
              <h3>Messages</h3>
              <p>{adminStats?.messages ?? "-"}</p>
            </div>
            <div className="feature-card">
              <h3>Calculations</h3>
              <p>{adminStats?.calculations ?? "-"}</p>
            </div>
            <div className="feature-card">
              <h3>PAYE runs</h3>
              <p>{adminStats?.payeCalculations ?? "-"}</p>
            </div>
            <div className="feature-card">
              <h3>Company runs</h3>
              <p>{adminStats?.companyCalculations ?? "-"}</p>
            </div>
          </div>
          {status ? <p className="note-text">{status}</p> : null}
        </section>
      ) : null}
    </div>
  );
}
