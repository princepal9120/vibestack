import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  HeroSection,
  FeaturesSection,
  FeaturedProjectsSection,
  PlatformsSection,
  CTASection,
} from "@/components/landing-sections";
import { prisma } from "@/lib/prisma";

async function getFeaturedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        upvoteCount: "desc",
      },
      take: 6,
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    // If no featured projects, get latest projects instead
    if (projects.length === 0) {
      return prisma.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
        include: {
          author: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });
    }

    return projects;
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <div className="dark min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProjectsSection projects={featuredProjects} />
        <FeaturesSection />
        <PlatformsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
