import { config } from "dotenv";
config({ path: ".env" });

import { PrismaClient, ResourceStatus } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { getTweet } from "react-tweet/api";

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clear user-generated content
    await prisma.comment.deleteMany();
    await prisma.upvote.deleteMany();
    await prisma.project.deleteMany();

    // await prisma.resource.deleteMany(); // Preserving resources to avoid re-fetching
    console.log("Removed all projects, collections, and workflows.");

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
            // Skills Configuration
            skillsPath: ".cursor/skills/<name>/",
            skillsGuide: `# Using Skills in Cursor

## Skills Directory
Cursor looks for skills in \`.cursor/skills/<name>/\` directories within your project.

## Creating a Skill
1. Create the directory: \`mkdir -p .cursor/skills/my-skill\`
2. Add a \`skill.md\` file with instructions
3. The skill will be automatically available

## Skill File Structure
\`\`\`
.cursor/
└── skills/
    └── react-component/
        ├── skill.md       # Main instructions
        └── examples/       # Optional examples
            └── Button.tsx
\`\`\`

## Example skill.md
\`\`\`markdown
# React Component Generator

When asked to create a React component:
1. Use TypeScript with proper interfaces
2. Include proper prop types
3. Add JSDoc documentation
4. Follow existing patterns in the codebase
\`\`\`

## Project Rules (.cursor/rules/)
You can also use \`.cursor/rules/\` with \`.mdc\` files for project-wide guidelines:
- Keep rules under 500 lines
- Use concrete names and descriptions
- Rules can be applied globally, locally, or by file patterns`,
            // MCP Configuration
            mcpSupported: true,
            mcpGuide: `# MCP Setup for Cursor

## Configuration Location
MCP servers are configured in Cursor settings under "MCP Servers" section.

## Adding an MCP Server
1. Open Cursor Settings (Cmd+,)
2. Navigate to "MCP Servers" section
3. Click "Add New MCP Server"
4. Provide server name and command/URL

## Configuration File
You can also configure via \`mcp.json\`:
\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-key-here"
      }
    }
  }
}
\`\`\`

## Popular MCP Servers for Cursor
- **Filesystem**: Direct file access
- **Brave Search**: Web search integration
- **GitHub**: PR and issue management
- **Database**: SQL query execution

## Tips
- Use environment variables for API keys
- Limit filesystem access to specific directories
- Test servers with simple commands first`,
            mcpConfigPath: "mcp.json or Cursor Settings",
            // Best Practices
            bestPractices: [
                "Use @Files, @Folders, @Code, @Docs, and @Web references to provide specific context in prompts",
                "Create .cursorignore and .cursorindexignore to exclude large or irrelevant files from AI context",
                "Write focused, composable .mdc rules under 500 lines with concrete names",
                "Use Agent mode for autonomous task execution, Ask mode for understanding and planning",
                "Define project-specific rules in .cursor/rules/ as .mdc files for AI to understand conventions",
                "Set global preferences like response language and coding principles via User Rules in settings",
                "Use environment variables for sensitive data instead of hardcoding API keys",
                "Restrict MCP server filesystem access to specific directories for security",
                "Regularly update MCP server packages to patch vulnerabilities",
                "Use local configurations for project-specific MCP servers to optimize performance",
                "Implement caching in custom servers for faster access to frequent data",
                "Version control your MCP configurations for team collaboration",
            ],
            // AI Capability Metadata
            agentType: "agentic",
            contextAwareness: ["repo", "docs"],
            planningAbility: true,
            toolCalling: true,
            memoryType: "session",
            bestFor: ["web-apps", "frontend", "full-stack", "typescript", "react"],
            tags: ["ide", "agentic", "enterprise"],
            workflows: ["editor", "repo-wide"],
            logoUrl: null,
            pricingTier: "freemium",
            companyName: "Anysphere",
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
            // Skills Configuration
            skillsPath: ".claude/skills/<name>/",
            skillsGuide: `# Using Skills in Claude Code

## Skills Directory
Claude Code loads skills from \`.claude/skills/<name>/\` directories.

## Creating a Skill
1. Create the directory: \`mkdir -p .claude/skills/my-skill\`
2. Add a \`SKILL.md\` file with instructions
3. Skills are automatically discovered

## Skill File Structure
\`\`\`
.claude/
└── skills/
    └── api-generator/
        ├── SKILL.md       # Main instructions
        ├── templates/      # Optional templates
        └── examples/       # Example outputs
\`\`\`

## Example SKILL.md
\`\`\`markdown
# API Route Generator

When generating API routes:
1. Use proper HTTP methods (GET, POST, PUT, DELETE)
2. Validate all inputs with Zod
3. Return consistent error responses
4. Add rate limiting for public endpoints
5. Include OpenAPI documentation comments
\`\`\`

## CLAUDE.md File
Place a \`CLAUDE.md\` at your project root for project-wide context:
- Common bash commands
- Core files and architecture
- Coding style guidelines
- Testing procedures
- Repository conventions

Claude automatically incorporates this into its context.`,
            // MCP Configuration
            mcpSupported: true,
            mcpGuide: `# MCP Setup for Claude Code

## Configuration Methods

### 1. CLI Commands (Quick Setup)
\`\`\`bash
claude mcp add github --scope user
claude mcp add filesystem /path/to/project --scope project
\`\`\`

### 2. Configuration Files (Recommended)
Edit configuration files directly for complex setups:

**User Config (~/.claude.json):**
\`\`\`json
{
  "mcpServers": {
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-perplexity"],
      "env": { "PERPLEXITY_API_KEY": "your-key" }
    }
  }
}
\`\`\`

**Project Config (.mcp.json):**
\`\`\`json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@mcp/postgres", "postgresql://..."]
    }
  }
}
\`\`\`

## Installation Scopes
- **Local**: Personal, experimental (current session only)
- **Project**: Team-shared (.mcp.json in project root)
- **User**: Personal tools across projects (~/.claude.json)

## Precedence
Local > Project > User (local overrides project overrides user)

## Popular MCP Integrations
- **GitHub**: PRs, issues, CI/CD management
- **Perplexity**: Real-time API documentation research
- **Sequential Thinking**: Complex task breakdown
- **Context7**: Version-specific library docs
- **Sentry**: Error monitoring integration
- **Figma/Notion**: Design and documentation workflows

## Environment Variables
\`\`\`bash
claude mcp add myserver --env API_KEY=secret
\`\`\`

## Troubleshooting
\`\`\`bash
claude mcp list          # Show configured servers
claude mcp test myserver # Test server connection
\`\`\``,
            mcpConfigPath: "~/.claude.json (user) or .mcp.json (project)",
            // Best Practices
            bestPractices: [
                "Use CLAUDE.md files at project root to document bash commands, core files, coding style, and testing procedures",
                "Plan before coding: instruct Claude to formulate a plan and approve it before code generation",
                "Use Escape key to pause Claude and redirect or expand instructions while preserving context",
                "Double-tap Escape to revisit and edit previous prompts",
                "Multi-task by establishing multiple Git checkouts in separate folders with Claude in each",
                "Only install trusted MCP servers as they operate with full system access",
                "Use project scope for testing MCP configurations before user-wide deployment",
                "Regularly update API keys, especially GitHub tokens",
                "Always review MCP server code to understand requested permissions",
                "Test MCP servers with simple commands after configuration",
                "For Windows: use cmd /c wrapper for npx commands and forward slashes in paths",
                "Set environment variables using --env flag, adjust timeouts with MCP_TIMEOUT",
            ],
            // AI Capability Metadata
            agentType: "autonomous",
            contextAwareness: ["repo", "terminal", "ci", "docs"],
            planningAbility: true,
            toolCalling: true,
            memoryType: "persistent",
            bestFor: ["full-stack", "debugging", "refactoring", "backend", "devops"],
            tags: ["cli", "agentic", "enterprise"],
            workflows: ["terminal", "ci", "repo-wide"],
            logoUrl: null,
            pricingTier: "paid",
            companyName: "Anthropic",
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
            // AI Capability Metadata
            agentType: "agentic",
            contextAwareness: ["repo", "terminal", "docs"],
            planningAbility: true,
            toolCalling: true,
            memoryType: "session",
            bestFor: ["full-stack", "scripting", "automation", "go", "python"],
            tags: ["cli", "agentic", "free", "open-source"],
            workflows: ["terminal", "ci", "repo-wide"],
            logoUrl: null,
            pricingTier: "freemium",
            companyName: "Google",
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
            // AI Capability Metadata
            agentType: "autonomous",
            contextAwareness: ["repo", "terminal", "ci"],
            planningAbility: true,
            toolCalling: true,
            memoryType: "persistent",
            bestFor: ["automation", "ci-cd", "large-refactors", "multi-step-tasks"],
            tags: ["cli", "agentic", "open-source"],
            workflows: ["terminal", "ci", "repo-wide"],
            logoUrl: null,
            pricingTier: "free",
            companyName: "Community",
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
            // Skills Configuration
            skillsPath: ".opencode/skill/<name>/",
            skillsGuide: `# Using Skills in OpenCode

## Skills Directory
OpenCode loads skills from \`.opencode/skill/<name>/\` directories.

## Creating a Skill
1. Create the directory: \`mkdir -p .opencode/skill/my-skill\`
2. Add instruction files
3. Skills are loaded on startup

## Skill File Structure
\`\`\`
.opencode/
└── skill/
    └── python-api/
        ├── instructions.md    # Main skill instructions
        ├── context.md         # Additional context
        └── examples/          # Example code
\`\`\`

## Example instructions.md
\`\`\`markdown
# Python API Development

When building Python APIs:
1. Use FastAPI or Flask
2. Add Pydantic models for validation
3. Include proper error handling
4. Add type hints everywhere
5. Structure with blueprints/routers
\`\`\`

## Custom Agents
Create specialized agents beyond skills:
\`\`\`bash
opencode agent create
\`\`\`

Built-in agents:
- **build**: Full permissions, makes changes
- **plan**: Read-only analysis and planning`,
            // MCP Configuration
            mcpSupported: true,
            mcpGuide: `# MCP Support in OpenCode

## Configuration
OpenCode supports MCP through its configuration file:

**opencode.json:**
\`\`\`json
{
  "model": "gpt-4o",
  "provider": "openai",
  "mcp": {
    "servers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "./"]
      }
    }
  }
}
\`\`\`

## Environment Variables
Set provider API keys:
\`\`\`bash
export OPENAI_API_KEY="..."
export ANTHROPIC_API_KEY="..."
export GOOGLE_API_KEY="..."
\`\`\`

## Tool Chain Integration
OpenCode integrates with your development tools:
- LSP (Language Server Protocol) support
- Git awareness
- Build tools (npm, pip, cargo)

## Built-in Tools
The AI has access to:
- \`glob\`, \`grep\`, \`ls\`: File navigation
- \`view\`, \`write\`, \`edit\`, \`patch\`: Code operations
- \`bash\`: Execute shell commands
- \`fetch\`: Get data from URLs
- \`sourcegraph\`: Search public code`,
            mcpConfigPath: "opencode.json",
            // Best Practices
            bestPractices: [
                "Use multiple AI providers for different tasks - OpenAI for speed, Claude for reasoning",
                "Leverage session persistence to maintain context across coding sessions",
                "Use the /models command to switch models mid-conversation based on task complexity",
                "Create custom agents for repetitive workflows using 'opencode agent create'",
                "Use the plan agent for analysis before the build agent for implementation",
                "Set up project-specific opencode.json for consistent team configuration",
                "Pipe output to OpenCode for code review: cat file.py | opencode 'review this'",
                "Use --continue flag to resume interrupted sessions seamlessly",
                "Leverage built-in Sourcegraph integration for searching open-source patterns",
                "Configure LSP integration for intelligent code diagnostics",
            ],
            // AI Capability Metadata
            agentType: "agentic",
            contextAwareness: ["repo", "terminal", "docs"],
            planningAbility: true,
            toolCalling: true,
            memoryType: "persistent",
            bestFor: ["full-stack", "multi-language", "open-source", "local-first"],
            tags: ["cli", "agentic", "open-source", "free"],
            workflows: ["terminal", "repo-wide"],
            logoUrl: null,
            pricingTier: "free",
            companyName: "Community",
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
            // Skills Configuration
            skillsPath: ".windsurf/skills/<name>/",
            skillsGuide: `# Using Skills in Windsurf

## Skills Directory
Windsurf loads custom configurations from \`.windsurf/skills/<name>/\`.

## Creating a Skill
1. Create directory: \`mkdir -p .windsurf/skills/my-skill\`
2. Add instruction files
3. Skills enhance Cascade and Flow modes

## Cascade Mode
Multi-file intelligent editing:
- Add context via skill files
- Coordinate changes across components
- Maintain code consistency

## Flow Mode
Agentic autonomous development:
- Define task boundaries in skills
- Set validation criteria
- Configure auto-review behavior`,
            // MCP Configuration
            mcpSupported: false,
            mcpGuide: `# Windsurf Integration

Windsurf uses Codeium's built-in AI infrastructure rather than MCP.

## Alternative: Codeium Extensions
- Built-in context providers
- Integrated search capabilities
- Native documentation access

## Workflow Integration
Use Cascade and Flow modes for:
- Multi-file editing
- Autonomous task execution
- Code review and refactoring`,
            mcpConfigPath: "N/A (uses Codeium infrastructure)",
            // Best Practices
            bestPractices: [
                "Let Cascade scan your entire codebase before starting complex edits",
                "Use Flow mode for multi-step autonomous tasks with clear completion criteria",
                "Review all AI-generated changes in diff view before accepting",
                "Combine Cascade for planning with Flow for execution",
                "Use Supercomplete inline suggestions for rapid coding",
                "Leverage existing VSCode extensions alongside Windsurf AI features",
                "Set up project context files for consistent AI behavior",
                "Break complex refactoring into smaller, reviewable chunks",
            ],
        },
        // NEW PLATFORMS
        {
            platformId: "codex",
            name: "Codex",
            tagline: "OpenAI's CLI coding agent",
            websiteUrl: "https://openai.com/codex",
            description: "Codex CLI is OpenAI's command-line coding agent that brings GPT-powered code generation directly to your terminal. It can read, modify, and run code within your project directory, with support for multimodal input including screenshots and design specifications.",
            setupGuide: `# Getting Started with Codex CLI

## Installation

### Via npm (Recommended)
\`\`\`bash
npm i -g @openai/codex
\`\`\`

### Via Homebrew
\`\`\`bash
brew install codex
\`\`\`

## Authentication
On first run, you'll be prompted to authenticate:
- ChatGPT account (Plus, Pro, Business, Enterprise)
- Or OpenAI API key

## Quick Start
\`\`\`bash
codex
\`\`\`

This launches the interactive TUI session.

## Key Features

### Interactive Mode
Full terminal UI for coding assistance:
- Multi-file operations
- Code review integration
- Test execution

### Single Commands
\`\`\`bash
codex "Add error handling to all API routes"
\`\`\`

### Multimodal Input
Attach screenshots or design specs:
\`\`\`bash
codex --attach design.png "Implement this UI"
\`\`\`

### Web Search
Enable real-time documentation lookup:
\`\`\`bash
codex --web "How to use the new React 19 API"
\`\`\`

## Slash Commands
- \`/model\`: Switch between GPT models
- \`/approvals\`: Change authorization level
- \`/new\`: Fresh session
- \`/diff\`: View Git differences`,
            cheatSheet: [
                "codex: Start interactive TUI session",
                "codex 'prompt': Single-shot command",
                "--attach: Include screenshots/designs",
                "--web: Enable web search for docs",
                "/model: Switch GPT models",
                "/approvals: Change auth level",
                "/new: Start fresh session",
                "/diff: View Git changes",
                "Included with ChatGPT Plus/Pro/Business",
                "Runs in Docker sandbox for security",
            ],
            // Skills Configuration
            skillsPath: ".codex/skills/<name>/",
            skillsGuide: `# Using Skills in Codex

## Skills Directory
Codex loads skills from \`.codex/skills/<name>/\` directories.

## Creating a Skill
1. Create directory: \`mkdir -p .codex/skills/my-skill\`
2. Add a \`skill.md\` with instructions
3. Skills are auto-loaded on session start

## Skill File Structure
\`\`\`
.codex/
└── skills/
    └── typescript-api/
        ├── skill.md         # Main instructions
        └── templates/       # Code templates
\`\`\`

## Example skill.md
\`\`\`markdown
# TypeScript API Generator

When creating API endpoints:
1. Use Zod for input validation
2. Return typed responses
3. Add OpenAPI documentation
4. Include rate limiting headers
\`\`\`

## Prompting Best Practices
The core principle for Codex models is "less is more":
- Be specific but concise
- Include constraints upfront
- Let the model determine implementation details`,
            // MCP Configuration
            mcpSupported: false,
            mcpGuide: `# Codex Integration

Codex CLI uses Docker-based sandboxing rather than MCP.

## Security Model
- Runs in lightweight container
- Restricted network access by default
- Isolated from host system

## IDE Integration
Codex integrates with:
- VS Code extension
- Cursor compatibility
- CI/CD pipelines

## Web Search
For external context, use the --web flag:
\`\`\`bash
codex --web "Find the latest prisma migration syntax"
\`\`\``,
            mcpConfigPath: "N/A (Docker-based sandboxing)",
            // Best Practices
            bestPractices: [
                "Craft specific, detailed prompts - quality output depends on prompt clarity",
                "Use aliases for frequently used configurations to launch quickly",
                "Master slash commands: /model, /approvals, /new, /diff",
                "Always review and test generated code thoroughly before committing",
                "Use --web flag for up-to-date documentation on new APIs and libraries",
                "Create Git checkpoints before and after each Codex session for easy rollback",
                "Leverage multimodal input: attach screenshots and designs for UI implementation",
                "Use Docker sandboxing for additional security when running generated code",
                "Switch between ChatGPT account and API key auth based on rate limits",
                "Document AI-generated code usage for team transparency",
            ],
        },
        {
            platformId: "amp",
            name: "Amp",
            tagline: "Sourcegraph's agentic coding assistant",
            websiteUrl: "https://sourcegraph.com/amp",
            description: "Amp is Sourcegraph's AI coding agent designed for team collaboration. It features autonomous reasoning, comprehensive code editing, and can work as both a VS Code extension and CLI tool. With 200K token context and thread sharing, it excels at complex multi-file tasks.",
            setupGuide: `# Getting Started with Amp

## Installation

### VS Code Extension
1. Open Extensions (Cmd+Shift+X)
2. Search "Amp" by Sourcegraph
3. Install and authenticate

### CLI
\`\`\`bash
npm install -g @sourcegraph/amp-cli
amp auth login
\`\`\`

## Key Features

### Agentic Coding
Amp can autonomously:
- Edit multiple files
- Run commands
- Execute tests
- Iterate on results

### Thread Sharing
Share conversation threads with teammates:
- Collaborative problem solving
- Knowledge transfer
- Code review assistance

### 200K Token Context
Generous context window allows:
- Understanding large codebases
- Multi-file refactoring
- Complex architectural changes

### Subagents
For complex tasks, Amp spawns subagents:
- Each has own context and tools
- Keeps main thread clean
- Handles extensive output

## AGENT.md Files
Create an \`AGENT.md\` at project root:
\`\`\`markdown
# Project Context

## Build Commands
- \`npm run build\`
- \`npm test\`

## Code Conventions
- Use TypeScript strict mode
- Follow ESLint rules

## Architecture
- src/api: REST endpoints
- src/components: React components
\`\`\``,
            cheatSheet: [
                "amp: Start interactive session",
                "Thread sharing: Collaborate with teammates",
                "200K token context window",
                "Subagents: Handle complex multi-step tasks",
                "AGENT.md: Project context file",
                "Works in VS Code, Cursor, VSCodium, CLI",
                "Compact Thread: Manage context efficiently",
                "New Thread with Summary: Preserve knowledge",
                "DevContainer compatible",
                "Enterprise security options",
            ],
            // Skills Configuration
            skillsPath: ".agents/skills/<name>/",
            skillsGuide: `# Using Skills in Amp

## Skills Directory
Amp loads Agent Skills from \`.agents/skills/<name>/\` directories (workspace) or \`~/.config/agents/skills/\` (user-level).

## What Are Agent Skills?
Domain-specific instruction sets that:
- Lazily load specific tool-use instructions
- Improve tool performance
- Maintain context efficiency

## Creating a Skill
1. Create directory: \`mkdir -p .agents/skills/react-testing\`
2. Add a \`skill.md\` with instructions
3. Skills auto-load based on context

## Skill File Structure
\`\`\`
.agents/
└── skills/
    └── react-testing/
        ├── skill.md        # Main instructions
        └── examples/       # Example patterns
\`\`\`

## Example skill.md
\`\`\`markdown
# React Testing Skill

When testing React components:
1. Use React Testing Library
2. Test user interactions, not implementation
3. Use userEvent for interactions
4. Assert on accessible elements
5. Mock network requests with MSW
\`\`\`

## Custom Slash Commands
Define in \`.agents/commands/\` folder:
\`\`\`
.agents/
└── commands/
    └── deploy.md
\`\`\``,
            // MCP Configuration
            mcpSupported: true,
            mcpGuide: `# MCP Setup for Amp

## Configuration Location
Global settings: \`~/.config/amp/settings.json\`

## Adding MCP Servers
\`\`\`json
{
  "mcpServers": {
    "read_web_page": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-web"]
    },
    "mermaid": {
      "command": "npx",
      "args": ["-y", "@mcp/mermaid-server"]
    }
  }
}
\`\`\`

## Built-in MCP Servers
- **read_web_page**: Fetch and read web content
- **Mermaid charting**: Generate diagrams

## AGENT.md for Context
Provide Amp with project context:
\`\`\`markdown
# Project

## MCP Servers Available
- Mermaid for diagrams
- Web reader for documentation

## When to Use MCP
- Fetch library documentation
- Generate architecture diagrams
\`\`\`

## Security Notes
- Review server code for permissions
- Run latest versions
- Be cautious with configuration modification capabilities`,
            mcpConfigPath: "~/.config/amp/settings.json",
            // Best Practices
            bestPractices: [
                "Use AGENT.md files to provide context about codebase, build commands, and conventions",
                "Create sub-project specific AGENT.md files for large monorepos",
                "Define custom slash commands in .agents/commands/ for automated workflows",
                "Plan before execution: discuss and refine plans before implementing code",
                "Break complex tasks into smaller, manageable pieces for the agent",
                "Leverage Amp's iteration capability on test results and code output",
                "Use Compact Thread and New Thread with Summary to manage 200K context",
                "Use subagents for multi-step tasks producing extensive output",
                "Share threads with teammates for collaborative problem-solving",
                "Integrate DAST tools to identify security issues in AI-generated code",
            ],
        },
        {
            platformId: "antigravity",
            name: "Antigravity",
            tagline: "Google's agentic AI coding IDE",
            websiteUrl: "https://deepmind.google/antigravity",
            description: "Antigravity is Google DeepMind's agentic AI coding assistant built on Gemini. It offers a full IDE experience with task boundaries, artifact management, and deep integration with development workflows. Features include browser automation, image generation, and comprehensive project management.",
            setupGuide: `# Getting Started with Antigravity

## Access
Antigravity is available through:
- Google DeepMind IDE
- VS Code with Gemini extension
- CLI via Gemini CLI

## Key Concepts

### Task Boundaries
Structure your work with explicit task phases:
- **PLANNING**: Research and design
- **EXECUTION**: Write and modify code
- **VERIFICATION**: Test and validate

### Artifacts
Create and manage project documents:
- \`implementation_plan.md\`: Design proposals
- \`task.md\`: Progress tracking
- \`walkthrough.md\`: Proof of work

### Workflows
Define reusable processes in \`.agent/workflows/\`:
\`\`\`markdown
---
description: How to deploy the application
---
1. Run tests
2. Build production bundle
3. Deploy to staging
4. Run smoke tests
5. Promote to production
\`\`\`

## Tool Access
Antigravity can:
- Read and write files
- Run terminal commands
- Control browser for testing
- Generate images
- Search the web

## Best Practices
- Use PLANNING mode before coding
- Create implementation plans for user review
- Track progress in task.md
- Document completed work in walkthrough.md`,
            cheatSheet: [
                "Task boundaries: PLANNING, EXECUTION, VERIFICATION",
                "Artifacts: implementation_plan.md, task.md, walkthrough.md",
                "Workflows: .agent/workflows/ for reusable processes",
                "// turbo annotation for auto-run commands",
                "Browser automation for E2E testing",
                "Image generation for assets and mockups",
                "Web search for real-time information",
                "Multi-file editing with smart context",
                "Built on Gemini models",
                "Integrated development environment",
            ],
            // Skills Configuration
            skillsPath: ".agent/skills/<name>/",
            skillsGuide: `# Using Skills in Antigravity

## Skills Directory
Antigravity loads skills from \`.agent/skills/<name>/\` directories.

## Creating a Skill
1. Create directory: \`mkdir -p .agent/skills/nextjs-app\`
2. Add a \`skill.md\` with instructions
3. Skills enhance AI capabilities for specific domains

## Skill File Structure
\`\`\`
.agent/
├── skills/
│   └── nextjs-app/
│       ├── skill.md         # Main instructions
│       └── templates/       # Code patterns
└── workflows/
    └── deploy.md            # Reusable workflows
\`\`\`

## Example skill.md
\`\`\`markdown
# Next.js App Development

When building Next.js applications:
1. Use App Router (not Pages)
2. Server Components by default
3. 'use client' only when needed
4. Type all props with TypeScript
5. Use Tailwind for styling
6. Follow existing patterns in codebase
\`\`\`

## Workflows
Define step-by-step processes:
\`\`\`yaml
---
description: Run full test suite
---
// turbo
1. npm run lint
// turbo
2. npm run test
3. npm run build
\`\`\`

The \`// turbo\` annotation auto-runs that step.`,
            // MCP Configuration
            mcpSupported: true,
            mcpGuide: `# MCP Support in Antigravity

## Configuration
Antigravity supports MCP through the Gemini infrastructure.

## Built-in Capabilities
Unlike traditional MCP, Antigravity has native tools:
- **File System**: Read/write files directly
- **Terminal**: Run commands with approval
- **Browser**: Automate web interactions
- **Image Generation**: Create assets
- **Web Search**: Real-time information

## .gemini Directory
User-specific configurations in \`~/.gemini/\`:
- Preferences and settings
- Cached information
- Artifact storage

## Workflows as MCP Alternative
Define custom tools via workflows:
\`\`\`markdown
---
description: Deploy to production
---
1. Run pre-deployment checks
2. Build the application
3. Deploy to cloud provider
\`\`\`

## Integration Points
- Google Cloud services
- Vertex AI
- Google Workspace (Docs, Sheets)`,
            mcpConfigPath: "~/.gemini/ or .agent/workflows/",
            // Best Practices
            bestPractices: [
                "Use task_boundary tool to structure work into PLANNING, EXECUTION, VERIFICATION phases",
                "Create implementation_plan.md for complex changes and get user approval before coding",
                "Track progress in task.md with [ ], [/], and [x] checkboxes",
                "Document completed work in walkthrough.md with embedded screenshots",
                "Define reusable workflows in .agent/workflows/ with // turbo annotations",
                "Use notify_user tool to communicate and get feedback during tasks",
                "Leverage browser_subagent for E2E testing and web interactions",
                "Generate images for UI mockups and visual assets",
                "Use web search for real-time documentation and API information",
                "Structure artifacts with proper markdown formatting and file links",
                "Create skills for domain-specific coding patterns",
                "Use absolute paths for all file operations",
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
            title: "Introducing Claude Code",
            description: "Official introduction from Anthropic. Claude lets developers delegate substantial engineering tasks to Claude directly from their terminal. Watch Claude explain projects, add features, create tests, and fix errors.",
            url: "https://www.youtube.com/watch?v=qURuNKz3a94",
            type: "youtube",
            source: "YouTube",
            author: "Anthropic",
            platforms: ["claude-code"],
            tags: ["official", "introduction", "beginner"],
            status: ResourceStatus.APPROVED,
            featured: true,
        },
        {
            title: "Claude Code Tutorial for Beginners",
            description: "Learn how to install Claude Code on Mac or Windows, connect it to VS Code, build your first app, structure prompts effectively, and use Plan mode like a senior engineer.",
            url: "https://www.youtube.com/watch?v=example1",
            type: "youtube",
            source: "YouTube",
            author: "Kevin Stratvert",
            platforms: ["claude-code"],
            tags: ["tutorial", "beginner", "setup"],
            status: ResourceStatus.APPROVED,
            featured: true,
        },
        {
            title: "Claude Code Tutorial #1 - Introduction & Setup",
            description: "Learn how to harness Claude Code within your development workflow, including how to install, setup a new project, add context, use MCP servers, and create subagents.",
            url: "https://www.youtube.com/watch?v=example2",
            type: "youtube",
            source: "YouTube",
            author: "Net Ninja",
            platforms: ["claude-code"],
            tags: ["tutorial", "setup", "mcp"],
            status: ResourceStatus.APPROVED,
        },
        {
            title: "Claude Code for Absolute Beginners: Step-by-Step Tutorial",
            description: "Bring Claude Code directly to your computer. Complete guide for absolute beginners with step-by-step instructions.",
            url: "https://www.youtube.com/watch?v=example3",
            type: "youtube",
            source: "YouTube",
            author: "Allie K Miller",
            platforms: ["claude-code"],
            tags: ["beginner", "tutorial"],
            status: ResourceStatus.APPROVED,
        },
        {
            title: "The Only Claude Code Guide You'll Ever Need (Opus 4.5)",
            description: "Complete beginner's guide to Claude Code. Everything you need to know about using Claude Code with Opus 4.5.",
            url: "https://www.youtube.com/watch?v=example4",
            type: "youtube",
            source: "YouTube",
            author: "Alex Finn",
            platforms: ["claude-code"],
            tags: ["complete-guide", "opus"],
            status: ResourceStatus.APPROVED,
        },
        {
            title: "Cursor Tips & Tricks - 10x Your Productivity",
            description: "Video tutorial covering advanced Cursor features and keyboard shortcuts.",
            url: "https://www.youtube.com/watch?v=example5",
            type: "youtube",
            source: "YouTube",
            author: "CodeWithAI",
            platforms: ["cursor"],
            tags: ["tips", "productivity", "advanced"],
            status: ResourceStatus.APPROVED,
        },
        {
            title: "The Complete Guide to Vibe Coding",
            description: "An in-depth look at how AI-assisted coding is changing development workflows.",
            url: "https://example.com/vibe-coding-guide",
            type: "blog",
            source: "Dev.to",
            author: "AI Dev Community",
            platforms: ["cursor", "claude-code"],
            tags: ["beginner", "workflow", "introduction"],
            status: ResourceStatus.APPROVED,
        },
        {
            title: "Building a SaaS with Claude Code in 48 Hours",
            description: "Thread documenting the journey of building a complete SaaS using Claude Code.",
            url: "https://x.com/example-saas-thread",
            type: "social",
            source: "X/Twitter",
            author: "@vibebuilder",
            platforms: ["claude-code"],
            tags: ["case-study", "saas", "full-stack"],
            status: ResourceStatus.APPROVED,
        },
        {
            title: "Windsurf vs Cursor: The Ultimate Comparison",
            description: "Detailed comparison of Windsurf and Cursor for AI-assisted development.",
            url: "https://example.com/windsurf-vs-cursor",
            type: "blog",
            source: "Medium",
            author: "AI Tools Review",
            platforms: ["windsurf", "cursor"],
            tags: ["comparison", "review"],
            status: ResourceStatus.APPROVED,
        },
        {
            title: "Getting Started with OpenCode",
            description: "Complete tutorial on setting up and using OpenCode with multiple AI providers.",
            url: "https://www.youtube.com/watch?v=example6",
            type: "youtube",
            source: "YouTube",
            author: "Terminal Dev",
            platforms: ["opencode"],
            tags: ["beginner", "setup", "multi-provider"],
            status: ResourceStatus.APPROVED,
        },
    ];

    // (Removed original example resources)

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

    // Seed MCP Servers
    const mcpServers = [
        {
            name: "Supabase",
            slug: "supabase",
            description: "Connect Claude Code to your Supabase database. Query tables, manage data, and interact with your Supabase project directly from the terminal.",
            provider: "official",
            category: "database",
            installCommand: "npx @anthropic-ai/mcp-server-supabase",
            docsUrl: "https://docs.anthropic.com/en/docs/claude-code/mcp/supabase",
            repoUrl: "https://github.com/anthropic/mcp-server-supabase",
            platforms: ["claude-code"],
            featured: true,
        },
        {
            name: "PostgreSQL",
            slug: "postgresql",
            description: "Direct PostgreSQL database access for Claude Code. Run queries, inspect schemas, and manage your database without leaving your terminal.",
            provider: "official",
            category: "database",
            installCommand: "npx @anthropic-ai/mcp-server-postgres",
            docsUrl: "https://docs.anthropic.com/en/docs/claude-code/mcp/postgres",
            platforms: ["claude-code"],
            featured: true,
        },
        {
            name: "Prisma",
            slug: "prisma",
            description: "Prisma ORM integration for Claude Code. Manage your schema, run migrations, and query your database using Prisma Client.",
            provider: "community",
            category: "database",
            installCommand: "npx @mcp/prisma-server",
            docsUrl: "https://prisma.io/docs",
            repoUrl: "https://github.com/prisma/prisma",
            platforms: ["claude-code", "cursor"],
            featured: true,
        },
        {
            name: "Figma",
            slug: "figma",
            description: "Access your Figma designs from Claude Code. Read design specs, extract components, and translate designs to code.",
            provider: "official",
            category: "design",
            installCommand: "npx @anthropic-ai/mcp-server-figma",
            docsUrl: "https://docs.anthropic.com/en/docs/claude-code/mcp/figma",
            platforms: ["claude-code"],
            featured: true,
        },
        {
            name: "Vercel",
            slug: "vercel",
            description: "Deploy and manage your Vercel projects from Claude Code. Create deployments, manage environment variables, and check deployment status.",
            provider: "official",
            category: "cloud",
            installCommand: "npx @anthropic-ai/mcp-server-vercel",
            docsUrl: "https://docs.anthropic.com/en/docs/claude-code/mcp/vercel",
            platforms: ["claude-code"],
        },
        {
            name: "Cloudflare",
            slug: "cloudflare",
            description: "Manage Cloudflare Workers, Pages, and D1 databases from Claude Code. Deploy edge functions and manage your CDN.",
            provider: "official",
            category: "cloud",
            installCommand: "npx @anthropic-ai/mcp-server-cloudflare",
            docsUrl: "https://docs.anthropic.com/en/docs/claude-code/mcp/cloudflare",
            platforms: ["claude-code"],
        },
        {
            name: "GitHub",
            slug: "github",
            description: "Full GitHub integration. Create issues, manage PRs, read repository contents, and automate your workflow.",
            provider: "official",
            category: "productivity",
            installCommand: "npx @anthropic-ai/mcp-server-github",
            docsUrl: "https://docs.anthropic.com/en/docs/claude-code/mcp/github",
            repoUrl: "https://github.com/anthropic/mcp-server-github",
            platforms: ["claude-code"],
            featured: true,
        },
        {
            name: "Slack",
            slug: "slack",
            description: "Send messages, read channels, and interact with your Slack workspace from Claude Code.",
            provider: "official",
            category: "productivity",
            installCommand: "npx @anthropic-ai/mcp-server-slack",
            docsUrl: "https://docs.anthropic.com/en/docs/claude-code/mcp/slack",
            platforms: ["claude-code"],
        },
        {
            name: "Sentry",
            slug: "sentry",
            description: "Access Sentry error tracking. Query issues, stack traces, and debug production errors directly from Claude Code.",
            provider: "official",
            category: "monitoring",
            installCommand: "npx @anthropic-ai/mcp-server-sentry",
            docsUrl: "https://docs.anthropic.com/en/docs/claude-code/mcp/sentry",
            platforms: ["claude-code"],
        },
        {
            name: "Axiom",
            slug: "axiom",
            description: "Query logs and traces from Axiom. Debug production issues with real-time observability data.",
            provider: "community",
            category: "monitoring",
            installCommand: "npx @mcp/axiom-server",
            docsUrl: "https://axiom.co/docs",
            platforms: ["claude-code"],
        },
        {
            name: "Convex",
            slug: "convex",
            description: "Connect to your Convex backend. Query your database, call functions, and manage your Convex project.",
            provider: "community",
            category: "database",
            installCommand: "npx @mcp/convex-server",
            docsUrl: "https://docs.convex.dev",
            repoUrl: "https://github.com/get-convex/convex",
            platforms: ["claude-code"],
        },
        {
            name: "E2B",
            slug: "e2b",
            description: "Run code in secure sandboxes. Execute Python, JavaScript, and more in isolated environments.",
            provider: "community",
            category: "devops",
            installCommand: "npx @mcp/e2b-server",
            docsUrl: "https://e2b.dev/docs",
            platforms: ["claude-code"],
        },
    ];

    for (const mcp of mcpServers) {
        await prisma.mCPServer.upsert({
            where: { slug: mcp.slug },
            update: mcp,
            create: mcp,
        });
        console.log(`  ✓ Created MCP: ${mcp.name}`);
    }

    // Seed Sub-Agents
    const subAgents = [
        {
            name: "React Architect",
            slug: "react-architect",
            role: "Expert React developer with deep knowledge of hooks, state management, and component architecture",
            systemPrompt: `You are an expert React architect with deep knowledge of React 18+, hooks, and modern patterns.

When writing React code:
- Always use functional components with hooks
- Prefer composition over inheritance
- Use TypeScript for type safety
- Implement proper error boundaries
- Follow the container/presentational pattern when appropriate
- Use React.memo() for performance optimization when needed
- Implement proper loading and error states
- Use Suspense for code splitting
- Follow the React team's recommended patterns

For state management:
- Start with useState/useReducer for local state
- Use Context for dependency injection, not global state
- Consider Zustand or Jotai for complex global state
- Use React Query/TanStack Query for server state

For styling:
- Prefer CSS Modules or Tailwind CSS
- Avoid inline styles except for dynamic values
- Use CSS custom properties for theming`,
            category: "frontend",
            language: "typescript",
            framework: "react",
            whenToUse: "Use when building React applications, creating new components, or architecting frontend solutions.",
            examples: ["Create a new dashboard component", "Implement a search with debounce", "Build a form with validation"],
            platforms: ["claude-code", "cursor"],
            featured: true,
        },
        {
            name: "Next.js Expert",
            slug: "nextjs-expert",
            role: "Full-stack Next.js developer specializing in App Router, Server Components, and performance optimization",
            systemPrompt: `You are an expert Next.js developer with deep knowledge of Next.js 14+ App Router.

Core principles:
- Use Server Components by default
- Only use 'use client' when necessary (state, effects, browser APIs)
- Leverage Server Actions for mutations
- Use proper data fetching patterns (fetch in Server Components)
- Implement proper caching strategies

File structure:
- app/ for routes using App Router
- components/ for reusable components
- lib/ for utilities and shared code
- Use route groups (parentheses) for organization
- Implement proper loading.tsx and error.tsx

Performance:
- Use dynamic imports for code splitting
- Implement proper image optimization with next/image
- Use proper metadata for SEO
- Implement proper caching with revalidate

API Routes:
- Use Route Handlers in app/api/
- Implement proper error handling
- Use NextResponse for responses
- Validate request bodies with Zod`,
            category: "fullstack",
            language: "typescript",
            framework: "nextjs",
            whenToUse: "Use when building Next.js applications with App Router, implementing API routes, or optimizing performance.",
            examples: ["Create an API route", "Implement server actions", "Build a dynamic page"],
            platforms: ["claude-code", "cursor"],
            featured: true,
        },
        {
            name: "Python Expert",
            slug: "python-expert",
            role: "Senior Python developer with expertise in FastAPI, Django, and modern Python patterns",
            systemPrompt: `You are an expert Python developer with deep knowledge of Python 3.11+ and modern patterns.

Code style:
- Follow PEP 8 style guidelines
- Use type hints everywhere (typing module)
- Use dataclasses or Pydantic for data structures
- Prefer f-strings for string formatting
- Use pathlib for file paths
- Use context managers (with) for resource management

For web development:
- FastAPI for modern async APIs
- Django for full-featured web applications
- Use SQLAlchemy or Django ORM for databases
- Implement proper dependency injection
- Use Pydantic for request/response validation

Best practices:
- Write comprehensive docstrings
- Use virtual environments (venv/poetry)
- Implement proper logging with structlog or loguru
- Use pytest for testing with proper fixtures
- Handle errors explicitly with try/except

Async programming:
- Use async/await for I/O bound operations
- Use asyncio for concurrent operations
- Consider using httpx for async HTTP requests`,
            category: "backend",
            language: "python",
            whenToUse: "Use when building Python applications, APIs with FastAPI, or backend services.",
            examples: ["Create a FastAPI endpoint", "Implement an async data processor", "Build a CLI tool"],
            platforms: ["claude-code", "cursor"],
            featured: true,
        },
        {
            name: "TypeScript Pro",
            slug: "typescript-pro",
            role: "TypeScript expert focusing on type safety, advanced patterns, and best practices",
            systemPrompt: `You are an expert TypeScript developer focused on type safety and best practices.

Core principles:
- Enable strict mode always
- Prefer interfaces for object shapes
- Use type for unions, intersections, and utility types
- Avoid 'any' - use 'unknown' when type is truly unknown
- Use const assertions for literal types
- Leverage discriminated unions for state machines

Advanced patterns:
- Use generics for reusable, type-safe code
- Implement proper type guards (is, asserts)
- Use template literal types for string patterns
- Leverage conditional types for type transformations
- Use mapped types for object transformations

Best practices:
- Export types from a central types.ts file
- Use Zod for runtime validation with type inference
- Implement proper error handling with Result types
- Use branded types for type-safe IDs
- Prefer readonly for immutable data

Common utilities:
- Partial<T>, Required<T>, Pick<T, K>, Omit<T, K>
- Record<K, V> for dictionaries
- ReturnType<T>, Parameters<T> for function types
- Awaited<T> for promise types`,
            category: "fullstack",
            language: "typescript",
            whenToUse: "Use when working with TypeScript, defining types, or implementing type-safe patterns.",
            examples: ["Create type-safe API client", "Implement a generic utility", "Build a type-safe state machine"],
            platforms: ["claude-code", "cursor"],
            featured: true,
        },
        {
            name: "Go Engineer",
            slug: "go-engineer",
            role: "Expert Go developer with focus on concurrency, performance, and idiomatic code",
            systemPrompt: `You are an expert Go developer with deep knowledge of Go 1.21+ and best practices.

Code style:
- Follow Effective Go guidelines
- Use gofmt for formatting
- Keep functions small and focused
- Use meaningful variable names
- Error handling: always check errors explicitly
- Use defer for cleanup operations

Concurrency:
- Use goroutines for concurrent operations
- Use channels for communication between goroutines
- Implement proper synchronization with sync package
- Use context for cancellation and timeouts
- Consider worker pools for bounded concurrency

Project structure:
- cmd/ for main applications
- internal/ for private packages
- pkg/ for public packages
- Use Go modules for dependency management

Best practices:
- Use interfaces for abstraction (accept interfaces, return structs)
- Implement the io.Reader/io.Writer patterns
- Use table-driven tests
- Handle errors by wrapping with context
- Use structured logging (zerolog, zap)`,
            category: "backend",
            language: "go",
            whenToUse: "Use when building Go applications, APIs, or concurrent systems.",
            examples: ["Create an HTTP server", "Implement a worker pool", "Build a CLI tool"],
            platforms: ["claude-code"],
        },
        {
            name: "DevOps Engineer",
            slug: "devops-engineer",
            role: "Infrastructure and DevOps specialist with expertise in Docker, Kubernetes, and CI/CD",
            systemPrompt: `You are an expert DevOps engineer with deep knowledge of infrastructure and deployment.

Docker:
- Write efficient multi-stage Dockerfiles
- Use .dockerignore to reduce context size
- Run as non-root user for security
- Use specific version tags, not :latest
- Leverage build cache effectively

Kubernetes:
- Use Deployments for stateless applications
- Implement proper health checks (liveness, readiness)
- Use ConfigMaps and Secrets for configuration
- Implement proper resource limits
- Use Horizontal Pod Autoscaler for scaling

CI/CD:
- GitHub Actions for automation
- Implement proper testing stages
- Use semantic versioning
- Implement blue-green or canary deployments
- Automate security scanning

Infrastructure as Code:
- Terraform for cloud infrastructure
- Use modules for reusability
- Implement proper state management
- Use workspaces for environments

Monitoring:
- Prometheus for metrics
- Grafana for dashboards
- Set up proper alerting
- Implement distributed tracing`,
            category: "devops",
            whenToUse: "Use when setting up infrastructure, CI/CD pipelines, or container orchestration.",
            examples: ["Write a Dockerfile", "Create GitHub Actions workflow", "Set up Kubernetes deployment"],
            platforms: ["claude-code"],
        },
        {
            name: "Database Architect",
            slug: "database-architect",
            role: "Database expert with focus on schema design, query optimization, and data modeling",
            systemPrompt: `You are an expert database architect with deep knowledge of SQL and NoSQL databases.

Schema design:
- Normalize to 3NF for OLTP workloads
- Consider denormalization for read-heavy workloads
- Use proper data types and constraints
- Implement proper foreign key relationships
- Use indexes strategically

PostgreSQL:
- Use JSONB for semi-structured data
- Implement proper indexing (B-tree, GIN, GiST)
- Use CTEs for complex queries
- Consider partitioning for large tables
- Use EXPLAIN ANALYZE for query optimization

Prisma:
- Design schema with proper relations
- Use proper field types and constraints
- Implement proper indexes in schema
- Use transactions for data integrity
- Handle migrations carefully

Query optimization:
- Avoid N+1 queries
- Use proper JOINs instead of subqueries
- Limit result sets with pagination
- Use database-level filtering, not application
- Cache expensive queries`,
            category: "database",
            language: "sql",
            whenToUse: "Use when designing database schemas, optimizing queries, or working with Prisma.",
            examples: ["Design a schema for user permissions", "Optimize a slow query", "Create a migration"],
            platforms: ["claude-code", "cursor"],
        },
        {
            name: "Testing Specialist",
            slug: "testing-specialist",
            role: "QA and testing expert with focus on comprehensive test coverage and best practices",
            systemPrompt: `You are an expert testing specialist with deep knowledge of testing patterns and tools.

Testing philosophy:
- Test behavior, not implementation
- Write tests that are maintainable
- Follow the testing pyramid (unit > integration > e2e)
- Use meaningful test descriptions
- Keep tests independent and isolated

Unit testing:
- Jest/Vitest for JavaScript/TypeScript
- pytest for Python
- Use proper mocking and stubbing
- Test edge cases and error paths
- Use parameterized tests for similar cases

Integration testing:
- Test component interactions
- Use test databases with proper cleanup
- Test API endpoints with supertest
- Mock external services appropriately

E2E testing:
- Playwright for browser automation
- Test critical user flows
- Use proper selectors (data-testid)
- Implement proper wait strategies
- Run in CI with proper browser setup

React Testing:
- React Testing Library for component tests
- Test user interactions, not implementation
- Use userEvent over fireEvent
- Query by role, label, or text`,
            category: "testing",
            whenToUse: "Use when writing tests, setting up testing infrastructure, or improving test coverage.",
            examples: ["Write unit tests for a service", "Create integration tests", "Set up E2E testing"],
            platforms: ["claude-code", "cursor"],
        },
    ];

    for (const agent of subAgents) {
        await prisma.subAgent.upsert({
            where: { slug: agent.slug },
            update: agent,
            create: agent,
        });
        console.log(`  ✓ Created Sub-Agent: ${agent.name}`);
    }

    // Seed Skills (Agent Skills - modular capabilities)
    console.log("\n📚 Seeding Skills...");

    const skills = [
        {
            name: "PowerPoint Creator",
            slug: "powerpoint-creator",
            tagline: "Create and edit professional presentations",
            description: "Generate polished PowerPoint presentations with proper formatting, charts, and layouts. Supports creating slides, adding content, and exporting to .pptx format.",
            instructions: `You are an expert PowerPoint creator. When asked to create presentations:

1. Structure slides logically with clear headings
2. Use bullet points for key information
3. Include speaker notes where appropriate
4. Suggest relevant images or charts
5. Follow professional presentation best practices
6. Keep text concise and readable
7. Use consistent styling throughout

Output Format:
- Provide slide content in structured format
- Include title, body, and notes for each slide
- Suggest visual elements to enhance impact`,
            category: "document",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode"],
            examples: ["Create a quarterly report presentation", "Design a product launch deck", "Make a training presentation"],
            triggers: ["create presentation", "make powerpoint", "pptx", "slides"],
            provider: "official",
            featured: true,
            useCount: 4520,
        },
        {
            name: "Excel Data Analyst",
            slug: "excel-data-analyst",
            tagline: "Create spreadsheets and analyze data with charts",
            description: "Build Excel spreadsheets with formulas, pivot tables, and visualizations. Analyze data sets, generate reports, and create interactive dashboards.",
            instructions: `You are an expert Excel/spreadsheet analyst. When working with data:

1. Structure data in proper tabular format
2. Use appropriate formulas (SUM, VLOOKUP, INDEX/MATCH)
3. Create pivot tables for summarization
4. Design clear and informative charts
5. Apply conditional formatting for insights
6. Validate data inputs where appropriate
7. Document complex formulas with comments

Best Practices:
- Use named ranges for readability
- Separate raw data from calculations
- Include data validation rules
- Design for scalability`,
            category: "data",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode"],
            examples: ["Analyze sales data", "Create financial model", "Build tracking spreadsheet"],
            triggers: ["excel", "spreadsheet", "data analysis", "xlsx", "pivot table"],
            provider: "official",
            featured: true,
            useCount: 3890,
        },
        {
            name: "PDF Generator",
            slug: "pdf-generator",
            tagline: "Generate formatted PDF documents and reports",
            description: "Create professional PDF documents with proper formatting, headers, tables, and visual elements. Ideal for reports, documentation, and formal documents.",
            instructions: `You are an expert PDF document creator. When generating PDFs:

1. Use proper document structure with headers
2. Apply consistent typography and spacing
3. Include tables for structured data
4. Add page numbers and headers/footers
5. Use appropriate margins and layout
6. Include a table of contents for long documents
7. Add visual hierarchy with headings

Document Standards:
- Use professional fonts (serif for body, sans-serif for headings)
- Maintain proper line height (1.5x)
- Include proper page breaks
- Add metadata (title, author, date)`,
            category: "document",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode", "copilot"],
            examples: ["Generate a report", "Create documentation", "Make a contract PDF"],
            triggers: ["pdf", "generate document", "create report", "export pdf"],
            provider: "official",
            featured: false,
            useCount: 2150,
        },
        {
            name: "Code Reviewer",
            slug: "code-reviewer",
            tagline: "Thorough code review with actionable feedback",
            description: "Perform comprehensive code reviews focusing on bugs, security issues, performance, and best practices. Provides specific suggestions with code examples.",
            instructions: `You are a senior code reviewer. When reviewing code:

## Review Checklist
1. **Correctness**: Does the code work as intended?
2. **Security**: Are there any vulnerabilities?
3. **Performance**: Are there optimization opportunities?
4. **Readability**: Is the code clear and maintainable?
5. **Testing**: Is the code properly tested?
6. **DRY**: Is there unnecessary duplication?

## Feedback Format
- Provide specific line-by-line feedback
- Categorize issues: Bug, Security, Performance, Style
- Include severity: Critical, High, Medium, Low
- Suggest fixes with code examples

## Tone
- Be constructive and educational
- Explain the "why" behind suggestions
- Acknowledge good patterns`,
            category: "coding",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode", "copilot", "windsurf"],
            examples: ["Review this pull request", "Check for security issues", "Audit performance"],
            triggers: ["review code", "code review", "check code", "audit"],
            provider: "community",
            featured: true,
            useCount: 5670,
        },
        {
            name: "Git Workflow Expert",
            slug: "git-workflow",
            tagline: "Advanced Git operations and workflow automation",
            description: "Master Git commands, branching strategies, conflict resolution, and team collaboration workflows.",
            instructions: `You are a Git and version control expert. When helping with Git:

## Branching Strategy
- main/master: Production-ready code
- develop: Integration branch
- feature/*: New features
- hotfix/*: Production fixes
- release/*: Release preparation

## Best Practices
- Write meaningful commit messages (conventional commits)
- Keep commits atomic and focused
- Rebase feature branches before merging
- Use pull requests for code review
- Tag releases appropriately

## Commands Reference
- Interactive rebase: git rebase -i HEAD~n
- Cherry-pick: git cherry-pick <commit>
- Bisect: git bisect start/good/bad
- Reflog: git reflog for recovery

## Conflict Resolution
- Understand both changes before resolving
- Test after resolution
- Communicate with original authors`,
            category: "workflow",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode", "copilot"],
            examples: ["Resolve merge conflict", "Set up branching strategy", "Recover lost commits"],
            triggers: ["git", "merge", "branch", "commit", "rebase"],
            provider: "community",
            featured: false,
            useCount: 3420,
        },
        {
            name: "API Designer",
            slug: "api-designer",
            tagline: "Design RESTful APIs following best practices",
            description: "Create well-structured APIs with proper endpoints, authentication, error handling, and documentation using OpenAPI/Swagger specifications.",
            instructions: `You are an API design expert. When designing APIs:

## RESTful Conventions
- Use nouns for resources: /users, /posts
- HTTP methods: GET, POST, PUT, PATCH, DELETE
- Proper status codes: 200, 201, 400, 401, 404, 500
- Consistent naming: camelCase or snake_case

## URL Design
- GET /resources - List all
- GET /resources/:id - Get one
- POST /resources - Create
- PUT /resources/:id - Replace
- PATCH /resources/:id - Update
- DELETE /resources/:id - Delete

## Authentication
- JWT for stateless auth
- OAuth 2.0 for third-party access
- API keys for service-to-service

## Documentation
- OpenAPI 3.0 specification
- Include examples for all endpoints
- Document error responses
- Version your API (v1, v2)`,
            category: "coding",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode"],
            examples: ["Design a user API", "Create OpenAPI spec", "Document endpoints"],
            triggers: ["api design", "rest api", "openapi", "swagger", "endpoints"],
            provider: "community",
            featured: false,
            useCount: 2890,
        },
        {
            name: "Database Architect",
            slug: "database-architect",
            tagline: "Design efficient database schemas and queries",
            description: "Create optimized database schemas, write efficient queries, and implement proper indexing strategies for both SQL and NoSQL databases.",
            instructions: `You are a database architecture expert. When designing databases:

## Schema Design
- Normalize to 3NF for OLTP systems
- Denormalize strategically for read performance
- Use appropriate data types
- Define proper relationships (1:1, 1:N, N:N)

## Indexing Strategy
- Index columns used in WHERE, JOIN, ORDER BY
- Consider composite indexes for multi-column queries
- Avoid over-indexing (slows writes)
- Use covering indexes for frequent queries

## Query Optimization
- Use EXPLAIN/ANALYZE to understand query plans
- Avoid SELECT * in production
- Limit result sets with pagination
- Use prepared statements

## SQL Best Practices
- Use transactions for data consistency
- Implement proper constraints (FK, UNIQUE, CHECK)
- Add created_at, updated_at timestamps
- Use soft deletes for audit trails`,
            category: "data",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode", "copilot"],
            examples: ["Design user schema", "Optimize slow query", "Create indexes"],
            triggers: ["database", "schema", "sql", "query optimization", "indexes"],
            provider: "community",
            featured: true,
            useCount: 4120,
        },
        {
            name: "CI/CD Pipeline Builder",
            slug: "cicd-pipeline",
            tagline: "Automate builds, tests, and deployments",
            description: "Create robust CI/CD pipelines using GitHub Actions, GitLab CI, or other platforms. Includes testing, linting, security scanning, and deployment stages.",
            instructions: `You are a CI/CD expert. When creating pipelines:

## Pipeline Stages
1. **Build**: Compile/bundle application
2. **Lint**: Check code style
3. **Test**: Run unit/integration tests
4. **Security**: Scan for vulnerabilities
5. **Deploy**: Push to environments

## GitHub Actions Best Practices
- Use matrix builds for multiple versions
- Cache dependencies for speed
- Use secrets for credentials
- Set up proper branch protection

## Deployment Strategy
- Staging environment for testing
- Blue-green or canary deployments
- Rollback procedures
- Health checks post-deploy

## Pipeline Template
\`\`\`yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
\`\`\``,
            category: "automation",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode"],
            examples: ["Create GitHub Actions workflow", "Set up deployment pipeline", "Add test automation"],
            triggers: ["ci/cd", "github actions", "pipeline", "deploy", "automation"],
            provider: "community",
            featured: false,
            useCount: 2340,
        },
        // NEW SKILLS with proper SKILL.md format
        {
            name: "Commit Message Generator",
            slug: "commit-helper",
            tagline: "Generates clear commit messages from git diffs",
            description: "Creates well-structured commit messages following conventional commits format. Analyzes staged changes and suggests appropriate commit messages with summary and detailed description.",
            instructions: `# Generating Commit Messages

## Instructions
1. Run \`git diff --staged\` to see changes
2. I'll suggest a commit message with:
   - Summary under 50 characters
   - Detailed description
   - Affected components

## Best Practices
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Explain what and why, not how
- Reference issues if applicable

## Conventional Commits Format
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

Types: feat, fix, docs, style, refactor, perf, test, chore

## Example
\`\`\`
feat(auth): add OAuth2 login support

- Implement Google OAuth2 provider
- Add session management with JWT
- Include remember-me functionality

Closes #123
\`\`\``,
            category: "workflow",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode", "codex"],
            examples: ["Write commit message", "Create PR description", "Generate changelog"],
            triggers: ["commit", "git commit", "write commit message", "conventional commit"],
            provider: "official",
            featured: true,
            useCount: 8920,
        },
        {
            name: "Code Explainer",
            slug: "explaining-code",
            tagline: "Explains code with visual diagrams and analogies",
            description: "Provides clear explanations of code using everyday analogies, ASCII diagrams, and step-by-step walkthroughs. Perfect for learning and understanding complex codebases.",
            instructions: `# Explaining Code

When explaining code, always include:

## 1. Start with an Analogy
Compare the code to something from everyday life to build intuition.

## 2. Draw a Diagram
Use ASCII art to show the flow, structure, or relationships:

\`\`\`
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Request │───▶│ Handler │───▶│ Response│
└─────────┘    └─────────┘    └─────────┘
        ▲              │
        └──────────────┘
            (loop)
\`\`\`

## 3. Walk Through the Code
Explain step-by-step what happens when the code runs.

## 4. Highlight a Gotcha
What's a common mistake or misconception?

## Guidelines
- Keep explanations conversational
- For complex concepts, use multiple analogies
- Show before/after comparisons when relevant
- Use syntax highlighting for code snippets`,
            category: "document",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode", "codex"],
            examples: ["Explain this function", "How does this work?", "Walk me through this code"],
            triggers: ["explain", "how does this work", "what does this do", "understand code"],
            provider: "official",
            featured: true,
            useCount: 7650,
        },
        {
            name: "PR Creator",
            slug: "create-pr",
            tagline: "Creates GitHub pull requests with properly formatted content",
            description: "Generates well-structured pull request descriptions with context, changes summary, testing notes, and proper formatting. Follows best practices for PR reviews.",
            instructions: `# Creating Pull Requests

## PR Template Structure

### Title
Format: \`<type>: <brief description>\`
Example: \`feat: Add user authentication flow\`

### Description
\`\`\`markdown
## Summary
Brief description of what this PR does.

## Changes
- [ ] Change 1
- [ ] Change 2
- [ ] Change 3

## Testing
How was this tested?
- Unit tests added/updated
- Manual testing steps

## Screenshots (if applicable)
Before | After

## Related Issues
Closes #issue_number
\`\`\`

## Best Practices
- Keep PRs focused and small
- Include context for reviewers
- Add testing instructions
- Tag relevant reviewers
- Link related issues`,
            category: "workflow",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode", "codex"],
            examples: ["Create a pull request", "Write PR description", "/pr"],
            triggers: ["create pr", "pull request", "/pr", "open pr"],
            provider: "official",
            featured: true,
            useCount: 6890,
        },
        {
            name: "Test Writer",
            slug: "testing-expert",
            tagline: "Writes comprehensive tests with proper coverage",
            description: "Creates unit, integration, and E2E tests using modern testing frameworks. Follows testing best practices and ensures proper coverage of edge cases.",
            instructions: `# Writing Tests

## Test Structure (AAA Pattern)
\`\`\`typescript
describe('UserService', () => {
  it('should create a user with valid data', async () => {
    // Arrange - Set up test data
    const userData = { name: 'John', email: 'john@test.com' };
    
    // Act - Execute the code under test
    const user = await userService.create(userData);
    
    // Assert - Verify the results
    expect(user.name).toBe('John');
    expect(user.id).toBeDefined();
  });
});
\`\`\`

## Test Types
1. **Unit Tests**: Test individual functions/methods
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows

## Best Practices
- Test behavior, not implementation
- Use descriptive test names
- One assertion per test when possible
- Mock external dependencies
- Test edge cases and error paths
- Use parameterized tests for similar cases

## Coverage Targets
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+`,
            category: "coding",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode", "codex", "copilot"],
            examples: ["Write tests for this function", "Add unit tests", "Create integration tests"],
            triggers: ["write tests", "add tests", "testing", "unit test", "test coverage"],
            provider: "community",
            featured: true,
            useCount: 5430,
        },
        {
            name: "Refactoring Assistant",
            slug: "refactoring",
            tagline: "Improve code quality through systematic refactoring",
            description: "Identifies code smells and applies appropriate refactoring patterns to improve maintainability, readability, and performance while preserving behavior.",
            instructions: `# Refactoring Code

## Common Code Smells
- Long methods (> 20 lines)
- Large classes (> 200 lines)
- Duplicate code
- Deep nesting (> 3 levels)
- Magic numbers/strings
- God objects

## Refactoring Patterns

### Extract Method
\`\`\`typescript
// Before
function processOrder(order) {
  // validate
  if (!order.id) throw new Error();
  if (!order.items.length) throw new Error();
  // calculate
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.qty;
  }
  return total;
}

// After
function processOrder(order) {
  validateOrder(order);
  return calculateTotal(order.items);
}
\`\`\`

### Replace Magic Numbers
\`\`\`typescript
// Before
if (user.age >= 18) { ... }

// After
const LEGAL_AGE = 18;
if (user.age >= LEGAL_AGE) { ... }
\`\`\`

## Guidelines
- Make one refactoring at a time
- Run tests after each change
- Keep commits atomic
- Document significant changes`,
            category: "coding",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode", "codex"],
            examples: ["Refactor this function", "Clean up this code", "Improve code quality"],
            triggers: ["refactor", "clean up", "improve code", "code smell"],
            provider: "community",
            featured: false,
            useCount: 4210,
        },
        {
            name: "Debugging Expert",
            slug: "debugging",
            tagline: "Systematic debugging and root cause analysis",
            description: "Provides structured approach to debugging issues, analyzing stack traces, identifying root causes, and suggesting fixes with proper error handling.",
            instructions: `# Debugging Issues

## Debugging Process
1. **Reproduce** - Confirm the bug consistently
2. **Isolate** - Narrow down the cause
3. **Identify** - Find the root cause
4. **Fix** - Implement the solution
5. **Verify** - Confirm the fix works
6. **Prevent** - Add tests/guards

## Analyzing Errors

### Stack Trace Analysis
- Start from the bottom (oldest call)
- Find where your code begins
- Look for the actual error message
- Check variable values at that point

### Common Issues
| Symptom | Likely Cause |
|---------|-------------|
| undefined is not a function | Method doesn't exist |
| Cannot read property of null | Missing null check |
| Maximum call stack | Infinite recursion |
| Memory leak | Unclosed resources |

## Debugging Tools
- \`console.log\` - Quick checks
- \`debugger\` statement - Breakpoints
- Chrome DevTools - Full debugging
- \`node --inspect\` - Node.js debugging

## Questions to Ask
- What changed recently?
- Does it happen consistently?
- What are the exact steps to reproduce?
- What environment is affected?`,
            category: "coding",
            platforms: ["claude-code", "cursor", "gemini-cli", "opencode", "codex", "copilot"],
            examples: ["Debug this error", "Fix this bug", "Why isn't this working"],
            triggers: ["debug", "error", "bug", "not working", "fix issue"],
            provider: "community",
            featured: true,
            useCount: 6780,
        },
    ];

    for (const skill of skills) {
        await prisma.skill.upsert({
            where: { slug: skill.slug },
            update: skill,
            create: skill,
        });
        console.log(`  ✓ Created Skill: ${skill.name}`);
    }

    // Seed Social Posts (Tweets) as requested
    const tweetUrls = [
        "https://x.com/milesdeutscher/status/2011542096164036702",
        "https://x.com/claudeai/status/2010805682434666759",
        "https://x.com/ericw_ai/status/2010019062873837961",
        "https://x.com/heyshrutimishra/status/2008863725550539083",
        "https://x.com/tobi/status/2010438500609663110",
        // New batch
        "https://x.com/RiverNotFlowing/status/2012533136589303963",
        "https://x.com/RisonSimon/status/2012533085661737142",
        "https://x.com/joshnomics/status/2012533073087185064",
        "https://x.com/DhruvalGolakiya/status/2012533016548302878",
        "https://x.com/__roycohen/status/2012532935560180011",
        "https://x.com/alwinrajkumar/status/2012532875795521935",
        "https://x.com/internetartsy/status/2012532862877139082",
        "https://x.com/Aykutuces/status/2012532809043206382",
        "https://x.com/kengdaica/status/2012532784007680200",
        "https://x.com/CryptoOverAI/status/2012532769188954303",
        "https://x.com/AlinCatalin/status/2012532478204899559",
        "https://x.com/ddotdev/status/2012532440972120350",
        "https://x.com/murd_arch/status/2012532318758379607",
        "https://x.com/john_skult/status/2012532247359111513",
        "https://x.com/ennycodes/status/2012532233051988243",
        "https://x.com/vincenzolandino/status/2012532144178966852",
        "https://x.com/naveenmiitk/status/2012531983382143473",
        "https://x.com/MinaGawargious/status/2012531930655301671",
        "https://x.com/MosesSenpai/status/2012531890440274287",
        // User Requested Resources (Claude Code) -> MOVED TO ARTICLES
        //"https://x.com/bcherny/status/2007179832300581177",
        //"https://x.com/alliekmiller/status/2012197383673729037",
        //"https://x.com/petergyang/status/1963248146336866757",
        "https://x.com/omarsar0/status/1987167737639325886", // Keep regular tweets
        // User Requested Resources (Cursor IDE) -> MOVED TO ARTICLES
        //"https://x.com/csjcode/status/1897421080459141467",
        //"https://x.com/leerob/status/1970296525269147949",
        //"https://x.com/PauloGaspar7/status/1903283826459029787",
        // User Requested Resources (AI Agents)
        "https://x.com/levie/status/1953225396822163885"
    ];

    console.log("Seeding Tweets...");

    for (const url of tweetUrls) {
        try {
            const id = url.split("/").pop();
            if (!id) continue;

            // Fetch tweet data using react-tweet
            const tweet = await getTweet(id).catch(() => null);

            if (!tweet) {
                console.warn(`  ! Could not fetch tweet ${id} (might be invalid ID or API limit). Skipping.`);
                continue;
            }

            // Create Resource
            await prisma.resource.create({
                data: {
                    title: `Post by ${tweet.user.name}`,
                    description: tweet.text,
                    url: url,
                    type: "social",
                    source: `@${tweet.user.screen_name}`, // Storing handle in 'source' field
                    author: tweet.user.name,
                    thumbnail: tweet.user.profile_image_url_https,
                    status: "APPROVED",
                    viewCount: Math.floor(Math.random() * 1000),
                }
            });
            console.log(`  ✓ Seeded tweet: ${id}`);
        } catch (error) {
            console.error(`  x Failed to seed ${url}:`, error);
        }
    }

    // Seed YouTube Tutorials
    const youtubeTutorials = [
        {
            title: "A Complete Guide to Claude Code - Here are ALL the Best Strategies",
            url: "https://www.youtube.com/watch?v=amEUIuBKwvg",
            description: "Comprehensive guide covering the best strategies for using Claude Code",
            type: "youtube",
            source: "YouTube",
            author: "YouTube", // We don't have channel name in the list, default to generic or extract if possible? I'll use "YouTube" for now or leave generic.
            thumbnail: "https://img.youtube.com/vi/amEUIuBKwvg/maxresdefault.jpg", // Construct thumbnail from ID
            status: "APPROVED"
        },
        {
            title: "Claude Code Advanced Masterclass in Under 81 Mins",
            url: "https://www.youtube.com/watch?v=59gy_24KIVE",
            description: "Advanced techniques for product managers and developers",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/59gy_24KIVE/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "How to Set Up Claude Code in 2026 (Beginner Tutorial)",
            url: "https://www.youtube.com/watch?v=kddjxKEeCuM",
            description: "Complete beginner setup guide for Windows, macOS, and Linux, including VS Code and Cursor integration",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/kddjxKEeCuM/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "Claude Code for Absolute Beginners: STEP-BY-STEP",
            url: "https://www.youtube.com/watch?v=v1ynWeHhzXs",
            description: "Beginner-friendly walkthrough covering file creation, custom agents, and project management",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/v1ynWeHhzXs/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "Claude Code Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=eMZmDH3T2bY", // Removing &vl=en for cleaner URL
            description: "Essential tutorial covering prompt structuring, Plan mode, and working with existing codebases",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/eMZmDH3T2bY/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "Claude Code Masterclass: From Beginner to Expert in 33 Minutes",
            url: "https://www.youtube.com/watch?v=PCvbhY4xV2c",
            description: "Complete masterclass covering installation, debugging, subagents, and building full applications",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/PCvbhY4xV2c/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "Claude Code Masterclass: Become a ONE-Person Company",
            url: "https://www.youtube.com/watch?v=6qJsw0n0GGw",
            description: "Advanced blueprint for creating an AI factory, including multimodal mastery and framework replication",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/6qJsw0n0GGw/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "How to 10X Claude Code workflows (from its creator)",
            url: "https://www.youtube.com/watch?v=wnRQI4WZlPY",
            description: "Expert tips directly from the creator on optimizing Claude Code workflows",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/wnRQI4WZlPY/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "Cursor AI Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=3289vhOUdKA",
            description: "Covers panel layout, AI chat, agents, and real-world applications with MCP servers",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/3289vhOUdKA/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "Claude Code + Cursor COURSE - Build a FULL App",
            url: "https://www.youtube.com/watch?v=w5DcGBv-cqg",
            description: "Full course on building complete apps using Claude Code and Cursor with Nuxt.js",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/w5DcGBv-cqg/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "Cursor AI Tutorial: 10x Your Coding Productivity in 2026",
            url: "https://www.youtube.com/watch?v=bsJkQGUKc1A",
            description: "Latest 2026 tutorial on agent modes, debugging, and choosing the right AI model",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/bsJkQGUKc1A/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "Learn 80% of Cursor AI 2.0 in Under 22 Minutes! (2026)",
            url: "https://www.youtube.com/watch?v=-PcOTX15geI",
            description: "Quick guide to Cursor 2.0's new Composer model and agents",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/-PcOTX15geI/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "OpenCode + AntiGravity is INSANE!",
            url: "https://www.youtube.com/watch?v=DS37JuZ2IP8",
            description: "Latest tutorial showing how to deploy multiple AI agents like Claude 4.5 and Gemini 3 Pro",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/DS37JuZ2IP8/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "OpenCode: Build ANYTHING!",
            url: "https://www.youtube.com/watch?v=PCnvVs6UmKk",
            description: "Step-by-step guide on downloading, setting up, and building projects with OpenCode using plain English prompts",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/PCnvVs6UmKk/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "OpenCode AI Agent Setup: From Zero to Custom Skills",
            url: "https://www.youtube.com/watch?v=vHkLrDD2xrU",
            description: "Comprehensive guide on installation, model configuration, and creating custom agent skills",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/vHkLrDD2xrU/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "Google's FREE AI Coding Tool Antigravity Tutorial",
            url: "https://www.youtube.com/watch?v=RMs8QPtpiSg",
            description: "Complete 24-hour test review with download, setup, and React project creation",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/RMs8QPtpiSg/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "How to use Google Antigravity for beginners (AI IDE)",
            url: "https://www.youtube.com/watch?v=QOpfCGa_2SU",
            description: "Beginner's guide covering installation, Gemini 3 features, and building a to-do app from scratch",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/QOpfCGa_2SU/maxresdefault.jpg",
            status: "APPROVED"
        },
        {
            title: "Automate Coding with OpenAI Codex - Full Tutorial",
            url: "https://www.youtube.com/watch?v=dL0uvPXYi28",
            description: "Tutorial on automating coding workflows with OpenAI Codex, GitHub integration, and Zapier automation",
            type: "youtube",
            source: "YouTube",
            thumbnail: "https://img.youtube.com/vi/dL0uvPXYi28/maxresdefault.jpg",
            status: "APPROVED"
        }
    ];

    console.log("Seeding YouTube Videos...");
    for (const video of youtubeTutorials) {
        await prisma.resource.upsert({
            where: { url: video.url },
            update: {
                ...video,
                status: ResourceStatus.APPROVED
            },
            create: {
                ...video,
                status: ResourceStatus.APPROVED,
                viewCount: Math.floor(Math.random() * 500)
            }
        });
        console.log(`  ✓ Seeded video: ${video.title.substring(0, 30)}...`);
    }

    // Seed Articles
    const articles = [
        {
            title: "How I Use Every Claude Code Feature",
            url: "https://blog.sshh.io/p/how-i-use-every-claude-code-feature",
            description: "A deep dive into maximizing productivity with Claude Code, covering advanced features and personal workflows.",
            type: "article",
            source: "blog.sshh.io",
            author: "Shrivu Shankar",
            thumbnail: "https://blog.sshh.io/og-image.png", // Placeholder/Generic if not available
            status: "APPROVED"
        },
        {
            title: "Antigravity vs Cursor vs Claude Code comparison",
            url: "https://thinkpeak.ai/antigravity-vs-cursor-vs-claude-code-2026/",
            description: "A comprehensive comparison of the top AI coding tools for 2026.",
            type: "article",
            source: "thinkpeak.ai",
            author: "ThinkPeak",
            thumbnail: "https://thinkpeak.ai/images/og.png",
            status: "APPROVED"
        },
        {
            title: "How to Safely Run AI Agents Like Cursor and Claude",
            url: "https://codewithandrea.com/articles/run-ai-agents-inside-devcontainer/",
            description: "Security best practices for running autonomous AI agents within dev containers.",
            type: "article",
            source: "codewithandrea.com",
            author: "Andrea",
            thumbnail: "https://codewithandrea.com/img/og.png",
            status: "APPROVED"
        }
    ];

    console.log("Seeding Articles...");
    for (const article of articles) {
        await prisma.resource.upsert({
            where: { url: article.url },
            update: {
                ...article,
                status: ResourceStatus.APPROVED,
                type: "article" // Explicitly ensure type is set to article/blog
            },
            create: {
                ...article,
                status: ResourceStatus.APPROVED,
                viewCount: Math.floor(Math.random() * 500)
            }
        });
        console.log(`  ✓ Seeded article: ${article.title.substring(0, 30)}...`);
    }

    // Seed X (Twitter) Articles - Force Type "article"
    const tweetArticles = [
        "https://x.com/bcherny/status/2007179832300581177",
        "https://x.com/alliekmiller/status/2012197383673729037",
        "https://x.com/petergyang/status/1963248146336866757",
        "https://x.com/csjcode/status/1897421080459141467",
        "https://x.com/leerob/status/1970296525269147949",
        "https://x.com/PauloGaspar7/status/1903283826459029787"
    ];

    console.log("Seeding X Articles as Blogs...");
    for (const url of tweetArticles) {
        try {
            const id = url.split("/").pop();
            if (!id) continue;
            // We use the same getTweet function
            const tweet = await getTweet(id).catch(() => null);
            if (!tweet) continue;

            await prisma.resource.upsert({
                where: { url: url },
                update: {
                    type: "article", // Force type to article
                    title: `Article by ${tweet.user.name}`,
                    description: tweet.text,
                    status: "APPROVED"
                },
                create: {
                    title: `Article by ${tweet.user.name}`,
                    description: tweet.text,
                    url: url,
                    type: "article", // Force type to article
                    source: `@${tweet.user.screen_name}`,
                    author: tweet.user.name,
                    // Try to get media photo, fallback to profile image
                    thumbnail: tweet.mediaDetails?.[0]?.media_url_https || tweet.user.profile_image_url_https,
                    status: "APPROVED",
                    viewCount: Math.floor(Math.random() * 1000),
                }
            });
            console.log(`  ✓ Updated X Post to Article: ${id}`);
        } catch (error) {
            console.error(`  x Failed to update X Article ${url}:`, error);
        }
    }

    // Ensure System User exists for Projects
    const systemUser = await prisma.user.upsert({
        where: { username: "vibestack" },
        update: {},
        create: {
            clerkId: "user_vibestack_system",
            email: "system@vibestack.ai",
            username: "vibestack",
            avatar: "https://github.com/shadcn.png",
            bio: "Official Vibe Stack System Account",
        },
    });

    console.log(`  ✓ System user ready: ${systemUser.username}`);

    // Seed New Projects (User Provided)
    const projects = [
        {
            title: "MyGitFolio - GitHub Portfolio Generator",
            description: "AI-powered tool that transforms your GitHub profile into a sleek, shareable portfolio page with repository stats, languages, and project highlights—no configuration needed.",
            longDescription: "Read more: https://www.reddit.com/r/vibecoding/comments/1q42pbl/i_vibe_coded_a_page_that_turns_your_github_into_a/",
            keyInsights: `• **Claude/Codex-driven entire build**: Developer used VS Code with Claude—zero handwritten code
• **Rapid MVP iteration**: Deployed to production within days; user feedback drove UX refinements (e.g., color customization)
• **Clean abstraction**: Focuses only on GitHub data visualization instead of reinventing portfolio builders
• **Performance optimization**: Backend reformats data vs. client-side rendering; identified API latency issues early via community testing
• **Production feedback loop**: 121+ Reddit comments revealed real-world concerns (loading delays, iOS compatibility); developer iterated based on user reports
• **Zero friction onboarding**: Enter GitHub username → instant portfolio; no auth, no config, no friction`,
            category: "web-app",
            platforms: ["claude-code"],
            techStack: ["react", "next.js", "typescript", "javascript", "tailwind", "node.js", "vercel"],
            liveUrl: "https://mygitfolio.com",
            featured: true,
            authorId: systemUser.id,
            screenshots: ["https://picsum.photos/800/450?random=1"]
        },
        {
            title: "Ultimate Vibe Coding Guide & Resources",
            description: "Comprehensive open-source guide documenting AI-driven game and app development using Cursor and Claude. Built on 4000+ Cursor prompts from a viral game project.",
            longDescription: "Read more: https://www.reddit.com/r/vibecoding/comments/1o05oi8/i_updated_my_100_free_ultimate_vibe_coding_guide/",
            keyInsights: `• **Documented 4000+ Cursor prompts**: Captured entire AI-assisted workflow from a viral game (3M+ views on X)
• **Community-driven knowledge**: 1300 GitHub stars from developers learning vibecoding patterns
• **Multi-tool guidance**: Covers Cursor, Claude Code, Cline, and other AI coding platforms with workflow comparisons
• **Viral project foundation**: Built on a game that gained massive traction; guide extracts lessons for others to replicate
• **Open-source learning**: Free resource; encourages contributions and community enhancement
• **Real-world iteration at scale**: Used by thousands; continuously updated based on community feedback`,
            category: "web-app",
            platforms: ["cursor", "claude-code"],
            techStack: ["javascript", "next.js", "react", "node.js"],
            githubUrl: "https://github.com/Enze/vibecoding",
            featured: true,
            authorId: systemUser.id,
            screenshots: ["https://picsum.photos/800/450?random=2"]
        },
        {
            title: "Terminal-Matrix Developer Portfolio",
            description: "Full-stack developer portfolio featuring terminal interface, matrix effects, and advanced animations—entirely built with Claude Code without handwritten code.",
            longDescription: "Read more: https://www.reddit.com/r/vibecoding/comments/1p1b26p/i_vibe_coded_my_entire_developer_portfolio/",
            keyInsights: `• **100% Claude-generated**: Zero lines of handwritten code; developer only provided detailed prompts and design vision
• **4-5 hour turnaround**: From concept to live production deployment—rapid iteration cycle
• **Claude Sonnet 4 + extended thinking**: Used extended context to maintain design coherence across complex animations
• **Prompt engineering as primary skill**: Developer focused on iterative refinement through conversation rather than coding
• **Advanced UI patterns**: Terminal interface and matrix effects show Claude's capability for sophisticated visual design
• **Pro plan leverage**: $20/month Claude Pro subscription enabled faster token processing and extended thinking`,
            category: "web-app",
            platforms: ["claude-code"],
            techStack: ["react", "next.js", "typescript", "javascript", "tailwind"],
            liveUrl: "https://ajkale.com",
            featured: true,
            authorId: systemUser.id,
            screenshots: ["https://picsum.photos/800/450?random=3"]
        },
        {
            title: "Vibe Coding: AI-Powered Portfolio Workshop",
            description: "Educational workshop repository teaching developers how to build production-ready portfolios using AI, GitHub, and Vercel deployment—no prior coding experience required.",
            longDescription: "Repo: https://github.com/arshchatrath/Vibe-coding",
            keyInsights: `• **Workshop-structured learning**: Live deployment on day one; attendees walk away with deployed portfolio
• **AI-as-copilot model**: ChatGPT → v0.dev → Vercel pipeline for fast UI generation
• **Git & GitHub fundamentals**: Teaches version control basics as foundation for AI-assisted workflows
• **Zero-to-production pipeline**: Prompt engineering → AI UI generation → one-click Vercel deployment
• **Reusable prompt templates**: Provides AI prompt templates attendees can use for future projects
• **No prior experience required**: Designed for beginners; uses intuitive tools (v0.dev) to abstract complexity`,
            category: "web-app",
            platforms: ["other"],
            techStack: ["javascript", "react", "node.js", "vercel"],
            githubUrl: "https://github.com/arshchatrath/Vibe-coding",
            featured: true,
            authorId: systemUser.id,
            screenshots: ["https://picsum.photos/800/450?random=4"]
        }
    ];

    console.log("Seeding Projects...");
    for (const project of projects) {
        await prisma.project.create({
            data: project
        });
        console.log(`  ✓ Created project: ${project.title}`);
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

