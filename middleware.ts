import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // For now, all authenticated users can access admin
    // The actual admin check happens server-side in the page component
    // This just ensures they're logged in
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
