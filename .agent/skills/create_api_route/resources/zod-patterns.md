# Zod Validation Patterns

## Primitive Types

```typescript
z.string().min(1, "Required");
z.string().email("Invalid email");
z.string().url("Invalid URL");
z.number().min(0).max(100);
z.boolean();
```

## Arrays & Objects

```typescript
// Array of strings
z.array(z.string());

// Object with optional field
z.object({
  name: z.string(),
  bio: z.string().optional(),
});
```

## Enums

```typescript
const STATUS = ["PENDING", "ACTIVE", "ARCHIVED"] as const;
z.enum(STATUS);
```

## Common API Schema

```typescript
export const CreateProjectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  tags: z.array(z.string()).max(5),
  isPublic: z.boolean().default(false),
});
```
