import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import mcpServers, { getMCPBySlug } from "@/lib/content/mcp";
import { ArrowLeft, ExternalLink, Server, Copy, Check } from "lucide-react";
import slugify from "slugify";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const mcp = getMCPBySlug(slug);

    if (!mcp) {
        return { title: "Not Found" };
    }

    return {
        title: `${mcp.name} MCP Server | Vibe Stack`,
        description: mcp.description,
    };
}

export async function generateStaticParams() {
    return mcpServers.map((mcp) => ({
        slug: slugify(mcp.name, { lower: true }),
    }));
}

export default async function MCPDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const mcp = getMCPBySlug(slug);

    if (!mcp) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl py-12">
                {/* Back Link */}
                <Link
                    href="/collections/mcps"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to MCP Servers
                </Link>

                {/* Header */}
                <div className="flex items-start gap-6 mb-8">
                    <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                        {mcp.logo ? (
                            <Image
                                src={mcp.logo}
                                alt={mcp.name}
                                width={56}
                                height={56}
                                className="w-14 h-14 object-contain"
                            />
                        ) : (
                            <Server className="h-10 w-10 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{mcp.name}</h1>
                        <p className="text-muted-foreground">MCP Server</p>
                    </div>
                </div>

                {/* Description */}
                <div className="rounded-xl border border-border bg-card p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">About</h2>
                    <p className="text-foreground leading-relaxed">{mcp.description}</p>
                </div>

                {/* Install / Links */}
                <div className="rounded-xl border border-border bg-card p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Installation</h2>
                    <p className="text-muted-foreground mb-4">
                        Follow the installation guide in the official repository:
                    </p>
                    <a
                        href={mcp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                    >
                        View Repository
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </div>

                {/* Other MCPs */}
                <div>
                    <h2 className="text-xl font-semibold mb-6">Other MCP Servers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {mcpServers
                            .filter((m) => m.name !== mcp.name)
                            .slice(0, 8)
                            .map((m) => (
                                <Link
                                    key={m.name}
                                    href={`/collections/mcps/${slugify(m.name, { lower: true })}`}
                                    className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
                                >
                                    {m.logo ? (
                                        <Image
                                            src={m.logo}
                                            alt={m.name}
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 object-contain"
                                        />
                                    ) : (
                                        <Server className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <span className="text-sm font-medium truncate">{m.name}</span>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
