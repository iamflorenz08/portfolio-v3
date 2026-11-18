import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { ExperienceSection } from "@/components/experience";
import { HeroBento } from "@/components/hero-bento";
import { CommandPalette } from "@/components/interactive/command-palette";
import { RevealObserver } from "@/components/interactive/reveal-observer";
import { Projects } from "@/components/projects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TechStack } from "@/components/tech-stack";
import { content } from "@/content/site";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <HeroBento />
        <TechStack />
        <About />
        <ExperienceSection />
        <Projects />
        <Contact />
      </main>
      <SiteFooter />
      <CommandPalette socials={content.profile.socials} email={content.profile.email} />
      <RevealObserver />
    </>
  );
}
