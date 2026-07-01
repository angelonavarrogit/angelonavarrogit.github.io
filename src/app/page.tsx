import { JsonLd } from '@/components/shared/JsonLd';
import { buildPersonJsonLd, buildWebSiteJsonLd } from '@/lib/seo';
import { getAllArticles } from '@/lib/blog';

import HeroSection from '@/components/sections/HeroSection';
import WhatIDoSection from '@/components/sections/WhatIDoSection';
import IndustriesSection from '@/components/sections/IndustriesSection';
import HighlightsSection from '@/components/sections/HighlightsSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import PhilosophySection from '@/components/sections/PhilosophySection';
import FeaturedTechSection from '@/components/sections/FeaturedTechSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import CertRoadmapSection from '@/components/sections/CertRoadmapSection';
import LearningSection from '@/components/sections/LearningSection';
import BlogSection from '@/components/sections/BlogSection';
import QuoteSection from '@/components/sections/QuoteSection';
import OutsideWorkSection from '@/components/sections/OutsideWorkSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';

/**
 * Home page — Enterprise Systems Engineer Portfolio.
 *
 * Streamlined to 14 focused sections (no redundancy).
 * Flow: Position → Proof → Story → Tech → Work → Vision → Personal → Contact
 */
export default function Home() {
  const personJsonLd = buildPersonJsonLd();
  const webSiteJsonLd = buildWebSiteJsonLd();
  const articles = getAllArticles();

  return (
    <div className="overflow-x-hidden">
      <JsonLd data={personJsonLd} />
      <JsonLd data={webSiteJsonLd} />

      {/* Position yourself */}
      <HeroSection />
      <WhatIDoSection />
      <IndustriesSection />
      <HighlightsSection />

      {/* Tell your story */}
      <AboutSection />
      <ExperienceSection />

      {/* Show your thinking */}
      <PhilosophySection />
      <FeaturedTechSection />

      {/* Prove your work */}
      <ProjectsSection />

      {/* Show your vision */}
      <CertRoadmapSection />
      <LearningSection />
      <BlogSection articles={articles} />

      {/* Close with personality */}
      <QuoteSection />
      <OutsideWorkSection />
      <ContactSection />

      <Footer />
    </div>
  );
}
