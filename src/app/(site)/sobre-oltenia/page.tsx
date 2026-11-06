import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PhotoGallery } from "@/components/PhotoGallery";
import { getCompany } from "@/content/company";
import { getSeoSettings } from "@/content/pages";
import { approvedPhotos } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { envSite, isIndexable } from "@/lib/site";
import { pageEntityData } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const [company, seo] = await Promise.all([getCompany(), getSeoSettings()]);
  const indexable = isIndexable(envSite, company.publication.approved);
  return pageMetadata(
    { title: "Quiénes somos", description: `Conoce al equipo de ${company.brand.name}.`, path: "/sobre-oltenia" },
    { company, indexable, seo: seo.sobreOltenia },
  );
}

export default async function AboutPage() {
  const company = await getCompany();
  const indexable = isIndexable(envSite, company.publication.approved);
  const { team } = company.intro;
  const teamPhotos = [...company.photos.team, ...company.photos.workplace];

  return (
    <>
      <div className="pt-14 sm:pt-20">
        <Container>
          <h1 className="text-3xl font-bold sm:text-4xl">Equipo</h1>
          {team.length > 0 ? (
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-muted">
              {team.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ) : null}

          <div className="mt-14 space-y-16 sm:mt-16">
            {company.teamMembers.map((member, index) => {
              const photo = member.photo ? approvedPhotos([member.photo])[0] : undefined;
              const reversed = index % 2 === 1;
              const gridCols = reversed ? "sm:grid-cols-[1fr_20rem]" : "sm:grid-cols-[20rem_1fr]";
              const photoCol = reversed ? "sm:col-start-2" : "sm:col-start-1";
              const textCol = reversed ? "sm:col-start-1" : "sm:col-start-2";
              return (
                <div key={member.name} className={`grid gap-8 ${photo ? `${gridCols} sm:items-start` : ""}`}>
                  {photo ? (
                    <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-navy-100 ${photoCol} sm:row-start-1`}>
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 640px) 320px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className={`${textCol} sm:row-start-1`}>
                    <h2 className="text-2xl font-bold sm:text-3xl">{member.name}</h2>
                    <p className="mt-1 text-sm font-bold uppercase tracking-[0.08em] text-accent">{member.role}</p>
                    <div className="mt-4 space-y-4 text-lg leading-relaxed text-muted">
                      {member.bio.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </div>

      {approvedPhotos(teamPhotos).length > 0 ? (
        <div className="border-t border-line bg-white py-14 sm:py-20">
          <Container>
            <PhotoGallery photos={teamPhotos} title="Equipo y lugar de trabajo" headingId="fotos-equipo-titulo" />
          </Container>
        </div>
      ) : null}

      <div className="py-14">
        <Container>
          <section
            aria-labelledby="unete-titulo"
            className="flex flex-col gap-5 rounded-xl bg-white p-8 shadow-sm ring-1 ring-line sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 id="unete-titulo" className="text-2xl font-bold">
                ¿Quieres trabajar en {company.brand.name}?
              </h2>
              <p className="mt-2 text-lg leading-relaxed">Cuéntanos tu experiencia en ventilación o climatización.</p>
            </div>
            <ButtonLink href="/trabaja-con-nosotros" className="shrink-0">
              Trabaja con nosotros
            </ButtonLink>
          </section>
        </Container>
      </div>

      <JsonLd
        data={pageEntityData({
          company,
          indexable,
          path: "/sobre-oltenia",
          type: "AboutPage",
          name: "Quiénes somos",
          description: `Conoce al equipo de ${company.brand.name}.`,
        })}
      />
    </>
  );
}
