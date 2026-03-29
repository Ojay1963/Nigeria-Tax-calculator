import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdSlot from "./AdSlot";
import StickyMobileCta from "./StickyMobileCta";

function Header() {
  const { isAuthenticated, user, logout, authLoading } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [installMessage, setInstallMessage] = useState("");
  const [isInstalled, setIsInstalled] = useState(() =>
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true)
  );
  const navItems = [
    ["Home", "/"],
    ["Calculator", "/calculator"],
    ["PAYE Nigeria", "/paye-calculator-nigeria"],
    ["About", "/about"],
    ["Guide", "/guide"],
    ["Contact", "/contact"]
  ];
  const resourceItems = [
    ["VAT calculator", "/vat-calculator-nigeria"],
    ["Profit calculator", "/profit-calculator-nigeria"],
    ["Loan calculator", "/loan-calculator-nigeria"],
    ["Expense tracker", "/business-expense-tracker"],
    ["FAQ", "/faq"]
  ];
  const resourcesActive = resourceItems.some(([, path]) => location.pathname.startsWith(path));

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 960) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setDeferredInstallPrompt(event);
      setInstallMessage("");
    }

    function handleAppInstalled() {
      setDeferredInstallPrompt(null);
      setIsInstalled(true);
      setInstallMessage("App installed.");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
  }, [location.pathname]);

  function closeMenu() {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
  }

  async function handleInstallClick() {
    if (isInstalled) {
      setInstallMessage("App already installed.");
      return;
    }

    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choiceResult = await deferredInstallPrompt.userChoice.catch(() => null);
      if (choiceResult?.outcome === "accepted") {
        setInstallMessage("Install started.");
      } else if (choiceResult?.outcome === "dismissed") {
        setInstallMessage("Install dismissed.");
      }
      setDeferredInstallPrompt(null);
      return;
    }

    setInstallMessage("Use your browser menu to install or add this app to your home screen.");
  }

  return (
    <header className={isScrolled ? "site-header is-scrolled" : "site-header"}>
      {isMenuOpen ? <button className="menu-backdrop" type="button" aria-label="Close menu" onClick={closeMenu} /> : null}
      <div className="header-main">
        <div className="brand-block">
          <NavLink to="/" className="brand-identity" onClick={closeMenu}>
            <img className="brand-logo" src="/naija-tax-calculator-logo.svg" alt="Naija Tax Calculator logo" width="48" height="48" fetchpriority="high" />
            <div className="brand-wordmark">
              <span className="brand-kicker">Naija Tax Calculator</span>
              <strong>NAIJA TAX CALCULATOR</strong>
            </div>
          </NavLink>
        </div>

        <button
          className={isMenuOpen ? "menu-toggle is-open" : "menu-toggle"}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
          onClick={() => setIsMenuOpen(current => !current)}
        >
          <span className="menu-toggle-line" />
          <span className="menu-toggle-line" />
          <span className="menu-toggle-line" />
          <span className="sr-only">Toggle navigation</span>
        </button>

        <nav
          id="primary-nav"
          className={isMenuOpen ? "site-nav nav-open fade-up fade-up-delay-2" : "site-nav fade-up fade-up-delay-2"}
          aria-label="Primary"
        >
          {navItems.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
          <div className={isResourcesOpen ? "nav-dropdown is-open" : "nav-dropdown"}>
            <button
              className={resourcesActive ? "nav-link nav-dropdown-trigger active" : "nav-link nav-dropdown-trigger"}
              type="button"
              aria-expanded={isResourcesOpen}
              onClick={() => setIsResourcesOpen(current => !current)}
            >
              Tools
            </button>
            <div className="nav-dropdown-menu">
              {resourceItems.map(([label, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => (isActive ? "nav-dropdown-item active" : "nav-dropdown-item")}
                  onClick={closeMenu}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className={isMenuOpen ? "header-actions actions-open fade-up fade-up-delay-3" : "header-actions fade-up fade-up-delay-3"}>
          {!isInstalled ? (
            <button className="nav-button install-button" type="button" onClick={handleInstallClick}>
              Install app
            </button>
          ) : null}
          {authLoading ? null : isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="nav-link action-link" onClick={closeMenu}>
                Dashboard
              </NavLink>
              <span className="nav-user">{user?.name || user?.email}</span>
              <button
                className="nav-button"
                type="button"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link action-link" onClick={closeMenu}>
                Login
              </NavLink>
            </>
          )}
        </div>
        {installMessage ? <p className="install-hint">{installMessage}</p> : null}
      </div>
    </header>
  );
}

function Footer() {
  const { isAuthenticated } = useAuth();
  const year = new Date().getFullYear();
  const footerGroups = [
    {
      title: "Core calculators",
      links: [
        ["Calculator", "/calculator"],
        ["PAYE Calculator Nigeria", "/paye-calculator-nigeria"],
        ["VAT Calculator Nigeria", "/vat-calculator-nigeria"],
        ["Company tax calculator", "/calculator?tab=company"]
      ]
    },
    {
      title: "Business tools",
      links: [
        ["Profit Calculator Nigeria", "/profit-calculator-nigeria"],
        ["Loan Calculator Nigeria", "/loan-calculator-nigeria"],
        ["Business Expense Tracker", "/business-expense-tracker"]
      ]
    },
    {
      title: "Learn",
      links: [["Home", "/"], ["About", "/about"], ["Tax Guide", "/guide"], ["FAQ", "/faq"], ["Contact", "/contact"]]
    },
    {
      title: "Account",
      links: [
        ["Dashboard", "/dashboard"],
        ["Login", "/login"],
        ...(isAuthenticated ? [] : [["Create account", "/register"]]),
        ["Privacy", "/privacy"],
        ["Terms", "/terms"]
      ]
    }
  ];

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <NavLink to="/" className="footer-brand-lockup">
          <img className="footer-logo" src="/naija-tax-calculator-logo.svg" alt="Naija Tax Calculator logo" loading="lazy" width="38" height="38" />
          <div>
            <strong>Naija Tax Calculator</strong>
            <p>Nigerian PAYE, VAT, loan, and company-tax estimates in one place.</p>
          </div>
        </NavLink>
      </div>
      <div className="footer-grid">
        {footerGroups.map(group => (
          <div key={group.title} className="footer-column">
            <span>{group.title}</span>
            {group.links.map(([label, path]) => (
              <NavLink key={path} to={path} className="footer-link">
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-meta">
        <p>{year} Naija Tax Calculator</p>
        <span className="footer-meta-dot" aria-hidden="true" />
        <p>Estimates only. Confirm final filing with the relevant tax authority or an adviser.</p>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="app-shell">
      <div className="background-orb orb-a" />
      <div className="background-orb orb-b" />
      <Header />
      <main className="page-shell">
        <Outlet />
        <AdSlot className="shell-ad shell-ad-bottom" label="Pre-footer placement for responsive ads and sponsored links" />
      </main>
      <Footer />
      <StickyMobileCta />
    </div>
  );
}
