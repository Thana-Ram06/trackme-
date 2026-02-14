"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    if (!auth) {
      alert("Sign-in is not configured. Add Firebase env vars in Vercel.");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
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
