"use client";

// NextAuth
import { signIn } from "next-auth/react";

export default function NoSnuPage() {
  return (
    <main id="login-error-main-page">
      <h1>Only emails with '@snu.ac.kr' are allowed.</h1>
      <button onClick={() => signIn("google")}>
        <img src="/image/ico/google.webp" alt="Google Icon" className="google-icon" />
        Login with Google
      </button>
    </main>
  );
}