import { Metadata } from "next";
import { getSections } from "@/lib/content/rules";
import { GlobalSearch } from "@/components/subagents/global-search";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
    title: "Sub-Agents Directory | Vibe Stack",
    description: "Browse 200+ Claude Code sub-agent prompts and MCP servers. Copy-paste ready prompts for React, Python, TypeScript, Go, and more frameworks.",
};

export default function SubAgentsPage() {
    const sections = getSections();

    return (
        <NuqsAdapter>
            <div className="min-h-screen w-full px-4 py-12">
                <div className="w-full max-w-6xl mx-auto">
                    <h1 className="sr-only">Sub-Agents Directory - Find Claude Code Sub-Agent Prompts</h1>
                    <GlobalSearch sections={sections} />
                </div>
            </div>
        </NuqsAdapter>
    );
}
