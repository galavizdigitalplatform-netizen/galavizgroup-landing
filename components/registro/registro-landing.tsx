"use client";

/**
 * /registro — focused lead-capture landing for paid traffic.
 *
 * Design: Claude Design project "Rediseño Conversión Landing". Styles live in
 * app/registro/registro.css, scoped under `.registro-root`.
 *
 * Differences from the home-page form (components/contact-form.tsx), all
 * deliberate:
 *   - Bilingual EN/ES with a toggle and ?lang= — the rest of the site is
 *     English-only, and this is the main reason the page exists.
 *   - Step 2 asks 4 LPMAMA pillars, not 7. This is a paid-traffic page; every
 *     extra field costs conversion. The home form stays the deep one.
 *   - Three goals (buy / invest / info), no "sell" — all map to lead_type
 *     'buyer'; the label rides along in the message.
 *
 * The TCPA YES/NO block is NOT decorative: it is the opt-in flow declared in
 * the Twilio A2P 10DLC campaign (CM16c56ebcf8ca44f44b7695ba9f6bf98d) and is
 * what carriers audit. Never collapse it into one generic checkbox.
 *
 * Posts to the existing /api/contact proxy, which sanitizes the lpmama block
 * field-by-field before forwarding to Rita OS.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DICT, type Lang, type LeadCopyKey } from "./registro-i18n";

const LANG_KEY = "galaviz_lead_lang";
/* Module scope so server and client agree within a build — a hardcoded year
   goes stale, and computing it per-render risks a New Year hydration blip. */
const YEAR = new Date().getFullYear();

type Goal = "" | "buy" | "invest" | "info";
type Contact = "" | "call" | "email" | "sms";
type BestTime = "" | "morning" | "afternoon" | "evening" | "any";
type Timeline = "" | "0-3 months" | "3-6 months" | "6-12 months" | "12+ months" | "Just exploring";
type Money = "" | "yes" | "no" | "not_sure";
type SmsConsent = "" | "yes" | "no";

/**
 * Canonical English tags written into the lead's message, in every language.
 * "Buying" / "Investing" / "Just Exploring" mirror the home form's vocabulary
 * so both surfaces land in the inbox looking the same.
 */
const GOAL_TAG: Record<Exclude<Goal, "">, string> = {
    buy: "Buying",
    invest: "Investing",
    info: "Just Exploring",
};
const CONTACT_TAG: Record<Exclude<Contact, "">, string> = {
    call: "Phone call",
    email: "Email",
    sms: "Text message",
};
const BESTTIME_TAG: Record<Exclude<BestTime, "">, string> = {
    morning: "Morning (8am-12pm)",
    afternoon: "Afternoon (12pm-5pm)",
    evening: "Evening (5pm-8pm)",
    any: "Anytime",
};

