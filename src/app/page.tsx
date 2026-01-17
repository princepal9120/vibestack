import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  HeroSection,
  FeaturesSection,
  FeaturedProjectsSection,
  PlatformsSection,
  CTASection,
  TestimonialsSection, // Keeping for reference or backup
} from "@/components/landing-sections";
import CommunityVibesSection from "@/components/community-vibes-section";
// import { prisma } from "@/lib/prisma"; // Removed

async function getFeaturedProjects() {
    return [];
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

async function getFeaturedResources() {
    return [];
}
