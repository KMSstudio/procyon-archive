import { NextResponse } from "next/server";

export function middleware(req) {
  const blockedBrowsers = ["kakao", "kakaotalk", "everytime"];
  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";

  if (blockedBrowsers.some(browser => userAgent.includes(browser))) {
    return NextResponse.redirect(new URL("/err/browser", req.url)); // GET 요청으로 리디렉트
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
