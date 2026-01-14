# Technical Specification (TechSpec)
## Vibe Stack – Architecture & Implementation

**Document Version:** 1.0  
**Last Updated:** January 14, 2026  
**Status:** Active Development  
**Audience:** Engineering Team, DevOps, QA

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Design](#database-design)
5. [API Specification](#api-specification)
6. [Authentication & Security](#authentication--security)
7. [Frontend Architecture](#frontend-architecture)
8. [Deployment & Infrastructure](#deployment--infrastructure)
9. [Scalability & Performance](#scalability--performance)
10. [Testing Strategy](#testing-strategy)
11. [Monitoring & Observability](#monitoring--observability)

---

## Architecture Overview

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                    │
│        React 18 + TailwindCSS + Next.js App Router          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Edge Layer (Vercel CDN)                     │
│  - Cached static assets                                      │
│  - Fast global distribution                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Application Layer (Next.js)                  │
│  - App Router (file-based routing)                          │
│  - API Routes (edge functions)                              │
│  - Server Components + Client Components                    │
│  - Middleware (auth validation)                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐     ┌──────────┐    ┌──────────┐
    │ Clerk    │     │PostgreSQL│    │Cloudinary│
    │ Auth SaaS│     │  DB      │    │ Storage  │
    └──────────┘     └──────────┘    └──────────┘
```

### Architectural Layers

| Layer | Technology | Responsibility |
|-------|-----------|-----------------|
| **Presentation** | React 18, TailwindCSS | UI rendering, client interactions, state management |
| **Application** | Next.js 14 App Router | Routing, server/client logic, middleware |
| **API** | Next.js API Routes | RESTful endpoints, business logic, validation |
| **Data Access** | Prisma ORM | Database abstraction, query building, migrations |
| **Database** | PostgreSQL 14+ | Persistent data storage, indexing, transactions |
| **Authentication** | Clerk | User identity, session management, webhooks |
| **Storage** | Cloudinary | Image hosting, CDN delivery, optimization |

---

## Technology Stack

### Frontend

```
Framework:        Next.js 14+ (App Router, TypeScript)
UI Library:       React 18+
Styling:          TailwindCSS 3+
Forms:            React Hook Form + Zod validation
Icons:            Lucide React
HTTP Client:      Native Fetch + SWR (React Query Phase 2)
State:            React Context + local component state
```

### Backend

```
Runtime:          Node.js 18+ LTS
Framework:        Next.js 14 API Routes
Language:         TypeScript
ORM:              Prisma 5+
Database Driver:  PostgreSQL (pg)
Validation:       Zod
Environment:      dotenv for config
```

### Infrastructure & Services

```
Hosting:          Vercel (Next.js optimized)
Database:         PostgreSQL 14+ (managed service: Vercel Postgres, Railway, Supabase)
Authentication:   Clerk (SaaS)
File Storage:     Cloudinary (SaaS)
CDN:              Vercel Edge Network + Cloudinary CDN
DNS:              Vercel + custom domain
Monitoring:       Vercel Analytics + Sentry (Phase 2)
CI/CD:            GitHub Actions
```

### Development Tools

```
Package Manager:   npm 9+
Build Tool:        Next.js built-in (webpack/turbopack)
Linting:           ESLint + Prettier
Testing:           Jest + React Testing Library (Phase 2)
Type Checking:     TypeScript
Version Control:   Git + GitHub
```

---

## System Architecture

### Component Architecture

```
vibe-stack/
├── app/
│   ├── layout.tsx                    [Root layout + Clerk provider]
│   ├── (auth)/                       [Auth routes group]
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── callback/
│   ├── (main)/                       [Main app group]
│   │   ├── layout.tsx                [Main navbar + footer]
│   │   ├── page.tsx                  [Homepage]
│   │   ├── profiles/
│   │   │   └── [id]/                 [Platform detail page]
│   │   ├── projects/
│   │   │   ├── page.tsx              [Gallery + filters]
│   │   │   ├── new/                  [Upload form]
│   │   │   └── [id]/                 [Project detail + comments]
│   │   ├── users/
│   │   │   └── [username]/           [User profile page]
│   │   └── collections/
│   │       └── [id]/                 [Collection detail]
│   └── api/
│       ├── auth/
│       ├── projects/
│       ├── comments/
│       ├── upvotes/
│       ├── users/
│       ├── profiles/
│       └── webhooks/
│           └── clerk.ts              [User sync webhook]
├── lib/
│   ├── prisma.ts                     [Prisma singleton]
│   ├── auth.ts                       [Auth utilities]
│   ├── validators.ts                 [Zod schemas]
│   └── cloudinary.ts                 [Image upload]
├── components/
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── project-card.tsx
│   ├── project-form.tsx
│   ├── comment-section.tsx
│   ├── filter-bar.tsx
│   └── user-card.tsx
├── public/
│   ├── profiles.json                 [Platform seed data]
│   ├── workflows.json                [Workflow templates]
│   └── collections.json              [Curated collections]
├── prisma/
│   ├── schema.prisma                 [Data model]
│   └── migrations/                   [Schema versions]
├── styles/
│   └── globals.css                   [Tailwind imports]
└── instrumentation.ts                [Observability – Phase 2]
```

### Data Flow Architecture

```
User Action (UI)
    │
    ▼
React Event Handler
    │
    ▼
API Route (/api/...)
    │
    ├─→ Clerk Auth Validation
    │
    ├─→ Input Validation (Zod)
    │
    ├─→ Business Logic
    │
    ├─→ Prisma Query
    │
    ▼
PostgreSQL Database
    │
    ├─→ Execute Query
    │
    ├─→ Return Result
    │
    ▼
API Response (JSON)
    │
    ▼
Client State Update
    │
    ▼
UI Re-render (React)
    │
    ▼
User Sees Changes
```

---

## Database Design

### Entity Relationship Diagram (ERD)

```
User
├── id (PK)
├── clerkId (UK)
├── email (UK)
├── username (UK)
├── avatar (nullable)
├── bio (nullable)
├── githubUrl (nullable)
├── twitterUrl (nullable)
└── timestamps

Project
├── id (PK)
├── title
├── description
├── longDescription (nullable)
├── authorId (FK → User)
├── platforms (array)
├── techStack (array)
├── category
├── githubUrl (nullable)
├── liveUrl (nullable)
├── screenshots (array)
├── keyInsights (nullable)
├── upvoteCount (denormalized)
├── commentCount (denormalized)
├── viewCount (denormalized)
├── featured (boolean)
└── timestamps

Upvote
├── id (PK)
├── userId (FK → User)
├── projectId (FK → Project)
├── unique(userId, projectId)
└── timestamp

Comment
├── id (PK)
├── content
├── projectId (FK → Project)
├── authorId (FK → User)
├── upvoteCount (denormalized)
└── timestamps

Collection
├── id (PK)
├── title
├── description
├── projectIds (array)
├── curator (nullable)
└── timestamps

PlatformProfile
├── id (PK)
├── platformId (UK)
├── name
├── websiteUrl (nullable)
├── description
├── setupGuide (markdown)
├── cheatSheet (array)
└── timestamps
```

### Indexing Strategy

```sql
-- Performance Critical Indexes

-- Projects: Filter by platform, category, date
CREATE INDEX idx_projects_platforms ON projects USING GIN(platforms);
CREATE INDEX idx_projects_category_createdAt ON projects(category, createdAt DESC);
CREATE INDEX idx_projects_trending ON projects(upvoteCount DESC, createdAt DESC);

-- Projects: Search
CREATE INDEX idx_projects_title_search ON projects USING GIN(to_tsvector('english', title));
CREATE INDEX idx_projects_description_search ON projects USING GIN(to_tsvector('english', description));

-- Author lookup
CREATE INDEX idx_projects_authorId ON projects(authorId);

-- Comments: Fast lookup
CREATE INDEX idx_comments_projectId ON comments(projectId);
CREATE INDEX idx_comments_authorId ON comments(authorId);

-- Upvotes: User upvote checks
CREATE INDEX idx_upvotes_userId_projectId ON upvotes(userId, projectId);
CREATE INDEX idx_upvotes_projectId ON upvotes(projectId);

-- Users: Fast lookups
CREATE INDEX idx_users_clerkId ON users(clerkId);
CREATE INDEX idx_users_username ON users(username);
```

### Query Optimization

**High-Frequency Queries:**

1. **Get projects with filters** (most common)
   ```sql
   -- Cache for 5 minutes
   SELECT * FROM projects 
   WHERE platforms @> ARRAY[?]::text[]
   AND category = ?
   ORDER BY createdAt DESC
   LIMIT 20;
   ```

2. **Get single project with comments**
   ```sql
   -- Use connection pooling
   SELECT p.*, c.* FROM projects p
   LEFT JOIN comments c ON p.id = c.projectId
   WHERE p.id = ?;
   ```

3. **Check upvote existence**
   ```sql
   -- Should hit index
   SELECT id FROM upvotes 
   WHERE userId = ? AND projectId = ?;
   ```

---

## API Specification

### Core Endpoints

#### Projects

```
GET    /api/projects
       Query params: platform, category, sort, search
       Response: Project[]
       Rate limit: 100/min (public)

POST   /api/projects
       Auth: Required (Clerk)
       Body: ProjectFormInput (Zod validated)
       Response: Project (201)
       Rate limit: 10/min per user

GET    /api/projects/[id]
       Response: Project (with comments)
       Side effect: Increments viewCount
       Rate limit: 500/min (public)

PATCH  /api/projects/[id]
       Auth: Required (owner only)
       Body: Partial<ProjectFormInput>
       Response: Project (200)
       Rate limit: 20/min per user

DELETE /api/projects/[id]
       Auth: Required (owner only)
       Response: { message: "deleted" } (200)
       Rate limit: 10/min per user
```

#### Upvotes

```
POST   /api/projects/[id]/upvote
       Auth: Required
       Body: {}
       Response: { message: "upvoted" } (201)
       Side effect: Increments project.upvoteCount
       Rate limit: 100/min per user

DELETE /api/projects/[id]/upvote
       Auth: Required
       Response: { message: "removed" } (200)
       Side effect: Decrements project.upvoteCount
       Rate limit: 100/min per user
```

#### Comments

```
GET    /api/projects/[id]/comments
       Response: Comment[]
       Rate limit: 200/min (public)

POST   /api/projects/[id]/comments
       Auth: Required
       Body: { content: string }
       Response: Comment (201)
       Side effect: Increments project.commentCount
       Rate limit: 30/min per user

PATCH  /api/comments/[id]
       Auth: Required (author only)
       Body: { content: string }
       Response: Comment (200)
       Rate limit: 20/min per user

DELETE /api/comments/[id]
       Auth: Required (author only)
       Response: { message: "deleted" } (200)
       Side effect: Decrements project.commentCount
       Rate limit: 20/min per user
```

#### Users

```
GET    /api/users/[username]
       Response: User + Projects
       Rate limit: 500/min (public)

PATCH  /api/users/[id]
       Auth: Required (owner only)
       Body: UserProfileInput (Zod validated)
       Response: User (200)
       Rate limit: 10/min per user
```

#### Profiles (Read-only)

```
GET    /api/profiles
       Response: PlatformProfile[]
       Cache: 1 hour (static)
       Rate limit: 1000/min (public)

GET    /api/profiles/[id]
       Response: PlatformProfile
       Cache: 1 hour (static)
       Rate limit: 1000/min (public)
```

### Response Format (Standard)

**Success (200):**
```json
{
  "data": { /* response object */ },
  "meta": { "timestamp": "2026-01-14T20:35:00Z" }
}
```

**Created (201):**
```json
{
  "data": { /* created object */ },
  "meta": { "timestamp": "2026-01-14T20:35:00Z" }
}
```

**Error (4xx, 5xx):**
```json
{
  "error": "descriptive error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "details": { /* optional additional info */ }
}
```

---

## Authentication & Security

### Authentication Flow

```
1. User visits /sign-in
   └→ Clerk SignIn component
   
2. User enters credentials
   └→ Clerk validates
   
3. Clerk creates session
   └→ Session token stored in secure cookie
   
4. Frontend calls API route
   └→ Middleware validates Clerk token
   
5. On first sign-up, Clerk webhook fires
   └→ POST /api/webhooks/clerk
   └→ User record synced to PostgreSQL
   
6. API route calls getCurrentUser()
   └→ Retrieves user from PostgreSQL
   └→ Passed to business logic
```

### Security Implementation

**Authentication:**
- ✅ Clerk for user management (handles password hashing, session management)
- ✅ Webhook verification (SVIX library validates webhook signatures)
- ✅ Secure session cookies (httpOnly, secure, sameSite=Lax)

**Authorization:**
- ✅ Row-level security: Check `authorId === currentUser.id` before updates/deletes
- ✅ Protected routes: Use `@clerk/nextjs` middleware
- ✅ API protection: Validate `getCurrentUser()` on write endpoints

**Data Validation:**
- ✅ Zod schemas on all API endpoints
- ✅ Type-safe form validation (React Hook Form)
- ✅ HTML entity escaping before rendering user content

**HTTPS & Transport:**
- ✅ All traffic encrypted (Vercel auto-HTTPS)
- ✅ HSTS header enabled (Vercel default)
- ✅ Secure Cloudinary URLs

**Input Sanitization:**
- ✅ Markdown preview (Phase 2): sanitize HTML with DOMPurify
- ✅ URL validation: Zod `z.string().url()`
- ✅ Array inputs: validate element types

### Rate Limiting

**Implementation:** Edge middleware on Vercel

```typescript
// Pseudo-code for rate limiting
export async function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const key = `${ip}:${request.pathname}`;
  
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60);
  
  const LIMITS = {
    '/api/projects': 100,
    '/api/projects/*/comments': 30,
    '/api/projects/*/upvote': 100,
  };
  
  if (count > LIMITS[request.pathname]) {
    return new Response('Too many requests', { status: 429 });
  }
}
```

---

## Frontend Architecture

### Component Hierarchy

```
RootLayout (Clerk Provider)
├── Header / Navbar
├── (auth) Routes
│   ├── SignIn Page
│   └── SignUp Page
├── (main) Routes
│   ├── HomePage
│   │   ├── Hero Section
│   │   ├── Featured Projects Grid
│   │   └── Latest Projects Grid
│   ├── ProfilesPage
│   │   ├── FilterBar
│   │   └── PlatformCard[]
│   ├── ProjectsPage
│   │   ├── FilterBar
│   │   ├── SearchBox
│   │   └── ProjectCard[]
│   ├── ProjectDetailPage
│   │   ├── ProjectHeader
│   │   ├── ProjectContent
│   │   ├── ProjectStats
│   │   ├── AuthorCard
│   │   ├── CommentSection
│   │   └── RelatedProjects
│   ├── NewProjectPage
│   │   └── ProjectForm
│   ├── UserProfilePage
│   │   ├── UserHeader
│   │   ├── UserStats
│   │   └── UserProjectsGrid
│   └── CollectionsPage
│       └── CollectionCard[]
└── Footer
```

### State Management

**v1 Approach (Simple):**
- React hooks + local component state
- Context for global state (user, auth)
- React Hook Form for form state
- Fetch API for data loading

**Flow:**
```typescript
// Component
const [projects, setProjects] = useState([]);
const [filters, setFilters] = useState({});

useEffect(() => {
  fetch(`/api/projects?${params}`).then(setProjects);
}, [filters]);

// Simple, no Redux/Zustand needed for v1
```

**v2 Plan (Phase 2):**
- Add React Query (SWR alternative) for server state
- Better caching + stale-while-revalidate
- Optimistic updates
- Background refetching

### Performance Optimizations

| Optimization | Implementation |
|--------------|-----------------|
| **Code Splitting** | Next.js automatic route-based splitting |
| **Image Optimization** | Next.js Image component + Cloudinary URLs |
| **Static Generation** | SSG for profiles, ISR with 1h revalidation |
| **Server Components** | Use RSC for layouts, data fetching |
| **Client Components** | Use CSR only for interactive elements |
| **Caching** | HTTP caching headers, browser cache |
| **Minification** | Next.js built-in (production mode) |

---

## Deployment & Infrastructure

### Deployment Architecture

```
┌──────────────────────┐
│   GitHub Repository  │
│   (Source of Truth)  │
└──────────────┬───────┘
               │ Push to main
               ▼
┌──────────────────────────────┐
│   GitHub Actions Workflow    │
│   1. Install dependencies    │
│   2. Run linting             │
│   3. Run type check          │
│   4. Deploy to Vercel        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   Vercel (Deployment)        │
│   1. Build Next.js app       │
│   2. Run database migrations │
│   3. Deploy to edge network  │
│   4. Health checks           │
└──────────────────────────────┘
```

### Environment Configuration

**Production (.env.production):**
```env
DATABASE_URL=postgresql://[prod-user]:[prod-pass]@[prod-host]:5432/vibe_stack
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[prod-key]
CLERK_SECRET_KEY=[prod-secret]
NEXT_PUBLIC_APP_URL=https://vibestack.dev
NODE_ENV=production
```

**Staging (.env.staging):**
```env
DATABASE_URL=postgresql://[staging-user]:[staging-pass]@[staging-host]:5432/vibe_stack
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[staging-key]
CLERK_SECRET_KEY=[staging-secret]
NEXT_PUBLIC_APP_URL=https://staging.vibestack.dev
NODE_ENV=production  # Use production settings for accuracy
```

**Development (.env.local):**
```env
DATABASE_URL=postgresql://localhost:5432/vibe_stack_dev
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[dev-key]
CLERK_SECRET_KEY=[dev-secret]
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### CI/CD Pipeline

**GitHub Actions Workflow (.github/workflows/deploy.yml):**

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - run: npm run lint
      
      - run: npm run type-check
      
      - run: npm run test  # Phase 2
      
      - uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Database Migrations

**Strategy: Prisma Migrations**

```bash
# Generate migration
npx prisma migrate dev --name add_featured_flag

# Apply to production (via Vercel deployment)
npx prisma migrate deploy

# Rollback (careful – requires manual intervention)
npx prisma migrate resolve --rolled-back {migration-name}
```

**Safety:**
- ✅ Migrations are version-controlled in `prisma/migrations/`
- ✅ Always test locally first
- ✅ Zero-downtime: Prisma handles backward compatibility
- ✅ Deployment runs migrations automatically (Vercel integration)

---

## Scalability & Performance

### Scaling Strategy

**Phase 1 (0 – 10k users):**
- ✅ Current architecture sufficient
- ✅ PostgreSQL standard shared instance
- ✅ Vercel automatic scaling

**Phase 2 (10k – 100k users):**
- ⚠️ PostgreSQL upgrade: dedicated instance
- ⚠️ Add Redis for caching (trending queries)
- ⚠️ Add Meilisearch for advanced search
- ⚠️ CDN optimization (Cloudinary already provides this)

**Phase 3 (100k+ users):**
- ⚠️ Read replicas for PostgreSQL
- ⚠️ API endpoint caching layer (CloudFlare)
- ⚠️ Background job queue (BullMQ)
- ⚠️ Analytics warehouse (e.g., ClickHouse)

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Homepage Load | < 2s | Lighthouse, web.dev |
| API Response | < 200ms (p95) | CloudWatch metrics |
| Database Query | < 50ms (p95) | PostgreSQL logs |
| Image Load | < 500ms | Cloudinary analytics |
| Time to First Byte | < 500ms | Vercel Analytics |

### Load Testing

**Tool:** k6 or Apache JMeter

**Scenarios:**
- 1000 concurrent users browsing projects
- 100 concurrent project uploads
- 500 concurrent upvotes/comments
- Full-text search under load

**Success Criteria:**
- ✅ p95 response time < 500ms
- ✅ Error rate < 1%
- ✅ Database CPU < 70%
- ✅ Memory usage stable

---

## Testing Strategy

### Testing Pyramid

```
        ▲
       ╱ ╲  E2E Tests (10%)
      ╱   ╲  Playwright / Cypress
     ╱─────╲
    ╱       ╲ Integration Tests (30%)
   ╱         ╲ API routes + DB
  ╱───────────╲
 ╱             ╲ Unit Tests (60%)
╱_______________╲ Jest + React Testing Library
```

### Test Coverage Goals

| Layer | Tool | Coverage | Timeline |
|-------|------|----------|----------|
| Unit | Jest | 80%+ | Phase 2 |
| Integration | Jest + @testing-library/react | 60%+ | Phase 2 |
| E2E | Playwright | Key user flows | Phase 2 |

### Critical Paths to Test (v1.1)

1. **Authentication**
   - Sign up → User created in DB
   - Sign in → Session established
   - Webhook sync → User synced

2. **Project CRUD**
   - Create project → Appears in gallery
   - Update project → Changes reflected
   - Delete project → Removed from gallery

3. **Engagement**
   - Upvote → Count increments
   - Comment → Appears immediately
   - Filter → Correct projects shown

---

## Monitoring & Observability

### Logging Strategy

**Log Levels:**
- `ERROR`: Production errors, failed requests, exceptions
- `WARN`: Rate limiting, validation failures, retries
- `INFO`: User actions, successful API calls
- `DEBUG`: Detailed flow for investigation

**Destinations:**
- Development: Console (Winston)
- Production: Sentry + Vercel Logs (Phase 1.5)

### Metrics to Track (Phase 2)

```typescript
// Sample metrics via Vercel Analytics + custom instrumentation
- API response times (by endpoint)
- Database query performance
- User authentication events
- Project upload success rate
- Error rates by type
- Cache hit rates
- CDN bandwidth usage
```

### Error Handling

**Strategy: Graceful Degradation**

```typescript
// Example: Comment creation failure
try {
  const comment = await prisma.comment.create({...});
} catch (error) {
  if (error.code === 'P2025') {
    // Project not found
    return { error: 'Project deleted', statusCode: 404 };
  }
  // Log unexpected error for investigation
  logger.error('Comment creation failed:', error);
  return { error: 'Something went wrong', statusCode: 500 };
}
```

### Alerts (Phase 2)

| Alert | Threshold | Action |
|-------|-----------|--------|
| Error Rate | > 1% | Page on-call |
| API Latency | p95 > 1s | Investigate + scale |
| Database CPU | > 80% | Scale PostgreSQL |
| Disk Space | > 90% | Clean up + alert |

---

## Development Workflow

### Local Development

```bash
# Clone and setup
git clone https://github.com/yourusername/vibe-stack.git
cd vibe-stack
npm install

# Environment setup
cp .env.example .env.local
# Fill in Clerk, Cloudinary, DATABASE_URL

# Database setup
npx prisma migrate dev --name init
npx prisma db seed  # optional: seed with initial data

# Run dev server
npm run dev
# Visit http://localhost:3000
```

### Git Workflow (Trunk-Based Development)

```
main (always deployable)
 ↑
 │ Pull Request (feature branch)
 │ - Feature: user-profiles
 │ - Tests passing
 │ - Code review approved
 │
```

### Code Review Checklist

- ✅ Follows TypeScript best practices
- ✅ Zod validation for inputs
- ✅ Error handling implemented
- ✅ No secrets in code
- ✅ Performance considered
- ✅ Accessibility checked
- ✅ Documentation updated

---

## Disaster Recovery

### Backup Strategy

| Component | Backup | Frequency | Recovery Time |
|-----------|--------|-----------|----------------|
| PostgreSQL | Automated snapshots | Daily | < 1 hour |
| Cloudinary | CDN global replication | Continuous | Automatic |
| Code | GitHub (DVCS) | Per commit | < 5 min |
| Configurations | Vercel secrets + Git | Manual | < 10 min |

### Incident Response

1. **Detection** → Sentry alert or monitoring dashboard
2. **Assessment** → Check logs, affected components
3. **Communication** → Notify team, post status
4. **Remediation** → Hotfix, rollback, or scale
5. **Post-mortem** → Analyze, prevent future issues

---

## Appendix: Command Reference

### Development

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript check
npm run format           # Format with Prettier
```

### Database

```bash
npx prisma studio      # Prisma data browser
npx prisma migrate dev  # Create + run migration
npx prisma db push     # Push schema changes
npx prisma db seed     # Seed initial data
```

### Deployment

```bash
vercel               # Deploy to Vercel
vercel --prod        # Deploy to production
vercel rollback       # Rollback to previous
```

---

**Document Maintained By:** Engineering Team  
**Last Review:** January 14, 2026  
**Next Review:** Quarterly
