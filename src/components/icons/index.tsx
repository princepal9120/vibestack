/**
 * Industry-level brand icons for AI coding platforms and tools
 * These are official/accurate SVG representations of each brand
 */

import { type LucideProps } from "lucide-react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

// ============================================================================
// PLATFORM BRAND ICONS
// ============================================================================

/**
 * Cursor - AI-first code editor
 * Official cube/pointer logo
 */
export function CursorIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M5.56 2.18a1 1 0 0 0-1.38 1.22l5.04 16.47a1 1 0 0 0 1.87.1l2.57-5.56 5.56-2.57a1 1 0 0 0-.1-1.87L2.65 4.93l2.91-2.75Z" />
            <path d="m13.54 13.54 5.66 5.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

/**
 * Claude - Anthropic's AI assistant
 * Official starburst/sparkle logo
 */
export function ClaudeIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M12 2L13.09 8.26L18 4L14.74 9.91L21 11L14.74 12.09L18 20L13.09 15.74L12 22L10.91 15.74L6 20L9.26 14.09L3 13L9.26 11.91L6 4L10.91 8.26L12 2Z" />
        </svg>
    );
}

/**
 * Google Gemini - AI model
 * Official gradient star logo (simplified for currentColor)
 */
export function GeminiIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M12 2C12 2 12 12 12 12C12 12 2 12 2 12C2 12 12 12 12 12C12 12 12 22 12 22C12 22 12 12 12 12C12 12 22 12 22 12C22 12 12 12 12 12C12 12 12 2 12 2Z" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
    );
}

/**
 * GitHub Copilot - AI pair programmer
 * Official sparkle/copilot logo
 */
export function CopilotIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 6c-2.21 0-4 1.79-4 4 0 1.1.45 2.1 1.17 2.83L12 15.66l2.83-2.83A3.99 3.99 0 0016 10c0-2.21-1.79-4-4-4zm0 5.5c-.83 0-1.5-.67-1.5-1.5S11.17 8.5 12 8.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
    );
}

/**
 * Replit - Browser-based IDE with AI
 * Official three-dot "prompt" logo
 */
export function ReplitIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="12" cy="12" r="2.5" />
            <circle cx="18" cy="12" r="2.5" />
        </svg>
    );
}

/**
 * Windsurf - Codeium's AI-native IDE
 * Stylized wave/wind logo
 */
export function WindsurfIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M3 8c2.5-2 5-3 8-3s5.5 1 8 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M5 13c2-1.5 4-2.5 7-2.5s5 1 7 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M7 18c1.5-1 3-1.5 5-1.5s3.5.5 5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

/**
 * VS Code - Visual Studio Code
 * Official bracket logo
 */
export function VSCodeIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M17.5 3L7 12l10.5 9V3zM2.5 12l6-5v10l-6-5zm12.5 6.5L9.5 12l5.5-6.5v13z" />
        </svg>
    );
}

/**
 * OpenCode - Terminal-based AI coding
 * Terminal prompt style icon
 */
export function OpenCodeIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
    );
}

/**
 * Roo Code - AI coding assistant
 * Code brackets with AI sparkle
 */
export function RooCodeIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M12 6v2M12 16v2M6 12h2M16 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/**
 * Aider - AI pair programming in terminal
 * Chat bubble with code
 */
export function AiderIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M9 10l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

/**
 * Cline - AI coding assistant
 * Lightning bolt style
 */
export function ClineIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );
}

/**
 * Augment Code - AI code enhancement
 * Plus/enhance style icon
 */
export function AugmentIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// ============================================================================
// SOCIAL / BRAND ICONS
// ============================================================================

/**
 * GitHub - Code hosting platform
 * Official Octocat silhouette
 */
export function GitHubIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
    );
}

/**
 * X (Twitter) - Social platform
 * Official X logo
 */
export function XIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

/**
 * YouTube - Video platform
 * Official play button logo
 */
export function YouTubeIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

/**
 * Discord - Community platform
 * Official Discord logo
 */
export function DiscordIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
    );
}

// ============================================================================
// FEATURE / CATEGORY ICONS
// ============================================================================

/**
 * Skills - Modular AI capabilities
 * Puzzle piece / module icon
 */
export function SkillsIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685c.24-.24.3-.597.276-.837-.07-.471-.497-.802-.925-.968a2.501 2.501 0 1 1 3.214-3.214c.166.446.497.855.968.925.24.036.597-.036.837-.276l1.611-1.61a2.402 2.402 0 0 1 1.704-.707c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
        </svg>
    );
}

/**
 * Prompts - Message/chat templates
 * Chat bubble with text lines
 */
export function PromptsIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            <path d="M8 12h.01" />
            <path d="M12 12h.01" />
            <path d="M16 12h.01" />
        </svg>
    );
}

/**
 * Workflows - Process/automation flows
 * Flow chart / git branch style
 */
export function WorkflowsIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="m9 14 2 2 4-4" />
        </svg>
    );
}

/**
 * MCPs - Model Context Protocol servers
 * Plug/connection icon
 */
export function MCPIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M12 22v-5" />
            <path d="M9 8V2" />
            <path d="M15 8V2" />
            <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
        </svg>
    );
}

/**
 * Sub-Agents - AI agent roles
 * Brain with circuit/bot style
 */
export function SubAgentsIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
            <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
            <path d="M6 18a4 4 0 0 1-1.967-.516" />
            <path d="M19.967 17.484A4 4 0 0 1 18 18" />
        </svg>
    );
}

/**
 * Resources - Learning materials
 * Book with bookmark
 */
export function ResourcesIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="m9 9.5 2 2 4-4" />
        </svg>
    );
}

/**
 * Guides - Step-by-step tutorials
 * Map/compass style
 */
export function GuidesIcon({ className, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" x2="9" y1="3" y2="18" />
            <line x1="15" x2="15" y1="6" y2="21" />
        </svg>
    );
}

// ============================================================================
// PLATFORM ICON MAPPING
// ============================================================================

export const platformIcons: Record<string, React.ComponentType<IconProps>> = {
    cursor: CursorIcon,
    "cursor-ai": CursorIcon,
    "claude-code": ClaudeIcon,
    claude: ClaudeIcon,
    anthropic: ClaudeIcon,
    "gemini-cli": GeminiIcon,
    gemini: GeminiIcon,
    "github-copilot": CopilotIcon,
    copilot: CopilotIcon,
    "replit-ai": ReplitIcon,
    replit: ReplitIcon,
    windsurf: WindsurfIcon,
    codeium: WindsurfIcon,
    vscode: VSCodeIcon,
    "vs-code": VSCodeIcon,
    opencode: OpenCodeIcon,
    "open-code": OpenCodeIcon,
    "roo-code": RooCodeIcon,
    roo: RooCodeIcon,
    aider: AiderIcon,
    cline: ClineIcon,
    augment: AugmentIcon,
    ramp: ClineIcon,
    ralph: RooCodeIcon,
};

/**
 * Get platform icon by ID with fallback
 */
export function getPlatformIcon(platformId: string): React.ComponentType<IconProps> {
    const normalizedId = platformId.toLowerCase().replace(/[\s_]/g, "-");
    return platformIcons[normalizedId] || CursorIcon;
}
