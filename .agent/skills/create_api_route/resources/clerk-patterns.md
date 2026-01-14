# Clerk Auth Patterns (Next.js App Router)

## 1. Getting Current User (Server)

Used in API Routes and Server Components.

```typescript
import { auth, currentUser } from "@clerk/nextjs";

// Fast: Just gets the ID (Use this for DB queries)
const { userId } = auth();

// Slow: Fetches full user object (avoid if ID is enough)
const user = await currentUser();
```

## 2. Protecting an API Route

```typescript
export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // ... implementation
}
```

## 3. Checking Organization

```typescript
const { userId, orgId, orgRole } = auth();

if (!orgId) {
  // User not in an org
}
```
