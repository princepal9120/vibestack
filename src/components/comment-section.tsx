"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Send, Loader2 } from "lucide-react";

interface Comment {
    id: string;
    content: string;
    createdAt: Date | string;
    author: {
        id: string;
        username: string;
        avatar: string | null;
    };
}

interface CommentSectionProps {
    projectId: string;
    initialComments: Comment[];
    currentUserId?: string;
}

export function CommentSection({
    projectId,
    initialComments,
    currentUserId,
}: CommentSectionProps) {
    const router = useRouter();
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);

        try {
            const res = await fetch(`/api/projects/${projectId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                const { data } = await res.json();
                setComments((prev) => [data, ...prev]);
                setNewComment("");
                router.refresh();
            } else if (res.status === 401) {
                router.push("/sign-in");
            }
        } catch (error) {
            console.error("Comment error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={currentUserId ? "Add a comment..." : "Sign in to comment"}
                    disabled={!currentUserId || loading}
                    className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!currentUserId || loading || !newComment.trim()}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                        No comments yet. Be the first to share your thoughts!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex gap-3 rounded-lg border bg-card p-4"
                        >
                            <div className="h-8 w-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
                                {comment.author.avatar && (
                                    <Image
                                        src={comment.author.avatar}
                                        alt={comment.author.username}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">
                                        {comment.author.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
