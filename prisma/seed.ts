import { config } from "dotenv";
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    // PrismaNeonHttp takes the connection string directly
    const adapter = new PrismaNeonHttp(connectionString, {});

    return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Seed Platform Profiles
    const platforms = [
        {
            platformId: "cursor",
            name: "Cursor",
            tagline: "The AI-first code editor",
            websiteUrl: "https://cursor.com",
            description: "Cursor is an AI-powered code editor built on VSCode. It integrates AI assistance directly into your coding workflow, allowing you to write, edit, and understand code faster with natural language interactions.",
            setupGuide: `# Getting Started with Cursor

## Installation
1. Download Cursor from https://cursor.com
2. Install and open the application
3. Sign in with your account

## Key Features
- **Cmd+K**: Ask AI to edit or generate code
- **Cmd+L**: Open AI chat panel
- **Tab**: Accept AI suggestions

## Best Practices
- Be specific in your prompts
- Use comments to guide AI
- Review and understand generated code`,
            cheatSheet: [
                "Cmd+K: Inline AI edit",
                "Cmd+L: Open chat",
                "Tab: Accept suggestion",
                "Cmd+Shift+L: Add file to context",
                "Use @file to reference files",
            ],
        },
        {
            platformId: "claude-code",
            name: "Claude Code",
            tagline: "AI pair programming in your terminal",
            websiteUrl: "https://anthropic.com",
            description: "Claude Code brings Anthropic's Claude AI directly into your terminal for an agentic coding experience. It can read files, write code, run commands, and help you build entire features through natural conversation.",
            setupGuide: `# Getting Started with Claude Code

## Installation
\`\`\`bash
npm install -g @anthropic/claude-code
\`\`\`

## Setup
1. Get your API key from https://console.anthropic.com
2. Run: claude-code --api-key YOUR_KEY
3. Start coding with: claude-code

## Usage
- Describe what you want to build
- Let Claude read your codebase
- Review and approve file changes`,
            cheatSheet: [
                "claude-code: Start a session",
                "Let it read files for context",
                "Approve changes before applying",
                "Use for refactoring large codebases",
                "Great for debugging complex issues",
            ],
        },
        {
            platformId: "replit-ai",
            name: "Replit AI",
            tagline: "AI-powered development in the browser",
            websiteUrl: "https://replit.com",
            description: "Replit AI integrates code generation, debugging, and explanation directly into the Replit online IDE. Build, deploy, and collaborate on projects without leaving your browser.",
            setupGuide: `# Getting Started with Replit AI

## Setup
1. Create an account at https://replit.com
2. Create a new Repl or open existing
3. AI features are available in the editor

## Features
- Ghostwriter: AI code completion
- Chat: Ask questions about your code
- Explain: Understand existing code
- Generate: Create new code from prompts`,
            cheatSheet: [
                "Click 'AI' button in sidebar",
                "Use chat for code questions",
                "Generate code from descriptions",
                "Debug errors with AI help",
                "Deploy instantly to Replit hosting",
            ],
        },
        {
            platformId: "github-copilot",
            name: "GitHub Copilot",
            tagline: "Your AI pair programmer",
            websiteUrl: "https://github.com/features/copilot",
            description: "GitHub Copilot uses OpenAI's Codex to suggest code completions in real-time. Available as an extension for VSCode, JetBrains, and other popular editors.",
            setupGuide: `# Getting Started with GitHub Copilot

## Installation
1. Install the GitHub Copilot extension in VSCode
2. Sign in with your GitHub account
3. Start typing code!

## Features
- Inline suggestions as you type
- Multi-line completions
- Comment-to-code generation
- Copilot Chat for Q&A`,
            cheatSheet: [
                "Tab: Accept suggestion",
                "Esc: Dismiss suggestion",
                "Alt+]: Next suggestion",
                "Alt+[: Previous suggestion",
                "Start with comments for context",
            ],
        },
        {
            platformId: "windsurf",
            name: "Windsurf",
            tagline: "The collaborative AI IDE",
            websiteUrl: "https://codeium.com/windsurf",
            description: "Windsurf by Codeium is a next-generation IDE with deep AI integration. Features include Cascade flows for multi-step edits and real-time collaboration between you and AI.",
            setupGuide: `# Getting Started with Windsurf

## Installation
1. Download from https://codeium.com/windsurf
2. Install and launch
3. Sign in or create account

## Key Features
- Cascade: Multi-step AI workflows
- Command mode: Natural language commands
- Deep codebase understanding`,
            cheatSheet: [
                "Cmd+I: Open Cascade",
                "Natural language commands",
                "AI understands full codebase",
                "Multi-file edits in one flow",
                "Review all changes before applying",
            ],
        },
    ];

    for (const platform of platforms) {
        await prisma.platformProfile.upsert({
            where: { platformId: platform.platformId },
            update: platform,
            create: platform,
        });
        console.log(`  ✓ Created platform: ${platform.name}`);
    }

    // Seed Collections
    const collections = [
        {
            title: "Best Web Apps",
            slug: "best-web-apps",
            description: "Top web applications built with AI coding tools. From SaaS platforms to productivity tools, these projects showcase the power of vibe coding.",
            projectIds: [],
            curator: "Vibe Stack Team",
        },
        {
            title: "CLI Tools",
            slug: "cli-tools",
            description: "Command-line tools and utilities built with AI assistance. Perfect examples of how to build developer tools with natural language.",
            projectIds: [],
            curator: "Vibe Stack Team",
        },
        {
            title: "Open Source Gems",
            slug: "open-source-gems",
            description: "Open source projects created with AI. Learn from the code and contribute to the community.",
            projectIds: [],
            curator: "Vibe Stack Team",
        },
    ];

    for (const collection of collections) {
        await prisma.collection.upsert({
            where: { slug: collection.slug },
            update: collection,
            create: collection,
        });
        console.log(`  ✓ Created collection: ${collection.title}`);
    }

    console.log("\n✅ Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
