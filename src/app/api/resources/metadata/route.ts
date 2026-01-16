import { NextRequest, NextResponse } from "next/server";

interface Metadata {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    authorName?: string;
    authorHandle?: string;
    duration?: string;
    type: "youtube" | "twitter" | "article";
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

// Fetch X/Twitter metadata by parsing OG tags
async function fetchTwitterMetadata(url: string): Promise<Metadata | null> {
    try {
        // Extract handle from URL
        const handleMatch = url.match(/(?:twitter\.com|x\.com)\/(@?[\w]+)/);
        const handle = handleMatch ? handleMatch[1] : undefined;

        // Try to fetch OG tags (may be blocked by Twitter, fallback to basic info)
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            },
        });

        if (!response.ok) {
            return {
                title: `Post by @${handle}`,
                type: "twitter",
                authorHandle: handle ? `@${handle}` : undefined,
            };
        }

        const html = await response.text();
        const metadata = parseOGTags(html);

        return {
            title: metadata.title || `Post by @${handle}`,
            description: metadata.description,
            thumbnailUrl: metadata.image,
            authorHandle: handle ? `@${handle}` : undefined,
            type: "twitter",
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

        return {
            title: metadata.title,
            description: metadata.description,
            thumbnailUrl: metadata.image,
            authorName: metadata.author,
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
        author: getMetaContent("author") || getMetaContent("site_name"),
    };
}

// Detect URL type
function detectUrlType(url: string): "youtube" | "twitter" | "article" {
    if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
    if (/twitter\.com|x\.com/.test(url)) return "twitter";
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