/** Strip formatting ("300,000", "$450000") down to a positive integer. */
function parseBudget(raw: string): number | null {
    const n = parseInt(raw.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > 0 ? n : null;
}
function validEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

interface FormState {
    goal: Goal;
    first: string;
    last: string;
    email: string;
    phone: string;
    contact: Contact;
    besttime: BestTime;
    zones: string;
    budget_min: string;
    budget_max: string;
    timeline: Timeline;
    preapproved_or_cash: Money;
    notes: string;
    sms_consent: SmsConsent;
    marketing_email_consent: boolean;
    website: string;
}

const EMPTY: FormState = {
    goal: "", first: "", last: "", email: "", phone: "",
    contact: "", besttime: "",
    zones: "", budget_min: "", budget_max: "", timeline: "", preapproved_or_cash: "",
    notes: "", sms_consent: "", marketing_email_consent: false, website: "",
};

type FieldError =
    | "f.err.req" | "f.err.email" | "f.err.phone" | "f.err.pick"
    | "f.err.sms" | "lp.err.budget";

export function RegistroLanding() {
    const [lang, setLang] = useState<Lang>("en");
    const [form, setForm] = useState<FormState>(EMPTY);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, FieldError>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [done, setDone] = useState(false);
    const [solid, setSolid] = useState(false);
    const [prepOpen, setPrepOpen] = useState(false);
    const successRef = useRef<HTMLDivElement>(null);

    const t = useCallback((k: LeadCopyKey) => DICT[lang][k], [lang]);

    /* Campaign deep links: ?lang=es forces a locale, ?goal=invest preselects
       the goal. Both are browser-only inputs (URL + localStorage) that must be
       read AFTER mount: this page is statically prerendered, so reading them
       during render would make the client markup disagree with the server's
       and blow up hydration. useSearchParams() would avoid the effect but
       forces the whole landing behind a Suspense fallback — a blank first
       paint on a paid-traffic page, which is a worse trade.
       This runs once on mount with an empty dep array and cannot cascade, so
       the set-state-in-effect rule is disabled deliberately and narrowly. */
    /* eslint-disable react-hooks/set-state-in-effect -- see note above */
    useEffect(() => {
        const qs = new URLSearchParams(window.location.search);

        const q = (qs.get("lang") || "").toLowerCase();
        if (q === "es" || q === "en") {
            setLang(q);
        } else {
            try {
                const saved = localStorage.getItem(LANG_KEY);
                if (saved === "es" || saved === "en") setLang(saved);
            } catch {
                /* private mode — English is a fine default */
            }
        }

        const g = (qs.get("goal") || "").toLowerCase();
        if (g === "buy" || g === "invest" || g === "info") {
            setForm((f) => ({ ...f, goal: g as Goal }));
        }
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    useEffect(() => {
        document.documentElement.lang = lang;
        try {
            localStorage.setItem(LANG_KEY, lang);
        } catch {
            /* ignore */
        }
    }, [lang]);

    useEffect(() => {
        const onScroll = () => setSolid(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
        setForm((f) => ({ ...f, [k]: v }));
        setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
    };

    /* Preferred contact = SMS implies they want texts. Nudge the TCPA radio to
       YES, but only when untouched and always overridable — the explicit
       choice is what the A2P audit rests on. */
    const onContactChange = (v: Contact) => {
        set("contact", v);
        if (v === "sms" && !form.sms_consent) {
            setForm((f) => ({ ...f, contact: v, sms_consent: "yes" }));
            setErrors((e) => ({ ...e, sms_consent: undefined }));
        }
    };

    /** Optional lpmama block — omit empties, never send "" or 0. */
    const buildLpmama = () => {
        const b: Record<string, unknown> = {};
        if (form.zones.trim()) b.zones = form.zones.trim();
        const min = parseBudget(form.budget_min);
        const max = parseBudget(form.budget_max);
        if (min !== null) b.budget_min = min;
        if (max !== null) b.budget_max = max;
        if (form.timeline) b.timeline = form.timeline;
        if (form.preapproved_or_cash) b.preapproved_or_cash = form.preapproved_or_cash;
        return Object.keys(b).length ? b : null;
    };

    /**
     * Preferred contact + best time aren't API fields — they ride the message.
     *
     * The metadata is written in English REGARDLESS of the page language, and
     * uses the same `[Interest: X]` tag the home form writes. The team triages
     * a single inbox: mixing Spanish and English tags would make these leads
     * unfilterable next to every other one. Only the visitor's own notes stay
     * in whatever language they typed.
     */
    const buildMessage = () => {
        const lines: string[] = [];
        if (form.goal) lines.push(`[Interest: ${GOAL_TAG[form.goal]}]`);
        if (form.notes.trim()) lines.push("", form.notes.trim());
        const extra: string[] = [];
        if (form.contact) extra.push(`Preferred contact: ${CONTACT_TAG[form.contact]}`);
        if (form.besttime) extra.push(`Best time: ${BESTTIME_TAG[form.besttime]}`);
        if (extra.length) lines.push("", extra.join(" · "));
        return lines.join("\n");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        const next: Partial<Record<keyof FormState, FieldError>> = {};
        if (!form.first.trim()) next.first = "f.err.req";
        if (!form.last.trim()) next.last = "f.err.req";
        if (!validEmail(form.email.trim())) {
            next.email = form.email.trim() ? "f.err.email" : "f.err.req";
        }
        if (form.phone.replace(/\D/g, "").length < 10) {
            next.phone = form.phone.trim() ? "f.err.phone" : "f.err.req";
        }
        if (!form.goal) next.goal = "f.err.pick";
        if (!form.contact) next.contact = "f.err.pick";
        if (!form.besttime) next.besttime = "f.err.pick";
        // TCPA — an explicit YES or NO is mandatory. This is the A2P evidence.
        if (!form.sms_consent) next.sms_consent = "f.err.sms";

        const min = parseBudget(form.budget_min);
        const max = parseBudget(form.budget_max);
        if (min !== null && max !== null && max <= min) {
            next.budget_min = "lp.err.budget";
            // Reopen step 2 — otherwise the error points at a collapsed field.
            setPrepOpen(true);
        }

        setErrors(next);
        if (Object.keys(next).length > 0) {
            requestAnimationFrame(() => {
                document
                    .querySelector(".registro-root .err-msg.show")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            });
            return;
        }

        setSubmitting(true);
        const lpmama = buildLpmama();
        const payload = {
            first_name: form.first.trim(),
            last_name: form.last.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            // Rita OS models buyer/seller only; this page has no seller path.
            lead_type: "buyer" as const,
            lead_source: "website" as const,
            message: buildMessage(),
            sms_consent: form.sms_consent,
            marketing_email_consent: form.marketing_email_consent,
            website: form.website,
            ...(lpmama ? { lpmama } : {}),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setSubmitError(data.error || t("f.err.submit"));
                setSubmitting(false);
                return;
            }
            setDone(true);
            requestAnimationFrame(() =>
                successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
            );
        } catch {
            setSubmitError(t("f.err.submit"));
            setSubmitting(false);
        }
    };

    const err = (k: keyof FormState) =>
        errors[k] ? <div className="err-msg show">{t(errors[k] as LeadCopyKey)}</div> : null;
    const cls = (k: keyof FormState) => (errors[k] ? "err" : undefined);
    /** Copy carries <em> for the accent word; the strings are ours, not input. */
    const html = (k: LeadCopyKey) => ({ __html: t(k) });

    return (
        <div className="registro-root">
            <header className={`header${solid ? " solid" : ""}`}>
                <div className="wrap header-row">
                    <div className="logo-lockup">
                        <a href="#top" className="logo-link" aria-label="Galaviz Group">
                            <Image src="/brand/logo-negative.svg" alt="Galaviz Group" width={260} height={88} className="logo-on-dark" priority />
                            <Image src="/brand/logo-primary.svg" alt="Galaviz Group" width={260} height={88} className="logo-on-light" />
                        </a>
                        <span className="logo-div" />
                        <Image src="/homesmart-logo-white.svg" alt="HomeSmart" width={120} height={26} className="hs-logo logo-on-dark" />
                        <Image src="/brand/homesmart-logo.svg" alt="HomeSmart" width={120} height={26} className="hs-logo logo-on-light" />
                    </div>
                    <div className="header-right">
                        <a href="tel:+16024970655" className="phone-link">{t("nav.phone")}</a>
                        <div className="lang" role="group" aria-label="Language">
                            <button type="button" onClick={() => setLang("en")} className={lang === "en" ? "active" : undefined} aria-pressed={lang === "en"}>EN</button>
                            <button type="button" onClick={() => setLang("es")} className={lang === "es" ? "active" : undefined} aria-pressed={lang === "es"}>ES</button>
                        </div>
                        <a href="#register" className="btn btn-gold">{t("nav.cta")}</a>
                    </div>
                </div>
            </header>

            <span id="top" />

            <section className="hero" id="register">
                <div className="wrap hero-grid">
                    {/* Two nested elements on purpose: the outer div is the grid
                        item and stretches to the (tall) row height, which is what
                        gives the inner one room to travel. A sticky grid item that
                        fills its own grid area has nowhere to stick. */}
                    <div className="hero-copy">
                        <div className="hero-copy-sticky">
                            <span className="eyebrow">{t("hero.eyebrow")}</span>
                            <h1 dangerouslySetInnerHTML={html("hero.title")} />
                            <p className="lede">{t("hero.lede")}</p>
                            <ul className="hero-points">
                                <li>{t("hero.p2")}</li>
                                <li>{t("hero.p3")}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="lead-card">
                        <span className="lc-badge">{t("lc.badge")}</span>

                        {!done && (
                            <form onSubmit={handleSubmit} noValidate>
                                <h2>{t("lc.title")}</h2>
                                <p className="sub">{t("lc.sub")}</p>

                                <div className="field full">
                                    <label htmlFor="r-goal">{t("f.goal")}</label>
                                    <select id="r-goal" name="goal" value={form.goal} className={cls("goal")} onChange={(e) => set("goal", e.target.value as Goal)}>
                                        <option value="">{t("f.goal.ph")}</option>
                                        <option value="buy">{t("f.g1")}</option>
                                        <option value="invest">{t("f.g2")}</option>
                                        <option value="info">{t("f.g3")}</option>
                                    </select>
                                    {err("goal")}
                                </div>

                                <div className="form-row">
                                    <div className="field">
                                        <label htmlFor="r-first">{t("f.first")}</label>
                                        <input id="r-first" name="first" autoComplete="given-name" value={form.first} className={cls("first")} onChange={(e) => set("first", e.target.value)} />
                                        {err("first")}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="r-last">{t("f.last")}</label>
                                        <input id="r-last" name="last" autoComplete="family-name" value={form.last} className={cls("last")} onChange={(e) => set("last", e.target.value)} />
                                        {err("last")}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="field">
                                        <label htmlFor="r-email">{t("f.email")}</label>
                                        <input id="r-email" name="email" type="email" autoComplete="email" value={form.email} className={cls("email")} onChange={(e) => set("email", e.target.value)} />
                                        {err("email")}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="r-phone">{t("f.phone")}</label>
                                        <input id="r-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} className={cls("phone")} onChange={(e) => set("phone", e.target.value)} />
                                        {err("phone")}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="field">
                                        <label htmlFor="r-contact">{t("f.contact")}</label>
                                        <select id="r-contact" name="contact" value={form.contact} className={cls("contact")} onChange={(e) => onContactChange(e.target.value as Contact)}>
                                            <option value="">{t("f.contact.ph")}</option>
                                            <option value="call">{t("f.c1")}</option>
                                            <option value="email">{t("f.c2")}</option>
                                            <option value="sms">{t("f.c3")}</option>
                                        </select>
                                        {err("contact")}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="r-besttime">{t("f.besttime")}</label>
                                        <select id="r-besttime" name="besttime" value={form.besttime} className={cls("besttime")} onChange={(e) => set("besttime", e.target.value as BestTime)}>
                                            <option value="">{t("f.besttime.ph")}</option>
                                            <option value="morning">{t("f.h1")}</option>
                                            <option value="afternoon">{t("f.h2")}</option>
                                            <option value="evening">{t("f.h3")}</option>
                                            <option value="any">{t("f.h4")}</option>
                                        </select>
                                        {err("besttime")}
                                    </div>
                                </div>

                                {/* Step 2 — optional LPMAMA pillars. Skipping it sends exactly
                                    the payload this form would send without the block. */}
                                <details className="prep" open={prepOpen} onToggle={(e) => setPrepOpen((e.currentTarget as HTMLDetailsElement).open)}>
                                    <summary>
                                        <span className="prep-t">{t("lp.summary")}</span>
                                        <span className="opt-lbl">{t("f.opt")}</span>
                                        <span className="prep-chev" aria-hidden="true">›</span>
                                    </summary>
                                    <div className="prep-body">
                                        <div className="field full">
                                            <label htmlFor="r-zones">{t("lp.zones")}</label>
                                            <input id="r-zones" name="zones" value={form.zones} placeholder={t("lp.zones.ph")} onChange={(e) => set("zones", e.target.value)} />
                                        </div>
                                        <div className="field full">
                                            <label htmlFor="r-bmin">{t("lp.budget")}</label>
                                            <div className="budget-row">
                                                <div className="money">
                                                    <span>$</span>
                                                    <input id="r-bmin" name="budget_min" inputMode="numeric" placeholder={t("lp.budget.min")} value={form.budget_min} className={cls("budget_min")} onChange={(e) => set("budget_min", e.target.value)} />
                                                </div>
                                                <span className="budget-dash" aria-hidden="true">–</span>
                                                <div className="money">
                                                    <span>$</span>
                                                    <input id="r-bmax" name="budget_max" inputMode="numeric" placeholder={t("lp.budget.max")} value={form.budget_max} onChange={(e) => set("budget_max", e.target.value)} />
                                                </div>
                                            </div>
                                            {err("budget_min")}
                                        </div>
                                        <div className="form-row">
                                            <div className="field">
                                                <label htmlFor="r-timeline">{t("lp.timeline")}</label>
                                                <select id="r-timeline" name="timeline" value={form.timeline} onChange={(e) => set("timeline", e.target.value as Timeline)}>
                                                    <option value="">{t("lp.timeline.ph")}</option>
                                                    <option value="0-3 months">{t("lp.t1")}</option>
                                                    <option value="3-6 months">{t("lp.t2")}</option>
                                                    <option value="6-12 months">{t("lp.t3")}</option>
                                                    <option value="12+ months">{t("lp.t4")}</option>
                                                    <option value="Just exploring">{t("lp.t5")}</option>
                                                </select>
                                            </div>
                                            <div className="field">
                                                <label htmlFor="r-money">{t("lp.money")}</label>
                                                {/* Key stays `preapproved_or_cash` — that's the receiver's
                                                    contract. Only the visible question dropped "or cash". */}
                                                <select id="r-money" name="preapproved_or_cash" value={form.preapproved_or_cash} onChange={(e) => set("preapproved_or_cash", e.target.value as Money)}>
                                                    <option value="">{t("lp.money.ph")}</option>
                                                    <option value="yes">{t("lp.m1")}</option>
                                                    <option value="no">{t("lp.m2")}</option>
                                                    <option value="not_sure">{t("lp.m3")}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </details>

                                <div className="field full">
                                    <label htmlFor="r-notes">
                                        {t("f.notes")} <span className="opt-lbl">{t("f.opt")}</span>
                                    </label>
                                    <textarea id="r-notes" name="notes" rows={3} placeholder={t("f.notes.ph")} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                                </div>

                                {/* Honeypot — invisible to humans, catches bots. */}
                                <input type="text" name="website" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => set("website", e.target.value)} />

                                {/* TCPA + CAN-SPAM. This is the opt-in flow declared in the
                                    Twilio A2P 10DLC campaign — carriers audit it. Do not
                                    simplify to a single blanket checkbox. */}
                                <div className="consent-block">
                                    <h4>{t("cs.title")}</h4>
                                    <p className="cs-note">{t("cs.note")}</p>

                                    <fieldset className="cs-fieldset">
                                        <legend dangerouslySetInnerHTML={html("cs.sms")} />
                                        <div className={`seg${errors.sms_consent ? " err" : ""}`}>
                                            <input type="radio" id="r-sms-yes" name="sms_consent" value="yes" checked={form.sms_consent === "yes"} onChange={() => set("sms_consent", "yes")} />
                                            <label className="opt" htmlFor="r-sms-yes">
                                                <b>{t("cs.yes.t")}</b>
                                                <span>{t("cs.yes.p")}</span>
                                            </label>
                                            <input type="radio" id="r-sms-no" name="sms_consent" value="no" checked={form.sms_consent === "no"} onChange={() => set("sms_consent", "no")} />
                                            <label className="opt" htmlFor="r-sms-no">
                                                <b>{t("cs.no.t")}</b>
                                                <span>{t("cs.no.p")}</span>
                                            </label>
                                        </div>
                                        {err("sms_consent")}
                                    </fieldset>

                                    <label className="consent">
                                        <input type="checkbox" name="marketing_email_consent" checked={form.marketing_email_consent} onChange={(e) => set("marketing_email_consent", e.target.checked)} />
                                        <span>{t("cs.mkt")}</span>
                                    </label>
                                </div>

                                <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={submitting} aria-busy={submitting}>
                                    {submitting ? t("f.sending") : <span dangerouslySetInnerHTML={html("f.submit")} />}
                                </button>
                                {submitError && <div className="err-msg show form-level">{submitError}</div>}
                                <p className="form-meta">{t("f.meta")}</p>
                                <div className="trust-mini">
                                    <span>{t("f.m1")}</span>
                                    <span className="dot" />
                                    <span>{t("f.m2")}</span>
                                </div>
                            </form>
                        )}

                        <div className={`form-success${done ? " show" : ""}`} ref={successRef}>
                            <div className="ok">✓</div>
                            <h3>{t("f.ok.t")}</h3>
                            <p>{t("f.ok.p")}</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="wrap">
                    <div className="footer-grid">
                        <div>
                            <Image src="/brand/logo-negative.svg" alt="Galaviz Group" width={160} height={48} />
                            <p>{t("ft.tag")}</p>
                            {/* ADRE broker disclosure — Galaviz Group is a team
                                operating under HomeSmart; the licensed brokerage
                                has to be named on public advertising. Mirrors
                                components/footer.tsx. */}
                            <p className="ft-disclosure">{t("ft.disclosure")}</p>
                        </div>
                        <div>
                            <h4>{t("ft.contact")}</h4>
                            <ul>
                                <li><a href="mailto:rita@galavizgroup.com">rita@galavizgroup.com</a></li>
                                <li><a href="tel:+16024970655">(602) 497-0655</a></li>
                                <li>{t("ft.area")}</li>
                            </ul>
                        </div>
                        <div>
                            <h4>{t("ft.legal")}</h4>
                            <ul>
                                <li><Link href="/privacy-policy">{t("ft.privacy")}</Link></li>
                                <li><Link href="/terms">{t("ft.terms")}</Link></li>
                                <li><Link href="/">{t("ft.home")}</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span>© {YEAR} {t("ft.copy")}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
