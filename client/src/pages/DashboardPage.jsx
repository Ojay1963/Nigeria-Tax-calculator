import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccountDashboard, getAdminDashboard, getAdminMonetization } from "../api/http";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../lib/format";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function prettyType(value) {
  return String(value || "").replaceAll("_", " ");
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [accountData, setAccountData] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [adminMonetization, setAdminMonetization] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    getAccountDashboard(token)
      .then(response => {
        setAccountData(response);
      })
      .catch(error => {
        setStatus(error.message);
      });
  }, [token]);

  useEffect(() => {
    if (user?.role !== "admin" || !token) {
      return;
    }

    Promise.all([getAdminDashboard(token), getAdminMonetization(token)])
      .then(([dashboardResponse, monetizationResponse]) => {
        setAdminStats(dashboardResponse);
        setAdminMonetization(monetizationResponse.data ?? []);
      })
      .catch(error => {
        setStatus(error.message);
      });
  }, [token, user?.role]);

  const stats = accountData?.stats || {};
  const paidReports = accountData?.paidReports || [];
  const calculations = accountData?.calculations || [];
  const monetization = accountData?.monetization || [];
  const messages = accountData?.messages || [];

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Dashboard"
        title="Your dashboard"
        copy="Track recent calculations, paid PDF reports, consultations, and support requests from one place."
        aside={
          <div className="hero-note-card">
            <strong>Signed in as</strong>
            <p>{user?.email}</p>
          </div>
        }
      />

      <section className="content-card">
        <SectionHeading
          eyebrow="Overview"
          title="Account summary"
          copy="Your recent activity and paid items."
        />
        <div className="feature-grid dashboard-stat-grid">
          <article className="feature-card">
            <h3>{stats.paidReports ?? 0}</h3>
            <p>Paid PDF reports</p>
          </article>
          <article className="feature-card">
            <h3>{stats.consultations ?? 0}</h3>
            <p>Consultation requests</p>
          </article>
          <article className="feature-card">
            <h3>{stats.calculations ?? 0}</h3>
            <p>Saved calculations</p>
          </article>
          <article className="feature-card">
            <h3>{stats.supportRequests ?? 0}</h3>
            <p>Support requests</p>
          </article>
        </div>
      </section>

      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Paid reports"
            title="Your PDF orders"
            copy="Download paid reports and review payment status."
          />
          {paidReports.length ? (
            <div className="support-grid">
              {paidReports.map(item => (
                <article className="feature-card dashboard-record-card" key={item._id}>
                  <div className="dashboard-record-head">
                    <h3>{item.reportScope || "Paid PDF report"}</h3>
                    <span className="dashboard-badge success">{item.paymentStatus}</span>
                  </div>
                  <p>Amount: {formatCurrency(item.amount || 0)}</p>
                  <p>Paid: {formatDate(item.paidAt)}</p>
                  <p>Reference: {item.paymentReference}</p>
                  <div className="dashboard-actions">
                    {item.downloadUrl ? (
                      <a className="button-primary" href={item.downloadUrl} target="_blank" rel="noreferrer">
                        Download PDF
                      </a>
                    ) : (
                      <span className="note-text">PDF is being prepared.</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="feature-card">
              <h3>No paid PDF yet</h3>
              <p>Your paid report history will appear here after checkout.</p>
              <Link className="button-secondary" to="/reports">
                Order a PDF report
              </Link>
            </div>
          )}
        </div>

        <div>
          <SectionHeading
            eyebrow="Profile"
            title="Account details"
            copy="Basic account information and verification status."
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
              <p>{user?.isVerified ? "Verified" : "Pending"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Recent activity"
            title="Requests and payments"
            copy="Recent consultations, support requests, subscriptions, and paid items."
          />
          {monetization.length ? (
            <div className="support-grid">
              {monetization.slice(0, 6).map(item => (
                <article className="feature-card dashboard-record-card" key={item._id}>
                  <div className="dashboard-record-head">
                    <h3>{prettyType(item.type)}</h3>
                    <span className={`dashboard-badge ${item.paymentStatus === "success" ? "success" : "neutral"}`}>
                      {item.paymentStatus || item.status}
                    </span>
                  </div>
                  <p>Status: {item.status}</p>
                  <p>Created: {formatDate(item.createdAt)}</p>
                  <p>{item.taxUseCase || item.message || item.reportScope || item.selectedPlan || "-"}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="feature-card">
              <h3>No recent requests</h3>
              <p>Your consultations, support requests, and purchases will appear here.</p>
            </div>
          )}
        </div>

        <div>
          <SectionHeading
            eyebrow="Calculations"
            title="Recent saved calculations"
            copy="Calculation history is saved when you run estimates while signed in."
          />
          {calculations.length ? (
            <div className="support-grid">
              {calculations.slice(0, 6).map(item => (
                <article className="feature-card dashboard-record-card" key={item._id}>
                  <div className="dashboard-record-head">
                    <h3>{item.type === "paye" ? "PAYE estimate" : "Company tax estimate"}</h3>
                    <span className="dashboard-badge neutral">{formatDate(item.createdAt)}</span>
                  </div>
                  {item.type === "paye" ? (
                    <p>Monthly PAYE: {formatCurrency(item.output?.monthlyTax || 0)}</p>
                  ) : (
                    <p>Total estimate: {formatCurrency(item.output?.totalEstimatedTax || 0)}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="feature-card">
              <h3>No saved calculations yet</h3>
              <p>Run the calculator while signed in to build your history.</p>
              <Link className="button-secondary" to="/calculator">
                Open calculator
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Support"
            title="Messages"
            copy="Recent messages sent from your account."
          />
          {messages.length ? (
            <div className="support-grid">
              {messages.slice(0, 4).map(item => (
                <article className="feature-card dashboard-record-card" key={item._id}>
                  <div className="dashboard-record-head">
                    <h3>{item.audience}</h3>
                    <span className="dashboard-badge neutral">{formatDate(item.createdAt)}</span>
                  </div>
                  <p>{item.message}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="feature-card">
              <h3>No messages yet</h3>
              <p>Contact support and your message history will show here.</p>
            </div>
          )}
        </div>

        <div>
          <SectionHeading
            eyebrow="Quick actions"
            title="Next steps"
            copy="Jump into your most common tasks."
          />
          <div className="support-grid">
            <Link className="feature-card feature-link-card" to="/calculator">
              <h3>Run calculations</h3>
              <p>Open PAYE and company tax tools.</p>
            </Link>
            <Link className="feature-card feature-link-card" to="/reports">
              <h3>Order PDF report</h3>
              <p>Create a reviewed or branded report.</p>
            </Link>
            <Link className="feature-card feature-link-card" to="/consultations">
              <h3>Book consultation</h3>
              <p>Turn a result into a paid service request.</p>
            </Link>
            <Link className="feature-card feature-link-card" to="/contact">
              <h3>Contact support</h3>
              <p>Send a message or request a follow-up.</p>
            </Link>
          </div>
        </div>
      </section>

      {user?.role === "admin" ? (
        <section className="content-card">
          <SectionHeading
            eyebrow="Admin"
            title="Admin summary"
            copy="Workspace-level metrics for administrators."
          />
          <div className="support-grid dashboard-grid">
            <div className="feature-card"><h3>Messages</h3><p>{adminStats?.messages ?? "-"}</p></div>
            <div className="feature-card"><h3>Calculations</h3><p>{adminStats?.calculations ?? "-"}</p></div>
            <div className="feature-card"><h3>Support leads</h3><p>{adminStats?.supportLeads ?? "-"}</p></div>
            <div className="feature-card"><h3>Consultations</h3><p>{adminStats?.consultations ?? "-"}</p></div>
            <div className="feature-card"><h3>PDF reports</h3><p>{adminStats?.pdfReports ?? "-"}</p></div>
            <div className="feature-card"><h3>Subscriptions</h3><p>{adminStats?.subscriptionRequests ?? "-"}</p></div>
          </div>
          {adminMonetization.length ? (
            <div className="support-grid dashboard-grid">
              {adminMonetization.slice(0, 6).map(item => (
                <article className="feature-card dashboard-record-card" key={item._id}>
                  <div className="dashboard-record-head">
                    <h3>{prettyType(item.type)}</h3>
                    <span className={`dashboard-badge ${item.paymentStatus === "success" ? "success" : "neutral"}`}>
                      {item.paymentStatus || item.status}
                    </span>
                  </div>
                  <p>{item.name}</p>
                  <p>{item.email}</p>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {status ? <p className="note-text">{status}</p> : null}
    </div>
  );
}
