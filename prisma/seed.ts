import { config } from "dotenv";
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    // PrismaNeon uses connectionString parameter
    const adapter = new PrismaNeon({ connectionString });

    return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
    console.log("🌱 Seeding database with comprehensive content...");

    // Seed Platform Profiles
    const platforms = [
        {
            platformId: "cursor",
            name: "Cursor",
            tagline: "The AI-first code editor",
            websiteUrl: "https://cursor.com",
            description: "Cursor is an AI-powered code editor built on VSCode. It integrates AI assistance directly into your coding workflow, allowing you to write, edit, and understand code faster with natural language interactions. Features include inline AI editing, chat-based assistance, and intelligent code completion.",
            setupGuide: `# Getting Started with Cursor

## Installation
1. Download Cursor from https://cursor.com
2. Install and open the application
3. Sign in with your account (GitHub, Google, or email)

## Key Features

### Cmd+K / Ctrl+K - Inline AI Edit
Select code and press Cmd+K to ask AI to edit it. Examples:
- "Add error handling"
- "Convert to TypeScript"
- "Optimize this function"

### Cmd+L / Ctrl+L - AI Chat Panel
Open the chat panel to have a conversation about your code:
- Ask questions about your codebase
- Get explanations for complex code
- Plan features before implementing

### Tab - Accept Suggestions
AI provides inline completions as you type. Press Tab to accept.

## .cursorrules File

Create a \`.cursorrules\` file in your project root to customize AI behavior:

\`\`\`
You are an expert TypeScript developer.
Always use functional components with React hooks.
Prefer const over let.
Use descriptive variable names.
Add JSDoc comments to exported functions.
Follow the existing code patterns in this project.
\`\`\`

## Best Practices
- Be specific in your prompts
- Use @file to reference specific files
- Add context by selecting relevant code
- Review and understand all generated code
- Use .cursorrules for project-wide consistency`,
            cheatSheet: [
                "Cmd+K: Inline AI edit - select code and describe changes",
                "Cmd+L: Open AI chat panel for conversations",
                "Tab: Accept AI suggestions as you type",
                "Cmd+Shift+L: Add current file to chat context",
                "@file: Reference specific files in your prompts",
                "@codebase: Search across your entire project",
                ".cursorrules: Define project-wide AI behavior rules",
                "Cmd+Shift+K: Quick fix suggestions on errors",
                "Escape: Cancel current AI operation",
                "Cmd+Enter: Submit prompt in chat",
            ],
        },
        {
            platformId: "claude-code",
            name: "Claude Code",
            tagline: "Agentic AI coding in your terminal",
            websiteUrl: "https://claude.com/product/claude-code",
            description: "Claude Code is Anthropic's agentic coding tool that lives in your terminal. It understands your entire codebase, can edit files, run commands, debug issues, and ship features—all through natural conversation. Works in terminal, VS Code, JetBrains IDEs, and integrates with GitHub, Slack, and more via MCP.",
            setupGuide: `# Getting Started with Claude Code

## Installation

### macOS/Linux
\`\`\`bash
curl -fsSL https://claude.ai/install.sh | bash
\`\`\`

### Homebrew
\`\`\`bash
brew install --cask claude-code
\`\`\`

### Windows
\`\`\`powershell
irm https://claude.ai/install.ps1 | iex
\`\`\`

Or via WinGet:
\`\`\`
winget install Anthropic.ClaudeCode
\`\`\`

## Quick Start
\`\`\`bash
cd your-project
claude
\`\`\`

## What Claude Code Can Do

### 1. Build Features from Descriptions
Tell Claude what you want in plain English. It will:
- Make a plan
- Write the code
- Run tests to ensure it works

### 2. Debug and Fix Issues
Paste an error message or describe a bug. Claude will:
- Analyze your codebase
- Identify the root cause
- Implement a fix

### 3. Navigate Any Codebase
Ask anything about your team's codebase:
- "Where is user authentication handled?"
- "How does the payment flow work?"
- "What files need to change to add dark mode?"

### 4. Automate Tedious Tasks
- Fix lint issues across the project
- Resolve merge conflicts
- Write release notes
- Update dependencies

## Unix Philosophy
Claude Code is composable and scriptable:
\`\`\`bash
# Watch logs and alert on anomalies
tail -f app.log | claude -p "Alert me if you see errors"

# Translate new strings
claude -p "Translate new strings to French and raise a PR"
\`\`\`

## MCP (Model Context Protocol)
Extend Claude with external data sources:
- Read design docs from Google Drive
- Update tickets in Jira
- Access Figma designs
- Integrate with Slack

## Best Practices
- Let Claude read your entire codebase for better context
- Break down large tasks into smaller, reviewable chunks
- Always review changes before applying
- Use Claude for code review before committing
- Leverage MCP for team workflows`,
            cheatSheet: [
                "claude: Start an interactive coding session",
                "claude -p 'prompt': Non-interactive single command",
                "/help: Show available commands in session",
                "/clear: Clear conversation history",
                "/compact: Toggle compact output mode",
                "Ctrl+C: Cancel current operation",
                "Let Claude read files before asking questions",
                "Review all file changes before approving",
                "Use with CI/CD: claude -p 'task' in GitHub Actions",
                "MCP integration: Connect Drive, Jira, Figma, Slack",
            ],
        },
        {
            platformId: "gemini-cli",
            name: "Gemini CLI",
            tagline: "Google's AI coding assistant for the terminal",
            websiteUrl: "https://ai.google.dev/gemini-api/docs",
            description: "Gemini CLI is Google's open-source command-line tool for interacting with Gemini models directly from your terminal. It assists with code analysis, task automation, and content generation. Supports multi-turn conversations, file analysis, and integrates with your development workflow.",
            setupGuide: `# Getting Started with Gemini CLI

## Prerequisites
- Node.js version 18 or later
- Google AI Studio API key (free)

## Installation

### Via npm (Recommended)
\`\`\`bash
npm install -g @anthropic-ai/gemini-cli
\`\`\`

### Via curl
\`\`\`bash
curl -fsSL https://gemini.dev/install.sh | bash
\`\`\`

## Setup

### 1. Get Your API Key
1. Go to https://aistudio.google.com/apikey
2. Create a new API key
3. Set it as an environment variable:

\`\`\`bash
export GEMINI_API_KEY="your-api-key"
\`\`\`

### 2. Start Using
\`\`\`bash
gemini "Explain this code"
\`\`\`

## Key Features

### Code Analysis
\`\`\`bash
gemini analyze main.py
gemini "What does this function do?" --file utils.ts
\`\`\`

### Multi-turn Conversations
\`\`\`bash
gemini chat
> Explain how auth works in this project
> Now help me add OAuth support
\`\`\`

### File Operations
\`\`\`bash
gemini "Generate unit tests for this file" --file api.ts
gemini "Refactor to use async/await" --file legacy.js --output modern.js
\`\`\`

## Configuration
Create ~/.geminirc for persistent settings:
\`\`\`json
{
  "model": "gemini-pro",
  "temperature": 0.7,
  "maxTokens": 4096
}
\`\`\`

## Best Practices
- Use --file flag to provide context
- Chain commands for complex workflows
- Pipe output to other tools
- Use in CI/CD for automated reviews`,
            cheatSheet: [
                "gemini 'prompt': Single-shot query",
                "gemini chat: Start interactive session",
                "gemini analyze <file>: Analyze code files",
                "--file <path>: Include file as context",
                "--output <path>: Write response to file",
                "--model <name>: Choose specific model",
                "Ctrl+C: Cancel current generation",
                "Supports piping: cat code.js | gemini 'explain'",
                "Works with Gemini Pro, Ultra, Flash models",
                "Free tier: 60 requests/minute",
            ],
        },
        {
            platformId: "ralph",
            name: "Ralph",
            tagline: "Autonomous AI coding agent harness",
            websiteUrl: "https://github.com/ralph-ai/ralph",
            description: "Ralph is an AI coding agent harness that orchestrates other AI CLI tools (Claude Code, Gemini CLI, OpenCode) to work autonomously on tasks. Define completion criteria, and Ralph will loop until done—perfect for complex, multi-step development tasks that need persistent attention.",
            setupGuide: `# Getting Started with Ralph

## What is Ralph?
Ralph is a **harness** for AI coding CLIs. It runs tools like Claude Code or Gemini CLI in a loop until specific completion criteria are met. Think of it as a project manager for your AI coding assistants.

## Prerequisites
- An AI coding CLI installed (Claude Code, Gemini CLI, or OpenCode)
- Bash 4.0+
- Git
- tmux (recommended for monitoring)
- jq (for status tracking)

## Installation

### Via Script
\`\`\`bash
git clone https://github.com/ralph-ai/ralph
cd ralph
./install.sh
\`\`\`

This adds \`ralph\`, \`ralph-monitor\`, and \`ralph-setup\` to your PATH.

### Via Bun (Ralph TUI)
\`\`\`bash
bun install -g ralph-tui
\`\`\`

## Quick Start

### 1. Initialize Your Project
\`\`\`bash
cd your-project
ralph-tui setup
\`\`\`

This creates \`.ralph-tui/config.toml\` and detects installed AI agents.

### 2. Create a PRD (Product Requirements Document)
\`\`\`bash
ralph-tui create-prd --chat
\`\`\`

The AI will ask about:
- Feature goals
- Requirements
- Quality gates (tests must pass, linting clean, etc.)

### 3. Run Ralph
\`\`\`bash
ralph prompt.md --completion-signal "DONE" --max-iterations 10
\`\`\`

Ralph will:
1. Read your instructions
2. Execute the AI coding agent
3. Track progress in \`progress.txt\`
4. Loop until completion or max iterations

## Key Concepts

### Completion Criteria
Define clear, verifiable criteria:
- ✅ "All unit tests pass"
- ✅ "ESLint reports 0 warnings"
- ❌ "Good code quality" (too vague)

### Progress Tracking
Ralph uses:
- \`progress.txt\`: Current status and decisions
- \`AGENTS.md\`: Learnings between iterations

### HITL to AFK Workflow
1. **Human-In-The-Loop**: Monitor first few runs
2. **Away-From-Keyboard**: Let Ralph work autonomously

## Best Practices
- Start with HITL, then go AFK
- Define clear completion criteria
- Take small steps (better code quality)
- Use Docker sandboxes for safety
- Set reasonable max-iterations to control costs`,
            cheatSheet: [
                "ralph prompt.md: Start autonomous task",
                "--completion-signal: Define 'done' signal",
                "--max-iterations: Limit loop count",
                "ralph-monitor: Watch progress in tmux",
                "ralph-tui: Terminal UI for orchestration",
                "progress.txt: Check current status",
                "AGENTS.md: View learnings between runs",
                "Use clear, verifiable completion criteria",
                "Start HITL (Human-In-The-Loop) first",
                "Use Docker sandbox for AFK runs",
            ],
        },
        {
            platformId: "opencode",
            name: "OpenCode",
            tagline: "Open-source AI coding assistant for the terminal",
            websiteUrl: "https://opencode.ai",
            description: "OpenCode is a powerful, open-source AI coding assistant that runs in your terminal. Built in Go with a beautiful TUI, it supports multiple AI providers (OpenAI, Anthropic, Google, local models via Ollama), persistent session history, and deep integration with your development tools.",
            setupGuide: `# Getting Started with OpenCode

## Installation

### Via curl (Recommended)
\`\`\`bash
curl -fsSL https://opencode.ai/install | bash
\`\`\`

### Via npm
\`\`\`bash
npm install -g opencode-ai
\`\`\`

### Via Homebrew (macOS)
\`\`\`bash
brew install opencode-ai/tap/opencode
\`\`\`

### Via Bun
\`\`\`bash
bun add -g opencode-ai
\`\`\`

## Launch OpenCode
\`\`\`bash
opencode
\`\`\`

## Multi-Model Support
OpenCode works with many AI providers:
- OpenAI (GPT-4, GPT-4o)
- Anthropic (Claude)
- Google (Gemini)
- AWS Bedrock
- Groq
- Local models (Ollama, LM Studio)

### Configure API Keys
\`\`\`bash
opencode auth login
\`\`\`

Or set environment variables:
\`\`\`bash
export OPENAI_API_KEY="..."
export ANTHROPIC_API_KEY="..."
export GOOGLE_API_KEY="..."
\`\`\`

## Key Features

### Session Management
Every conversation is saved to SQLite:
- Persistent history
- Project-specific contexts
- Resume interrupted sessions
- Track code changes

### Tool Chain Integration
- **LSP Support**: Intelligent code analysis and diagnostics
- **Git Awareness**: Understands your version control
- **Build Tools**: Works with npm, pip, cargo, etc.

### AI Assistant Tools
OpenCode's AI has access to:
- \`glob\`, \`grep\`, \`ls\`: File navigation
- \`view\`, \`write\`, \`edit\`, \`patch\`: Code operations
- \`bash\`: Execute shell commands
- \`fetch\`: Get data from URLs
- \`sourcegraph\`: Search public code

### Agents
Built-in agents for different tasks:
- \`build\`: Full permissions, makes changes
- \`plan\`: Read-only analysis

Create custom agents:
\`\`\`bash
opencode agent create
\`\`\`

## Commands
\`\`\`
/models - Select AI model
/help - Show commands
/clear - Clear screen
/session - Manage sessions
\`\`\`

## Configuration
Create \`opencode.json\` in your project:
\`\`\`json
{
  "model": "gpt-4o",
  "provider": "openai"
}
\`\`\``,
            cheatSheet: [
                "opencode: Launch interactive TUI",
                "opencode 'prompt': Non-interactive mode",
                "--continue: Resume last session",
                "--session <id>: Load specific session",
                "-m <model>: Select AI model",
                "/models: Switch models in session",
                "/help: Show all commands",
                "Supports OpenAI, Claude, Gemini, Ollama",
                "Sessions saved to SQLite automatically",
                "opencode agent create: Make custom agent",
            ],
        },
        {
            platformId: "replit-ai",
            name: "Replit AI",
            tagline: "AI-powered development in the browser",
            websiteUrl: "https://replit.com",
            description: "Replit AI integrates code generation, debugging, and explanation directly into the Replit online IDE. Build, deploy, and collaborate on projects without leaving your browser. Features Ghostwriter for code completion and AI chat for assistance.",
            setupGuide: `# Getting Started with Replit AI

## Setup
1. Create an account at https://replit.com
2. Create a new Repl or open existing project
3. AI features are available in the editor

## Key Features

### Ghostwriter (Code Completion)
AI-powered autocomplete that suggests code as you type:
- Works in 30+ languages
- Context-aware suggestions
- Tab to accept, Escape to dismiss

### AI Chat
Open the AI panel to chat about your code:
- Ask questions about errors
- Generate new files
- Explain complex code
- Debug issues

### Generate Code
Describe what you want and let AI create it:
- "Create a Flask API with user authentication"
- "Add a dark mode toggle"
- "Write tests for this function"

### Explain Code
Select code and ask AI to explain it:
- Understand legacy code
- Learn new patterns
- Debug confusing errors

## Best Practices
- Be specific in your prompts
- Review generated code before running
- Use AI chat for debugging complex issues
- Combine with Replit's instant deploy`,
            cheatSheet: [
                "Tab: Accept Ghostwriter suggestion",
                "Escape: Dismiss suggestion",
                "Cmd+I: Open AI chat",
                "Select code + Explain: Get explanation",
                "Generate: Describe what you want",
                "Transform: Refactor selected code",
                "Instant deploy: Ship to production",
                "Works in 30+ programming languages",
                "Multiplayer: Code with others in real-time",
                "Free tier available",
            ],
        },
        {
            platformId: "github-copilot",
            name: "GitHub Copilot",
            tagline: "Your AI pair programmer",
            websiteUrl: "https://github.com/features/copilot",
            description: "GitHub Copilot is an AI pair programmer that offers suggestions as you code. Powered by OpenAI Codex, it works as an extension in VS Code, JetBrains, Neovim, and more. Features include inline suggestions, chat, voice commands, and enterprise-grade security.",
            setupGuide: `# Getting Started with GitHub Copilot

## Subscription
1. Go to https://github.com/features/copilot
2. Choose a plan (Individual, Business, or Enterprise)
3. Subscribe and enable for your account

## Installation

### VS Code
1. Open Extensions (Cmd+Shift+X)
2. Search "GitHub Copilot"
3. Install and sign in with GitHub

### JetBrains IDEs
1. Open Settings → Plugins
2. Search "GitHub Copilot"
3. Install, restart, and sign in

### Neovim
\`\`\`bash
:Copilot setup
:Copilot enable
\`\`\`

## Key Features

### Inline Suggestions
As you type, Copilot suggests completions:
- Tab: Accept suggestion
- Esc: Dismiss
- Alt+]: Next suggestion
- Alt+[: Previous suggestion

### Copilot Chat
Have conversations about your code:
- Explain code
- Fix bugs
- Generate tests
- Refactor

### Commands
In chat, use slash commands:
- \`/explain\`: Explain selected code
- \`/fix\`: Fix the selected code
- \`/tests\`: Generate unit tests
- \`/doc\`: Add documentation

### Voice Commands
Use natural language voice commands (in VS Code)

## Best Practices
- Write clear comments before code
- Use descriptive function names
- Review all suggestions
- Combine with Copilot Chat for complex tasks`,
            cheatSheet: [
                "Tab: Accept suggestion",
                "Esc: Dismiss suggestion",
                "Alt+]: Next suggestion",
                "Alt+[: Previous suggestion",
                "Cmd+I: Open Copilot Chat",
                "/explain: Explain selected code",
                "/fix: Fix code issues",
                "/tests: Generate unit tests",
                "/doc: Add documentation",
                "Works in VS Code, JetBrains, Neovim, CLI",
            ],
        },
        {
            platformId: "windsurf",
            name: "Windsurf",
            tagline: "AI-powered code editor",
            websiteUrl: "https://codeium.com/windsurf",
            description: "Windsurf is Codeium's AI-powered code editor. It combines an intelligent editor with autonomous AI agents that can write, refactor, and debug code across your entire project. Features include Cascade for multi-file edits and Flow for agentic development.",
            setupGuide: `# Getting Started with Windsurf

## Installation
1. Download from https://codeium.com/windsurf
2. Install the application
3. Sign in with your Codeium account

## Key Features

### Cascade
Multi-file AI editing:
- Understands your entire codebase
- Makes coordinated changes across files
- Maintains consistency

### Flow
Agentic development mode:
- AI works autonomously on tasks
- Runs commands, reads files
- Reviews its own work

### Supercomplete
Advanced code completion:
- Context-aware suggestions
- Works with your codebase
- Fast and accurate

## Commands
- Cmd+L: Open AI chat
- Cmd+K: Inline edit
- Tab: Accept suggestion

## Best Practices
- Let Cascade read your project first
- Use Flow for complex, multi-step tasks
- Review all AI-generated changes
- Combine with your existing workflow`,
            cheatSheet: [
                "Cmd+L: Open Cascade chat",
                "Cmd+K: Inline AI edit",
                "Tab: Accept Supercomplete suggestion",
                "Cascade: Multi-file intelligent editing",
                "Flow: Agentic autonomous mode",
                "Built on VSCode foundation",
                "Free tier available",
                "Enterprise security options",
                "Works with existing extensions",
                "Cross-platform: Mac, Windows, Linux",
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
            description: "A curated collection of the best web applications built with AI coding tools. From SaaS products to developer tools, see what's possible when you vibe code.",
            projectIds: [],
            curator: "Vibe Stack Team",
        },
        {
            title: "CLI Tools",
            slug: "cli-tools",
            description: "Command-line tools and utilities built with AI assistance. Discover powerful CLI applications created using Cursor, Claude Code, and other AI coding platforms.",
            projectIds: [],
            curator: "Vibe Stack Team",
        },
        {
            title: "Open Source Gems",
            slug: "open-source-gems",
            description: "Outstanding open-source projects built with AI coding tools. Contribute, learn, and get inspired by these community-driven creations.",
            projectIds: [],
            curator: "Vibe Stack Team",
        },
        {
            title: "Beginner Friendly",
            slug: "beginner-friendly",
            description: "Perfect starting points for developers new to AI-assisted coding. Simple projects with clear code and great learning potential.",
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

    // Get platform IDs for relations
    const cursorProfile = await prisma.platformProfile.findUnique({ where: { platformId: "cursor" } });
    const claudeProfile = await prisma.platformProfile.findUnique({ where: { platformId: "claude-code" } });
    const ralphProfile = await prisma.platformProfile.findUnique({ where: { platformId: "ralph" } });
    const openCodeProfile = await prisma.platformProfile.findUnique({ where: { platformId: "opencode" } });
    const geminiProfile = await prisma.platformProfile.findUnique({ where: { platformId: "gemini-cli" } });

    // Seed Workflows
    const workflows = [];

    if (cursorProfile) {
        workflows.push(
            {
                title: "Setting Up .cursorrules for Project Consistency",
                slug: "cursor-rules-setup",
                description: "Learn how to configure .cursorrules to maintain consistent AI behavior and code style across your project.",
                content: `# Setting Up .cursorrules for Project Consistency

## What are Cursor Rules?
The \`.cursorrules\` file defines project-specific instructions that Cursor follows when generating code. It's like a coding style guide that AI understands.

## Creating Your Rules File
Create a \`.cursorrules\` file in your project root:

\`\`\`
You are an expert TypeScript/React developer.

Code Style:
- Always use functional components with React hooks
- Prefer const over let, never use var
- Use descriptive variable and function names
- Add JSDoc comments to all exported functions
- Maximum line length: 100 characters

Patterns:
- Use React Query for data fetching
- Use Zod for validation
- Handle all error cases explicitly
- Prefer early returns for guard clauses

Testing:
- Write tests alongside implementation
- Use React Testing Library patterns
- Mock external dependencies

This project uses:
- Next.js 14 App Router
- TypeScript strict mode
- Tailwind CSS
- Prisma ORM
\`\`\`

## Advanced Rules

### File-Specific Instructions
\`\`\`
For API routes (app/api/*):
- Always validate request bodies with Zod
- Return consistent error responses
- Use NextResponse.json()

For Components (components/*):
- Accept props with TypeScript interfaces
- Use 'use client' only when needed
- Extract complex logic to hooks
\`\`\`

## Best Practices
1. **Be Specific**: Vague rules lead to inconsistent output
2. **Include Examples**: Show don't tell
3. **Update Regularly**: Rules evolve with your project
4. **Team Alignment**: Share rules with your team`,
                category: "rules",
                difficulty: "beginner",
                platformId: cursorProfile.id,
            },
            {
                title: "Multi-File Refactoring with Cursor",
                slug: "cursor-multi-file-refactor",
                description: "Safely refactor code across multiple files using Cursor's AI capabilities.",
                content: `# Multi-File Refactoring with Cursor

## When to Use
- Renaming components or functions used across files
- Changing data structures
- Migrating to new patterns
- Updating API contracts

## Step-by-Step Process

### 1. Gather Context
Use Cmd+Shift+L to add all relevant files to chat context:
- The file you're changing
- Files that import/use it
- Related test files

### 2. Explain the Refactor
In chat (Cmd+L), describe your refactoring goal:
\`\`\`
I want to rename the UserCard component to ProfileCard.
Files that need updating:
- components/UserCard.tsx (main file)
- pages/profile.tsx (imports it)
- components/index.ts (exports it)

Please update all references and imports.
\`\`\`

### 3. Review Changes
- Cursor will show a diff for each file
- Review each change carefully
- Look for missed references

### 4. Apply Changes
- Accept changes file by file
- Run TypeScript compiler to catch errors
- Run tests to verify behavior

## Safety Checklist
✅ Commit current state before refactoring
✅ Run \`tsc --noEmit\` to catch type errors
✅ Run full test suite
✅ Review git diff before pushing`,
                category: "refactoring",
                difficulty: "intermediate",
                platformId: cursorProfile.id,
            }
        );
    }

    if (claudeProfile) {
        workflows.push(
            {
                title: "Effective Debugging with Claude Code",
                slug: "claude-code-debugging",
                description: "Master debugging workflows using Claude Code's agentic capabilities to find and fix bugs faster.",
                content: `# Debugging with Claude Code

## The Agentic Debugging Flow

Claude Code can read your codebase, understand context, and help debug issues systematically.

## Step 1: Describe the Bug
Be specific about:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Any error messages

Example:
\`\`\`
The user registration fails with a 500 error when the email 
contains a '+' symbol. Expected: User should be created.
Error: "Invalid email format" from Zod validation.
\`\`\`

## Step 2: Let Claude Investigate
Claude will:
1. Read relevant files (validation, API route, types)
2. Identify the problematic code
3. Explain the root cause

## Step 3: Review the Fix
Claude suggests fixes with explanations:
\`\`\`typescript
// Before: Simple email regex
const emailSchema = z.string().email();

// After: Custom validation that allows + symbols
const emailSchema = z.string().refine(
  (val) => /^[^@]+@[^@]+\.[^@]+$/.test(val),
  "Invalid email format"
);
\`\`\`

## Best Debugging Prompts
- "Why would this code throw [error]?"
- "What edge cases am I missing in this function?"
- "Debug why [feature] works in dev but fails in prod"
- "Find the root cause, don't just fix the symptom"

## Pro Tips
1. Share full error stack traces
2. Let Claude read test files for context
3. Ask for explanations, not just fixes
4. Request prevention strategies`,
                category: "debugging",
                difficulty: "intermediate",
                platformId: claudeProfile.id,
            },
            {
                title: "Building Features End-to-End with Claude Code",
                slug: "claude-code-feature-building",
                description: "How to use Claude Code to build complete features from requirements to deployment.",
                content: `# Building Features End-to-End with Claude Code

## Overview
Claude Code excels at building complete features when given clear requirements.

## Phase 1: Planning
Start with a conversation:
\`\`\`
I want to add a "Save to Collection" feature. Users should be 
able to save projects to custom collections, like bookmarking.

Requirements:
- Create, rename, delete collections
- Add/remove projects from collections
- Show collections on user profile
- Limit: 10 collections per user

Tech stack: Next.js 14, Prisma, PostgreSQL

Let's plan this out before writing code.
\`\`\`

## Phase 2: Database Design
Let Claude create migrations:
\`\`\`
Create the Prisma schema for collections. Each collection 
belongs to a user and contains multiple projects.
\`\`\`

## Phase 3: API Routes
Build the backend:
\`\`\`
Create API routes for:
- POST /api/collections (create)
- GET /api/collections (list user's collections)
- PUT /api/collections/:id (update)
- DELETE /api/collections/:id (delete)
- POST /api/collections/:id/projects (add project)
- DELETE /api/collections/:id/projects/:projectId (remove)
\`\`\`

## Phase 4: Frontend
Build the UI:
\`\`\`
Create the UI components:
- CollectionPicker modal (for saving projects)
- CollectionList component (for profile page)
- CreateCollectionForm

Use our existing design system and patterns.
\`\`\`

## Phase 5: Testing
\`\`\`
Write tests for the collections feature:
- Unit tests for collection utilities
- API route tests with mocked Prisma
- Component tests for the UI
\`\`\`

## Pro Tips
1. Share existing code patterns with Claude
2. Ask for small, reviewable chunks
3. Run tests after each phase
4. Use /compact mode for faster iteration`,
                category: "setup",
                difficulty: "advanced",
                platformId: claudeProfile.id,
            }
        );
    }

    if (ralphProfile) {
        workflows.push({
            title: "Autonomous Development with Ralph",
            slug: "ralph-autonomous-workflow",
            description: "Set up Ralph to run AI coding agents autonomously until your criteria are met.",
            content: `# Autonomous Development with Ralph

## When to Use Ralph
- Large, well-defined tasks
- Tasks with clear completion criteria
- Background development work
- Overnight code generation

## HITL to AFK Workflow

### Phase 1: Human-In-The-Loop (HITL)
1. Define your task clearly
2. Run Ralph with low max-iterations (3-5)
3. Watch the first few cycles
4. Refine your prompt based on behavior

### Phase 2: Away-From-Keyboard (AFK)
1. Increase max-iterations (10-50)
2. Use Docker sandbox for safety
3. Let Ralph work overnight
4. Review results in the morning

## Example: Building a Test Suite

### Create prompt.md
\`\`\`markdown
# Task: Add Comprehensive Tests

## Goal
Add unit tests to achieve 80% code coverage.

## Completion Criteria (verifiable)
- [ ] npm run test passes
- [ ] Coverage report shows >= 80%
- [ ] No console.log statements in tests
- [ ] All tests follow existing patterns

## Files to Test
- src/utils/*.ts
- src/api/*.ts
- src/components/*.tsx
\`\`\`

### Run Ralph
\`\`\`bash
ralph prompt.md \\
  --completion-signal "✅ All criteria met" \\
  --max-iterations 20
\`\`\`

## Monitoring Progress
\`\`\`bash
# Watch in real-time
ralph-monitor

# Check status
cat progress.txt

# Review decisions
cat AGENTS.md
\`\`\`

## Best Practices
1. Clear, verifiable completion criteria
2. Start with HITL, then AFK
3. Use sandboxes for safety
4. Set reasonable iteration limits`,
            category: "tips",
            difficulty: "advanced",
            platformId: ralphProfile.id,
        });
    }

    for (const workflow of workflows) {
        await prisma.workflow.upsert({
            where: { slug: workflow.slug },
            update: workflow,
            create: workflow,
        });
        console.log(`  ✓ Created workflow: ${workflow.title}`);
    }

    // Seed Prompt Templates
    const prompts = [];

    if (claudeProfile) {
        prompts.push(
            {
                title: "Feature Implementation Prompt",
                slug: "feature-implementation",
                description: "A structured prompt for implementing new features with proper architecture.",
                prompt: `Implement a [FEATURE_NAME] feature.

## Requirements
[List specific requirements]

## Technical Constraints
- Tech stack: [YOUR STACK]
- Follow patterns in: [REFERENCE FILES]
- Must include: TypeScript types, error handling, tests

## Acceptance Criteria
- [ ] [Specific, verifiable criterion]
- [ ] [Another criterion]
- [ ] All tests pass
- [ ] TypeScript compiles with no errors

## Implementation Steps
1. Start with data model/types
2. Build API layer
3. Create UI components
4. Add tests
5. Update documentation

Please proceed step by step, explaining your approach.`,
                category: "coding",
                useCase: "Starting a new feature with clear requirements",
                platformId: claudeProfile.id,
            },
            {
                title: "Bug Analysis Prompt",
                slug: "bug-analysis",
                description: "Systematic prompt for analyzing and fixing bugs with root cause analysis.",
                prompt: `I'm experiencing a bug:

## Error Details
\`\`\`
[PASTE ERROR MESSAGE/STACK TRACE]
\`\`\`

## Expected Behavior
[What should happen]

## Actual Behavior  
[What actually happens]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Bug occurs]

## Environment
- Node/Runtime version: 
- OS: 
- Relevant packages:

## What I've Tried
[List attempts to fix]

---

Please:
1. Analyze the error and identify root cause
2. Explain WHY this bug occurs
3. Suggest a fix with code
4. Recommend how to prevent similar issues`,
                category: "debugging",
                useCase: "Debugging issues systematically with full context",
                platformId: claudeProfile.id,
            },
            {
                title: "Code Review Prompt",
                slug: "code-review",
                description: "Get AI to review your code for issues, improvements, and best practices.",
                prompt: `Please review this code:

\`\`\`[language]
[PASTE YOUR CODE]
\`\`\`

## Context
[What this code does, where it's used]

## Review Focus
Check for:
- 🐛 Bugs and edge cases
- ⚡ Performance issues
- 🔒 Security vulnerabilities
- 📖 Readability and maintainability
- 🎯 Best practices violations
- ✨ Improvement opportunities

## Output Format
For each issue found:
1. Location (line/function)
2. Issue description
3. Severity (critical/warning/suggestion)
4. Recommended fix with code`,
                category: "refactoring",
                useCase: "Pre-commit code review to catch issues early",
                platformId: claudeProfile.id,
            }
        );
    }

    if (cursorProfile) {
        prompts.push({
            title: "Cursor Inline Edit Prompt",
            slug: "cursor-inline-edit",
            description: "Effective prompts for Cmd+K inline editing in Cursor.",
            prompt: `When using Cmd+K for inline edits, be specific:

## Good Prompts
- "Add null check and early return"
- "Convert to async/await with try-catch"
- "Extract magic numbers to named constants"
- "Add JSDoc with param and return types"
- "Memoize this expensive computation"

## Prompt Formula
[Action] + [Specific detail] + [Constraint if any]

## Examples
- "Refactor to use optional chaining instead of nested ifs"
- "Add loading state handling, use existing isLoading pattern"
- "Convert class to functional component with hooks"
- "Add input validation, throw descriptive errors"`,
            category: "coding",
            useCase: "Quick inline edits with Cursor Cmd+K",
            platformId: cursorProfile.id,
        });
    }

    for (const prompt of prompts) {
        await prisma.promptTemplate.upsert({
            where: { slug: prompt.slug },
            update: prompt,
            create: prompt,
        });
        console.log(`  ✓ Created prompt: ${prompt.title}`);
    }

    // Seed Resources
    const resources = [
        {
            title: "The Complete Guide to Vibe Coding",
            description: "An in-depth look at how AI-assisted coding is changing development workflows.",
            url: "https://example.com/vibe-coding-guide",
            type: "article",
            source: "Dev.to",
            author: "AI Dev Community",
            platforms: ["cursor", "claude-code"],
            tags: ["beginner", "workflow", "introduction"],
        },
        {
            title: "Cursor Tips & Tricks - 10x Your Productivity",
            description: "Video tutorial covering advanced Cursor features and keyboard shortcuts.",
            url: "https://youtube.com/example-cursor-tips",
            type: "youtube",
            source: "YouTube",
            author: "CodeWithAI",
            platforms: ["cursor"],
            tags: ["tips", "productivity", "advanced"],
        },
        {
            title: "Building a SaaS with Claude Code in 48 Hours",
            description: "Thread documenting the journey of building a complete SaaS using Claude Code.",
            url: "https://x.com/example-saas-thread",
            type: "x_post",
            source: "X/Twitter",
            author: "@vibebuilder",
            platforms: ["claude-code"],
            tags: ["case-study", "saas", "full-stack"],
        },
        {
            title: "AI Coding Best Practices for Teams",
            description: "Blog post on establishing consistent AI coding practices across engineering teams.",
            url: "https://example.com/team-ai-practices",
            type: "blog",
            source: "Medium",
            author: "Engineering Lead",
            platforms: ["cursor", "claude-code", "github-copilot"],
            tags: ["teams", "best-practices", "enterprise"],
        },
        {
            title: "Ralph: Autonomous AI Coding Explained",
            description: "Deep dive into using Ralph for autonomous, overnight code generation.",
            url: "https://example.com/ralph-explained",
            type: "tutorial",
            source: "Dev.to",
            author: "Ralph Contributor",
            platforms: ["ralph", "claude-code"],
            tags: ["advanced", "automation", "autonomous"],
        },
        {
            title: "Getting Started with OpenCode",
            description: "Complete tutorial on setting up and using OpenCode with multiple AI providers.",
            url: "https://youtube.com/opencode-getting-started",
            type: "youtube",
            source: "YouTube",
            author: "Terminal Dev",
            platforms: ["opencode"],
            tags: ["beginner", "setup", "multi-provider"],
        },
        {
            title: "Gemini CLI vs Claude Code: Which to Choose?",
            description: "Comparison of Google's Gemini CLI and Anthropic's Claude Code for different use cases.",
            url: "https://example.com/gemini-vs-claude",
            type: "article",
            source: "Dev.to",
            author: "AI Tools Review",
            platforms: ["gemini-cli", "claude-code"],
            tags: ["comparison", "decision-guide"],
        },
    ];

    for (const resource of resources) {
        await prisma.resource.upsert({
            where: { url: resource.url },
            update: resource,
            create: resource,
        });
        console.log(`  ✓ Created resource: ${resource.title}`);
    }

    // Seed End-to-End Guides
    const guides = [
        {
            title: "Building a Full-Stack SaaS with Claude Code",
            slug: "saas-with-claude-code",
            description: "A complete walkthrough of building a production-ready SaaS product using Claude Code. Covers project setup, database design, authentication, core features, and deployment.",
            content: `# Building a Full-Stack SaaS with Claude Code

## The Journey
I built a complete invoicing SaaS in 2 weeks using Claude Code. Here's exactly how.

## Week 1: Foundation

### Day 1-2: Project Setup
Started by describing my tech stack to Claude:
- Next.js 14 App Router
- Prisma + PostgreSQL
- Clerk authentication
- Stripe for payments

Claude helped scaffold the project structure and set up all configurations.

### Day 3-4: Database Design
Described my data model in plain English. Claude generated:
- Prisma schema with all relations
- Migration files
- Seed data script

### Day 5-7: Authentication & Core Features
- Clerk integration with webhooks
- User dashboard
- Invoice CRUD operations
- PDF generation

## Week 2: Polish & Ship

### Day 8-9: Stripe Integration
Claude handled the complex Stripe integration:
- Subscription management
- Usage-based billing
- Webhook handling
- Customer portal

### Day 10-11: Testing & Bug Fixes
Used Claude to:
- Write comprehensive tests
- Debug edge cases
- Handle error states

### Day 12-14: Deploy & Launch
- Vercel deployment
- Environment setup
- Monitoring configuration

## Key Learnings
1. Be specific about your tech stack upfront
2. Let Claude read your existing code before changes
3. Break large features into smaller chunks
4. Always review and understand the generated code

## Stats
- Lines of code: ~15,000
- Features: 12 major features
- Time saved: Estimated 4 weeks
- Bugs in production: 2 (minor)`,
            outcome: "Launched invoicing SaaS with paying customers",
            platforms: ["claude-code"],
            techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Clerk", "Stripe"],
            duration: "2 weeks",
            authorName: "Vibe Stack Team",
            featured: true,
        },
        {
            title: "From Zero to CLI Tool with Cursor",
            slug: "cli-tool-with-cursor",
            description: "How I built a developer CLI tool using Cursor. Includes tips for Node.js CLI development with AI assistance.",
            content: `# Building a CLI Tool with Cursor

## The Goal
Build a CLI to generate project scaffolding from templates.

## Project Setup
Created a clean TypeScript project with:
- Commander.js for CLI parsing
- Chalk for colored output
- Inquirer for prompts

## Using Cursor Effectively

### .cursorrules for CLI Development
\`\`\`
You are building a Node.js CLI tool.
- Use Commander.js for commands
- Add helpful --help text to all commands
- Include examples in help text
- Handle errors gracefully with exit codes
- Use chalk for colored output sparingly
\`\`\`

### Iterating on Commands
For each command:
1. Describe the command's purpose
2. Let Cursor generate the implementation
3. Test with various inputs
4. Refine error handling

## Publishing to npm
Cursor helped with:
- Package.json configuration
- README with examples
- GitHub Actions for publishing

## Results
- Published in 1 week
- 500+ downloads in first month
- Zero production bugs`,
            outcome: "Published npm package with 500+ downloads",
            platforms: ["cursor"],
            techStack: ["Node.js", "TypeScript", "Commander.js", "Chalk"],
            duration: "1 week",
            authorName: "CLI Builder",
            featured: false,
        },
    ];

    for (const guide of guides) {
        await prisma.endToEndGuide.upsert({
            where: { slug: guide.slug },
            update: guide,
            create: guide,
        });
        console.log(`  ✓ Created guide: ${guide.title}`);
    }

    console.log("\n✅ Comprehensive seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
