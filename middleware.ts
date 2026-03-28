import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookieName, roleCanAccess, verifyAccessToken } from "@/lib/access";

const protectedPrefixes = ["/store-board", "/ops", "/api/store-board", "/api/ops"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const session = await verifyAccessToken(request.cookies.get(getSessionCookieName())?.value);

  if (!session || !roleCanAccess(session.role, pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/access";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/store-board/:path*", "/ops/:path*", "/api/store-board/:path*", "/api/ops/:path*"]
};
