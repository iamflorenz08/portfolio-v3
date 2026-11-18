import { content } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col items-center gap-3 py-8 text-sm text-subtle sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {content.profile.name}.
        </p>
        <p className="font-mono text-xs">
          Press <kbd className="rounded border border-border px-1.5 py-0.5">⌘</kbd>{" "}
          <kbd className="rounded border border-border px-1.5 py-0.5">K</kbd> to navigate
        </p>
        <a href="#main" className="font-mono text-xs transition-colors hover:text-accent">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
