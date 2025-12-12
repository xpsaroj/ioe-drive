import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Routes that require authentication - Allowing Resources routes for non-logged-in users too
const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    // "/resources(.*)",
    "/community(.*)",
    "/marketplace(.*)",
    "/alumni(.*)",
    "/profile(.*)",
]);

// Routes that should redirect signed-in users away from them
const isAuthPage = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    const { isAuthenticated } = await auth();

    if (!isAuthenticated && isProtectedRoute(req)) {
        await auth.protect();
    }

    // Redirect signed-in users away from auth pages
    if (isAuthenticated && isAuthPage(req)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return;
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

        // Protect all API routes
        // BUT Clerk's own API routes are automatically excluded by Clerk
        '/(api|trpc)(.*)',
    ],
};