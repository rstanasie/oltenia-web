import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import type { ReactNode } from "react";
import { DraftModeBanner } from "@/components/DraftModeBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { PreviewBanner } from "@/components/PreviewBanner";
import { getCompany } from "@/content/company";
import { isIndexable } from "@/lib/site";
import { localBusinessData, organizationData } from "@/lib/structured-data";
import { SanityLive } from "@/sanity/lib/live";
import { envSite } from "@/lib/site";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-heading", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  const indexable = isIndexable(envSite, company.publication.approved);
  return {
    metadataBase: envSite.siteUrl ?? undefined,
    title: {
      default: `${company.brand.name} · Ventilación y climatización en ${company.location.city}`,
      template: `%s | ${company.brand.name}`,
    },
    description: company.intro.short,
    applicationName: company.brand.name,
    formatDetection: { telephone: false, email: false, address: false },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#14283f",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [company, { isEnabled: isDraftMode }] = await Promise.all([getCompany(), draftMode()]);
  const indexable = isIndexable(envSite, company.publication.approved);

  return (
    <html lang="es" data-scroll-behavior="smooth" className={spaceGrotesk.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenido"
          className="sr-only z-50 rounded-md bg-navy-900 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <DraftModeBanner />
        <PreviewBanner indexable={indexable} />
        <Header />
        <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <JsonLd data={organizationData(company, indexable)} />
        <JsonLd data={localBusinessData(company, indexable)} />
        <SanityLive />
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  );
}
