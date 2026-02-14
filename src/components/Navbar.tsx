"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";
import LoginButton from "@/components/LoginButton";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link href="/" className="logo-wrapper">
          <Image
            src="/logo.png"
            alt="Track logo"
            width={32}
            height={32}
            className="logo-img"
          />
          <span className="brand-name">Track.me</span>
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

