import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { LightboxProvider } from "@/components/Lightbox";
import { NarrativePhoto } from "@/components/NarrativePhoto";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { getCompany } from "@/content/company";
import { getServicesPage, getSeoSettings } from "@/content/pages";
import type { Photo } from "@/content/types";
import { findPhoto, hasCustomerContact, photosByCaptions, sectorLabels } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { envSite, isIndexable } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [company, seo] = await Promise.all([getCompany(), getSeoSettings()]);
  const indexable = isIndexable(envSite, company.publication.approved);
  return pageMetadata(
    {
      title: "Servicios",
      description: `Ventilación, climatización y aire acondicionado en ${company.location.city}. Conoce las áreas de trabajo de ${company.brand.name}.`,
      path: "/servicios",
    },
    { company, indexable, seo: seo.servicios },
  );
}

function onlyPhotos(photos: (Photo | null)[]): Photo[] {
  return photos.filter((p): p is Photo => p !== null);
}

export default async function ServicesPage() {
  const [company, page] = await Promise.all([getCompany(), getServicesPage()]);
  const { sectors, serviceArea, brands } = company.serviceDetails;
  const facts = [
    sectors.length > 0 && { label: "Tipos de trabajo", value: sectors.map((s) => sectorLabels[s]).join(", ") },
    serviceArea && { label: "Zona de trabajo", value: serviceArea },
    brands.length > 0 && { label: "Marcas", value: brands.join(", ") },
    company.certifications.length > 0 && { label: "Certificaciones", value: company.certifications.join(", ") },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  const projects = company.photos.projects;
  const pick = (src: string) => findPhoto(projects, `/images/proyectos/${src}`);

  const heroPhoto = pick("instalacion-conductos-fachada-01.jpg");
  const equipmentPhotos = onlyPhotos([
    pick("equipos-climatizacion-01.jpg"),
    pick("equipos-climatizacion-02.jpg"),
    pick("aire-acondicionado-exterior-01.jpg"),
  ]);
  const exteriorDuctPhotos = onlyPhotos([pick("instalacion-conductos-fachada-03.jpg"), pick("instalacion-conductos-fachada-04.jpg")]);
  const interiorDuctPhotos = onlyPhotos([pick("instalacion-conductos-nave-01.jpg"), pick("instalacion-conductos-nave-05.jpg")]);
  const diffusionMainPhoto = pick("conductos-textiles-01.jpg");
  const diffusionSidePhotos = onlyPhotos([pick("conductos-textiles-02.jpg"), pick("conductos-textiles-04.jpg")]);
  const returnPhoto = pick("instalacion-conductos-nave-02.jpg");

  const exploreCategories = [
    { id: "conductos-exterior", title: "Conductos en exterior", photos: photosByCaptions(projects, ["Conductos en exterior"]) },
    { id: "conductos-interior", title: "Conductos en interior", photos: photosByCaptions(projects, ["Conductos en interior"]) },
    {
      id: "conductos-textiles",
      title: "Conductos textiles y toberas",
      photos: photosByCaptions(projects, ["Conductos textiles y difusión del aire"]),
    },
    { id: "equipos-climatizacion", title: "Equipos de climatización", photos: photosByCaptions(projects, ["Equipos de climatización"]) },
  ].filter((category) => category.photos.length > 0);

  return (
    <LightboxProvider>
      <div className="border-b border-line bg-white">
        <Container className="py-14 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent">{page.heroEyebrow}</p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{page.heroHeading}</h1>
              {page.heroIntroPara1 ? <p className="mt-4 text-lg leading-relaxed text-muted">{page.heroIntroPara1}</p> : null}
              {page.heroIntroPara2 ? <p className="mt-4 text-lg leading-relaxed text-muted">{page.heroIntroPara2}</p> : null}
            </div>
            <div className="pointer-events-none hidden flex-col gap-14 sm:gap-16 lg:flex">
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 400 200"
                className="h-48 w-full text-navy-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                preserveAspectRatio="none"
              >
                <path d="M0 60 C 120 40, 200 100, 400 70" />
                <path d="M0 110 C 140 90, 220 150, 400 120" />
                <path d="M0 160 C 160 140, 240 200, 400 170" />
              </svg>
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 400 200"
                className="h-48 w-full text-navy-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                preserveAspectRatio="none"
              >
                <path d="M0 60 C 120 40, 200 100, 400 70" />
                <path d="M0 110 C 140 90, 220 150, 400 120" />
                <path d="M0 160 C 160 140, 240 200, 400 170" />
              </svg>
            </div>
          </div>
        </Container>
      </div>

      <div className="py-14 sm:py-20">
        <Container>
          {/* 1. Climatización y ventilación */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div>
              <h2 className="text-2xl font-bold">Climatización y ventilación: dos trabajos distintos</h2>
              <p className="mt-3 max-w-prose leading-relaxed text-muted">
                La climatización se encarga de la temperatura: calienta en invierno y refresca en verano para que
                el espacio sea cómodo durante todo el año.
              </p>
              <p className="mt-3 max-w-prose leading-relaxed text-muted">
                La ventilación, en cambio, se ocupa del aire en sí: lo renueva, retira el aire viciado y evita que
                se acumulen olores o humedad.
              </p>
              <p className="mt-3 max-w-prose leading-relaxed text-muted">
                Son trabajos distintos, pero van de la mano. En {company.brand.name} instalamos los equipos y
                conductos que hacen posible ambos, adaptados a cada edificio.
              </p>
            </div>
            <NarrativePhoto photo={heroPhoto} aspect="aspect-[4/3]" priority />
          </div>

          {/* 2. Equipos */}
          <div className="mt-14 sm:mt-16">
            <h2 className="text-2xl font-bold">El equipo que trata y mueve el aire</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Todo empieza en el equipo: una máquina que calienta, enfría o renueva el aire antes de enviarlo al
              edificio. Según el proyecto, puede ser una unidad de tratamiento de aire, un equipo de climatización
              de gran formato o una unidad exterior de aire acondicionado.
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              Cada equipo se conecta a los conductos que distribuirán ese aire por el espacio.
            </p>
            {equipmentPhotos.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {equipmentPhotos.map((photo) => (
                  <NarrativePhoto key={photo.src} photo={photo} sizes="(min-width: 640px) 33vw, 100vw" />
                ))}
              </div>
            ) : null}
          </div>

          {/* 3. Conductos */}
          <div id="conductos-camino-del-aire" className="mt-14 scroll-mt-24 sm:mt-16">
            <h2 className="text-2xl font-bold">Conductos: el camino del aire</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Desde el equipo, el aire viaja a través de conductos metálicos, por fuera o por dentro del edificio.
              El recorrido depende del espacio disponible: a veces va por la fachada, otras veces se esconde sobre
              un falso techo o recorre una nave industrial de punta a punta.
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              Cada tramo se adapta a la distribución del edificio: cambios de dirección, transiciones de tamaño y
              uniones pensadas para que el aire llegue sin perder fuerza.
            </p>
            {exteriorDuctPhotos.length > 0 || interiorDuctPhotos.length > 0 ? (
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                {exteriorDuctPhotos.length > 0 ? (
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.1em] text-accent">En el exterior</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {exteriorDuctPhotos.map((photo) => (
                        <NarrativePhoto key={photo.src} photo={photo} sizes="(min-width: 640px) 25vw, 50vw" />
                      ))}
                    </div>
                  </div>
                ) : null}
                {interiorDuctPhotos.length > 0 ? (
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.1em] text-accent">En el interior</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {interiorDuctPhotos.map((photo) => (
                        <NarrativePhoto key={photo.src} photo={photo} sizes="(min-width: 640px) 25vw, 50vw" />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* 4. Difusión */}
          <div className="mt-14 sm:mt-16">
            <h2 className="text-2xl font-bold">Difusión: el aire llega donde debe</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Llevar el aire a una sala no es suficiente: también hay que repartirlo bien. Las toberas dirigen
              chorros de aire hacia zonas concretas, mientras que los conductos textiles lo reparten de forma más
              suave, a través de un tejido permeable o de perforaciones a lo largo de su recorrido.
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              La elección depende del espacio: una nave industrial, un almacén o una zona de trabajo no necesitan
              la misma salida de aire.
            </p>
            {diffusionMainPhoto || diffusionSidePhotos.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
                <NarrativePhoto photo={diffusionMainPhoto} aspect="aspect-[4/3] sm:aspect-auto sm:h-full" />
                {diffusionSidePhotos.length > 0 ? (
                  <div className="grid gap-4 sm:grid-rows-2">
                    {diffusionSidePhotos.map((photo) => (
                      <NarrativePhoto key={photo.src} photo={photo} sizes="(min-width: 640px) 25vw, 100vw" />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* 5. Retorno y extracción */}
          <div className="mt-14 grid gap-8 sm:mt-16 lg:grid-cols-[1fr_18rem] lg:items-center lg:gap-12">
            <div>
              <h2 className="text-2xl font-bold">Qué pasa después: retorno y extracción</h2>
              <p className="mt-3 max-w-prose leading-relaxed text-muted">
                El recorrido del aire no siempre termina al llegar a la sala. En muchas instalaciones, parte del
                aire vuelve al equipo a través de un conducto de retorno, donde se trata de nuevo antes de volver a
                circular. Otras veces, el aire se extrae y se expulsa al exterior, llevándose el calor, la humedad
                o los contaminantes que ya no hacen falta dentro.
              </p>
              <p className="mt-3 max-w-prose leading-relaxed text-muted">
                No todas las instalaciones incluyen los mismos elementos: cada proyecto se diseña según las
                necesidades del espacio.
              </p>
            </div>
            <NarrativePhoto photo={returnPhoto} />
          </div>
        </Container>
      </div>

      {exploreCategories.length > 0 ? (
        <section aria-labelledby="explora-titulo" className="bg-white py-14 sm:py-20">
          <Container>
            <h2 id="explora-titulo" className="text-3xl font-bold sm:text-4xl">
              Explora nuestro trabajo
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
              Estas fotos están organizadas por tipo de trabajo. Recorre cada categoría para ver más ejemplos.
            </p>
            <div className="mt-10 space-y-12 sm:space-y-16">
              {exploreCategories.map((category) => (
                <div key={category.id} id={category.id} className="scroll-mt-24">
                  <h3 className="text-xl font-bold sm:text-2xl">{category.title}</h3>
                  <div className="mt-5">
                    <PhotoCarousel photos={category.photos} />
                  </div>
                </div>
              ))}
            </div>

            <div
              aria-labelledby="descubre-oficio-titulo"
              className="mt-12 flex flex-col gap-5 rounded-xl border-l-8 border-accent bg-paper p-8 shadow-sm ring-1 ring-line sm:mt-16 sm:flex-row sm:items-center sm:justify-between"
            >
              <p id="descubre-oficio-titulo" className="max-w-xl text-lg leading-relaxed text-navy-900">
                Detrás de cada instalación hay un proceso de fabricación. Conoce los detalles y la experiencia que
                forman parte de nuestro trabajo.
              </p>
              <ButtonLink href="/en-detalle" variant="secondary" className="shrink-0">
                En detalle
              </ButtonLink>
            </div>
          </Container>
        </section>
      ) : null}

      {facts.length > 0 ? (
        <section aria-labelledby="detalles-titulo" className="bg-white py-14">
          <Container>
            <h2 id="detalles-titulo" className="text-2xl font-bold sm:text-3xl">
              Detalles
            </h2>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="border-l-4 border-accent pl-4">
                  <dt className="text-sm font-bold uppercase tracking-[0.12em] text-muted">{fact.label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-navy-900">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      {hasCustomerContact(company) ? (
        <section aria-labelledby="consulta-titulo" className="on-dark bg-navy-900 py-14 text-white">
          <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="consulta-titulo" className="text-2xl font-bold text-white sm:text-3xl">
                ¿Tienes una consulta?
              </h2>
              <p className="mt-2 text-lg text-navy-200">Consulta nuestros datos de contacto.</p>
            </div>
            <ButtonLink href="/contacto">Contactar</ButtonLink>
          </Container>
        </section>
      ) : null}
    </LightboxProvider>
  );
}
