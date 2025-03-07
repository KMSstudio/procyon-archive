"use client";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    signIn("google", { callbackUrl: "/" });
  }, []);

  return <p>Redirecting to Google login...</p>;
}