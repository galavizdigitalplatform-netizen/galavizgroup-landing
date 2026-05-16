import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    display: "swap",
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    display: "swap",
});

const SITE_URL = "https://galavizgroup.com";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Galaviz Group — Arizona Real Estate",
        template: "%s · Galaviz Group",
    },
    description:
        "Galaviz Group helps Arizona families buy, sell, and invest in real estate across the Phoenix metro. Expert representation, clear process, lasting outcomes.",
    keywords: [
        "Arizona real estate",
        "Phoenix metro real estate",
        "real estate broker Arizona",
        "buy home Phoenix",
        "sell home Phoenix",
        "Mesa real estate",
        "Scottsdale real estate",
        "Chandler real estate",
        "Galaviz Group",
    ],
    authors: [{ name: "Galaviz Group" }],
    creator: "Galaviz Group",
    publisher: "Galaviz Group",
    alternates: { canonical: SITE_URL },
    openGraph: {
        type: "website",
        url: SITE_URL,
        title: "Galaviz Group — Arizona Real Estate",
        description:
            "Helping Arizona families buy, sell, and invest with confidence. Phoenix metropolitan area.",
        siteName: "Galaviz Group",
        locale: "en_US",
        images: [
            {
                url: "/hero-arizona.jpg",
                width: 2400,
                height: 1600,
                alt: "Arizona home at golden hour",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Galaviz Group — Arizona Real Estate",
        description:
            "Helping Arizona families buy, sell, and invest with confidence.",
        images: ["/hero-arizona.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${playfair.variable} ${inter.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-background text-foreground">
                {children}
            </body>
        </html>
    );
}
