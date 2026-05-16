"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";

/**
 * Public contact form for galavizgroup.com.
 *
 * Submits to /api/contact (Next.js route handler in this app) which
 * forwards the body 1:1 to Rita OS at
 *   https://os.galavizgroup.com/api/public/opportunities/capture
 *
 * The payload shape mirrors `leadCaptureSchema` in the rita-os repo:
 * snake_case field names, `lead_type` constrained to 'buyer' | 'seller',
 * SMS opt-in as 'yes' | 'no' (no default — explicit pick).
 *
 * TCPA compliance:
 * - SMS Yes/No radio is required; no default value.
 * - Marketing email is an optional checkbox.
 * - Transactional consent is implicit at submit (covered by the
 *   statement above the submit button + the legal links).
 */

type Interest = "buying" | "selling" | "both" | "investing";

const INTEREST_TO_LEAD_TYPE: Record<Interest, "buyer" | "seller"> = {
    buying: "buyer",
    selling: "seller",
    both: "buyer",
    investing: "buyer",
};

const INTEREST_LABEL: Record<Interest, string> = {
    buying: "Buying",
    selling: "Selling",
    both: "Both",
    investing: "Investing",
};

interface FormState {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    interest: Interest;
    message: string;
    sms_consent: "" | "yes" | "no";
    marketing_email_consent: boolean;
    website: string; // honeypot
}

const INITIAL: FormState = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    interest: "buying",
    message: "",
    sms_consent: "",
    marketing_email_consent: false,
    website: "",
};

