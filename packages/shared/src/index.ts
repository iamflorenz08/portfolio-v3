/**
 * Shared domain types for the portfolio.
 * Used by the web app today and by the backend (apps/api) later,
 * so the API contract and the UI stay in sync.
 */

export interface SocialLink {
  label: string;
  url: string;
  /** Handle shown in the UI, e.g. "@username" */
  handle?: string;
}

export interface Stat {
  label: string;
  value: number;
  /** e.g. "+" or "%" */
  suffix?: string;
}

export interface Profile {
  name: string;
  /** Short role headline, e.g. "Software Engineer" */
  role: string;
  /** Rotating titles for the hero typewriter. Falls back to `role`. */
  roles?: string[];
  /** One-line pitch shown in the hero and used as the default meta description */
  tagline: string;
  /** Longer paragraphs for the About section */
  about: string[];
  location?: string;
  /** IANA time zone for the live local-time widget, e.g. "Asia/Manila" */
  timeZone?: string;
  email?: string;
  /** Path under /public or absolute URL */
  avatar?: string;
  resumeUrl?: string;
  availableForWork?: boolean;
  /** Animated counters in the About section */
  stats?: Stat[];
  socials: SocialLink[];
}

export interface Experience {
  company: string;
  companyUrl?: string;
  role: string;
  /** ISO-ish dates, e.g. "2023-01". Omit `end` for current roles. */
  start: string;
  end?: string;
  location?: string;
  summary?: string;
  highlights: string[];
  stack?: string[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  url?: string;
  repoUrl?: string;
  image?: string;
  /** Screenshots shown in the project details modal. */
  gallery?: { src: string; alt: string }[];
  /** Key features listed in the project details modal. */
  highlights?: string[];
  featured?: boolean;
  year?: number;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface SiteContent {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  skills: SkillGroup[];
}
