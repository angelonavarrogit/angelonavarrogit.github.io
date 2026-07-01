import { JsonLd } from '@/components/shared/JsonLd';
import { buildPersonJsonLd, buildWebSiteJsonLd } from '@/lib/seo';
import { GITHUB_FALLBACK } from '@/data/github-fallback';
import { getAllArticles } from '@/lib/blog';

import HeroSection from '@/components/sections/HeroSection';
import WhatIDoSection from '@/components/sections/WhatIDoSection';
import IndustriesSection from '@/components/sections/IndustriesSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import SkillsSection from '@/components/sections/SkillsSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import StatsSection from '@/components/sections/StatsSection';
import TelecomSection from '@/components/sections/TelecomSection';
import GitHubSection from '@/components/sections/GitHubSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';

/**
 * Home page — Enterprise Systems Engineer Portfolio.
 *
 * Section order (repositioned for professional impact):
 * Hero → What I Do → Industries → About → Experience → Skills →
 * Certifications → Projects → Stats → Telecom → GitHub → Blog → Contact
 */
export default function Home() {
  const personJsonLd = buildPersonJsonLd();
  const webSiteJsonLd = buildWebSiteJsonLd();
  const articles = getAllArticles();

  return (
    <div className="overflow-x-hidden">
      <JsonLd data={personJsonLd} />
      <JsonLd data={webSiteJsonLd} />

      <HeroSection />
      <WhatIDoSection />
      <IndustriesSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <CertificationsSection />
      <ProjectsSection />
      <StatsSection />
      <TelecomSection />
      <GitHubSection data={GITHUB_FALLBACK} />
      <BlogSection articles={articles} />
      <ContactSection />

      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-foreground-muted">
          © {new Date().getFullYear()} Angelo Navarro. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
