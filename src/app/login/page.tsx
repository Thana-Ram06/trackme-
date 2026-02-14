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
    } catch (error: unknown) {
      console.error("Login error:", error);
      const code = error && typeof error === "object" && "code" in error ? (error as { code?: string }).code : "";
      if (code === "auth/unauthorized-domain") {
        alert("This domain is not allowed. Add it in Firebase Console → Authentication → Settings → Authorized domains.");
      } else if (code === "auth/popup-blocked") {
        alert("Popup was blocked. Allow popups for this site and try again.");
      } else {
        alert(`Login failed${code ? ` (${code})` : ""}`);
      }
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
