import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Get the current user from the database using Clerk auth
 * Returns null if not authenticated or user not found
 */
export async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

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
