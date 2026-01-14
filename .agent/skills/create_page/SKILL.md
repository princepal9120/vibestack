---
name: create_page
description: Create a new Next.js App Router page (Server Component) with proper metadata and layout.
---

# Create Page Skill

Use this skill when the user asks to create a new route or page in the application.

## Standards & Patterns

### 1. File Structure

- Path: `app/[route]/page.tsx` (or `app/(group)/[route]/page.tsx`).
- **Always** use Server Components by default (no `'use client'` unless specific interaction is needed, in which case prefer extracting to a client component).
- Colocate `loading.tsx` and `error.tsx` if the page fetches data.

### 2. Metadata (SEO)

- Export a `metadata` object or `generateMetadata` function.
- Include `title` and `description`.

### 3. Data Fetching

- Fetch data directly in the Server Component (async/await).
- Use `Suspense` for granular loading states.

### 4. Implementation Template

```tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Page Title | Vibe Stack",
  description: "Description of the page content",
};

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  // const data = await getData(params.slug);

  return (
    <main className="container py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
        <p className="text-muted-foreground">Subtitle or description.</p>
      </header>

      <section>
        <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
          {/* <ProjectList /> */}
          <div className="p-4 border rounded-lg">Content goes here</div>
        </Suspense>
      </section>
    </main>
  );
}
```
