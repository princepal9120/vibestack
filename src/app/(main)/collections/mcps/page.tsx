import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import mcpServers from "@/lib/content/mcp";
import { cn } from "@/lib/utils";
import { Search, ExternalLink, Server } from "lucide-react";
import slugify from "slugify";

export const metadata: Metadata = {
    title: "MCP Servers Directory | Vibe Stack",
    description: "Discover and search for custom MCP tools to extend Claude Code and other AI coding assistants",
};

function MCPCard({ mcp }: { mcp: typeof mcpServers[0] }) {
    const slug = slugify(mcp.name, { lower: true });

    return (
        <Link
            href={`/collections/mcps/${slug}`}
            className="group relative flex flex-col p-5 rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        >
            {/* Logo */}
            <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    {mcp.logo ? (
                        <Image
                            src={mcp.logo}
                            alt={mcp.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                        />
                    ) : (
                        <Server className="h-6 w-6 text-muted-foreground" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {mcp.name}
                    </h3>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-grow">
                {mcp.description}
            </p>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">MCP Server</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
        </Link>
    );
}

export default function MCPsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container py-12 space-y-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Find MCP Servers
                    </h1>
                    <p className="text-muted-foreground">
                        Discover and search for custom MCP tools to extend Claude Code.{" "}
                        <a
                            href="https://modelcontextprotocol.io/introduction"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-foreground transition-colors"
                        >
                            How to use them in Claude Code
                        </a>
                    </p>
                </div>

                {/* MCP Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mcpServers.map((mcp) => (
                        <MCPCard key={mcp.name} mcp={mcp} />
                    ))}
                </div>
            </div>
        </div>
    );
}
