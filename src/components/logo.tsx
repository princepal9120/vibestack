import Image from "next/image";

export function Logo({ className }: { className?: string }) {
    return (
        <Image
            src="/logo.svg"
            alt="Vibe Stack Logo"
            width={32}
            height={32}
            className={className}
        />
    );
}
