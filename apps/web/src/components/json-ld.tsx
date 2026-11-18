import { content } from "@/content/site";
import { siteConfig } from "@/lib/site";

/** Structured data so search engines understand who this site is about. */
export function JsonLd() {
  const { profile, experience, skills } = content;
  const current = experience.find((e) => !e.end);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.title,
        description: siteConfig.description,
        inLanguage: "en",
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteConfig.url}/#profilepage`,
        url: siteConfig.url,
        name: siteConfig.title,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        mainEntity: { "@id": `${siteConfig.url}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: profile.name,
        jobTitle: profile.role,
        description: profile.tagline,
        url: siteConfig.url,
        ...(profile.email && { email: `mailto:${profile.email}` }),
        ...(profile.avatar && { image: new URL(profile.avatar, siteConfig.url).toString() }),
        ...(profile.location && {
          address: { "@type": "PostalAddress", addressCountry: profile.location },
        }),
        ...(current && {
          worksFor: { "@type": "Organization", name: current.company, url: current.companyUrl },
        }),
        knowsAbout: skills.flatMap((g) => g.items),
        sameAs: profile.socials.map((s) => s.url),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" to prevent breaking out of the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
