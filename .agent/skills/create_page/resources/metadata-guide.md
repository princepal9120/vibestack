# Next.js Metadata Guide (SEO)

## Static Metadata

Export a constant `metadata` object from your `layout.tsx` or `page.tsx`.

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your projects",
  openGraph: {
    title: "Dashboard | Vibe Stack",
    description: "Manage your projects",
    images: ["/og-image.png"],
  },
};
```

## Dynamic Metadata

Use `generateMetadata` for dynamic routes.

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.id);

  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      images: [project.coverImage],
    },
  };
}
```

## Templates (Layouts)

Use default and template titles in `layout.tsx` to handle suffixes automatically.

```typescript
// app/layout.tsx
export const metadata = {
  title: {
    template: "%s | Vibe Stack",
    default: "Vibe Stack",
  },
};
```
