import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE_NAME = "gai_admin_session";
const JWT_SECRET_STRING = process.env.JWT_SECRET || "gai-pro-secure-jwt-key-2026-bangladesh";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. If accessing Admin Login while already authenticated -> redirect to dashboard
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  // 2. Protect Admin Frontend Pages (/admin, /admin/pricing, etc.)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      addSecurityHeaders(response);
      return response;
    }
  }

  // 3. Protect Admin API Routes (/api/admin/* except /api/admin/auth/login)
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/auth/login") {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=()"
  );
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
