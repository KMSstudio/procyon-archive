"use client";

// NextAuth
import { signIn } from "next-auth/react";

export default function BlockPage() {
  return (
    <main id="login-error-main-page">
      <h1>Unknown login error. Please try it again</h1>
      <button onClick={() => signIn("google")}>
        <img src="/image/ico/google.png" alt="Google Icon" className="google-icon" />
        Try Again
      </button>
    </main>
  );
}