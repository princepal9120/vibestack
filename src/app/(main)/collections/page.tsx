import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
    SubAgentsIcon,
    WorkflowsIcon,
    MCPIcon,
    SkillsIcon,
} from "@/components/icons";

export const metadata: Metadata = {
    title: "Collections | Vibe Stack",
    description: "Curated sub-agents, workflows, and MCPs for AI coding",
};

const collections = [
    {
        title: "Sub-Agents",
        description: "Role-specific AI agent configurations for React, Python, TypeScript, and more",
        href: "/collections/subagents",
        icon: SubAgentsIcon,
        count: "25+",
        gradient: "from-purple-500/20 to-purple-600/10",
    },
    {
        title: "Workflows",
        description: "Best practices, setup guides, and productivity hacks for AI tools",
        href: "/collections/workflows",
        icon: WorkflowsIcon,
        count: "30+",
        gradient: "from-amber-500/20 to-amber-600/10",
    },
    {
        title: "MCPs",
        description: "Model Context Protocol servers for database, cloud, and productivity integrations",
        href: "/collections/mcps",
        icon: MCPIcon,
        count: "15+",
        gradient: "from-emerald-500/20 to-emerald-600/10",
    },
    {
        title: "Skills",
        description: "Modular AI capabilities you can compose and customize",
        href: "/collections/skills",
        icon: SkillsIcon,
        count: "40+",
        gradient: "from-blue-500/20 to-blue-600/10",
    },
];


export default function CollectionsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container py-12 space-y-12">
                {/* Header */}
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Your curated library of AI coding knowledge. Discover sub-agents,
                        learn workflows, and integrate MCPs.
                    </p>
                </div>

                {/* Collections Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {collections.map((collection) => (
                        <Link
                            key={collection.href}
                            href={collection.href}
                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                        >
                            {/* Gradient Header */}
                            <div className={`bg-gradient-to-br ${collection.gradient} p-6 pb-8`}>
                                <div className="flex items-start justify-between">
                                    <div className="h-12 w-12 rounded-xl bg-card/80 backdrop-blur flex items-center justify-center shadow">
                                        <collection.icon className="h-6 w-6 text-foreground" />
                                    </div>
                                    <span className="rounded-full bg-card/80 backdrop-blur px-3 py-1 text-xs font-medium">
                                        {collection.count}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 -mt-4 relative z-10">
                                <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                                    {collection.title}
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    {collection.description}
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Browse {collection.title.toLowerCase()}
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
