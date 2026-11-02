import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { NarrativePhoto } from "@/components/NarrativePhoto";
import { getCompany } from "@/content/company";
import { getEnDetallePage } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";
import { envSite, isIndexable } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  const indexable = isIndexable(envSite, company.publication.approved);
  return pageMetadata(
    {
      title: "En detalle",
      description: `El oficio detrás de las instalaciones de ${company.brand.name}, incluida su experiencia en fabricación.`,
      path: "/en-detalle",
    },
    { company, indexable },
  );
}

export default async function EnDetallePage() {
  const page = await getEnDetallePage();

  return (
    <>
      <div className="py-14 sm:py-20">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent">En detalle</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">El oficio detrás de cada instalación</h1>
          {page.introText ? <p className="mt-4 text-lg leading-relaxed text-muted">{page.introText}</p> : null}

          <div className="mt-14 sm:mt-16">
            <h2 className="text-2xl font-bold sm:text-3xl">{page.experienceHeading}</h2>
            {page.experienceBody ? <p className="mt-4 leading-relaxed text-muted">{page.experienceBody}</p> : null}
            {page.archiveNote ? <p className="mt-3 text-sm italic text-muted">{page.archiveNote}</p> : null}

            {page.overviewImage ? (
              <div className="mt-8">
                <NarrativePhoto photo={page.overviewImage} aspect="aspect-[4/3] sm:aspect-[16/9]" priority />
              </div>
            ) : null}

            <div className="mt-12">
              <h3 className="text-xl font-bold">{page.step1Heading}</h3>
              {page.step1Body ? <p className="mt-3 leading-relaxed text-muted">{page.step1Body}</p> : null}
              {page.step1Image ? (
                <div className="mt-5">
                  <NarrativePhoto photo={page.step1Image} aspect="aspect-[4/3] sm:aspect-[16/9]" />
                </div>
              ) : null}
            </div>

            <div id="uniones-perfiles" className="mt-12 scroll-mt-24">
              <h3 className="text-xl font-bold">{page.step2Heading}</h3>
              {page.step2Body ? <p className="mt-3 leading-relaxed text-muted">{page.step2Body}</p> : null}
              {page.step2ImageA || page.step2ImageB ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <NarrativePhoto photo={page.step2ImageA} sizes="(min-width: 640px) 50vw, 100vw" />
                  <NarrativePhoto photo={page.step2ImageB} sizes="(min-width: 640px) 50vw, 100vw" />
                </div>
              ) : null}

              {page.step2BodyExtra ? <p className="mt-6 leading-relaxed text-muted">{page.step2BodyExtra}</p> : null}
              {page.step2ImageC || page.step2ImageD ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <NarrativePhoto photo={page.step2ImageC} sizes="(min-width: 640px) 50vw, 100vw" />
                  <NarrativePhoto photo={page.step2ImageD} sizes="(min-width: 640px) 50vw, 100vw" />
                </div>
              ) : null}
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-bold">{page.step3Heading}</h3>
              {page.step3Body ? <p className="mt-3 leading-relaxed text-muted">{page.step3Body}</p> : null}
              {page.step3Image ? (
                <div className="mt-5">
                  <NarrativePhoto photo={page.step3Image} aspect="aspect-[4/3] sm:aspect-[16/9]" />
                </div>
              ) : null}
            </div>

            {page.closingText ? <p className="mt-12 text-lg leading-relaxed text-muted">{page.closingText}</p> : null}
          </div>
        </Container>
      </div>
    </>
  );
}
