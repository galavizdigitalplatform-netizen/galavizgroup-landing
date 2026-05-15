import Link from "next/link";

/**
 * Top nav — minimal, transparent over the hero, with the wordmark left
 * and a single CTA right. We intentionally avoid a full nav menu since
 * the home page is the only marketing surface; deep links are below the
 * fold or in the footer.
 */
export function Nav() {
    return (
        <header className="absolute inset-x-0 top-0 z-20">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10 md:py-8">
                <Link
                    href="/"
                    className="font-display text-base md:text-lg font-semibold uppercase tracking-[0.18em] text-pure-white"
                    aria-label="Galaviz Legacy Group home"
                >
                    Galaviz Legacy Group
                </Link>
                <Link
                    href="#contact"
                    className="hidden md:inline-flex items-center text-[12px] uppercase tracking-[0.18em] font-medium text-pure-white/90 hover:text-warm-gold transition-colors"
                >
                    Contact
                </Link>
            </div>
        </header>
    );
}
