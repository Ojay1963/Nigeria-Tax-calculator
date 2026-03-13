import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Client render failure", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-shell">
          <main className="page-shell">
            <section className="content-card">
              <h2>Something went wrong</h2>
              <p>This page hit an unexpected error. Refresh and try again.</p>
            </section>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
