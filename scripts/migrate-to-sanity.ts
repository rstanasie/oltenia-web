/**
 * One-time (and repeatable) migration: seeds Sanity with the content that
 * currently lives in this repository, so the owners can start editing from
 * real starting values instead of a blank Studio.
 *
 *   npm run sanity:migrate
 *
 * Safe to re-run: every document uses a stable, predictable _id and is
 * created with createIfNotExists AFTER checking it doesn't already exist —
 * so nothing is ever overwritten. Once an owner edits a document in Studio,
 * this script leaves it alone on every future run. Image files are only
 * uploaded the first time, for the same reason (no duplicate assets pile up
 * on repeat runs).
 *
 * Requires SANITY_API_WRITE_TOKEN (a token with "Editor" or "Administrator"
 * access) — see .env.example. This is a separate, higher-privilege token
 * from the read-only one the website uses; never commit it, never put it in
 * a NEXT_PUBLIC_ variable.
 */
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { createClient, type SanityClient } from "@sanity/client";

const root = process.cwd();
loadEnvConfig(root, false);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("Falta NEXT_PUBLIC_SANITY_PROJECT_ID. Configura .env.local antes de migrar (ver README.md § Sanity).");
  process.exit(1);
}
if (!token) {
  console.error("Falta SANITY_API_WRITE_TOKEN. Crea un token con permiso de Editor en manage.sanity.io y añádelo a .env.local.");
  process.exit(1);
}

const client: SanityClient = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const imageCache = new Map<string, { _type: "image"; asset: { _type: "reference"; _ref: string } }>();

