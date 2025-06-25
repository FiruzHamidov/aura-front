export const PUBLIC_API_ROUTES = [
  "/login",
  "/sms/request",
  "/sms/verify",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/properties",
];

export const AUTH_REQUIRED_ROUTES = [
  "/favorites",
  "/profile",
  "/profile/favorites",
  "/profile/wallet",
  "/profile/my-listings",
  "/add-listing",
  "/dashboard",
];

export const AGENT_ONLY_ROUTES = [
  "/dashboard",
  "/dashboard/listings",
  "/dashboard/analytics",
  "/add-listing",
];

export const ADMIN_ONLY_ROUTES = [
  "/admin",
  "/admin/users",
  "/admin/listings",
  "/admin/reports",
];
