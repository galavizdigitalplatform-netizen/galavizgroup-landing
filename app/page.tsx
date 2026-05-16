import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
    return (
        <>
            <Nav />
            <main className="flex-1">
                <Hero />
                <Services />
                <ContactSection />
            </main>
            <Footer />
        </>
    );
}
