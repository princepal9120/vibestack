---
name: create_api_route
description: Create a new Next.js API route following Vibe Stack backend standards (App Router, Zod, Clerk).
---

# Create API Route Skill

Use this skill when the user asks to create a new backend API endpoint.

## Standards & Patterns

### 1. File Structure

- Use Next.js App Router conventions: `app/api/[resource]/route.ts`.

### 2. Authentication & Authorization

- Use `auth()` from `@clerk/nextjs` to get the current user.
- **Always** check for `userId` if the route is protected.
- Return `401 Unauthorized` if no user and auth is required.

### 3. Validation

- Use `zod` for request body validation.
- Return `400 Bad Request` if validation fails.

### 4. Response Format

- Success: `{ data: T, meta: { timestamp: string } }`
- Error: `{ error: string, code: string, statusCode: number }`

### 5. Implementation Template

```typescript
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Validation Schema
const CreateResourceSchema = z.object({
  name: z.string().min(1),
  // ...other fields
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED", statusCode: 401 },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = CreateResourceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          code: "VALIDATION_ERROR",
          statusCode: 400,
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Business Logic (e.g., Prisma call)
    // const data = await prisma.resource.create(...)
    const data = { id: "123", ...result.data }; // Placeholder

    return NextResponse.json(
      { data, meta: { timestamp: new Date().toISOString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API_POST_ERROR]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        code: "INTERNAL_ERROR",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
```