export function ContactForm() {
    const [form, setForm] = useState<FormState>(INITIAL);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const update = <K extends keyof FormState>(field: K, value: FormState[K]) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Client-side validation — the API repeats these checks but a
        // friendly inline message is better UX than a server 400.
        if (!form.first_name.trim() || !form.last_name.trim()) {
            setError("Please enter your full name.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (form.phone.replace(/\D/g, "").length < 7) {
            setError("Please enter a valid phone number.");
            return;
        }
        if (form.sms_consent !== "yes" && form.sms_consent !== "no") {
            setError(
                "Please choose YES or NO to authorize or decline SMS communication.",
            );
            return;
        }

        setIsSubmitting(true);

        // Compose the lead_type + an intent prefix in the message so the
        // team can see whether the lead is buying, selling, both, or
        // investing. The Rita OS endpoint only models buyer/seller, so
        // "both" and "investing" are encoded as buyer + a context hint.
        const intentTag = `[Interest: ${INTEREST_LABEL[form.interest]}]`;
        const composedMessage = form.message.trim()
            ? `${intentTag}\n\n${form.message.trim()}`
            : intentTag;

        const payload = {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            lead_type: INTEREST_TO_LEAD_TYPE[form.interest],
            lead_source: "website" as const,
            message: composedMessage,
            sms_consent: form.sms_consent,
            marketing_email_consent: form.marketing_email_consent,
            website: form.website,
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.error || "Something went wrong. Please try again.");
                setIsSubmitting(false);
                return;
            }
            setSubmitted(true);
        } catch {
            setError("Network error. Please check your connection and try again.");
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="rounded-md border border-line bg-soft-beige/40 p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warm-gold">
                    <Check className="h-6 w-6 text-deep-indigo" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-2xl text-deep-indigo">Thank you.</h3>
                <p className="mt-2 text-rich-black/70">
                    Rita&apos;s team will reach out within one business day.
                </p>
            </div>
        );
    }

    const inputCls =
        "w-full rounded-sm border border-line bg-pure-white px-3.5 py-2.5 text-[15px] text-rich-black placeholder:text-rich-black/40 focus:border-warm-gold focus:outline-none focus:ring-1 focus:ring-warm-gold transition-colors";

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {error && (
                <div
                    role="alert"
                    className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="first_name"
                        className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-deep-indigo"
                    >
                        First name <span className="text-warm-gold">*</span>
                    </label>
                    <input
                        id="first_name"
                        type="text"
                        required
                        autoComplete="given-name"
                        value={form.first_name}
                        onChange={(e) => update("first_name", e.target.value)}
                        className={inputCls}
                    />
                </div>
                <div>
                    <label
                        htmlFor="last_name"
                        className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-deep-indigo"
                    >
                        Last name <span className="text-warm-gold">*</span>
                    </label>
                    <input
                        id="last_name"
                        type="text"
                        required
                        autoComplete="family-name"
                        value={form.last_name}
                        onChange={(e) => update("last_name", e.target.value)}
                        className={inputCls}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="email"
                        className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-deep-indigo"
                    >
                        Email <span className="text-warm-gold">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputCls}
                    />
                </div>
                <div>
                    <label
                        htmlFor="phone"
                        className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-deep-indigo"
                    >
                        Phone <span className="text-warm-gold">*</span>
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={inputCls}
                    />
                </div>
            </div>

            <fieldset>
                <legend className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-deep-indigo">
                    I&apos;m interested in <span className="text-warm-gold">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(Object.keys(INTEREST_LABEL) as Interest[]).map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => update("interest", opt)}
                            aria-pressed={form.interest === opt}
                            className={`rounded-sm border px-3 py-2.5 text-[13px] font-medium uppercase tracking-[0.06em] transition-colors ${
                                form.interest === opt
                                    ? "border-warm-gold bg-warm-gold text-deep-indigo"
                                    : "border-line bg-pure-white text-rich-black/70 hover:border-warm-gold/60 hover:text-deep-indigo"
                            }`}
                        >
                            {INTEREST_LABEL[opt]}
                        </button>
                    ))}
                </div>
            </fieldset>

            <div>
                <label
                    htmlFor="message"
                    className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-deep-indigo"
                >
                    Notes{" "}
                    <span className="text-rich-black/40 normal-case tracking-normal">
                        (optional)
                    </span>
                </label>
                <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Anything you&rsquo;d like Rita&rsquo;s team to know before they reach out."
                    className={`${inputCls} resize-none`}
                />
            </div>

            {/* Honeypot — bots populate, humans never see. */}
            <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
                style={{ clip: "rect(0 0 0 0)", clipPath: "inset(50%)" }}
            />

            {/* ── UX-CMP3 — TCPA + CAN-SPAM consent ─────────────────── */}
            <div className="space-y-4 border-t border-line pt-6">
                <h4 className="font-display text-lg text-deep-indigo">
                    Communication preferences
                </h4>
                <p className="text-[13px] leading-relaxed text-rich-black/65">
                    By submitting this form, you agree to receive transactional
                    emails from Galaviz Group about your real estate
                    inquiry. You may unsubscribe from any email at any time.
                </p>

                <fieldset className="space-y-2">
                    <legend className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.08em] text-deep-indigo">
                        SMS communication <span className="text-warm-gold">*</span>
                    </legend>
                    <label
                        className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
                            form.sms_consent === "yes"
                                ? "border-warm-gold bg-warm-gold/10"
                                : "border-line hover:border-warm-gold/40"
                        }`}
                    >
                        <input
                            type="radio"
                            name="sms_consent"
                            value="yes"
                            checked={form.sms_consent === "yes"}
                            onChange={() => update("sms_consent", "yes")}
                            className="mt-1 accent-warm-gold"
                        />
                        <span className="text-[13px] leading-relaxed">
                            <strong className="block font-semibold text-rich-black">
                                YES — Send me SMS
                            </strong>
                            <span className="text-rich-black/65">
                                I authorize Galaviz Group to contact me by
                                SMS at the phone number provided. Standard message
                                and data rates may apply. Reply STOP to
                                unsubscribe, HELP for help.
                            </span>
                        </span>
                    </label>
                    <label
                        className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
                            form.sms_consent === "no"
                                ? "border-deep-indigo bg-soft-beige/40"
                                : "border-line hover:border-deep-indigo/40"
                        }`}
                    >
                        <input
                            type="radio"
                            name="sms_consent"
                            value="no"
                            checked={form.sms_consent === "no"}
                            onChange={() => update("sms_consent", "no")}
                            className="mt-1 accent-deep-indigo"
                        />
                        <span className="text-[13px] leading-relaxed">
                            <strong className="block font-semibold text-rich-black">
                                NO — Do not send me SMS
                            </strong>
                            <span className="text-rich-black/65">
                                I prefer email or phone call only.
                            </span>
                        </span>
                    </label>
                </fieldset>

                <label className="flex cursor-pointer items-start gap-3">
                    <input
                        type="checkbox"
                        checked={form.marketing_email_consent}
                        onChange={(e) =>
                            update("marketing_email_consent", e.target.checked)
                        }
                        className="mt-1 accent-warm-gold"
                    />
                    <span className="text-[13px] leading-relaxed text-rich-black/70">
                        Send me occasional market updates and tips. You can
                        unsubscribe at any time.
                    </span>
                </label>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-warm-gold px-6 py-3.5 text-[13px] uppercase tracking-[0.16em] font-semibold text-deep-indigo transition-colors hover:bg-warm-gold-soft disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2"
            >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Sending…" : "Send message"}
            </button>

            <p className="text-center text-[12px] leading-relaxed text-rich-black/55">
                By submitting, you agree to our{" "}
                <Link
                    href="/privacy-policy"
                    className="underline decoration-warm-gold/60 underline-offset-2 hover:text-deep-indigo"
                >
                    Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                    href="/terms"
                    className="underline decoration-warm-gold/60 underline-offset-2 hover:text-deep-indigo"
                >
                    Terms
                </Link>
                . Equal Housing Opportunity.
            </p>
        </form>
    );
}
