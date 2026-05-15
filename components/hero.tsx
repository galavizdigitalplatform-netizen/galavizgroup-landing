import Image from "next/image";
import Link from "next/link";

/**
 * Hero — photo-cinematic, 90vh, full-bleed Unsplash photo with a
 * dark-to-transparent gradient so the white copy stays AA-legible
 * regardless of the underlying pixel.
 *
 * Image: Roberto Nickson on Unsplash (so3wgJLwDxo).
 * License: Unsplash License — free commercial use, attribution
 * optional. Credit is given discreetly in the footer.
 */
export function Hero() {
    return (
        <section className="relative isolate flex min-h-[90vh] flex-col justify-end overflow-hidden">
            <Image
                src="/hero-arizona.jpg"
                alt=""
                fill
                priority
                quality={85}
                sizes="100vw"
                className="object-cover object-center -z-10"
            />
            {/* Top-down gradient: darker at the bottom where the copy
                lives, fading toward the upper third so the photo can breathe. */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(28,28,28,0.55) 0%, rgba(28,28,28,0.25) 45%, rgba(28,28,28,0.05) 70%, rgba(28,28,28,0) 100%)",
                }}
            />
            {/* Soft bottom vignette to anchor the copy block. */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                    background:
                        "linear-gradient(0deg, rgba(28,28,28,0.75) 0%, rgba(28,28,28,0.35) 25%, rgba(28,28,28,0) 60%)",
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 md:px-10 md:pb-24">
                <p className="mb-6 text-[11px] uppercase tracking-[0.32em] text-warm-gold font-medium">
                    Arizona · Phoenix Metro
                </p>
                <h1 className="font-display tracking-display text-pure-white text-[44px] leading-[1.05] sm:text-[60px] md:text-[76px] lg:text-[88px] font-semibold max-w-4xl">
                    Helping Arizona families
                    <br />
                    find home.
                </h1>
                <p className="mt-6 max-w-xl text-base sm:text-lg text-pure-white/85 leading-relaxed">
                    Expert representation across the Phoenix metro. Buy, sell,
                    and invest with clarity.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <Link
                        href="#contact"
                        className="inline-flex items-center justify-center rounded-sm bg-warm-gold px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] font-semibold text-deep-indigo transition-colors hover:bg-warm-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 focus-visible:ring-offset-rich-black"
                    >
                        Schedule a consultation
                    </Link>
                    <Link
                        href="#services"
                        className="inline-flex items-center justify-center rounded-sm border border-pure-white/40 px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] font-semibold text-pure-white transition-colors hover:border-warm-gold hover:text-warm-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 focus-visible:ring-offset-rich-black"
                    >
                        What we do
                    </Link>
                </div>
            </div>
        </section>
    );
}
