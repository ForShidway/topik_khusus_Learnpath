import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/src/lib/session-core";

// Route yang butuh login
const protectedRoutes = ["/dashboard"];
// Route yang tidak boleh diakses jika sudah login
const authRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionToken = req.cookies.get("session")?.value;
  const session = await decrypt(sessionToken);

  const isLoggedIn = !!session;
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthPage = authRoutes.some((r) => pathname.startsWith(r));

  // Belum login tapi akses route protected → redirect ke login
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login tapi akses halaman login/register → redirect ke dashboard
  if (isAuthPage && isLoggedIn) {
    const dashboardUrl =
      session.role === "admin" ? "/dashboard/admin" : "/dashboard/user";
    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  // Akses admin dashboard tapi bukan admin → redirect ke dashboard user
  if (pathname.startsWith("/dashboard/admin") && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals dan static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
