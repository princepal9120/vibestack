import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/project-card";
import { Github, Twitter, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserPageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({
    params,
}: UserPageProps): Promise<Metadata> {
    const { username } = await params;
    const user = await prisma.user.findUnique({
        where: { username },
        select: { username: true, bio: true },
    });

    if (!user) return { title: "User Not Found" };

    return {
        title: user.username,
        description: user.bio || `Projects by ${user.username}`,
    };
}

export default async function UserPage({ params }: UserPageProps) {
    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            projects: {
                orderBy: { createdAt: "desc" },
                include: {
                    author: {
                        select: {
                            username: true,
                            avatar: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    projects: true,
                    upvotes: true,
                },
            },
        },
    });

    if (!user) {
        notFound();
    }

    // Calculate total upvotes received
    const totalUpvotes = user.projects.reduce(
        (sum, p) => sum + p.upvoteCount,
        0
    );

    return (
        <div className="container py-8">
            {/* Profile Header */}
            <div className="mb-12 flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-8">
                <div className="h-24 w-24 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    {user.avatar && (
                        <Image
                            src={user.avatar}
                            alt={user.username}
                            width={96}
                            height={96}
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="mt-4 md:mt-0">
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    {user.bio && (
                        <p className="mt-2 text-lg text-muted-foreground max-w-xl">
                            {user.bio}
                        </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                        {user.githubUrl && (
                            <a
                                href={user.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="h-4 w-4" />
                                GitHub
                            </a>
                        )}
                        {user.twitterUrl && (
                            <a
                                href={user.twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Twitter className="h-4 w-4" />
                                Twitter
                            </a>
                        )}
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Joined{" "}
                            {formatDistanceToNow(new Date(user.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 flex items-center justify-center gap-6 md:justify-start">
                        <div>
                            <div className="text-2xl font-bold">{user._count.projects}</div>
                            <div className="text-sm text-muted-foreground">Projects</div>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div>
                            <div className="text-2xl font-bold">{totalUpvotes}</div>
                            <div className="text-sm text-muted-foreground">Total Upvotes</div>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div>
                            <div className="text-2xl font-bold">{user._count.upvotes}</div>
                            <div className="text-sm text-muted-foreground">Given</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Projects</h2>
                {user.projects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">
                        No projects yet
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {user.projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
