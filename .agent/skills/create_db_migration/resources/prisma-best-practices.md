# Prisma Best Practices

## 1. Naming

- Use **singular, PascalCase** for model names: `User`, `Post`, `Comment`.
- Use **camelCase** for fields: `firstName`, `isActive`.
- Explicitly map to plural table names if using an existing DB: `@@map("users")`.

## 2. IDs

Always use CUIDs (collision-resistant) for primary keys in new projects.

```prisma
id String @id @default(cuid())
```

## 3. Relations

Always explicitly name relation fields and foreign keys.

```prisma
// One-to-Many: User has many Posts
model User {
  id    String @id @default(cuid())
  posts Post[]
}

model Post {
  id        String @id @default(cuid())
  authorId  String
  author    User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([authorId]) // Important for performance!
}
```

## 4. Enums

Use Enums for state.

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  role Role @default(USER)
}
```
