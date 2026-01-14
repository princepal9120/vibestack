---
name: create_db_migration
description: Manage database schema changes and migrations using Prisma.
---

# Database Migration Skill

Use this skill when the user asks to modify the database or run a migration.

## Workflow

1.  **Modify Schema**: Edit `prisma/schema.prisma`.
2.  **Generate Migration**: Run `npx prisma migrate dev --name <descriptive_name>`.
3.  **Verify**: Check that the `prisma/migrations` folder contains the new SQL file.

## Standards & Patterns

### 1. Schema Design

- **Models**: `PascalCase` (e.g., `UserProfile`).
- **Fields**: `camelCase` (e.g., `firstName`).
- **IDs**: Always use CUID or UUID.
  ```prisma
  id String @id @default(cuid())
  ```
- **Timestamps**: Always include tracking fields.
  ```prisma
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ```

### 2. Indexes

- Add indexes for fields used in filters or joins.
- `@@index([userId])` is mandatory for relation foreign keys.

### 3. Commands

- **Development**: `npx prisma migrate dev` (Automatic generation + application).
- **Production**: `npx prisma migrate deploy` (Apply only).
- **Reset**: `npx prisma migrate reset` (Nuclear option - deletes data).

### 4. Example Model

```prisma
model Project {
  id          String   @id @default(cuid())
  title       String

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```
