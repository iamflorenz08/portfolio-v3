import { content } from "@/content/site";

const { profile } = content;

export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  name: profile.name,
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
  locale: "en_US",
  keywords: [
    profile.name,
    profile.role,
    "Software Engineer",
    "Portfolio",
    "Full-Stack Developer",
    ...content.skills.flatMap((g) => g.items),
  ],
} as const;

export const nav = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const;

export function formatMonth(value?: string) {
  if (!value) return "Present";
  const [y, m] = value.split("-").map(Number);
  if (!y) return value;
  return new Date(Date.UTC(y, (m ?? 1) - 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
