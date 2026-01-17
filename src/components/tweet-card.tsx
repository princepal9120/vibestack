import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TweetCardProps {
    author: {
        name: string;
        handle: string;
        avatar: string;
    };
    content: string;
    className?: string;
    href?: string;
}

export function TweetCard({ author, content, className, href }: TweetCardProps) {
    const CardContent = (
        <div className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 shadow-sm",
            "hover:border-white/20 transition-colors duration-300",
            className
        )}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
                        <Image
                            src={author.avatar}
                            alt={author.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white leading-none">
                            {author.name}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1">
                            {author.handle}
                        </p>
                    </div>
                </div>

                {/* Close/X Icon (Decorative) */}
                <div className="text-zinc-500 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                </div>
            </div>

            {/* Content */}
            <p className="text-[15px] leading-relaxed text-zinc-300">
                {content}
            </p>
        </div>
    );

    if (href) {
        return (
            <Link href={href} target="_blank" rel="noopener noreferrer" className="block">
                {CardContent}
            </Link>
        );
    }

    return CardContent;
}
