---
name: create_feature
description: Guide to implementing a complete end-to-end feature (DB -> API -> UI -> Page).
---

# Complete Feature Skill

Use this skill when the user asks to build a full feature (e.g., "Build a comment system" or "Add project upvoting").

## Workflow

Execute these steps in order. Do not skip steps unless the component already exists.

### Step 1: Database Layer

**Skill Reference:** `create_db_migration`

1. Define the data model in `prisma/schema.prisma`.
2. Run the migration to update the DB.

### Step 2: Backend API

**Skill Reference:** `create_api_route`

1. Create the API route (`app/api/.../route.ts`).
2. Implement validation (Zod) and authorization (Clerk).
3. Connect to the database (Prisma).

### Step 3: UI Components

**Skill Reference:** `create_component`

1. Create the reusable UI parts (forms, cards, buttons).
2. Add interactions and animations.
3. Use client-side logic for API calls (fetch/mutation).

### Step 4: Page Assembly

**Skill Reference:** `create_page`

1. Create the main page (`app/.../page.tsx`).
2. Fetch initial data server-side.
3. Compose the UI components.

## Example: Building "Comments"

1. **DB**: Add `Comment` model to Prisma. Run migration.
2. **API**: Create `POST /api/comments` and `GET /api/comments`.
3. **UI**: Create `CommentForm.tsx` (client) and `CommentList.tsx`.
4. **Page**: Add `<CommentSection />` to the Project Detail page.
