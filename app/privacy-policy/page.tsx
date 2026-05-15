import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "Privacy Policy for Galaviz Legacy Group, including SMS messaging disclosure required by TCPA.",
    alternates: { canonical: "https://galavizgroup.com/privacy-policy" },
};

export default function PrivacyPolicy() {
    return (
        <LegalShell title="Privacy Policy" lastUpdated="May 15, 2026">
            <p>
                Galaviz Legacy Group (&ldquo;<strong>we</strong>,&rdquo; &ldquo;
                <strong>us</strong>,&rdquo; or &ldquo;
                <strong>our</strong>&rdquo;) respects your privacy. This Privacy
                Policy explains how we collect, use, and disclose information
                from visitors and clients of <strong>galavizgroup.com</strong>{" "}
                and our related real estate services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>When you interact with us, we may collect:</p>
            <ul>
                <li>
                    <strong>Identity and contact information</strong> — name,
                    email address, telephone number, and mailing address that
                    you provide through our forms or correspondence.
                </li>
                <li>
                    <strong>Inquiry content</strong> — the message or notes you
                    submit, along with the interest you select (buying,
                    selling, both, or investing).
                </li>
                <li>
                    <strong>Communication preferences</strong> — your explicit
                    opt-in or opt-out for SMS text messages and your optional
                    marketing email opt-in, captured at the time of submission.
                </li>
                <li>
                    <strong>Technical metadata</strong> — IP address, browser
                    type, device, and timestamp captured automatically when you
                    submit our form, used to evidence consent and prevent
                    abuse.
                </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>
                    Respond to your inquiries and provide real estate
                    representation services.
                </li>
                <li>
                    Send transactional communications about your inquiry,
                    showing requests, offers, listings, transactions, and
                    closings.
                </li>
                <li>
                    Send SMS text messages only after you have provided
                    explicit opt-in consent (see Section 3 below).
                </li>
                <li>
                    Send marketing emails (market updates, new listings,
                    promotions) only if you have separately opted in to
                    marketing email.
                </li>
                <li>
                    Maintain records required by the Arizona Department of
                    Real Estate, the Internal Revenue Service, and applicable
                    federal and state law.
                </li>
                <li>
                    Improve our website, services, and security.
                </li>
            </ul>

            <h2>3. SMS Messaging Disclosure</h2>
            <div className="callout">
                <p>
                    By providing your phone number and opting in, you consent
                    to receive SMS messages from Galaviz Legacy Group. Message
                    frequency varies. Message and data rates may apply. Reply
                    HELP for help, STOP to unsubscribe. We will not share or
                    sell your phone number or SMS opt-in consent to third
                    parties or affiliates for marketing purposes.
                </p>
            </div>
            <p>
                SMS consent is captured explicitly through a YES/NO selection
                on our contact form, or through a verbal or written opt-in
                recorded by one of our licensed agents at the time of
                engagement. You may opt out at any time by replying{" "}
                <strong>STOP</strong> to any text message we send you. For
                help, reply <strong>HELP</strong> or contact us at the email
                and phone number listed in Section 9.
            </p>

            <h2>4. Information Sharing</h2>
            <p>
                <strong>
                    We do not sell or share your phone number or SMS opt-in
                    data for marketing purposes.
                </strong>{" "}
                Information you provide is used internally by Galaviz Legacy
                Group and its licensed real estate professionals. We may share
                information with:
            </p>
            <ul>
                <li>
                    Service providers acting on our behalf (e.g., transactional
                    email, CRM, SMS gateway providers) under written
                    confidentiality and data-protection terms.
                </li>
                <li>
                    Title, escrow, lending, and inspection partners as needed
                    to complete a transaction you have authorized.
                </li>
                <li>
                    Regulators, courts, or law enforcement when required by
                    law or to protect our legal rights.
                </li>
            </ul>

            <h2>5. Data Retention</h2>
            <p>
                We retain contact records for a minimum of seven (7) years
                following the conclusion of an engagement, consistent with
                Arizona Department of Real Estate broker recordkeeping
                requirements and IRS guidance. We retain opt-out and revocation
                records permanently to honor your preferences across future
                interactions.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
                <li>
                    Access the personal information we hold about you.
                </li>
                <li>
                    Request correction of inaccurate information.
                </li>
                <li>
                    Request deletion of your information, subject to the
                    recordkeeping obligations described in Section 5.
                </li>
                <li>
                    Opt out of SMS or marketing email at any time (reply STOP
                    to any text, click the unsubscribe link in any marketing
                    email, or contact us using the details in Section 9).
                </li>
            </ul>

            <h2>7. Children&apos;s Privacy</h2>
            <p>
                Our services are not directed to individuals under 18 years of
                age. We do not knowingly collect personal information from
                children. If you believe a child has provided personal
                information, please contact us and we will delete it.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. The
                &ldquo;Last updated&rdquo; date at the top of this page
                reflects the most recent revision. Material changes will be
                communicated through a notice on the home page or by email
                where appropriate.
            </p>

            <h2>9. Contact</h2>
            <p>
                For privacy questions, opt-out requests, or any matter related
                to this Policy, contact us at:
            </p>
            <p>
                <strong>Galaviz Legacy Group</strong>
                <br />
                2955 E Mallory St, Mesa, AZ 85213
                <br />
                Email: <a href="mailto:rita@galavizgroup.com">rita@galavizgroup.com</a>
                <br />
                Phone: <a href="tel:+16024970655">(602) 497-0655</a>
            </p>
        </LegalShell>
    );
}
