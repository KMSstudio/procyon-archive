import { NextResponse } from "next/server";

export function middleware(req) {
  // List of allowed browsers
  const allowedBrowsers = ["chrome", "firefox", "safari", "edg"];

  // Retrieve the 'user-agent' from the request headers
  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";
  console.log(userAgent);

  // Check if the browser is in the allowed list
  const isValidBrowser = allowedBrowsers.some(browser => userAgent.includes(browser));

  // Redirect users using unsupported browsers
  if (!isValidBrowser) {
    return NextResponse.redirect(new URL("/login/unknown", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/api/auth/signin/google"],
};