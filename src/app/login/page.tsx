"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleGoogleLogin = async () => {
    if (!auth) {
      alert("Sign-in is not configured. Add Firebase env vars in Vercel.");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const path = redirectTo.startsWith("/") ? redirectTo : "/" + redirectTo;
      router.push(path);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h1>Sign in</h1>
      <button type="button" onClick={handleGoogleLogin} className="btn btn-lg btn-primary">
        Sign in with Google
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="login-container">
        <h1>Sign in</h1>
        <p>Loading…</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
