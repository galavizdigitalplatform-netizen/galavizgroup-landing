import Link from "next/link";
import { Nav } from "./nav";
import { Footer } from "./footer";

/**
 * Shared layout for /privacy-policy and /terms.
 *
 * Differences vs the home page:
 * - Nav appears on a solid dark band (no transparent overlay over hero)
 * - Content is a prose column max-w-3xl with editorial line-height
 * - Headers stay in Source Serif 4, body in Inter
 */
export function LegalShell({
    title,
    lastUpdated,
    children,
}: {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="relative bg-deep-indigo">
                <Nav />
                <div className="mx-auto w-full max-w-7xl px-6 pt-32 pb-16 md:px-10 md:pt-40 md:pb-24">
                    <Link
                        href="/"
                        className="inline-block text-[11px] uppercase tracking-[0.18em] text-warm-gold hover:text-pure-white transition-colors"
                    >
                        ← Back to home
                    </Link>
                    <h1 className="mt-6 font-display text-4xl md:text-6xl text-pure-white tracking-display">
                        {title}
                    </h1>
                    <p className="mt-4 text-[14px] text-pure-white/65">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </div>

            <main className="flex-1 bg-pure-white">
                <article className="mx-auto w-full max-w-3xl px-6 py-16 md:px-8 md:py-24 prose-legal">
                    {children}
                </article>
            </main>

            <Footer />
        </>
    );
}
