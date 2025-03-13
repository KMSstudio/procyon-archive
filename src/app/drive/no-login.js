"use client";

import { signIn } from "next-auth/react";
import "@/app/styles/err.css";

export default function NoLoginComponent() {
  return (
    <div id="login-error-main-page">
      <h1>Login to access Archive.</h1>
      <button onClick={() => signIn("google")}>
        <img src="/image/ico/google.png" alt="Google Icon" className="google-icon" />
        Login with Google
      </button>
    </div>
  );
}