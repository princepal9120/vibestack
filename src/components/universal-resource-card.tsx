"use client";

import { motion } from "framer-motion";
import { Play, User, ExternalLink, MessageCircle, Heart, Share2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { YouTubeIcon, ResourcesIcon, XIcon } from "@/components/icons";
import Image from "next/image";

export interface UniversalResourceProps {
    resource: {
        id: string;
        title: string;
        description: string | null;
        url: string;
        thumbnail: string | null;
        author: string | null;
        authorHandle?: string | null; // e.g. @username or r/subreddit
        type: string; // "youtube", "twitter", "reddit", "article", "project"
        source?: string | null; // "Medium", "Substack"
        stats?: {
            likes?: number;
            comments?: number;
            views?: number;
        };
    };
    className?: string;
}

export function UniversalResourceCard({ resource, className }: UniversalResourceProps) {
    const isVideo = resource.type === "youtube";
    const isSocial = resource.type === "twitter" || resource.type === "social" || resource.type === "reddit";
    const isReddit = resource.type === "reddit" || resource.url.includes("reddit.com");
    const isArticle = resource.type === "article" || resource.type === "blog";
    const isProject = resource.type === "project";

    // Extract Thumbnail
    let thumbnail = resource.thumbnail;
    if (isVideo && !thumbnail) {
        const videoId = resource.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        if (videoId) thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // Determine Badge
    const getBadge = () => {
        if (isVideo) return { icon: Play, text: "Video", color: "bg-red-500 text-white" };
        if (isReddit) return { icon: MessageCircle, text: "Thread", color: "bg-orange-500 text-white" };
        if (isSocial) return { icon: XIcon, text: "Social", color: "bg-black text-white dark:bg-white dark:text-black" };
        if (isArticle) return { icon: BookOpen, text: "Article", color: "bg-emerald-500 text-white" };
        if (isProject) return { icon: ExternalLink, text: "Project", color: "bg-blue-500 text-white" };
        return { icon: ExternalLink, text: "Resource", color: "bg-primary text-primary-foreground" };
    };

    const badge = getBadge();
    const BadgeIcon = badge.icon;

    // Formatting Author
    const formattedAuthor = resource.author || (isReddit ? "Reddit User" : "Unknown Author");
    const authorAvatarInitial = formattedAuthor[0]?.toUpperCase() || "?";

    return (
        <a
            href={resource.url}
            target={isProject ? undefined : "_blank"} // Projects use Link usually, but for consistency here reusing <a>
            rel="noopener noreferrer"
            className={cn(
                "group block h-full rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg flex flex-col",
                className
            )}
        >
            {/* Header / Thumbnail Area */}
            <div className="relative aspect-video w-full bg-muted overflow-hidden">
                {thumbnail ? (
                    <Image
                        src={thumbnail}
                        alt={resource.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    // Fallback pattern if no thumbnail
                    <div className={cn(
                        "w-full h-full flex flex-col items-center justify-center p-6 text-center",
                        isVideo ? "bg-red-500/5" : isReddit ? "bg-orange-500/5" : "bg-primary/5"
                    )}>
                        <BadgeIcon className={cn("h-12 w-12 mb-2 opacity-20", isVideo ? "text-red-500" : "text-foreground")} />
                        {isSocial && (
                            <p className="text-xs text-muted-foreground line-clamp-3 px-4 italic">
                                "{resource.description || resource.title}"
                            </p>
                        )}
                    </div>
                )}

                {/* Overlay Gradient (Always subtle at bottom for text readability if title over image in future, but here purely for depth) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Type Badge (Top Right) */}
                <div className={cn(
                    "absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm",
                    badge.color
                )}>
                    {/* Render Icon differently if it's a Component vs Lucide Icon */}
                    {/* Simplified for this demo: just use text or generic icon if needed */}
                    {/* <BadgeIcon className="h-3 w-3" /> */}
                    <span>{badge.text}</span>
                </div>

                {/* Play Button Overlay for Videos */}
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-1 p-4">
                {/* Title */}
                <h3 className="font-bold text-base leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {isSocial && !thumbnail ? (resource.description?.slice(0, 50) + "...") : resource.title}
                    {/* Social posts often have title as full text if scraped incorrectly, prioritize clear title */}
                </h3>

                {/* Subtitle / Description */}
                {!isSocial && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {resource.description}
                    </p>
                )}
                {isSocial && (
                    <div className="flex-1" /> // Spacer
                )}

                {/* Footer: Author & Stats */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 ring-border",
                            isReddit ? "bg-orange-500/10 text-orange-600" : "bg-muted text-muted-foreground"
                        )}>
                            {authorAvatarInitial}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium truncate max-w-[120px]">
                                {formattedAuthor}
                            </span>
                            {resource.authorHandle && (
                                <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                                    {resource.authorHandle}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Optional Source/Icon indicator */}
                    {resource.source && (
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {resource.source}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
}
