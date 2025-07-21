import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_REQUIRED_ROUTES } from "./constants/routes";

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;

  const authToken = cookies.get("auth_token")?.value;

  const isProtected = AUTH_REQUIRED_ROUTES.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/favorites", "/dashboard/:path*"],
};
