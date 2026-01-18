"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Play, User, ExternalLink, MessageCircle, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { YouTubeIcon, ResourcesIcon } from "@/components/icons";
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
    upvoteCount?: number;
    viewCount?: number;
}

interface ResourceCardProps {
    resource: Resource;
    className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
    const [imageError, setImageError] = useState(false);
    const isVideo = resource.type === "youtube";
    const isBlog = resource.type === "blog" || resource.type === "article";

    // Determine thumbnail
    let thumbnail = resource.thumbnail;
    if (isVideo && !thumbnail) {
        // Extract YouTube video ID
        const videoId = resource.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        if (videoId) thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // Default layout (Image Card) will be used for Video, Blog, and Article to maintain "clean" look
    // Only fall back to specific layouts if needed, but User requested consistency.

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className={cn(
                "group relative block overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl hover:border-primary/40",
                className
            )}
        >
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block h-full flex flex-col">
                {/* Thumbnail Section */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                    {thumbnail && !imageError ? (
                        <Image
                            src={thumbnail}
                            alt={resource.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            {isVideo ? (
                                <YouTubeIcon className="h-12 w-12 text-red-500/80" />
                            ) : (
                                <MessageCircle className="h-12 w-12 text-primary/40" />
                            )}
                        </div>
                    )}

                    {/* Overlay: Play Button (Video) or Link Icon (Blog) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300",
                            isVideo ? "bg-red-600" : "bg-primary text-primary-foreground"
                        )}>
                            {isVideo ? (
                                <Play className="h-5 w-5 text-white ml-1 fill-white" />
                            ) : (
                                <ExternalLink className="h-5 w-5" />
                            )}
                        </div>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-2 right-2">
                        <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 backdrop-blur-md",
                            isVideo ? "bg-black/60" : "bg-black/40"
                        )}>
                            {isVideo ? (
                                <>
                                    <YouTubeIcon className="h-3 w-3 text-red-500" />
                                    Video
                                </>
                            ) : (
                                <>
                                    <MessageCircle className="h-3 w-3 text-primary" />
                                    Article
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {resource.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                        {resource.description}
                    </p>

                    <div className="flex items-center gap-2 pt-3 border-t border-border/50 text-xs text-muted-foreground mt-auto">
                        {resource.author && (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                                    {resource.thumbnail && !isVideo && resource.source?.includes("@") ? (
                                        // If it's a social post styled as article, maybe use thumbnail as avatar? 
                                        // But we used thumbnail for main image. Use User icon or source icon
                                        <Image src={resource.thumbnail} alt={resource.author} width={20} height={20} className="object-cover" />
                                    ) : (
                                        <User className="h-3 w-3" />
                                    )}
                                </div>
                                <span className="font-medium text-foreground/80">{resource.author}</span>
                            </div>
                        )}
                        {resource.source && (
                            <span className="ml-auto opacity-70 border-l border-border pl-2">
                                {resource.source}
                            </span>
                        )}
                    </div>
                </div>
            </a>
        </motion.div>
    );
}
