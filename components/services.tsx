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
            <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3 md:border md:border-line">
                {SERVICES.map(({ icon: Icon, title, body }) => (
                    <article
                        key={title}
                        className="group relative bg-pure-white p-8 md:p-10 transition-colors hover:bg-soft-beige/40"
                    >
                        <Icon
                            className="h-7 w-7 text-warm-gold"
                            strokeWidth={1.25}
                            aria-hidden
                        />
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
