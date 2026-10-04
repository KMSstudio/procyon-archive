// @/proxy.js

import { NextResponse } from "next/server";

const BLOCKED_BROWSERS = [
  {
    keywords: ["kakao", "kakaotalk"],
    redirect: "/err/browser/kakaotalk",
  },
  {
    keywords: ["everytime"],
    redirect: "/err/browser/everytime",
  },
];

/**
 * Redirects requests from unsupported in-app browsers.
 * @param {import("next/server").NextRequest} request
 */
export function proxy(request) {
  const userAgent =
    request.headers.get("user-agent")?.toLowerCase() || "";
  const blockedBrowser = BLOCKED_BROWSERS.find(({ keywords }) =>
    keywords.some(keyword => userAgent.includes(keyword))
  );

  if (blockedBrowser) {
    return NextResponse.redirect(
      new URL(blockedBrowser.redirect, request.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/drive/:path*"],
};
