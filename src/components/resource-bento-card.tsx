import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, ExternalLink, MessageSquare, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Resource {
    id: string;
    title: string;
    description: string | null;
    url: string;
    type: string;
    author: string | null;
    source: string | null;
    thumbnail: string | null;
    // Add other fields if needed for compatibility
}

interface ResourceBentoCardProps {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    resources: Resource[];
    type: "youtube" | "social" | "blog" | "official";
    href: string;
    className?: string;
}

export function ResourceBentoCard({
    title,
    subtitle,
    icon: Icon,
    resources,
    type,
    href,
    className
}: ResourceBentoCardProps) {
    return (
        <div className={cn(
            "flex flex-col h-[500px] rounded-3xl border border-border bg-card overflow-hidden group hover:border-primary/20 transition-colors",
            className
        )}>
            {/* Header */}
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3 mb-1">
                    <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        type === "youtube" && "bg-red-500/10 text-red-500",
                        type === "social" && "bg-blue-500/10 text-blue-500",
                        type === "blog" && "bg-green-500/10 text-green-500",
                        type === "official" && "bg-orange-500/10 text-orange-500",
                    )}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">{subtitle}</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/50 mx-6 my-2" />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4 custom-scrollbar">
                {resources.map((resource) => (
                    <ResourceItem key={resource.id} resource={resource} type={type} />
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 pt-2 border-t border-border/50 bg-muted/20">
                <Link
                    href={href}
                    className="flex items-center justify-between px-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
                >
                    <span>{resources.length} {type === "social" ? "posts" : type === "youtube" ? "videos" : "articles"}</span>
                    <div className="flex items-center gap-1 font-medium">
                        View Collection
                        <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
                    </div>
                </Link>
            </div>
        </div>
    );
}

function ResourceItem({ resource, type }: { resource: Resource; type: "youtube" | "social" | "blog" | "official" }) {
    // Generate YouTube thumbnail from URL if not provided (fallback)
    const getYouTubeThumbnail = (url: string) => {
        const videoId = url.split("v=")[1]?.split("&")[0];
        return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    };

    if (type === "youtube") {
        const thumbnail = resource.thumbnail || getYouTubeThumbnail(resource.url);
        return (
            <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 group/item hover:bg-muted/50 p-2 rounded-xl transition-colors"
            >
                <div className="relative h-20 w-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden border border-border">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={resource.title}
                            fill
                            className="object-cover transition-transform group-hover/item:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Play className="h-6 w-6 text-muted-foreground" />
                        </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity bg-black/20">
                        <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="h-3 w-3 text-black fill-black ml-0.5" />
                        </div>
                    </div>
                </div>
                <div className="flex-1 min-w-0 py-1">
                    <h4 className="font-medium text-sm leading-tight line-clamp-2 mb-1 group-hover/item:text-primary transition-colors">
                        {resource.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{resource.author}</p>
                </div>
            </a>
        );
    }

    if (type === "social") {
        return (
            <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group/item hover:bg-muted/50 p-3 rounded-xl transition-colors"
            >
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-muted overflow-hidden border border-border">
                    {resource.thumbnail ? (
                        <Image src={resource.thumbnail} alt={resource.author || "User"} width={40} height={40} className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-500/10 text-blue-500">
                            <MessageSquare className="h-4 w-4" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm truncate">{resource.author}</span>
                        {/* <span className="text-xs text-muted-foreground truncate">{resource.source}</span> */}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {resource.description || resource.title}
                    </p>
                </div>
            </a>
        );
    }

    // Blog / Official
    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 group/item hover:bg-muted/50 p-3 rounded-xl transition-colors"
        >
            <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center border border-border text-muted-foreground group-hover/item:text-primary group-hover/item:bg-primary/10 transition-colors">
                <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight line-clamp-1 mb-1 group-hover/item:text-primary transition-colors">
                    {resource.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {resource.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                    <span>{resource.source || "Article"}</span>
                    {resource.author && (
                        <>
                            <span>•</span>
                            <span>{resource.author}</span>
                        </>
                    )}
                </div>
            </div>
        </a>
    );
}
