import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Public routes that anyone can visit
const isPublicRoute = createRouteMatcher([
    '/',               // Home
    '/sign-in(.*)',    // Clerk sign-in
    '/sign-up(.*)',    // Clerk sign-up
    '/public(.*)',     // Example other public routes
]);

// Routes that should redirect signed-in users AWAY from them
const isAuthPage = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    const { isAuthenticated, redirectToSignIn } = await auth();

    // Allow all public routes without auth
    if (isPublicRoute(req)) {
        // But redirect SIGNED-IN users away from auth pages
        if (isAuthenticated && isAuthPage(req)) {
            const dashboardUrl = new URL('/dashboard', req.url);
            return Response.redirect(dashboardUrl);
        }
        return; // allow access
    }

    // Protect all other routes
    if (!isAuthenticated) {
        return redirectToSignIn();
    }

    // Default: allow request
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