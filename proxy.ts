// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_REQUIRED_ROUTES } from "./constants/routes";

export function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;

  // Конвертируем POST от Bitrix в GET
  if (
    request.method === "POST" &&
    nextUrl.pathname.startsWith("/properties-widget")
  ) {
    return NextResponse.redirect(nextUrl, 303);
  }

  const authToken = cookies.get("auth_token")?.value;
  const isProtected = AUTH_REQUIRED_ROUTES.some((p) =>
    nextUrl.pathname.startsWith(p)
  );
  if (isProtected && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/properties-widget", // важно: чтобы сработал 303
    "/profile/:path*",
    "/favorites",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
