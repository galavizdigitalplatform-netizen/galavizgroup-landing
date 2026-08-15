import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";

/**
 * Titulares en **Source Serif 4** — serif transicional de contraste bajo.
 * Sustituye a Playfair Display, que por ser Didone afilaba los trazos finos
 * en el hero (88px) y sonaba a editorial de moda, no a asesoría inmobiliaria.
 *
 * ⚠️ `axes: ["opsz"]` no es opcional, y por eso tampoco se declara `weight`:
 * Source Serif 4 tiene eje óptico (8..60). Al fijar pesos estáticos, next/font
 * sirve el corte para texto chico —más ancho y de menos contraste— y el hero
 * pierde el afinado. Mismo motivo que Newsreader en app/registro/layout.tsx.
 * La variable cubre 400 y 600, los dos únicos pesos que usa `font-display`.
 */
const sourceSerif = Source_Serif_4({
    variable: "--font-source-serif",
    subsets: ["latin"],
    axes: ["opsz"],
    display: "swap",
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    // 700 y 800 los usa /registro (botones y versalitas). La home no los usa;
    // agregarlos aquí evita descargar Inter dos veces.
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
                url: "/og-galaviz.png",
                width: 1200,
                height: 630,
                alt: "Galaviz Group — a real estate team at HomeSmart",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Galaviz Group — Arizona Real Estate",
        description:
            "Helping Arizona families buy, sell, and invest with confidence.",
        images: ["/og-galaviz.png"],
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
            className={`${sourceSerif.variable} ${inter.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-background text-foreground">
                {children}
            </body>
        </html>
    );
}
