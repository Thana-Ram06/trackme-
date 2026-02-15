"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Dashboard error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="dashboard dashboard-error">
          <div className="dashboard-inner">
            <p className="dashboard-error-title">Something went wrong</p>
            <p className="dashboard-error-text">
              There was a problem loading the dashboard. Try refreshing the page
              or logging out and back in.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
