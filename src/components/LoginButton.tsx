"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type LoginButtonProps = {
  variant?: "primary" | "ghost";
};

export default function LoginButton({ variant = "primary" }: LoginButtonProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleClick = async () => {
    if (loading || !user) return;
    await logout();
    router.push("/");
  };

  const baseClass = "btn btn-sm";
  const variantClass =
    variant === "primary" ? "btn-primary" : "btn-ghost btn-pill";

  return (
    <button
      type="button"
      className={`${baseClass} ${variantClass}`}
      onClick={handleClick}
      disabled={loading}
    >
      Sign out
    </button>
  );
}

