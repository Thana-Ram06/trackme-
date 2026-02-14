"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type LoginButtonProps = {
  variant?: "primary" | "ghost";
};

export default function LoginButton({ variant = "primary" }: LoginButtonProps) {
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const router = useRouter();

  const handleClick = async () => {
    if (loading) return;

    if (!user) {
      await loginWithGoogle();
      router.push("/dashboard");
      return;
    }

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
      {!user ? "Sign in" : "Sign out"}
    </button>
  );
}

