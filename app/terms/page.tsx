import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description:
        "Terms and Conditions for Galaviz Legacy Group, including SMS program terms required by TCPA and US wireless carriers.",
    alternates: { canonical: "https://galavizgroup.com/terms" },
};

export default function Terms() {
    return (
        <LegalShell title="Terms & Conditions" lastUpdated="May 15, 2026">
            <p>
                These Terms and Conditions (the &ldquo;<strong>Terms</strong>
                &rdquo;) govern your use of <strong>galavizgroup.com</strong>{" "}
                and the services provided by Galaviz Legacy Group (&ldquo;
                <strong>we</strong>,&rdquo; &ldquo;<strong>us</strong>,&rdquo;
                or &ldquo;<strong>our</strong>&rdquo;). By using the website
                or submitting our contact form, you agree to these Terms.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
                Your use of the site, submission of any form, or engagement
                with our services constitutes your acceptance of these Terms
                and our{" "}
                <a href="/privacy-policy">Privacy Policy</a>. If you do not
                agree, please do not use the site or submit information.
            </p>

            <h2>2. Real Estate Services</h2>
            <p>
                Galaviz Legacy Group is a licensed real estate brokerage
                operating under the Arizona Department of Real Estate
                (&ldquo;ADRE&rdquo;). Information provided on this site is for
                general informational purposes only and does not constitute
                legal, tax, financial, or investment advice. You should
                consult a qualified attorney, accountant, or financial
                professional before making decisions related to a real estate
                transaction.
            </p>

            <h2>3. SMS Program Terms</h2>
            <div className="callout">
                <p>
                    <strong>Program:</strong> Galaviz Legacy Group customer
                    care messaging.
                </p>
                <p>
                    <strong>Message frequency:</strong> Variable (typically
                    1–4 messages per week per active engagement).
                </p>
                <p>
                    <strong>Carriers supported:</strong> T-Mobile, AT&amp;T,
                    Verizon, US Cellular, Sprint, Boost, Cricket, MetroPCS.
                </p>
                <p>
                    <strong>
                        Message and data rates may apply.
                    </strong>{" "}
                    Your wireless carrier&apos;s standard rates apply to all
                    messages sent or received as part of this program. We are
                    not responsible for your carrier&apos;s fees.
                </p>
                <p>
                    <strong>For help</strong> text <strong>HELP</strong> to{" "}
                    <strong>(602) 497-0655</strong> or email{" "}
                    <a href="mailto:rita@galavizgroup.com">
                        rita@galavizgroup.com
                    </a>
                    .
                </p>
                <p>
                    <strong>To opt out</strong> text <strong>STOP</strong> to{" "}
                    <strong>(602) 497-0655</strong> at any time. You will
                    receive a confirmation that you have been unsubscribed.
                    Standard opt-out keywords (STOP, STOPALL, UNSUBSCRIBE,
                    CANCEL, END, QUIT) are honored automatically.
                </p>
            </div>
            <p>
                You consent to the SMS program through an explicit opt-in on
                our contact form, a verbal or written opt-in recorded by a
                licensed agent, or by replying <strong>YES</strong> to a
                double opt-in invitation sent to your phone number. We will
                not text you for any purpose unless you have provided that
                consent. We do not share or sell your phone number or SMS
                opt-in data for marketing purposes.
            </p>

            <h2>4. No Guarantees</h2>
            <p>
                Market predictions, neighborhood comparisons, and property
                valuations presented through our services are estimates based
                on data available at the time. Actual outcomes vary. We do
                not guarantee specific sale prices, timelines, or rental
                income.
            </p>

            <h2>5. Limitation of Liability</h2>
            <p>
                To the maximum extent permitted by Arizona law, Galaviz Legacy
                Group, its agents, employees, and affiliates are not liable
                for indirect, incidental, special, consequential, or punitive
                damages arising out of or related to your use of the site or
                services. Our total liability for any direct damages will not
                exceed the amount actually paid by you, if any, for the
                services giving rise to the claim.
            </p>

            <h2>6. Indemnification</h2>
            <p>
                You agree to indemnify and hold harmless Galaviz Legacy Group,
                its agents, and its affiliates from any claims, damages, or
                expenses arising from your misuse of the site, breach of
                these Terms, or violation of applicable law.
            </p>

            <h2>7. Governing Law</h2>
            <p>
                These Terms are governed by the laws of the State of Arizona,
                without regard to its conflict of laws principles. Any
                dispute arising out of or related to these Terms or the
                services shall be resolved exclusively in the state or
                federal courts located in Maricopa County, Arizona, and you
                consent to the personal jurisdiction of those courts.
            </p>

            <h2>8. Severability &amp; Entire Agreement</h2>
            <p>
                If any provision of these Terms is found invalid or
                unenforceable, the remaining provisions remain in full force
                and effect. These Terms, together with our{" "}
                <a href="/privacy-policy">Privacy Policy</a>, constitute the
                entire agreement between you and Galaviz Legacy Group with
                respect to your use of the site, superseding any prior
                agreement.
            </p>

            <h2>9. Contact</h2>
            <p>
                Questions about these Terms? Contact:
            </p>
            <p>
                <strong>Galaviz Legacy Group</strong>
                <br />
                2955 E Mallory St, Mesa, AZ 85213
                <br />
                Email:{" "}
                <a href="mailto:rita@galavizgroup.com">rita@galavizgroup.com</a>
                <br />
                Phone: <a href="tel:+16024970655">(602) 497-0655</a>
            </p>
        </LegalShell>
    );
}
