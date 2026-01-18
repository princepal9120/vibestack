# Contributing to VibeStack

First off, thank you for considering contributing to VibeStack! 🎉

It's people like you that make VibeStack such a great tool for the AI coding community. This document provides guidelines and best practices for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

---

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be Respectful** - Treat everyone with respect. No harassment, discrimination, or inappropriate behavior.
- **Be Constructive** - Provide helpful feedback. Criticism should be constructive and aimed at improving the project.
- **Be Inclusive** - Welcome newcomers and help them get started. We were all beginners once.
- **Be Patient** - Maintainers are volunteers. Give them time to review your contributions.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**
- **Git**
- **PostgreSQL** (for database)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vibestack.git
   cd vibestack
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/princepal9120/vibestack.git
   ```

---

## Development Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in the required environment variables:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."
```

### 3. Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

(Optional) Seed the database:

```bash
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Structure

```
vibestack/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   ├── (routes)/          # Page routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── ...               # Feature-specific components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Database seeding script
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

---

## Making Changes

### 1. Sync with Upstream

Before starting work, sync your fork:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Create a Branch

Create a descriptive branch name:

```bash
# For features
git checkout -b feature/add-search-functionality

# For bug fixes
git checkout -b fix/login-redirect-issue

# For documentation
git checkout -b docs/update-readme
```

### 3. Make Your Changes

- Write clean, readable code
- Follow existing patterns and conventions
- Add comments where necessary
- Update documentation if needed

### 4. Test Your Changes

```bash
# Run linter
npm run lint

# Run type checking
npm run type-check

# Build the project
npm run build
```

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces (avoid `any`)
- Use meaningful variable and function names

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
}

const fetchUserById = async (userId: string): Promise<User> => {
  // ...
};

// ❌ Bad
const fetchUser = async (id: any): Promise<any> => {
  // ...
};
```

### React Components

- Use functional components with hooks
- Follow the component file structure:

  ```typescript
  // Imports
  import { useState } from 'react';

  // Types
  interface Props {
    title: string;
  }

  // Component
  export function MyComponent({ title }: Props) {
    return <div>{title}</div>;
  }
  ```

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use CSS variables from our design system

### File Naming

- **Components:** PascalCase (`UserCard.tsx`)
- **Utilities:** camelCase (`formatDate.ts`)
- **Constants:** SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                                       |
| ---------- | ------------------------------------------------- |
| `feat`     | New feature                                       |
| `fix`      | Bug fix                                           |
| `docs`     | Documentation changes                             |
| `style`    | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring (no feature or bug fix)          |
| `perf`     | Performance improvements                          |
| `test`     | Adding or updating tests                          |
| `chore`    | Maintenance tasks (dependencies, configs)         |
| `ci`       | CI/CD changes                                     |

### Examples

```bash
feat(auth): add Google OAuth login
fix(api): resolve 500 error on resource submission
docs(readme): update installation instructions
refactor(components): extract common button styles
```

---

## Pull Request Process

### Before Submitting

- [ ] Code compiles without errors (`npm run build`)
- [ ] Linter passes (`npm run lint`)
- [ ] Changes are tested locally
- [ ] Documentation is updated if needed
- [ ] Commits follow conventional commit format

### Submitting a PR

1. Push your branch to your fork:

   ```bash
   git push origin feature/your-feature
   ```

2. Go to GitHub and click "Compare & pull request"

3. Fill in the PR template:
   - **Title:** Clear, descriptive title
   - **Description:** Explain what and why
   - **Screenshots:** Include if there are UI changes
   - **Related Issues:** Link any related issues

4. Request review from maintainers

### PR Review Process

- Be responsive to feedback
- Make requested changes promptly
- Resolve all conversations before merging
- Squash commits if requested

---

## Issue Guidelines

### Reporting Bugs

Include the following:

- **Description:** Clear description of the bug
- **Steps to Reproduce:** How to trigger the bug
- **Expected Behavior:** What should happen
- **Actual Behavior:** What actually happens
- **Screenshots:** If applicable
- **Environment:** Browser, OS, Node version

### Requesting Features

Include:

- **Problem:** What problem does this solve?
- **Solution:** How would you like it to work?
- **Alternatives:** Any alternatives you've considered?
- **Additional Context:** Any other relevant information

### Good First Issues

Look for issues labeled `good first issue` - these are great for newcomers!

---

## Need Help?

- 💬 Open a [Discussion](https://github.com/princepal9120/vibestack/discussions)
- 🐛 Check [existing issues](https://github.com/princepal9120/vibestack/issues)
- 📧 Reach out to maintainers

---

## Recognition

Contributors will be:

- Listed in our README
- Mentioned in release notes
- Part of our awesome community! 🌟

---

Thank you for contributing to VibeStack! Together, we're building something amazing. 🚀
