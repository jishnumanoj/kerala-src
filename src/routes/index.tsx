import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { HouseThemeProvider } from "@/components/site/HouseTheme";
import { Header } from "@/components/site/Header";
import { Hero, Intro, Projects } from "@/components/site/SectionsTop";
import {
  Overview,
  Services,
  Philosophy,
  ImageBreak,
  Process,
  Studio,
} from "@/components/site/SectionsMid";
import {
  Stats,
  Testimonials,
  Social,
  FinalCTA,
  Footer,
} from "@/components/site/SectionsEnd";
import { Enquiry } from "@/components/site/Enquiry";
import { HouseTour } from "@/components/site/HouseTour";
import { WhatsAppButton, ConsultationPopup } from "@/components/site/FloatingActions";

const title = "D'Casa Homes — Traditional Kerala Homes & Architecture";
const description =
  "D'Casa Homes designs and builds traditional Kerala-inspired homes in Ernakulam and Thrissur, featuring terracotta tiled roofs, timber detailing, shaded verandahs and courtyards.";


export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          name: "D'Casa Homes",
          description,
          url: "/",
          sameAs: ["https://www.instagram.com/"],
        }),
      },
    ],
  }),
});

function Index() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <HouseThemeProvider>
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Intro />
        <Projects />
        <HouseTour />
        <Overview />
        <Services />
        <Philosophy />
        <ImageBreak />
        <Process />
        <Studio />
        <Stats />
        <Testimonials />
        <Social />
        <FinalCTA />
        <Enquiry />
      </main>
      <Footer />
      <WhatsAppButton />
      <ConsultationPopup />
      <Toaster />
    </div>
    </HouseThemeProvider>
  );
}
