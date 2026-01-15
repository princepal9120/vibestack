"use client";

import mcpServers from "@/lib/content/mcp";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import { ExternalLink } from "lucide-react";

export function MCPList() {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">MCP Servers</h3>
                <Link
                    href="/collections/mcps"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                    <span>View all</span>
                    <ExternalLink className="w-3 h-3" />
                </Link>
            </div>
            <div className="overflow-x-auto hide-scrollbar">
                <motion.div
                    className="flex gap-2 pb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.2,
                        staggerChildren: 0.05,
                    }}
                >
                    {mcpServers.map((mcp, index) => (
                        <motion.div
                            key={mcp.name}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: "easeOut",
                            }}
                        >
                            <Link
                                href={`/collections/mcps/${slugify(mcp.name, { lower: true })}`}
                                className="px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap flex items-center gap-2 border border-border bg-card hover:bg-accent transition-colors"
                            >
                                {mcp.logo && (
                                    <Image
                                        src={mcp.logo}
                                        alt={`${mcp.name} logo`}
                                        width={16}
                                        height={16}
                                        className="h-4 w-4 object-contain"
                                    />
                                )}
                                <span>{mcp.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
