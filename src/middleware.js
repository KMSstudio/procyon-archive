import { NextResponse } from "next/server";

export function middleware(req) {
  const blockedBrowsers = ["kakao", "kakaotalk", "everytime"];
  const kakaotalk = ["kakao", "kakaotalk"];
  const everytime = ["everytime"];
  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";

  if (kakaotalk.some(keyword => userAgent.includes(keyword))) {
    return NextResponse.redirect(new URL("/err/browser/kakaotalk", req.url)); }
  if (everytime.some(keyword => userAgent.includes(keyword))) {
    return NextResponse.redirect(new URL("/err/browser/everytime", req.url)); }
  if (blockedBrowsers.some(browser => userAgent.includes(browser))) {
    return NextResponse.redirect(new URL("/err/browser", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
