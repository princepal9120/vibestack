import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-8 space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
            </div>

            <Skeleton className="h-12 w-full" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border bg-card p-4 space-y-4">
                        <Skeleton className="aspect-video rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
