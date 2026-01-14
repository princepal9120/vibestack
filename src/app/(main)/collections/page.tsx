import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FolderOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Collections",
    description: "Curated collections of AI-assisted projects",
};

export default async function CollectionsPage() {
    const collections = await prisma.collection.findMany({
        orderBy: { createdAt: "desc" },
    });

    if (collections.length === 0) {
        return (
            <div className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                    <p className="mt-2 text-muted-foreground">
                        Curated collections of AI-assisted projects
                    </p>
                </div>

                <div className="text-center py-16">
                    <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">
                        Collections coming soon...
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        We're curating the best projects for you
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                <p className="mt-2 text-muted-foreground">
                    Curated collections of AI-assisted projects
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {collections.map((collection) => (
                    <Link
                        key={collection.id}
                        href={`/collections/${collection.slug}`}
                        className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg"
                    >
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <FolderOpen className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            {collection.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {collection.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {collection.projectIds.length} projects
                            </span>
                            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
