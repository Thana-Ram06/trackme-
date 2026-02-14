"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";
import LoginButton from "@/components/LoginButton";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-mark" />
        <Link href="/" className="navbar-brand">
          Track.me
        </Link>
      </div>

      <div className="navbar-center">
        <span>Calm subscription tracking for busy people.</span>
      </div>

      <div className="navbar-right">
        <ThemeToggle />
        <LoginButton variant="ghost" />
        {user && (
          <Link href="/dashboard" className="btn btn-sm btn-ghost">
            Dashboard
          </Link>
        )}
      </div>
    </header>
  );
}

