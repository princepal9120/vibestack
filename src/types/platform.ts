

export type AgentType = "assistive" | "agentic" | "autonomous";
export type ContextType = "repo" | "terminal" | "ci" | "docs";
export type MemoryType = "none" | "session" | "persistent";
export type WorkflowType = "terminal" | "editor" | "ci" | "repo-wide";
export type PlatformTag = "cli" | "ide" | "agentic" | "open-source" | "enterprise" | "free";
export type PricingTier = "free" | "freemium" | "paid" | "enterprise";


export interface AICapability {
    agentType: AgentType;
    contextAwareness: ContextType[];
    planningAbility: boolean;
    toolCalling: boolean;
    memory: MemoryType;
    bestFor: string[];
}



export interface PlatformProfile {
    id: string;
    platformId: string;
    name: string;
    tagline: string | null;
    websiteUrl: string | null;
    description: string;
    setupGuide: string;
    cheatSheet: string[];
    skillsPath: string | null;
    skillsGuide: string | null;
    mcpSupported: boolean;
    mcpGuide: string | null;
    mcpConfigPath: string | null;
    bestPractices: string[];

    // AI Capabilities
    agentType: AgentType;
    contextAwareness: ContextType[];
    planningAbility: boolean;
    toolCalling: boolean;
    memoryType: MemoryType;
    bestFor: string[];

    // Classification
    tags: PlatformTag[];
    workflows: WorkflowType[];

    // Metadata
    logoUrl: string | null;
    pricingTier: PricingTier | null;
    companyName: string | null;

    createdAt: Date;
    updatedAt: Date;
}

// Display / UI Types

export interface PlatformCardData {
    id: string;
    platformId: string;
    name: string;
    tagline: string | null;
    websiteUrl: string | null;
    agentType: AgentType;
    tags: string[];
    workflows: string[];
    bestFor: string[];
    pricingTier: string | null;
    companyName: string | null;
}


export interface PlatformFilters {
    agentType?: AgentType | null;
    tags?: PlatformTag[];
    workflows?: WorkflowType[];
    search?: string;
}


export interface CompareItem {
    id: string;
    name: string;
    platformId: string;
}

export interface CompareState {
    selectedPlatforms: CompareItem[];
    isOpen: boolean;
}

// Recommendation Types

export interface RecommendationPreferences {
    languages: string[];
    projectType: string;
    repoSize: "small" | "medium" | "large";
    teamSize: "solo" | "small" | "enterprise";
    preferCLI: boolean;
}

export interface RecommendationResult {
    platform: PlatformCardData;
    matchScore: number; // 0-100
    matchReasons: string[];
}

// Agent Type Labels & Colors

export const AGENT_TYPE_CONFIG: Record<AgentType, { label: string; color: string; description: string }> = {
    assistive: {
        label: "Assistive",
        color: "blue",
        description: "Provides suggestions and completions on demand",
    },
    agentic: {
        label: "Agentic",
        color: "orange",
        description: "Can plan and execute multi-step tasks with guidance",
    },
    autonomous: {
        label: "Autonomous",
        color: "purple",
        description: "Independently executes complex workflows end-to-end",
    },
};

export const WORKFLOW_CONFIG: Record<WorkflowType, { label: string; icon: string }> = {
    terminal: { label: "Terminal", icon: "terminal" },
    editor: { label: "Editor", icon: "code" },
    ci: { label: "CI/CD", icon: "git-branch" },
    "repo-wide": { label: "Repo-wide", icon: "folder" },
};

export const TAG_CONFIG: Record<PlatformTag, { label: string; variant: string }> = {
    cli: { label: "CLI", variant: "outline" },
    ide: { label: "IDE", variant: "outline" },
    agentic: { label: "Agentic", variant: "default" },
    "open-source": { label: "Open Source", variant: "secondary" },
    enterprise: { label: "Enterprise", variant: "default" },
    free: { label: "Free", variant: "secondary" },
};
