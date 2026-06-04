import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Expose the request pathname to server components (the root layout reads it
// via headers() to exempt /check, /report, /lookup from the COMING_SOON gate).
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Run on page requests; skip Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
