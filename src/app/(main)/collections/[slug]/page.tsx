import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/project-card";

interface CollectionPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: CollectionPageProps): Promise<Metadata> {
    const { slug } = await params;
    const collection = await prisma.collection.findUnique({
        where: { slug },
        select: { title: true, description: true },
    });

    if (!collection) return { title: "Collection Not Found" };

    return {
        title: collection.title,
        description: collection.description.slice(0, 160),
    };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { slug } = await params;

    const collection = await prisma.collection.findUnique({
        where: { slug },
    });

    if (!collection) {
        notFound();
    }

    // Fetch projects in the collection
    const projects = await prisma.project.findMany({
        where: {
            id: { in: collection.projectIds },
        },
        include: {
            author: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{collection.title}</h1>
                <p className="mt-2 text-muted-foreground max-w-2xl">
                    {collection.description}
                </p>
                {collection.curator && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        Curated by {collection.curator}
                    </p>
                )}
            </div>

            {projects.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                    No projects in this collection yet
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
