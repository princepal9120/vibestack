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


// In Next.js 16, the file convention changed from middleware.ts to proxy.ts
// The clerkMiddleware function still works the same way - it wraps our proxy function
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Initialize ratelimit conditionally to avoid errors during build or if env vars are missing
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: true,
        prefix: "@rate-limit",
    });
}

export default clerkMiddleware(async (auth, req) => {
    // Basic Rate Limiting for API routes
    if (req.nextUrl.pathname.startsWith("/api") && ratelimit) {
        const { userId } = await auth();
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const identifier = userId ?? ip;

        const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

        if (!success) {
            return new NextResponse("Too Many Requests", {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": limit.toString(),
                    "X-RateLimit-Remaining": remaining.toString(),
                    "X-RateLimit-Reset": reset.toString(),
                },
            });
        }
    }

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
