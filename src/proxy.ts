import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isAdmin = request.cookies.get("admin")?.value === "true";

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminPath && !isLoginPage && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
