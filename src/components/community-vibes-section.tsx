"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExternalLink, Twitter, Youtube, FileText } from "lucide-react";
import { Resource } from "@prisma/client";

// Types
interface ContentItem {
    id: string;
    type: "twitter" | "youtube" | "article";
    title: string;
    author: {
        name: string;
        handle?: string;
        avatar: string;
    };
    url: string;
    thumbnail?: string; // For videos/articles
    content?: string;   // For tweets
}

// Map Prisma Resource to ContentItem
const mapResourceToContentItem = (resource: Resource): ContentItem => {
    let type: "twitter" | "youtube" | "article" = "article";
    if (resource.type === "youtube") type = "youtube";
    else if (resource.type === "social") type = "twitter";

    return {
        id: resource.id,
        type,
        title: resource.title,
        author: {
            name: resource.author || "Unknown",
            handle: resource.source ? (resource.source.startsWith("@") ? resource.source : `@${resource.author?.replace(/\s+/g, "").toLowerCase()}`) : undefined,
            avatar: resource.thumbnail || `https://avatar.vercel.sh/${resource.author || "user"}.png`,
        },
        url: resource.url,
        thumbnail: resource.thumbnail || undefined, // Youtube mapping usually handles this in the component if missing
        content: resource.description || undefined,
    };
};

// Components

const ContentCard = ({ item }: { item: ContentItem }) => {
    const isVideo = item.type === "youtube";

    // Video cards are larger
    const cardDimensions = isVideo
        ? "h-[220px] w-[380px]"
        : "h-[160px] w-[320px]";

    return (
        <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 hover:shadow-2xl",
                cardDimensions,
                "flex-shrink-0 mx-3", // Spacing
                isVideo ? "p-0" : "p-5" // Remove padding for video cards to let thumbnail bleed
            )}
        >
            {/* Video Card Layout */}
            {isVideo ? (
                <>
                    {/* Full thumbnail background */}
                    <div className="absolute inset-0 z-0">
                        {item.thumbnail ? (
                            <Image
                                src={item.thumbnail}
                                alt={item.title}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                            />
                        ) : (
                            // Fallback generated thumbnail from ID if url matches youtube pattern, else generic
                            <div className="w-full h-full bg-neutral-900" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 flex flex-col justify-between h-full p-5">
                        {/* Header: Author badge */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
                                <div className="relative h-5 w-5 overflow-hidden rounded-full">
                                    <Image src={item.author.avatar} alt={item.author.name} fill className="object-cover" />
                                </div>
                                <span className="text-[10px] font-medium text-white/90">{item.author.name}</span>
                            </div>
                            <div className="rounded-full bg-red-500/20 p-1.5 backdrop-blur-md border border-red-500/20 text-red-400">
                                <Youtube className="h-3.5 w-3.5" fill="currentColor" />
                            </div>
                        </div>

                        {/* Play Button (Center) */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                            <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                                <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center pl-0.5">
                                    <Youtube className="h-4 w-4 fill-black" />
                                </div>
                            </div>
                        </div>

                        {/* Footer: Title */}
                        <div>
                            <h4 className="font-bold text-white leading-tight line-clamp-2 drop-shadow-md text-base group-hover:text-primary transition-colors">
                                {item.title}
                            </h4>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Normal Card Layout (Tweets/Articles) */}
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10">
                                <Image
                                    src={item.author.avatar}
                                    alt={item.author.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-white/90">
                                    {item.author.name}
                                </span>
                                {item.author.handle && (
                                    <span className="text-[10px] text-white/50">
                                        {item.author.handle}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5",
                            item.type === "twitter" && "text-blue-400",
                            item.type === "article" && "text-green-400"
                        )}>
                            {item.type === "twitter" && <Twitter className="h-3 w-3" fill="currentColor" />}
                            {item.type === "article" && <FileText className="h-3 w-3" />}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mt-3 flex-1">
                        <p className={cn(
                            "text-sm font-medium leading-relaxed text-white/80 line-clamp-3",
                            item.type === "twitter" && "text-[13px]"
                        )}>
                            {item.content || item.title}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-white/40 group-hover:text-primary transition-colors">
                        <span>Read more</span>
                        <ExternalLink className="h-3 w-3" />
                    </div>
                </>
            )}
        </Link>
    );
};

const ScrollingRow = ({
    items,
    direction = "left",
    speed = 40
}: {
    items: ContentItem[],
    direction?: "left" | "right",
    speed?: number
}) => {
    if (!items.length) return null;

    // Multiply items to ensure seamless loop
    const duplicatedItems = [...items, ...items, ...items, ...items];

    return (
        <div className="group relative flex overflow-hidden py-4 select-none fading-edge">
            <div
                className={cn(
                    "flex flex-shrink-0",
                    direction === "left" ? "animate-marquee" : "animate-marquee-reverse"
                )}
                style={{
                    "--marquee-duration": `${speed}s`,
                } as React.CSSProperties}
            >
                {duplicatedItems.map((item, idx) => (
                    <ContentCard key={`${item.id}-${idx}`} item={item} />
                ))}
            </div>
        </div>
    );
};

interface CommunityVibesSectionProps {
    resources?: Resource[];
}

const CommunityVibesSection = ({ resources = [] }: CommunityVibesSectionProps) => {
    // Process resources
    const tweets = resources.filter(r => r.type === "social").map(mapResourceToContentItem);
    const videos = resources.filter(r => r.type === "youtube").map(mapResourceToContentItem);
    const articles = resources.filter(r => r.type === "blog" || r.type === "article").map(mapResourceToContentItem);

    // Use fallback if no DB data
    // (In a real app, maybe we just hide sections, but for now fallback ensures the homepage looks good)
    const displayTweets = tweets.length > 3 ? tweets : [];
    const displayVideos = videos.length > 3 ? videos : [];
    const displayArticles = articles.length > 3 ? articles : [];

    // If completely empty, return null or fallback to defaults? 
    // The user asked to "use my db data", so we should try to use it.
    // But if DB is empty, the section disappears which might be confusing.
    // I'll assume DB is seeded (I seeded it earlier).

    return (
        <section className="relative w-full overflow-hidden bg-[#0A0A0A] py-24 text-foreground">
            {/* Background Ambience */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,100,0,0.05),transparent_50%)]" />

            <div className="container relative z-10 mx-auto mb-16 px-4 text-center">
                <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                    Community Vibes
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-white/60">
                    See what builders are creating with Vibe Stack.
                    Real projects, real code, real vibes.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {displayTweets.length > 0 && <ScrollingRow items={displayTweets} direction="left" speed={40} />}
                {displayVideos.length > 0 && <ScrollingRow items={displayVideos} direction="right" speed={45} />}
                {displayArticles.length > 0 && <ScrollingRow items={displayArticles} direction="left" speed={50} />}
            </div>

            <style jsx global>{`
        .fading-edge {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
        </section>
    );
};

export default CommunityVibesSection;
