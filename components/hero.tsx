import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

/**
 * Hero — photo-cinematic, 90vh, full-bleed photo with dark
 * gradients so the white copy stays AA-legible regardless of the
 * underlying pixel.
 *
 * Image: original Galaviz Group photograph — a family receiving the
 * keys to their new Arizona home at golden hour. The subjects sit to
 * the right; the calmer left third carries the headline.
 *
 * No `quality` prop: Next 16 restricts `images.qualities` to `[75]` by
 * default, so an un-allowlisted value (the old `quality={85}`) made the
 * optimizer return 400 in production and the photo never rendered.
 * Defaulting to 75 keeps the request inside the allowlist.
 */
export function Hero() {
    return (
        <section className="relative isolate flex min-h-[90vh] flex-col justify-end overflow-hidden">
            <Image
                src="/hero.jpg"
                alt="A real estate agent handing house keys to a smiling family outside their new Arizona home at golden hour"
                fill
                priority
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
            {/* Left-to-right scrim: the new photo keeps its subjects to the
                right, so a soft darkening on the left third guarantees the
                white headline stays legible without dimming the family. */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                    background:
                        "linear-gradient(90deg, rgba(28,28,28,0.45) 0%, rgba(28,28,28,0.15) 32%, rgba(28,28,28,0) 58%)",
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
                        className="inline-flex items-center justify-center rounded-sm bg-warm-gold px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] font-semibold text-deep-indigo shadow-sm transition duration-200 hover:bg-warm-gold-soft hover:shadow-lg hover:shadow-warm-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 focus-visible:ring-offset-rich-black"
                    >
                        Schedule a consultation
                    </Link>
                    <Link
                        href="#services"
                        className="inline-flex items-center justify-center rounded-sm border border-pure-white/40 px-7 py-3.5 text-[13px] uppercase tracking-[0.16em] font-semibold text-pure-white backdrop-blur-[2px] transition duration-200 hover:border-warm-gold hover:bg-pure-white/5 hover:text-warm-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 focus-visible:ring-offset-rich-black"
                    >
                        What we do
                    </Link>
                </div>
            </div>

            {/* Scroll cue — decorative, md+ only, gentle float that
                respects prefers-reduced-motion (see .scroll-cue). */}
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 md:block"
            >
                <ChevronDown className="scroll-cue h-6 w-6 text-pure-white/55" />
            </div>
        </section>
    );
}
