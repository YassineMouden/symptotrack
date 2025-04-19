import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get path and token from request
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("next-auth.session-token") || 
                request.cookies.get("__Secure-next-auth.session-token");
  
  // Define authentication states
  const isAuth = !!token;
  const isAuthPage = 
    path.startsWith("/auth/signin") || 
    path.startsWith("/auth/signup") ||
    path.startsWith("/auth/forgot-password");
  
  // Redirect authenticated users away from auth pages
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }
  
  // Redirect unauthenticated users to login when accessing protected routes
  if (!isAuth && isProtectedRoute(path)) {
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Define protected routes that require authentication
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    "/profile",
    "/profile/edit",
  ];
  
  return protectedRoutes.some(route => pathname.startsWith(route));
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    '/profile/:path*',
    '/auth/:path*',
  ],
}; 