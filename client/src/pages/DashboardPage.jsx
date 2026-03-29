import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccountDashboard, getAdminDashboard, getAdminMonetization } from "../api/http";
import EmptyState from "../components/EmptyState";
import PageHero from "../components/PageHero";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";
import StatusPill from "../components/StatusPill";
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

function DashboardRow({ title, meta, badge, children, actions }) {
  return (
    <details className="dashboard-row">
      <summary className="dashboard-row-summary">
        <div className="dashboard-row-main">
          <strong>{title}</strong>
          <span>{meta}</span>
        </div>
        <div className="dashboard-row-side">
          {badge ? <StatusPill label={badge.label} variant={badge.kind || "neutral"} compact /> : null}
          <span className="dashboard-row-toggle">View</span>
        </div>
      </summary>
      <div className="dashboard-row-body">
        <div className="dashboard-row-content">{children}</div>
        {actions ? <div className="dashboard-actions">{actions}</div> : null}
      </div>
    </details>
  );
}

export default function DashboardPage() {
  const { resendVerification, user, token } = useAuth();
  const [accountData, setAccountData] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [adminMonetization, setAdminMonetization] = useState([]);
  const [status, setStatus] = useState("");
  const [verificationStatus, setVerificationStatus] = useState({ type: "", message: "" });
  const [resendingVerification, setResendingVerification] = useState(false);

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
  const consultations = accountData?.consultations || [];
  const supportRequests = accountData?.supportRequests || [];
  const messages = accountData?.messages || [];
  const billingItems = monetization.filter(item => item.paymentStatus === "success");

  async function handleResendVerification() {
    if (!user?.email) {
      return;
    }

    setResendingVerification(true);
    setVerificationStatus({ type: "", message: "" });

    try {
      const response = await resendVerification({ email: user.email });
      setVerificationStatus({ type: "success", message: response.message });
    } catch (error) {
      setVerificationStatus({ type: "error", message: error.message });
    } finally {
      setResendingVerification(false);
    }
  }

  return (
    <div className="page-stack">
      <SeoHead
        title="Dashboard | Naija Tax Calculator"
        description="Review your Naija Tax Calculator account activity, saved calculations, support requests, and payments."
        canonicalPath="/dashboard"
      />
      <PageHero
        eyebrow="Dashboard"
        title="Your dashboard"
        copy="Track reports, payments, support, and calculations from one place."
        aside={
          <div className="hero-note-card">
            <strong>{user?.name || "Account"}</strong>
            <p>{user?.email}</p>
          </div>
        }
      />

      {!user?.isVerified ? (
        <section className="content-card verification-banner">
          <div>
            <strong>Finish verifying your account</strong>
            <p>Some account features work better once your email address is verified.</p>
            {verificationStatus.message ? (
              <StatusPill
                label={verificationStatus.message}
                variant={verificationStatus.type === "error" ? "warning" : "success"}
              />
            ) : (
              <StatusPill label="Pending verification" variant="warning" />
            )}
          </div>
          <button className="button-primary" type="button" onClick={handleResendVerification} disabled={resendingVerification}>
            {resendingVerification ? "Sending..." : "Resend verification email"}
          </button>
        </section>
      ) : null}

      <section className="content-card">
        <SectionHeading eyebrow="Overview" title="Summary" copy="Your latest account activity." />
          <div className="feature-grid dashboard-stat-grid">
            <a className="feature-card feature-link-card stat-link-card" href="#paid-reports">
              <span className="card-icon">PDF</span>
              <h3>{stats.paidReports ?? 0}</h3>
              <p>Paid reports</p>
            </a>
            <a className="feature-card feature-link-card stat-link-card" href="#billing-history">
              <span className="card-icon">PAY</span>
              <h3>{billingItems.length}</h3>
              <p>Successful payments</p>
            </a>
            <a className="feature-card feature-link-card stat-link-card" href="#saved-calculations">
              <span className="card-icon">CALC</span>
              <h3>{stats.calculations ?? 0}</h3>
              <p>Saved calculations</p>
            </a>
            <a className="feature-card feature-link-card stat-link-card" href="#support-tickets">
              <span className="card-icon">SUP</span>
              <h3>{stats.supportRequests ?? 0}</h3>
              <p>Support tickets</p>
            </a>
        </div>
      </section>

      <section className="content-card split-card">
        <div id="paid-reports">
          <SectionHeading eyebrow="Paid reports" title="PDF history" copy="Compact rows. Click any row for full details." />
          {paidReports.length ? (
            <div className="dashboard-list">
              {paidReports.map(item => (
                <DashboardRow
                  key={item._id}
                  title={item.reportScope || "Paid PDF report"}
                  meta={`${formatCurrency(item.amount || 0)} • ${formatDate(item.paidAt)}`}
                  badge={{ label: "paid", kind: "success" }}
                  actions={
                    item.downloadUrl ? (
                      <a className="button-primary" href={item.downloadUrl} target="_blank" rel="noreferrer">
                        Download PDF
                      </a>
                    ) : (
                      <span className="note-text">PDF is being prepared.</span>
                    )
                  }
                >
                  <p>Reference: {item.paymentReference}</p>
                  <p>Type: {item.calculationType || "PAYE"}</p>
                  <p>Use case: {item.taxUseCase || "-"}</p>
                </DashboardRow>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No paid PDF yet"
              copy="Your paid reports will appear here after checkout."
              icon="PDF"
              action={<Link className="button-secondary" to="/reports">Order PDF report</Link>}
            />
          )}
        </div>

        <div>
          <SectionHeading eyebrow="Profile" title="Profile and settings" copy="Your account details." />
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
              <h3>Status</h3>
              <StatusPill label={user?.isVerified ? "Verified" : "Pending verification"} variant={user?.isVerified ? "success" : "warning"} compact />
            </div>
          </div>
        </div>
      </section>

      <section className="content-card split-card">
        <div id="billing-history">
          <SectionHeading eyebrow="Billing" title="Payment history" copy="Successful paid items from your account." />
          {billingItems.length ? (
            <div className="dashboard-list">
              {billingItems.map(item => (
                <DashboardRow
                  key={item._id}
                  title={prettyType(item.type)}
                  meta={`${formatCurrency(item.amount || 0)} • ${formatDate(item.paidAt || item.createdAt)}`}
                  badge={{ label: item.paymentStatus, kind: "success" }}
                >
                  <p>Reference: {item.paymentReference || "-"}</p>
                  <p>Status: {item.status}</p>
                  <p>Description: {item.reportScope || item.selectedPlan || item.consultationType || "-"}</p>
                </DashboardRow>
              ))}
            </div>
          ) : (
            <EmptyState title="No payment history yet" copy="Your successful payments will appear here." icon="PAY" />
          )}
        </div>

        <div>
          <SectionHeading eyebrow="Consultations" title="Consultation requests" copy="Booked and pending consultation items." />
          {consultations.length ? (
            <div className="dashboard-list">
              {consultations.map(item => (
                <DashboardRow
                  key={item._id}
                  title={item.consultationType || "Consultation"}
                  meta={`${formatDate(item.createdAt)}${item.preferredDate ? ` • ${item.preferredDate}` : ""}`}
                  badge={{
                    label: item.paymentStatus || item.status,
                    kind: item.paymentStatus === "success" ? "success" : "neutral"
                  }}
                >
                  <p>Status: {item.status}</p>
                  <p>Preferred time: {item.preferredTime || "-"}</p>
                  <p>Use case: {item.taxUseCase || "-"}</p>
                </DashboardRow>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No consultation request yet"
              copy="Booked or pending consultations will appear here."
              icon="CALL"
              action={<Link className="button-secondary" to="/consultations">Book consultation</Link>}
            />
          )}
        </div>
      </section>

      <section className="content-card split-card">
        <div id="support-tickets">
          <SectionHeading eyebrow="Support" title="Support tickets" copy="Compact ticket rows with status." />
          {supportRequests.length || messages.length ? (
            <div className="dashboard-list">
              {supportRequests.map(item => (
                <DashboardRow
                  key={item._id}
                  title={item.taxUseCase || "Support request"}
                  meta={formatDate(item.createdAt)}
                  badge={{ label: item.status || "new", kind: "neutral" }}
                >
                  <p>Request type: {prettyType(item.type)}</p>
                  <p>Message: {item.message || "-"}</p>
                </DashboardRow>
              ))}
              {messages.map(item => (
                <DashboardRow
                  key={item._id}
                  title={item.audience || "Message"}
                  meta={formatDate(item.createdAt)}
                  badge={{ label: "received", kind: "neutral" }}
                >
                  <p>{item.message}</p>
                </DashboardRow>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No support ticket yet"
              copy="Your support requests and messages will appear here."
              icon="SUP"
              action={<Link className="button-secondary" to="/contact">Contact support</Link>}
            />
          )}
        </div>

        <div id="saved-calculations">
          <SectionHeading eyebrow="Calculations" title="Saved calculations history" copy="Click a row to see the saved output." />
          {calculations.length ? (
            <div className="dashboard-list">
              {calculations.map(item => (
                <DashboardRow
                  key={item._id}
                  title={item.type === "paye" ? "PAYE estimate" : "Company tax estimate"}
                  meta={formatDate(item.createdAt)}
                  badge={{
                    label: item.type === "paye" ? formatCurrency(item.output?.monthlyTax || 0) : formatCurrency(item.output?.totalEstimatedTax || 0),
                    kind: "neutral"
                  }}
                >
                  {item.type === "paye" ? (
                    <>
                      <p>Annual income: {formatCurrency(item.input?.annualIncome || 0)}</p>
                      <p>Monthly PAYE: {formatCurrency(item.output?.monthlyTax || 0)}</p>
                      <p>Annual tax: {formatCurrency(item.output?.annualTax || 0)}</p>
                    </>
                  ) : (
                    <>
                      <p>Annual turnover: {formatCurrency(item.input?.annualTurnover || 0)}</p>
                      <p>Total estimate: {formatCurrency(item.output?.totalEstimatedTax || 0)}</p>
                      <p>Classification: {item.output?.classification || "-"}</p>
                    </>
                  )}
                </DashboardRow>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No saved calculations yet"
              copy="Run the calculator while signed in and your history will appear here."
              icon="CALC"
              action={<Link className="button-secondary" to="/calculator">Open calculator</Link>}
            />
          )}
        </div>
      </section>

      <section className="content-card split-card">
        <div>
          <SectionHeading eyebrow="Timeline" title="Recent activity timeline" copy="Your latest account activity in one stream." />
          {monetization.length || calculations.length || messages.length ? (
            <div className="dashboard-list">
              {[...monetization, ...calculations, ...messages]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
                .map(item => {
                  const title =
                    item.type === "paye"
                      ? "PAYE calculation"
                      : item.type === "company"
                        ? "Company tax calculation"
                        : prettyType(item.type || item.audience || "activity");

                  const meta =
                    item.paymentReference ||
                    item.taxUseCase ||
                    item.message ||
                    item.reportScope ||
                    item.selectedPlan ||
                    "-";

                  return (
                    <DashboardRow
                      key={item._id}
                      title={title}
                      meta={formatDate(item.createdAt)}
                      badge={{
                        label: item.paymentStatus || item.status || "saved",
                        kind: item.paymentStatus === "success" ? "success" : "neutral"
                      }}
                    >
                      <p>{meta}</p>
                    </DashboardRow>
                  );
                })}
            </div>
          ) : (
            <EmptyState title="No recent activity yet" copy="Your calculations, requests, and purchases will show here." icon="LOG" />
          )}
        </div>

        <div>
          <SectionHeading eyebrow="Quick actions" title="Next steps" copy="Jump into your common tasks." />
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
          <SectionHeading eyebrow="Admin" title="Admin summary" copy="Workspace-level metrics for administrators." />
          <div className="support-grid dashboard-grid">
            <div className="feature-card"><h3>Messages</h3><p>{adminStats?.messages ?? "-"}</p></div>
            <div className="feature-card"><h3>Calculations</h3><p>{adminStats?.calculations ?? "-"}</p></div>
            <div className="feature-card"><h3>Support leads</h3><p>{adminStats?.supportLeads ?? "-"}</p></div>
            <div className="feature-card"><h3>Consultations</h3><p>{adminStats?.consultations ?? "-"}</p></div>
            <div className="feature-card"><h3>PDF reports</h3><p>{adminStats?.pdfReports ?? "-"}</p></div>
            <div className="feature-card"><h3>Subscriptions</h3><p>{adminStats?.subscriptionRequests ?? "-"}</p></div>
          </div>
          {adminMonetization.length ? (
            <div className="dashboard-list">
              {adminMonetization.slice(0, 8).map(item => (
                <DashboardRow
                  key={item._id}
                  title={prettyType(item.type)}
                  meta={`${item.name} • ${item.email}`}
                  badge={{
                    label: item.paymentStatus || item.status,
                    kind: item.paymentStatus === "success" ? "success" : "neutral"
                  }}
                >
                  <p>Reference: {item.paymentReference || "-"}</p>
                  <p>Created: {formatDate(item.createdAt)}</p>
                </DashboardRow>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {status ? <p className="note-text">{status}</p> : null}
    </div>
  );
}
