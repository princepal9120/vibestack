"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUp, MessageCircle, ExternalLink, Code2 } from "lucide-react";

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
    variant?: "grid" | "list";
}

// ProductHunt-style project card
export function ProjectCard({ project, className, variant = "list" }: ProjectCardProps) {
    const thumbnail = project.screenshots[0];

    if (variant === "grid") {
        return <GridProjectCard project={project} className={className} />;
    }

    // List variant - ProductHunt horizontal style
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:bg-accent/50 hover:border-primary/30",
                className
            )}
        >
            {/* Thumbnail */}
            <Link href={`/projects/${project.id}`} className="shrink-0">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Code2 className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <Link href={`/projects/${project.id}`} className="block">
                    <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                    </p>
                </Link>

                {/* Tags */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    {project.platforms.slice(0, 2).map((platform, i) => (
                        <span key={platform}>
                            {i > 0 && <span className="mr-1.5">·</span>}
                            <Link
                                href={`/projects?platform=${platform}`}
                                className="hover:text-primary transition-colors"
                            >
                                {platform}
                            </Link>
                        </span>
                    ))}
                    {project.techStack.slice(0, 2).map((tech) => (
                        <span key={tech}>
                            <span className="mr-1.5">·</span>
                            <span className="rounded bg-muted px-1.5 py-0.5">
                                {tech}
                            </span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Comments */}
            <Link
                href={`/projects/${project.id}#comments`}
                className="hidden sm:flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
            >
                <MessageCircle className="h-4 w-4" />
                <span>{project.commentCount}</span>
            </Link>

            {/* Upvote Button - ProductHunt style */}
            <UpvoteButton projectId={project.id} count={project.upvoteCount} />
        </motion.div>
    );
}

// Grid variant for featured sections
function GridProjectCard({ project, className }: { project: ProjectCardProps["project"]; className?: string }) {
    const thumbnail = project.screenshots[0];

    return (
        <motion.div
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg hover:border-primary/30",
                className
            )}
        >
            <Link href={`/projects/${project.id}`}>
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Code2 className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                        {project.category.replace("-", " ")}
                    </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>

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
                    <div className="flex items-center justify-between pt-2 border-t border-border">
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
                                <ArrowUp className="h-3.5 w-3.5" />
                                {project.upvoteCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="h-3.5 w-3.5" />
                                {project.commentCount}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Upvote button component - ProductHunt style vertical pill
function UpvoteButton({ projectId, count }: { projectId: string; count: number }) {
    return (
        <button
            className="shrink-0 flex flex-col items-center justify-center rounded-lg border-2 border-border bg-card px-3 py-2 min-w-[60px] transition-all hover:border-primary hover:bg-primary/10 group/upvote"
            onClick={(e) => {
                e.preventDefault();
                // TODO: Implement upvote API call
                console.log("Upvote project:", projectId);
            }}
        >
            <ArrowUp className="h-5 w-5 text-muted-foreground group-hover/upvote:text-primary transition-colors" />
            <span className="text-sm font-semibold text-foreground mt-0.5">{count}</span>
        </button>
    );
}

export { GridProjectCard };
