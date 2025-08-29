// middleware.ts

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req) {
  const session = await auth();

  const isAuthPage = req.nextUrl.pathname.startsWith("/signin") || req.nextUrl.pathname.startsWith("/signup");
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLawyerRoute = req.nextUrl.pathname.startsWith("/lawyer");
  const isClientRoute = req.nextUrl.pathname.startsWith("/client");

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (session) {
    const userRole = session.user.role;

    // Admin-specific protection
    if (isAdminRoute && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Lawyer-specific protection
    if (isLawyerRoute && (userRole !== "LAWYER" && userRole !== "ADMIN")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Client-specific protection
    if (isClientRoute && (userRole !== "CLIENT" && userRole !== "ADMIN")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|signin|signup).*)"],
};
