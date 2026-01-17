import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  HeroSection,
  FeaturesSection,
  FeaturedProjectsSection,
  PlatformsSection,
  CTASection,
} from "@/components/landing-sections";
import CommunityVibesSection from "@/components/community-vibes-section";
import { prisma } from "@/lib/prisma";

async function getFeaturedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { upvoteCount: "desc" },
      take: 6,
      include: {
        author: {
          select: { username: true, avatar: true },
        },
      },
    });

    // If no featured projects, get latest projects
    if (projects.length === 0) {
      return prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          author: {
            select: { username: true, avatar: true },
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

async function getFeaturedResources() {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        status: "APPROVED",
        featured: true,
      },
      orderBy: { viewCount: "desc" },
      take: 50,
    });

    // Fallback if no featured resources
    if (resources.length === 0) {
      return prisma.resource.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    return resources;
  } catch (error) {
    console.error("Error fetching featured resources:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();
  const featuredResources = await getFeaturedResources();

  return (
    <div className="dark min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProjectsSection projects={featuredProjects} />
        <FeaturesSection />
        <PlatformsSection />
        <CommunityVibesSection resources={featuredResources} />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
