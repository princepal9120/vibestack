import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Get the current user from the database using Clerk auth
 * Auto-creates user in DB if authenticated with Clerk but not yet synced
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    // Try to find existing user
    let user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    // If not found, auto-create from Clerk data (for local dev where webhooks don't work)
    if (!user) {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return null;
        }

        const email = clerkUser.emailAddresses[0]?.emailAddress || "";
        const username = clerkUser.username || email.split("@")[0] || `user_${userId.slice(-8)}`;

        try {
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email,
                    username,
                    avatar: clerkUser.imageUrl || null,
                    bio: clerkUser.firstName || clerkUser.lastName
                        ? `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()
                        : null,
                },
            });
            console.log(`[Auth] Auto-created user ${user.id} from Clerk`);
        } catch (error) {
            // Handle unique constraint errors (race condition or duplicate)
            console.error("[Auth] Error auto-creating user:", error);

            // Try to fetch again in case of race condition
            user = await prisma.user.findUnique({
                where: { clerkId: userId },
            });
        }
    }

    return user;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    return user;
}