async function uploadImage(publicPath: string) {
  if (imageCache.has(publicPath)) return imageCache.get(publicPath)!;
  const absolute = path.join(root, "public", publicPath);
  if (!existsSync(absolute)) {
    throw new Error(`No existe el archivo ${absolute}. Revisa la ruta en scripts/migrate-to-sanity.ts.`);
  }
  const asset = await client.assets.upload("image", createReadStream(absolute), { filename: path.basename(absolute) });
  const value = { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
  imageCache.set(publicPath, value);
  return value;
}

/** Creates a document only if it doesn't exist yet, and only uploads its images in that case — so re-running never re-uploads or overwrites owner edits. */
async function ensureDocument(id: string, type: string, build: () => Promise<Record<string, unknown>>) {
  const existing = await client.fetch<string | null>(`*[_id == $id][0]._id`, { id });
  if (existing) {
    console.log(`– ya existe, no se toca: ${id}`);
    return;
  }
  const fields = await build();
  await client.createIfNotExists({ _id: id, _type: type, ...fields });
  console.log(`✓ creado: ${id}`);
}

async function main() {
  console.log(`Migrando contenido a Sanity (proyecto ${projectId}, dataset ${dataset})…\n`);

  // ---- Singletons -----------------------------------------------------
  await ensureDocument("siteSettings", "siteSettings", async () => ({
    brandName: "Oltenia",
    locationCity: "Zaragoza",
    locationCountry: "España",
    publicationApproved: false,
  }));

  await ensureDocument("companyInfo", "companyInfo", async () => ({
    shortIntro: "Oltenia es una empresa de ventilación, climatización y aire acondicionado con sede en Zaragoza.",
    team: [
      "Oltenia está dirigida por sus fundadores, Sorin y Mihaela Tanasie. Juntos reúnen más de 25 años de experiencia en el sector y comparten la responsabilidad de cada proyecto: desde las decisiones técnicas en obra hasta la organización que permite llevarlo adelante.",
      "Además de la dirección, Oltenia cuenta con un equipo de profesionales contratados que llevan a cabo las instalaciones en cada proyecto.",
    ],
    history: [],
    workingApproach: [],
    certifications: [],
    serviceSectors: [],
    brands: [],
  }));

  await ensureDocument("contactInfo", "contactInfo", async () => ({
    customerPhone: "+34625352933",
    customerWhatsapp: "+34625352933",
    customerEmail: null,
    customerAddress: {
      _type: "postalAddress",
      street: "C/ Antonio Sangenis, 62",
      postalCode: "50010",
      locality: "Zaragoza",
      province: "Zaragoza",
      country: "España",
    },
    openingHours: [],
    recruitmentSameAsCustomer: false,
    recruitmentPhone: "+34642871023",
    recruitmentEmail: "olteniaconducciones@yahoo.es",
    recruitmentWhatsappMessage:
      "Hola, me interesa trabajar en Oltenia. Me gustaría consultar si tenéis oportunidades disponibles. Mi experiencia es…",
    recruitmentEmailSubject: "Quiero trabajar en Oltenia",
    recruitmentEmailBody:
      "Hola,\n\nme interesa trabajar en Oltenia. Me gustaría consultar si tenéis oportunidades disponibles.\n\nMi experiencia es…\n\nMi disponibilidad es…\n",
  }));

  await ensureDocument("legalInfo", "legalInfo", async () => ({
    termsOfUse: [],
    intellectualProperty: [],
    applicableLaw: [],
    purposes: [],
    recipients: [],
    legalBases: [],
    retentionPeriods: [],
    reviewed: false,
  }));

  await ensureDocument("homePage", "homePage", async () => ({
    heroEyebrow: "Base en Zaragoza · alcance nacional",
    heroHeadline: "Ventilación y climatización",
    heroSubtext:
      "Instalamos sistemas de climatización y ventilación con base en Zaragoza y alcance regional. Conoce nuestro trabajo y descubre cómo formar parte del equipo.",
    primaryCtaLabel: "Trabaja con nosotros",
    secondaryCtaLabel: "Conoce nuestros servicios",
  }));

  await ensureDocument("servicesPage", "servicesPage", async () => ({
    heroEyebrow: "Qué hacemos",
    heroHeading: "El recorrido del aire",
    heroIntroPara1:
      "Cuando entras en un edificio bien acondicionado, no piensas en el aire que respiras. Pero detrás de esa sensación de confort hay un recorrido completo: equipos que tratan el aire, conductos que lo transportan y salidas que lo reparten donde sea necesario.",
    heroIntroPara2:
      "Hacer posible ese recorrido exige más que montar piezas: hay que interpretar planos, tomar medidas y resolver cómo encaja la instalación en una obra donde cada espacio plantea retos distintos. Es un oficio que combina precisión, habilidad manual y criterio técnico, y en el que siempre hay algo nuevo que aprender.",
  }));

  await ensureDocument("recruitmentPage", "recruitmentPage", async () => ({
    heroEyebrow: `Empleo · Zaragoza`,
    heroHeadline: "Un oficio que se aprende trabajando",
    heroSubtext:
      "Detrás de cada instalación hay conocimientos, precisión y experiencia. Descubre cómo es trabajar en ventilación y climatización en Zaragoza y todo lo que puedes llegar a aprender",
    primaryCtaLabel: "Puestos abiertos",
  }));

  // Confirmed general statements only — anything not explicitly confirmed stays empty
  // and is listed for the owners instead (see CONTENT_CHECKLIST.md).
  await ensureDocument("workingConditions", "workingConditions", async () => ({
    employmentStatement: "Contratación formalizada correctamente, con retribución transparente y pagos puntuales.",
    scheduleStatement: "Jornada completa.",
    collectiveAgreementStatement: "Convenio Colectivo de Industria, Tecnología y Servicios del Metal de Zaragoza.",
    vacationStatement: "30 días naturales de vacaciones retribuidas al año.",
    siteSafetyStatement:
      "La empresa cumple con la normativa de prevención de riesgos laborales (Ley 31/1995): formación y equipos de protección adecuados a cada tarea.",
    vehicleArrangementNote: "Desplazamientos de trabajo a cargo de la empresa.",
    travelTimeStatement: "Los desplazamientos de trabajo se cuentan y se pagan como tiempo de trabajo.",
    trainingStatement: "Cursos de formación autorizados, financiados por la empresa.",
    overtimeStatement:
      "Las horas extra son voluntarias: se registran y se compensan según los términos y límites legales aplicables.",
    companyBaseNote: "La base de Oltenia es el punto de encuentro del equipo antes de salir a cada obra — con su máquina de café de rigor.",
  }));

  await ensureDocument("seoSettings", "seoSettings", async () => ({}));

  await ensureDocument("enDetallePage", "enDetallePage", async () => ({
    introText:
      "Instalar ventilación y climatización bien hecha exige entender cómo se comporta el aire, cómo encajan las piezas y qué detalles marcan la diferencia. Aquí compartimos ese conocimiento con más profundidad: los procesos y la experiencia que hay detrás de nuestro trabajo.",
    experienceHeading: "Nuestra experiencia en fabricación",
    experienceBody:
      "Hoy en Oltenia nos dedicamos a instalar sistemas de ventilación y climatización. Durante años, antes de eso, también fabricamos nosotros mismos las piezas y los conductos que instalábamos, y queremos conservar ese conocimiento. Las fotografías que siguen pertenecen a esa etapa anterior.",
    archiveNote: "Archivo de Oltenia · Fabricación propia de una etapa anterior",
    overviewImage: {
      ...(await uploadImage("/images/proyectos/taller-fabricacion-conductos-01.jpg")),
      alt: "Vista general del taller, con distintas piezas de conducto fabricadas y una plegadora de chapa al fondo.",
    },
    step1Heading: "De una medida a una pieza",
    step1Body:
      "Cada conducto partía de una necesidad concreta: una medida, una dirección, un espacio por el que tenía que pasar el aire. A partir de ahí, la chapa se cortaba y se conformaba hasta darle la forma exacta que ese tramo necesitaba, a veces con un corte en ángulo para adaptarse a un cambio de dirección.",
    step1Image: {
      ...(await uploadImage("/images/proyectos/taller-fabricacion-conductos-03.jpg")),
      alt: "Pieza de conducto con un corte en ángulo, fabricada a medida para adaptarse a un cambio de dirección.",
    },
    step2Heading: "Donde se jugaba la precisión: uniones y perfiles",
    step2Body:
      "Dos tramos nunca se unían con una soldadura de más. El borde de la chapa se plegaba para encajar con el siguiente tramo sin soldadura, y cada esquina llevaba sus propios herrajes y tornillería de montaje.",
    step2ImageA: {
      ...(await uploadImage("/images/proyectos/taller-fabricacion-conductos-04.jpg")),
      alt: "Detalle del pliegue de chapa que une dos tramos de conducto sin soldadura.",
    },
    step2ImageB: {
      ...(await uploadImage("/images/proyectos/taller-fabricacion-conductos-05.jpg")),
      alt: "Detalle de una esquina de conducto con herrajes y tornillería de montaje.",
    },
    step2BodyExtra:
      "Algunas uniones incorporaban un tramo flexible, pensado para absorber pequeños desajustes de montaje. Cada esquina y cada tornillo se revisaban a mano antes de dar la pieza por terminada.",
    step2ImageC: {
      ...(await uploadImage("/images/proyectos/taller-fabricacion-conductos-06.jpg")),
      alt: "Detalle de una unión flexible entre dos tramos de conducto.",
    },
    step2ImageD: {
      ...(await uploadImage("/images/proyectos/taller-fabricacion-conductos-07.jpg")),
      alt: "Detalle de una esquina de conducto con una unión flexible y tornillería de montaje.",
    },
    step3Heading: "De la pieza a la instalación",
    step3Body:
      "Antes de salir hacia la obra, cada tramo se preparaba a medida para un proyecto concreto. Así llegaban varias piezas fabricadas para una misma instalación, listas para ocupar su lugar en el recorrido del aire.",
    step3Image: {
      ...(await uploadImage("/images/proyectos/taller-fabricacion-conductos-02.jpg")),
      alt: "Conductos rectangulares fabricados a medida, apilados en el taller y listos para una misma instalación.",
    },
    closingText:
      "Ya no fabricamos nosotros mismos estas piezas. Pero ese conocimiento —cómo encajan, qué detalles importan, cómo se adapta cada tramo al recorrido del aire— sigue presente en cómo trabajamos hoy, instalación a instalación.",
  }));

  // ---- Team members -----------------------------------------------------
  await ensureDocument("teamMember-sorin-tanasie", "teamMember", async () => ({
    name: "Sorin Tanasie",
    role: "Cofundador · Director técnico y ejecutivo",
    order: 1,
    bio: [
      "Graduado en Electrónica y Computación por la Universidad de Craiova, Sorin comenzó su trayectoria en mantenimiento de instalaciones energéticas y, posteriormente, como responsable de mantenimiento de un buque de mercancías en Sudáfrica.",
      "Tras llegar a España y trabajar brevemente en construcción, inició su recorrido en ventilación y climatización en Barajas. Allí adquirió la experiencia que le llevaría a emprender por cuenta propia.",
      "Su trayectoria combina conocimientos técnicos, trabajo en obra y gestión de proyectos: una experiencia que hoy aporta a la dirección de Oltenia.",
    ],
    photo: { ...(await uploadImage("/images/equipo/sorin-tanasie.jpg")), alt: "Sorin Tanasie, cofundador y director técnico y ejecutivo de Oltenia." },
  }));

  await ensureDocument("teamMember-mihaela-tanasie", "teamMember", async () => ({
    name: "Mihaela Tanasie",
    role: "Cofundadora · Directora de administración y finanzas",
    order: 2,
    bio: [
      "Mihaela se encarga de la organización administrativa de Oltenia. Coordina las finanzas y la contabilidad, la contratación y la gestión de personal, así como los contratos, las compras y los pagos.",
      "Antes de esta etapa, trabajó en el sector bancario en Craiova, en limpieza hospitalaria y en restauración, en establecimientos como La Piemontesa y Trastevere.",
      "Esa experiencia en entornos distintos forma parte de su recorrido hasta asumir la gestión diaria de la empresa.",
    ],
    photo: { ...(await uploadImage("/images/equipo/mihaela-tanasie.jpg")), alt: "Mihaela Tanasie, cofundadora y directora de administración y finanzas de Oltenia." },
  }));

  await ensureDocument("teamMember-victor", "teamMember", async () => ({
    name: "Víctor Grumezescu",
    role: "Oficial de primera · 5 años en Oltenia",
    order: 3,
    bio: [
      "Graduado en Ciencias Sociales por el IES Corona de Aragón, Víctor cuenta con una trayectoria variada que incluye experiencias en restauración y mecánica, además de un notable talento para los bailes populares rumanos.",
      "Tras cinco años en Oltenia, ha alcanzado la categoría de oficial de primera, asumiendo cada vez mayores responsabilidades en obra. Participa en la organización de los trabajos, coordina tareas cuando es necesario y se preocupa por el bienestar de sus compañeros. Y, sobre todo, por el suyo propio.",
    ],
    photo: { ...(await uploadImage("/images/equipo/victor.jpg")), alt: "Víctor, oficial de primera en Oltenia." },
  }));

  // ---- Services -----------------------------------------------------
  await ensureDocument("service-ventilacion", "service", async () => ({
    serviceId: "ventilacion",
    name: "Ventilación",
    order: 1,
    summary: "La ventilación renueva el aire interior y extrae el aire viciado, la humedad y los olores. Es la base de un ambiente interior sano en viviendas, locales y edificios.",
    activities: [],
    details: [],
  }));
  await ensureDocument("service-climatizacion", "service", async () => ({
    serviceId: "climatizacion",
    name: "Climatización",
    order: 2,
    summary: "La climatización controla la temperatura y la calidad del aire durante todo el año, combinando calefacción, refrigeración y tratamiento del aire según cada espacio.",
    activities: [],
    details: [],
  }));
  await ensureDocument("service-aire-acondicionado", "service", async () => ({
    serviceId: "aire-acondicionado",
    name: "Aire acondicionado",
    order: 3,
    summary: "El aire acondicionado enfría y deshumidifica el ambiente para mantener una temperatura cómoda en los meses de calor.",
    activities: [],
    details: [],
  }));

  // ---- Project photos (the 7 fabrication-archive photos live only in enDetallePage above) ----
  const projectPhotos: { id: string; file: string; alt: string; caption: string; order: number }[] = [
    { id: "photo-fachada-01", file: "instalacion-conductos-fachada-01.jpg", alt: "Conductos de ventilación de chapa galvanizada instalados en la fachada de un edificio en obra.", caption: "Conductos en exterior", order: 1 },
    { id: "photo-fachada-02", file: "instalacion-conductos-fachada-02.jpg", alt: "Red de conductos rectangulares con codos instalada en el exterior de un edificio.", caption: "Conductos en exterior", order: 2 },
    { id: "photo-fachada-03", file: "instalacion-conductos-fachada-03.jpg", alt: "Detalle de los codos y tramos de conducto de ventilación fijados a la fachada.", caption: "Conductos en exterior", order: 3 },
    { id: "photo-fachada-04", file: "instalacion-conductos-fachada-04.jpg", alt: "Conductos rectangulares con varios cambios de dirección instalados en la fachada de un edificio, sobre soportes metálicos.", caption: "Conductos en exterior", order: 4 },
    { id: "photo-fachada-05", file: "instalacion-conductos-fachada-05.jpg", alt: "Tramo de conducto rectangular con transiciones de dirección instalado en el exterior de un edificio en obra.", caption: "Conductos en exterior", order: 5 },
    { id: "photo-climatizacion-planta-industrial-02", file: "climatizacion-planta-industrial-02.jpg", alt: "Red de conductos de climatización aislados conectando distintos niveles de una planta industrial.", caption: "Conductos en exterior", order: 6 },
    { id: "photo-nave-01", file: "instalacion-conductos-nave-01.jpg", alt: "Conducto de ventilación aislado instalado en el techo de una nave industrial, sobre una zona de descarga.", caption: "Conductos en interior", order: 7 },
    { id: "photo-nave-02", file: "instalacion-conductos-nave-02.jpg", alt: "Unidad de tratamiento de aire conectada a dos conductos circulares que atraviesan la cubierta de una nave industrial.", caption: "Conductos en interior", order: 8 },
    { id: "photo-nave-05", file: "instalacion-conductos-nave-05.jpg", alt: "Conductos de ventilación circulares instalados junto a la cubierta de una nave industrial.", caption: "Conductos en interior", order: 9 },
    { id: "photo-textiles-01", file: "conductos-textiles-01.jpg", alt: "Dos conductos textiles instalados en la cumbrera de una nave, con toberas de difusión repartidas a lo largo del recorrido.", caption: "Conductos textiles y difusión del aire", order: 10 },
    { id: "photo-textiles-02", file: "conductos-textiles-02.jpg", alt: "Conductos textiles de distribución de aire instalados en el techo de un almacén, sobre una zona de palés.", caption: "Conductos textiles y difusión del aire", order: 11 },
    { id: "photo-textiles-03", file: "conductos-textiles-03.jpg", alt: "Conductos textiles de difusión de aire instalados sobre una zona de muelles de carga.", caption: "Conductos textiles y difusión del aire", order: 12 },
    { id: "photo-textiles-04", file: "conductos-textiles-04.jpg", alt: "Detalle de la tela y las toberas de difusión de un conducto textil.", caption: "Conductos textiles y difusión del aire", order: 13 },
    { id: "photo-textiles-05", file: "conductos-textiles-05.jpg", alt: "Conducto circular con toberas de difusión repartidas a lo largo del recorrido, instalado en una nave industrial.", caption: "Conductos textiles y difusión del aire", order: 14 },
    { id: "photo-aire-acondicionado-exterior-01", file: "aire-acondicionado-exterior-01.jpg", alt: "Unidad exterior de aire acondicionado instalada sobre bancada de hormigón en una cubierta.", caption: "Equipos de climatización", order: 15 },
    { id: "photo-equipos-climatizacion-01", file: "equipos-climatizacion-01.jpg", alt: "Unidad de tratamiento de aire con panel de control, conectada a conductos circulares en el interior de una nave.", caption: "Equipos de climatización", order: 16 },
    { id: "photo-equipos-climatizacion-02", file: "equipos-climatizacion-02.jpg", alt: "Equipo de climatización de gran formato instalado en la cubierta de un edificio.", caption: "Equipos de climatización", order: 17 },
  ];

  for (const p of projectPhotos) {
    await ensureDocument(p.id, "photo", async () => ({
      image: await uploadImage(`/images/proyectos/${p.file}`),
      alt: p.alt,
      caption: p.caption,
      collection: "proyectos",
      isHistoricalArchive: false,
      publicationApproved: true,
      order: p.order,
    }));
  }

  // ---- Vacancies ----
  // Salary removed (2026-11-07, owner-directed): no salaryRange is seeded on any
  // vacancy below. The "Salario" section on each /puestos/[slug] page and the
  // JobPosting baseSalary already hide themselves automatically when salaryRange
  // is empty, so this is a placeholder for the next version — fill salaryRange in
  // Sanity Studio once confirmed bands are approved, see CONTENT_CHECKLIST.md.
  const applicationInstructions = "Adjunta tu currículum en el siguiente formulario; no hace falta nada más para presentarte.";

  await ensureDocument("vacancy-peon-ayudante", "vacancy", async () => ({
    title: "Peón / Ayudante",
    slug: { _type: "slug", current: "peon-ayudante" },
    status: "open",
    shortDescription: "Primeros pasos",
    location: "Zaragoza",
    order: 1,
    summary:
      "El punto de partida en el oficio: te incorporas a un equipo de instalación para familiarizarte con las herramientas, los materiales y la forma de trabajar en obra.",
    responsibilities: [
      "Apoyar a instaladores con más experiencia en el montaje de conductos.",
      "Preparar la zona de trabajo y los materiales antes de cada tarea.",
      "Aprender los procedimientos básicos de seguridad en obra.",
    ],
    essentialRequirements: ["Buena actitud y ganas de aprender el oficio.", "Compromiso con el trabajo diario en obra."],
    desirableRequirements: ["Experiencia previa en construcción u otro oficio manual."],
    learningOpportunities: [
      "Cómo funciona un equipo de instalación de principio a fin.",
      "Manejo de herramientas y materiales de conductos.",
      "Procedimientos de seguridad en obra.",
    ],
    applicationInstructions,
  }));

  await ensureDocument("vacancy-oficial-tercera", "vacancy", async () => ({
    title: "Oficial de tercera",
    slug: { _type: "slug", current: "oficial-tercera" },
    status: "open",
    shortDescription: "Montaje supervisado",
    location: "Zaragoza",
    order: 2,
    summary: "El siguiente paso tras los primeros meses en obra: montas bajo la guía de compañeros con más experiencia, ganando precisión y soltura.",
    responsibilities: [
      "Realizar tareas básicas de instalación bajo supervisión.",
      "Montar soportes y sistemas de anclaje.",
      "Iniciarte en la lectura de planos técnicos.",
    ],
    essentialRequirements: ["Algo de experiencia previa en montaje o construcción.", "Atención al detalle y disposición a seguir indicaciones."],
    desirableRequirements: ["Conocimientos básicos de lectura de planos."],
    learningOpportunities: ["Montaje de conductos con precisión.", "Interpretación de planos técnicos.", "Técnicas de instalación en distintos tipos de obra."],
    applicationInstructions,
  }));

  await ensureDocument("vacancy-oficial-segunda", "vacancy", async () => ({
    title: "Oficial de segunda",
    slug: { _type: "slug", current: "oficial-segunda" },
    status: "open",
    shortDescription: "Trabajo autónomo",
    location: "Zaragoza",
    order: 3,
    summary: "Trabajas con autonomía en el día a día, sin necesitar supervisión constante.",
    responsibilities: [
      "Realizar instalaciones habituales con independencia creciente.",
      "Interpretar planos técnicos sin supervisión constante.",
      "Montar tramos completos de conducto.",
      "Resolver problemas técnicos habituales en obra.",
    ],
    essentialRequirements: ["Experiencia demostrable en montaje de conductos.", "Capacidad para trabajar con autonomía."],
    desirableRequirements: ["Experiencia en distintos tipos de edificio (naves, locales, viviendas)."],
    learningOpportunities: ["Planificación de una instalación completa.", "Resolución práctica de problemas en obra."],
    applicationInstructions,
  }));

  await ensureDocument("vacancy-oficial-primera", "vacancy", async () => ({
    title: "Oficial de primera",
    slug: { _type: "slug", current: "oficial-primera" },
    status: "open",
    shortDescription: "Resolución técnica",
    location: "Zaragoza",
    order: 4,
    summary: "El nivel con más autonomía en obra: resuelves instalaciones complejas y apoyas al resto del equipo cuando hace falta.",
    responsibilities: [
      "Realizar instalaciones técnicamente exigentes.",
      "Adaptar conductos a espacios complejos.",
      "Resolver imprevistos de instalación.",
      "Apoyar y orientar a compañeros con menos experiencia.",
    ],
    essentialRequirements: ["Experiencia consolidada en instalación de conductos.", "Capacidad para resolver problemas técnicos sin supervisión."],
    desirableRequirements: ["Experiencia apoyando o coordinando a otros instaladores."],
    learningOpportunities: ["Instalaciones de alta complejidad técnica.", "Coordinación práctica de tareas en obra."],
    applicationInstructions,
  }));

  console.log("\nMigración completada.");
}

main().catch((error) => {
  console.error("\nLa migración falló:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
