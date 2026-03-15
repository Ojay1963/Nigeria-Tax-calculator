import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuthenticated, user, logout, authLoading } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const navItems = [
    ["Home", "/"],
    ["Calculator", "/calculator"],
    ["Pricing", "/pricing"],
    ["Contact", "/contact"]
  ];
  const resourceItems = [
    ["Tax Guide", "/guide"],
    ["FAQ", "/faq"],
    ["Verify Email", "/verify-email"]
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
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
  }, [location.pathname]);

  function closeMenu() {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
  }

  return (
    <header className={isScrolled ? "site-header is-scrolled" : "site-header"}>
      {isMenuOpen ? <button className="menu-backdrop" type="button" aria-label="Close menu" onClick={closeMenu} /> : null}
      <div className="header-main">
        <div className="brand-block">
          <div className="brand-identity">
            <img className="brand-logo" src="/naija-tax-calculator-logo.png" alt="Naija Tax Calculator logo" />
            <div className="brand-wordmark">
              <span className="brand-kicker">Naija Tax Calculator</span>
              <strong>NAIJA TAX CALCULATOR</strong>
            </div>
          </div>
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
              Resources
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
              <NavLink to="/register" className="nav-link action-link" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const footerGroups = [
    {
      title: "Product",
      links: [
        ["Calculator", "/calculator"],
        ["Pricing", "/pricing"],
        ["Tax Guide", "/guide"],
        ["FAQ", "/faq"]
      ]
    },
    {
      title: "Company",
      links: [
        ["Home", "/"],
        ["Contact", "/contact"],
        ["Register", "/register"]
      ]
    },
    {
      title: "Account",
      links: [
        ["Dashboard", "/dashboard"],
        ["Login", "/login"],
        ["Sign Up", "/register"],
        ["Verify Email", "/verify-email"]
      ]
    },
    {
      title: "Legal",
      links: [
        ["Privacy", "/privacy"],
        ["Terms", "/terms"]
      ]
    }
  ];

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <strong>Naija Tax Calculator</strong>
        <p>Nigerian PAYE and company-tax estimates.</p>
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
      </main>
      <Footer />
    </div>
  );
}
