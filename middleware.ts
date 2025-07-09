import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_REQUIRED_ROUTES,
  AGENT_ONLY_ROUTES,
  ADMIN_ONLY_ROUTES,
} from "./constants/routes";

function requiresAuth(pathname: string): boolean {
  return AUTH_REQUIRED_ROUTES.some((route) => pathname.startsWith(route));
}

function isAgentOnlyRoute(pathname: string): boolean {
  return AGENT_ONLY_ROUTES.some((route) => pathname.startsWith(route));
}

function isAdminOnlyRoute(pathname: string): boolean {
  return ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));
}

function getUserFromCookies(request: NextRequest): {
  id: number;
  role: string;
  name: string;
  email: string;
} | null {
  try {
    const userCookie = request.cookies.get("user_data")?.value;

    if (!userCookie) {
      return null;
    }

    const decoded = decodeURIComponent(userCookie);
    const parsed = JSON.parse(decoded);

    if (!parsed.id || !parsed.role || !parsed.name || !parsed.email) {
      console.error("Invalid user data structure:", parsed);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname;

  const isDev = process.env.NODE_ENV === "development";
  const debugEnabled = process.env.NEXT_PUBLIC_DEBUG_MIDDLEWARE === "true";

  if (isDev || debugEnabled) {
    console.log(`🌐 [Middleware] ${hostname}${pathname}`);
  }

  const authToken = request.cookies.get("auth_token")?.value;
  const user = getUserFromCookies(request);

  const isAuthenticated = !!authToken && !!user;
  const userRole = user?.role?.toLowerCase() || "guest";

  if (requiresAuth(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && pathname === "/login") {
    const redirectTo = request.nextUrl.searchParams.get("redirect");
    if (redirectTo && redirectTo !== "/login") {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthenticated) {
    if (
      isAgentOnlyRoute(pathname) &&
      userRole !== "agent" &&
      userRole !== "admin"
    ) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    if (isAdminOnlyRoute(pathname) && userRole !== "admin") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  const response = NextResponse.next();

  if (isAuthenticated && user) {
    response.headers.set("x-user-id", user.id.toString());
    response.headers.set("x-user-role", userRole);
    response.headers.set("x-user-email", user.email);
    response.headers.set("x-is-authenticated", "true");
  } else {
    response.headers.set("x-is-authenticated", "false");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)"],
};
