"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, MessageCircle, ThumbsUp, Eye } from "lucide-react";

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        description: string;
        category: string;
        platforms: string[];
        techStack: string[];
        screenshots: string[];
        upvoteCount: number;
        commentCount: number;
        viewCount: number;
        author: {
            username: string;
            avatar: string | null;
        };
    };
    className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
    const thumbnail = project.screenshots[0] || "/placeholder-project.png";

    return (
        <motion.div
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg",
                className
            )}
        >
            <Link href={`/projects/${project.id}`}>
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                        src={thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                        {project.category.replace("-", " ")}
                    </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {project.title}
                        </h3>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((tech) => (
                            <span
                                key={tech}
                                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.techStack.length > 3 && (
                            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                +{project.techStack.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-muted overflow-hidden">
                                {project.author.avatar && (
                                    <Image
                                        src={project.author.avatar}
                                        alt={project.author.username}
                                        width={24}
                                        height={24}
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {project.author.username}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3.5 w-3.5" />
                                {project.upvoteCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="h-3.5 w-3.5" />
                                {project.commentCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5" />
                                {project.viewCount}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
