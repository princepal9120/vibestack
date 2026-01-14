import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { ProjectForm } from "@/components/project-form";

export const metadata: Metadata = {
    title: "Upload Project",
    description: "Share your AI-assisted project with the community",
};

export default async function NewProjectPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="container max-w-3xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Upload Project</h1>
                <p className="mt-2 text-muted-foreground">
                    Share your AI-assisted project with the community
                </p>
            </div>

            <div className="rounded-xl border bg-card p-6 md:p-8">
                <ProjectForm />
            </div>
        </div>
    );
}
