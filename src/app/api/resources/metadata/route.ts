import { NextRequest, NextResponse } from "next/server";

interface Metadata {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    authorName?: string;
    authorHandle?: string;
    duration?: string;
    type: "youtube" | "twitter" | "reddit" | "article";
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Fetch YouTube metadata using oEmbed API
async function fetchYouTubeMetadata(url: string): Promise<Metadata | null> {
    try {
        const videoId = extractYouTubeId(url);
        if (!videoId) return null;

        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const response = await fetch(oembedUrl);

        if (!response.ok) return null;

        const data = await response.json();

        return {
            title: data.title,
            description: `Video by ${data.author_name}`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            authorName: data.author_name,
            type: "youtube",
        };
    } catch {
        return null;
    }
}

import { getTweet } from "react-tweet/api";

// Fetch X/Twitter metadata using react-tweet API
async function fetchTwitterMetadata(url: string): Promise<Metadata | null> {
    try {
        const idMatch = url.match(/(?:twitter\.com|x\.com)\/(?:[^/]+)\/status\/([0-9]+)/);
        const tweetId = idMatch ? idMatch[1] : null;

        if (!tweetId) return null;

        const tweet = await getTweet(tweetId);

        if (!tweet) return null;

        return {
            title: `Post by ${tweet.user.name}`,
            description: tweet.text,
            authorName: tweet.user.name,
            authorHandle: `@${tweet.user.screen_name}`,
            thumbnailUrl: tweet.user.profile_image_url_https.replace("_normal", ""), // Get higher res image
            type: "twitter",
        };
    } catch (error) {
        console.error("Error fetching tweet:", error);
        return null;
    }
}

// Fetch Reddit metadata using their public JSON API
async function fetchRedditMetadata(url: string): Promise<Metadata | null> {
    try {
        // Ensure URL ends with .json to get JSON data
        // Clean URL first
        let jsonUrl = url.split("?")[0];
        if (jsonUrl.endsWith("/")) jsonUrl = jsonUrl.slice(0, -1);
        if (!jsonUrl.endsWith(".json")) jsonUrl += ".json";

        const response = await fetch(jsonUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (VibeStackBot/1.0)",
            },
        });

        if (!response.ok) return null;

        const data = await response.json();
        const post = data[0]?.data?.children[0]?.data;

        if (!post) return null;

        return {
            title: post.title,
            description: post.selftext || `Discussion on r/${post.subreddit}`,
            thumbnailUrl: (post.thumbnail && post.thumbnail.startsWith("http")) ? post.thumbnail : undefined,
            authorName: `u/${post.author}`,
            authorHandle: `r/${post.subreddit}`,
            type: "reddit",
        };
    } catch {
        return null;
    }
}

// Fetch article metadata by parsing OG tags
async function fetchArticleMetadata(url: string): Promise<Metadata | null> {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            },
        });

        if (!response.ok) return null;

        const html = await response.text();
        const metadata = parseOGTags(html);

        // Detect source from URL or site_name
        let source = metadata.author || "Article"; // Default source fallback
        if (url.includes("medium.com")) source = "Medium";
        else if (url.includes("substack.com")) source = "Substack";
        else if (url.includes("dev.to")) source = "Dev.to";
        else if (url.includes("hashnode.dev")) source = "Hashnode";
        else if (url.includes("twitter.com") || url.includes("x.com")) source = "X Article";

        return {
            title: metadata.title,
            description: metadata.description,
            thumbnailUrl: metadata.image,
            authorName: source === "Medium" || source === "Substack" ? metadata.author : undefined, // Medium/Substack often have author in og:author
            // We pass the source for the UI to display
            authorHandle: source, // HACK: We'll use authorHandle field to transport 'source' string temporarily if strict types
            type: "article",
        };
    } catch {
        return null;
    }
}

// Parse Open Graph and Twitter Card meta tags from HTML
function parseOGTags(html: string): {
    title?: string;
    description?: string;
    image?: string;
    author?: string;
} {
    const getMetaContent = (property: string): string | undefined => {
        // Try og:property
        const ogMatch = html.match(
            new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']+)["']`, "i")
        );
        if (ogMatch) return ogMatch[1];

        // Try twitter:property
        const twitterMatch = html.match(
            new RegExp(`<meta[^>]*name=["']twitter:${property}["'][^>]*content=["']([^"']+)["']`, "i")
        );
        if (twitterMatch) return twitterMatch[1];

        // Try reversed order (content before property)
        const reversedMatch = html.match(
            new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:${property}["']`, "i")
        );
        if (reversedMatch) return reversedMatch[1];

        return undefined;
    };

    // Get title from og:title or <title> tag
    let title = getMetaContent("title");
    if (!title) {
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        title = titleMatch ? titleMatch[1].trim() : undefined;
    }

    return {
        title,
        description: getMetaContent("description"),
        image: getMetaContent("image"),
        author: getMetaContent("site_name"),
    };
}

// Detect URL type
function detectUrlType(url: string): "youtube" | "twitter" | "reddit" | "article" {
    if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
    if (/twitter\.com|x\.com/.test(url)) {
        // Check if it's an article (e.g. /article/ or specific path? X articles are tricky URLs, usually just posts)
        // For now, assume all x.com are twitter types unless we find a specific pattern
        return "twitter";
    }
    if (/reddit\.com/.test(url)) return "reddit";
    return "article";
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
        new URL(url); // Validate URL
    } catch {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const type = detectUrlType(url);
    let metadata: Metadata | null = null;

    switch (type) {
        case "youtube":
            metadata = await fetchYouTubeMetadata(url);
            break;
        case "twitter":
            metadata = await fetchTwitterMetadata(url);
            break;
        case "reddit":
            metadata = await fetchRedditMetadata(url);
            break;
        case "article":
            metadata = await fetchArticleMetadata(url);
            break;
    }

    if (!metadata) {
        return NextResponse.json(
            { error: "Could not fetch metadata", type },
            { status: 404 }
        );
    }

    return NextResponse.json(metadata);
}
