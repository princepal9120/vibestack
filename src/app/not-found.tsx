import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <FileQuestion className="h-10 w-10 text-muted-foreground" />
            </div>

            <div>
                <h1 className="text-4xl font-bold tracking-tight">404</h1>
                <p className="mt-2 text-xl text-muted-foreground">Page not found</p>
                <p className="mt-4 text-muted-foreground max-w-md">
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    <Home className="mr-2 h-4 w-4" />
                    Go home
                </Link>
                <Link
                    href="/projects"
                    className="inline-flex items-center justify-center rounded-lg border px-6 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Browse projects
                </Link>
            </div>
        </div>
    );
}
