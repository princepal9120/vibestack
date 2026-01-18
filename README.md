<div align="center">

# 🚀 VibeStack

**The Community Platform for AI-Assisted Coding**

[![GitHub Stars](https://img.shields.io/github/stars/princepal9120/vibestack?style=for-the-badge&logo=github&color=yellow)](https://github.com/princepal9120/vibestack)
[![GitHub Forks](https://img.shields.io/github/forks/princepal9120/vibestack?style=for-the-badge&logo=github&color=blue)](https://github.com/princepal9120/vibestack/fork)
[![GitHub Issues](https://img.shields.io/github/issues/princepal9120/vibestack?style=for-the-badge&logo=github&color=red)](https://github.com/princepal9120/vibestack/issues)
[![License](https://img.shields.io/github/license/princepal9120/vibestack?style=for-the-badge&color=green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

[**View Demo**](https://vibestack.dev) · [**Report Bug**](https://github.com/princepal9120/vibestack/issues/new?labels=bug) · [**Request Feature**](https://github.com/princepal9120/vibestack/issues/new?labels=enhancement)

<br />

<img src="public/og-image.png" alt="VibeStack Preview" width="800" />

</div>

---

## 🌟 What is VibeStack?

VibeStack is a **community-driven platform** that bridges the gap between learning AI-assisted coding and showcasing real-world projects. It serves as a centralized hub where developers can:

- **📚 Learn** – Access industry-grade setup guides, workflows, and best practices for AI coding tools like Cursor, Claude Code, and more
- **🔨 Build** – Contribute and showcase projects built with vibe coding platforms
- **💡 Inspire** – Discover, collaborate, and get inspired by others' work

### Why VibeStack?

AI coding tools are everywhere, but knowledge is fragmented. Developers waste time:

- Searching for scattered documentation
- Guessing best practices
- Working in isolation with no real-world examples

**VibeStack solves this** by providing a unified platform with curated guides, community projects, and shared learnings.

---

## ✨ Features

### 🎯 Core Features

| Feature                 | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| **Platform Profiles**   | Comprehensive guides for Cursor, Claude Code, Gemini CLI, and more                |
| **Project Showcase**    | Upload and discover community projects with screenshots, tech stack, and insights |
| **Resource Library**    | Curated blogs, tutorials, YouTube videos, and X/Twitter threads                   |
| **MCP Directory**       | Browse Model Context Protocol servers and integrations                            |
| **Sub-Agents Library**  | Role-specific AI agent prompts (React Architect, Python Expert, etc.)             |
| **Skills Repository**   | Modular AI capabilities like Anthropic's Skills                                   |
| **Curated Collections** | Themed project collections (e.g., "Best Cursor Projects")                         |

### 🚀 Platform Features

- 🔐 **Authentication** – Secure sign-in with Clerk (GitHub, Google, Email)
- 🔍 **Global Search** – Fuzzy search with `Cmd+K` across all content
- ⬆️ **Upvoting System** – Community-driven project rankings
- 💬 **Comments** – Engage with project authors
- 🏷️ **Filtering** – Filter by platform, tech stack, category
- 📱 **Responsive Design** – Beautiful on all devices
- 🌙 **Dark Mode** – Easy on the eyes

---

## 🛠️ Tech Stack

| Technology                                          | Purpose                          |
| --------------------------------------------------- | -------------------------------- |
| [**Next.js 16**](https://nextjs.org/)               | React framework with App Router  |
| [**TypeScript**](https://www.typescriptlang.org/)   | Type-safe development            |
| [**Tailwind CSS 4**](https://tailwindcss.com/)      | Utility-first styling            |
| [**Prisma**](https://www.prisma.io/)                | Type-safe ORM                    |
| [**PostgreSQL**](https://www.postgresql.org/)       | Database (via Neon)              |
| [**Clerk**](https://clerk.com/)                     | Authentication & user management |
| [**Framer Motion**](https://www.framer.com/motion/) | Animations                       |
| [**Fuse.js**](https://fusejs.io/)                   | Fuzzy search                     |
| [**Zod**](https://zod.dev/)                         | Schema validation                |
| [**Vercel**](https://vercel.com/)                   | Deployment & hosting             |

---

## 📁 Project Structure

```
vibestack/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (main)/               # Main routes (resources, projects, platforms, etc.)
│   │   ├── api/                  # API routes
│   │   │   ├── projects/         # Project CRUD endpoints
│   │   │   ├── resources/        # Resource endpoints
│   │   │   ├── search/           # Search API
│   │   │   └── webhooks/         # Clerk webhooks
│   │   ├── sign-in/              # Auth pages
│   │   ├── sign-up/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Base UI components (shadcn/ui)
│   │   ├── navbar.tsx            # Navigation
│   │   ├── footer.tsx            # Footer
│   │   ├── command-palette.tsx   # Cmd+K search
│   │   ├── project-card.tsx      # Project display
│   │   ├── resource-bento-card.tsx
│   │   └── ...
│   │
│   ├── lib/                      # Utilities & config
│   │   ├── prisma.ts             # Database client
│   │   ├── auth.ts               # Auth helpers
│   │   ├── validators.ts         # Zod schemas
│   │   └── utils.ts              # Utility functions
│   │
│   └── proxy.ts                  # API proxy configuration
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
│
├── content/                      # Markdown content (guides, resources)
├── public/                       # Static assets
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm**, **yarn**, **pnpm**, or **bun**
- **PostgreSQL** database (we recommend [Neon](https://neon.tech))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/princepal9120/vibestack.git
   cd vibestack
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file** (see [Environment Variables](#-environment-variables))

5. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npm run db:seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# ======================
# Database (PostgreSQL with Neon)
# ======================
DATABASE_URL="postgresql://user:password@host-pooler.neon.tech/vibestack?sslmode=require"
DIRECT_URL="postgresql://user:password@host.neon.tech/vibestack?sslmode=require"

# ======================
# Clerk Authentication
# ======================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Clerk URLs (optional)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# ======================
# Cloudinary (Image Uploads)
# ======================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ======================
# App Configuration
# ======================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

<details>
<summary><strong>📖 Where to get these values</strong></summary>

| Variable                      | Where to get it                                                           |
| ----------------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL` / `DIRECT_URL` | [Neon Dashboard](https://neon.tech) → Create Project → Connection Details |
| `CLERK_*` keys                | [Clerk Dashboard](https://clerk.com) → Create App → API Keys              |
| `CLOUDINARY_*`                | [Cloudinary Dashboard](https://cloudinary.com) → Settings → Access Keys   |

</details>

---

## 📖 Usage Examples

### Browsing Platform Guides

```
1. Navigate to /platforms
2. Select a platform (e.g., "Cursor")
3. Explore setup guides, workflows, and cheat sheets
```

### Uploading a Project

```
1. Sign in with GitHub/Google
2. Click "Showcase Your Project"
3. Fill in project details, tech stack, and screenshots
4. Write key insights about how you used AI tools
5. Publish and share with the community!
```

### Using the Command Palette

```
1. Press Cmd+K (Mac) or Ctrl+K (Windows)
2. Type to search across all content
3. Select a result to navigate instantly
```

---

## 🤝 Contributing

We ❤️ contributions! VibeStack is built by the community, for the community.

### Quick Start

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/vibestack.git

# 3. Create a feature branch
git checkout -b feature/amazing-feature

# 4. Make your changes and commit
git commit -m "feat: add amazing feature"

# 5. Push and open a PR
git push origin feature/amazing-feature
```

### Contribution Guidelines

- 📖 Read our [**CONTRIBUTING.md**](CONTRIBUTING.md) for detailed guidelines
- 🐛 Found a bug? [Open an issue](https://github.com/princepal9120/vibestack/issues/new?labels=bug)
- 💡 Have an idea? [Request a feature](https://github.com/princepal9120/vibestack/issues/new?labels=enhancement)
- 🏷️ Look for `good first issue` labels for beginner-friendly tasks

### Code Standards

- **TypeScript** – Strong typing, avoid `any`
- **Conventional Commits** – `feat:`, `fix:`, `docs:`, etc.
- **Component Structure** – Functional components with hooks
- **Styling** – Tailwind CSS, mobile-first responsive

---

## 🗺️ Roadmap

### ✅ v1.0 (Current)

- [x] Platform profiles & guides
- [x] Project showcase & gallery
- [x] Resource library with filtering
- [x] User authentication
- [x] Comments & upvoting
- [x] Global search (Cmd+K)

### 🚧 v1.1 (In Progress)

- [ ] Email notifications
- [ ] Enhanced user profiles
- [ ] Admin content dashboard
- [ ] Advanced filtering options

### 🔮 v2.0 (Future)

- [ ] Advanced search (Meilisearch)
- [ ] User-created collections
- [ ] Leaderboards & badges
- [ ] Project of the week
- [ ] Follow users
- [ ] Nested comment replies
- [ ] API for third-party integrations

<details>
<summary><strong>Have ideas for the roadmap?</strong></summary>

We'd love to hear from you! [Open a discussion](https://github.com/princepal9120/vibestack/discussions) or [submit a feature request](https://github.com/princepal9120/vibestack/issues/new?labels=enhancement).

</details>

---

## 📜 License

This project is open source and available under the [**MIT License**](LICENSE).

```
MIT License

Copyright (c) 2026 VibeStack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) – The React Framework
- [Clerk](https://clerk.com/) – Authentication made simple
- [Prisma](https://prisma.io/) – Next-gen ORM
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) – Beautiful UI components
- All our amazing [contributors](https://github.com/princepal9120/vibestack/graphs/contributors) ❤️

---

## 🌟 Show Your Support

If VibeStack has helped you, please consider:

- ⭐ **Starring** the repository
- 🐦 **Sharing** on social media
- 💬 **Telling** your friends and colleagues
- 🤝 **Contributing** to the project

---

<div align="center">

**Built with ❤️ by the VibeStack community**

[GitHub](https://github.com/princepal9120/vibestack) · [Issues](https://github.com/princepal9120/vibestack/issues) · [Discussions](https://github.com/princepal9120/vibestack/discussions)

</div>
