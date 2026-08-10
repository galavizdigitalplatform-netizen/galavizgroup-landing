import type { Metadata } from "next";
import { RegistroLanding } from "@/components/registro/registro-landing";
import "./registro.css";

const SITE_URL = "https://galavizgroup.com";

export const metadata: Metadata = {
    title: "Buy or Invest in Arizona Real Estate",
    description:
        "Tell us what you're looking for and our team will send you matching buy or investment opportunities across the Phoenix metro.",
    alternates: { canonical: `${SITE_URL}/registro` },
    /*
     * `openGraph` and `twitter` REPLACE the root layout's blocks — they are not
     * merged. Both are spelled out here on purpose: without `images` this page
     * shipped with no og:image at all and fell back to the root's twitter:image
     * (the hero photo), and without a `twitter` block its card carried the HOME
     * page's title and description. Add a field to one, add it to both.
     */
    openGraph: {
        type: "website",
        url: `${SITE_URL}/registro`,
        title: "Galaviz Group — Buy or Invest in Arizona Real Estate",
        description:
            "Tell us what you're looking for and our team will send you matching opportunities across the Phoenix metro.",
        siteName: "Galaviz Group",
        images: [
            {
                url: "/og-galaviz.png",
                width: 1200,
                height: 630,
                alt: "Galaviz Group — a real estate team at HomeSmart",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Galaviz Group — Buy or Invest in Arizona Real Estate",
        description:
            "Tell us what you're looking for and our team will send you matching opportunities across the Phoenix metro.",
        images: ["/og-galaviz.png"],
    },
};

/**
 * /registro — standalone lead-capture landing for paid campaigns.
 *
 * Renders without the site Nav/Footer on purpose: the whole point is a page
 * with exactly one thing to do. It brings its own header and footer.
 */
export default function RegistroPage() {
    return <RegistroLanding />;
}
