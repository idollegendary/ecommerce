import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth/");
  const isProtectedUser = ["/cart", "/checkout", "/profile"].some((p) => pathname.startsWith(p));
  const isProtectedAdmin = pathname.startsWith("/admin");

  if (isAuthRoute && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if ((isProtectedUser || isProtectedAdmin) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/cart", "/checkout", "/profile", "/admin/:path*"],
};

