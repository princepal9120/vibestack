"use client";

import { motion } from "framer-motion";
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
    const isYouTube = resource.type === "youtube";

    // Extract YouTube video ID for thumbnail if needed
    const videoId = isYouTube ? resource.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] : null;
    const infoThumbnail = resource.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null);

    if (isYouTube) {
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
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                        {infoThumbnail ? (
                            <Image
                                src={infoThumbnail}
                                alt={resource.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-600/10">
                                <YouTubeIcon className="h-12 w-12 text-red-400" />
                            </div>
                        )}

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                <Play className="h-6 w-6 text-white ml-1 fill-white" />
                            </div>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                                <YouTubeIcon className="h-3 w-3 text-red-500" />
                                Video
                            </span>
                        </div>
                    </div>

                    {/* Content */}
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
                                        <User className="h-3 w-3" />
                                    </div>
                                    <span className="font-medium text-foreground/80">{resource.author}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </a>
            </motion.div>
        );
    }

    // Blog/Other Resource Card
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
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <ResourcesIcon className="h-5 w-5" />
                    </div>
                    {resource.source && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 bg-muted/60 border border-border px-2 py-1 rounded-full">
                            {resource.source}
                        </span>
                    )}
                </div>

                <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {resource.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow leading-relaxed">
                    {resource.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                    {resource.author ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center border border-border">
                                <User className="h-3 w-3" />
                            </div>
                            <span className="font-medium text-foreground/80">{resource.author}</span>
                        </div>
                    ) : (
                        <div />
                    )}

                    <div className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <ExternalLink className="h-4 w-4" />
                    </div>
                </div>
            </a>
        </motion.div>
    );
}
