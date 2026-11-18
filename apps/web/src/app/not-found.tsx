import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="container-page flex min-h-dvh flex-col items-start justify-center gap-6">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="btn">
        ← Back home
      </Link>
    </main>
  );
}
