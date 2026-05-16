import Link from "next/link";

/**
 * Footer — dark deep-indigo block, 3-column on desktop, stacked on
 * mobile. Holds:
 *   col 1: brand wordmark + tagline + photo credit (Unsplash license)
 *   col 2: site links (home, privacy, terms, team login)
 *   col 3: contact + service area
 */
export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-deep-indigo text-pure-white/85">
            <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-20">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    <div>
                        <p className="font-display text-lg uppercase tracking-[0.18em] font-semibold text-pure-white">
                            Galaviz Group
                        </p>
                        <p className="mt-3 text-[14px] leading-relaxed text-pure-white/65 max-w-xs">
                            Helping Arizona families buy, sell, and invest with
                            confidence. Phoenix Metropolitan Area.
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-warm-gold mb-4">
                            Site
                        </p>
                        <ul className="space-y-2.5 text-[14px]">
                            <li>
                                <Link
                                    href="/"
                                    className="text-pure-white/80 hover:text-warm-gold transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="text-pure-white/80 hover:text-warm-gold transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-pure-white/80 hover:text-warm-gold transition-colors"
                                >
                                    Terms &amp; Conditions
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://os.galavizgroup.com/login"
                                    className="text-pure-white/80 hover:text-warm-gold transition-colors"
                                >
                                    Team login
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-warm-gold mb-4">
                            Contact
                        </p>
                        <ul className="space-y-2.5 text-[14px] text-pure-white/80">
                            <li>
                                <a
                                    href="mailto:rita@galavizgroup.com"
                                    className="hover:text-warm-gold transition-colors"
                                >
                                    rita@galavizgroup.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+16024970655"
                                    className="hover:text-warm-gold transition-colors"
                                >
                                    (602) 497-0655
                                </a>
                            </li>
                            <li>Phoenix Metropolitan Area, Arizona</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-3 border-t border-pure-white/15 pt-6 text-[12px] text-pure-white/55 md:flex-row md:items-center md:justify-between">
                    <p>
                        &copy; {year} Galaviz Group · Licensed Real Estate
                        Brokerage in Arizona · Equal Housing Opportunity
                    </p>
                    <p className="text-pure-white/40">
                        Hero photo by Roberto Nickson on Unsplash
                    </p>
                </div>
            </div>
        </footer>
    );
}
