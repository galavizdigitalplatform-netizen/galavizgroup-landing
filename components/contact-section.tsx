import { ContactForm } from "./contact-form";

/**
 * Two-column contact section on home:
 *   left  — pitch + direct contact info (phone, email, area)
 *   right — TCPA-compliant lead form (client component)
 *
 * On mobile the columns stack with the form below the pitch.
 */
export function ContactSection() {
    return (
        <section
            id="contact"
            className="bg-soft-beige/50 border-t border-line"
        >
            <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-28">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
                    <div className="lg:col-span-2">
                        <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-warm-gold font-medium">
                            Get in touch
                        </p>
                        <h2 className="font-display text-3xl md:text-5xl text-deep-indigo tracking-display">
                            Have questions?
                            <br />
                            We&apos;re here to help.
                        </h2>
                        <p className="mt-5 max-w-md text-[16px] text-rich-black/70 leading-relaxed">
                            Reach out and we&apos;ll respond within one business
                            day. No pressure, no scripts — just a clear
                            conversation about what you&apos;re working toward.
                        </p>

                        <dl className="mt-10 space-y-5 text-[15px]">
                            <div>
                                <dt className="text-[11px] uppercase tracking-[0.18em] text-rich-black/55 font-medium">
                                    Email
                                </dt>
                                <dd className="mt-1">
                                    <a
                                        href="mailto:rita@galavizgroup.com"
                                        className="text-deep-indigo hover:text-warm-gold transition-colors"
                                    >
                                        rita@galavizgroup.com
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-[11px] uppercase tracking-[0.18em] text-rich-black/55 font-medium">
                                    Phone
                                </dt>
                                <dd className="mt-1">
                                    <a
                                        href="tel:+16024970655"
                                        className="text-deep-indigo hover:text-warm-gold transition-colors"
                                    >
                                        (602) 497-0655
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-[11px] uppercase tracking-[0.18em] text-rich-black/55 font-medium">
                                    Service area
                                </dt>
                                <dd className="mt-1 text-rich-black/75">
                                    Phoenix Metropolitan Area, Arizona
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="rounded-sm border border-line bg-pure-white p-6 shadow-sm md:p-10">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
