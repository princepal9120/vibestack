import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
    "/projects/new(.*)",
    "/submit/(.*)",
    "/api/projects((?!/[^/]+$).*)", // POST to /api/projects
    "/api/comments(.*)",
    "/api/upvotes(.*)",
    "/api/users/(.*)",
]);

// Define public routes that don't need auth
const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/projects(.*)",
    "/profiles(.*)",
    "/users/(.*)",
    "/collections(.*)",
    "/resources(.*)",
    "/api/projects(.*)", // GET requests
    "/api/profiles(.*)",
    "/api/webhooks(.*)",
    "/api/resources/(.*)", // Resource metadata and submit
]);


export default clerkMiddleware(async (auth, req) => {
    // Protect routes that need authentication
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
