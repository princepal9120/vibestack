"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Play, Star, ExternalLink, Bookmark, Share2, MoreHorizontal, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { YouTubeIcon, XIcon } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";

interface Resource {
    id: string;
    title: string;
    description: string | null;
    url: string;
    thumbnail: string | null;
    author: string | null;
    type: string;
    source?: string | null;
    authorHandle?: string | null;
}

interface ResourceBentoGridProps {
    resources: Resource[];
}

// Premium Resource Card Component
function ResourceCard({
    resource,
    size = "normal",
    index = 0
}: {
    resource: Resource;
    size?: "featured" | "normal" | "compact";
    index?: number;
}) {
    const isVideo = resource.type === "youtube";
    const isSocial = resource.type === "twitter" || resource.type === "social";

    // Extract YouTube thumbnail
    let thumbnail = resource.thumbnail;
    if (isVideo && !thumbnail) {
        const videoId = resource.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        if (videoId) thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // Get type badge
    const getBadge = () => {
        if (isVideo) return { label: "Video", color: "bg-red-500 text-white", icon: Play };
        if (isSocial) return { label: "Thread", color: "bg-foreground text-background", icon: XIcon };
        return { label: "Article", color: "bg-emerald-500 text-white", icon: ExternalLink };
    };

    const badge = getBadge();

    if (size === "featured") {
        return (
            <motion.a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative col-span-2 row-span-2 overflow-hidden rounded-3xl border border-border bg-card"
            >
                {/* Large Thumbnail */}
                <div className="absolute inset-0">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={resource.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative h-full flex flex-col justify-end p-6">
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                        <span className={cn("px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", badge.color)}>
                            <badge.icon className="h-3 w-3" />
                            {badge.label}
                        </span>
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                        </span>
                    </div>

                    {/* Play Button for Videos */}
                    {isVideo && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                <Play className="h-8 w-8 text-white ml-1" fill="white" />
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {resource.title}
                        </h3>
                        {resource.description && (
                            <p className="text-sm text-white/70 line-clamp-2">
                                {resource.description}
                            </p>
                        )}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                                {resource.author?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{resource.author || "Anonymous"}</p>
                                {resource.authorHandle && (
                                    <p className="text-xs text-white/60">@{resource.authorHandle.replace("@", "")}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.a>
        );
    }

    // Normal Card
    return (
        <motion.a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
                size === "compact" ? "p-4" : ""
            )}
        >
            {size !== "compact" && (
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={resource.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : isSocial ? (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center">
                            <XIcon className="h-12 w-12 text-white/20" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 flex items-center justify-center">
                            <ExternalLink className="h-12 w-12 text-emerald-500/20" />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", badge.color)}>
                            {badge.label}
                        </span>
                    </div>

                    {/* Play Button for Videos */}
                    {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className={cn("p-4", size === "compact" ? "p-0" : "")}>
                {size === "compact" && (
                    <div className="flex items-start gap-3">
                        <div className={cn("w-10 h-10 rounded-full shrink-0 flex items-center justify-center",
                            isSocial ? "bg-foreground/5" : "bg-emerald-500/10"
                        )}>
                            {isSocial ? (
                                <XIcon className="h-4 w-4" />
                            ) : (
                                <span className="text-xs font-bold">{resource.author?.[0]?.toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                {resource.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                {resource.author || "Anonymous"}
                            </p>
                        </div>
                    </div>
                )}

                {size !== "compact" && (
                    <>
                        <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {resource.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-3">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                {resource.author?.[0]?.toUpperCase() || "?"}
                            </div>
                            <span className="text-xs text-muted-foreground truncate">
                                {resource.author || "Unknown"}
                            </span>
                            {resource.authorHandle && (
                                <span className="text-xs text-muted-foreground/60">
                                    @{resource.authorHandle.replace("@", "")}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </motion.a>
    );
}

export function ResourceBentoGrid({ resources }: ResourceBentoGridProps) {
    // Get resources by type
    const allResources = resources.slice(0, 9);
    const featured = allResources[0];
    const rest = allResources.slice(1, 9);

    if (allResources.length === 0) {
        return (
            <div className="py-16 text-center">
                <p className="text-muted-foreground">No resources yet. Be the first to contribute!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Premium 3x3 Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
                {/* Featured Large Card - 2x2 */}
                {featured && (
                    <div className="md:col-span-2 md:row-span-2">
                        <ResourceCard resource={featured} size="featured" index={0} />
                    </div>
                )}

                {/* Right Column - Stacked Cards */}
                {rest.slice(0, 2).map((resource, idx) => (
                    <ResourceCard key={resource.id} resource={resource} size="normal" index={idx + 1} />
                ))}

                {/* Bottom Row */}
                {rest.slice(2, 5).map((resource, idx) => (
                    <ResourceCard key={resource.id} resource={resource} size="normal" index={idx + 3} />
                ))}
            </div>

            {/* More Resources Link */}
            <div className="flex justify-center pt-4">
                <Link
                    href="/resources"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all text-sm font-medium"
                >
                    View all resources
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
