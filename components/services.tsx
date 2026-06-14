import { Home, Key, TrendingUp } from "lucide-react";

const SERVICES = [
    {
        icon: Home,
        title: "Buy",
        body: "Guided property search across the Phoenix metro with deep neighborhood expertise.",
    },
    {
        icon: Key,
        title: "Sell",
        body: "Strategic listing, professional staging, and proven negotiation.",
    },
    {
        icon: TrendingUp,
        title: "Invest",
        body: "Long-term portfolio strategy for rental and flip opportunities.",
    },
];

export function Services() {
    return (
        <section
            id="services"
            className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-28"
        >
            <div className="mb-12 max-w-2xl md:mb-16">
                <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-warm-gold font-medium">
                    What we do
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-deep-indigo tracking-display">
                    Real estate, done with intent.
                </h2>
                <p className="mt-5 max-w-xl text-base md:text-[17px] text-rich-black/70 leading-relaxed">
                    A focused practice. Three services, executed with the same
                    standard of clarity and care.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                {SERVICES.map(({ icon: Icon, title, body }) => (
                    <article
                        key={title}
                        className="group relative overflow-hidden rounded-xl border border-line bg-pure-white p-8 shadow-[0_2px_10px_rgba(40,34,22,0.03)] transition duration-200 hover:border-warm-gold/30 hover:shadow-[0_14px_30px_rgba(40,34,22,0.10)] motion-safe:hover:-translate-y-1 md:p-9"
                    >
                        {/* Gold hairline accent — fades in on hover. */}
                        <span
                            aria-hidden
                            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-warm-gold to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        />
                        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-soft-beige/60">
                            <Icon
                                className="h-6 w-6 text-warm-gold"
                                strokeWidth={1.5}
                                aria-hidden
                            />
                        </span>
                        <h3 className="mt-6 font-display text-[26px] text-deep-indigo">
                            {title}
                        </h3>
                        <p className="mt-3 text-[15px] leading-relaxed text-rich-black/65">
                            {body}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}
