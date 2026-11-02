import type { CareerStage, RelatedContentLink } from "@/data/careerStages";
import type {
  CompanyContent,
  ContractType,
  PostalAddress,
  Sector,
  Service,
  ServiceActivity,
  ServiceId,
  TeamMember,
  Vacancy,
} from "@/content/types";
import { toPhoto, type SanityPhotoFragment } from "@/sanity/lib/image";

type RawAddress = { street?: string; postalCode?: string; locality?: string; province?: string; country?: string } | null;
type RawOpeningHour = { days?: string; hours?: string };

function toAddress(raw: RawAddress): PostalAddress | null {
  if (!raw || !raw.street || !raw.postalCode || !raw.locality || !raw.province || !raw.country) return null;
  return { street: raw.street, postalCode: raw.postalCode, locality: raw.locality, province: raw.province, country: raw.country };
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export type RawSeoEntry = { metaTitle?: string | null; metaDescription?: string | null } | null | undefined;

export type RawSiteQueryResult = {
  siteSettings: {
    brandName?: string;
    logo?: SanityPhotoFragment;
    locationCity?: string;
    locationCountry?: string;
    publicationApproved?: boolean;
    approvedBy?: string | null;
    approvedOn?: string | null;
  } | null;
  companyInfo: {
    shortIntro?: string;
    history?: string[];
    team?: string[];
    workingApproach?: string[];
    certifications?: string[];
    serviceSectors?: Sector[];
    serviceArea?: string | null;
    brands?: string[];
  } | null;
  contactInfo: {
    customerPhone?: string | null;
    customerWhatsapp?: string | null;
    customerEmail?: string | null;
    customerAddress?: RawAddress;
    customerMapUrl?: string | null;
    openingHours?: RawOpeningHour[];
    recruitmentSameAsCustomer?: boolean;
    recruitmentPhone?: string | null;
    recruitmentWhatsapp?: string | null;
    recruitmentEmail?: string | null;
    recruitmentWhatsappMessage?: string;
    recruitmentEmailSubject?: string;
    recruitmentEmailBody?: string;
  } | null;
  legalInfo: {
    legalName?: string | null;
    taxId?: string | null;
    registeredAddress?: RawAddress;
    registryDetails?: string | null;
    legalEmail?: string | null;
    dataControllerName?: string | null;
    dataControllerAddress?: RawAddress;
    dataControllerEmail?: string | null;
    rightsContact?: string | null;
    termsOfUse?: string[];
    intellectualProperty?: string[];
    applicableLaw?: string[];
    purposes?: string[];
    recipients?: string[];
    legalBases?: string[];
    retentionPeriods?: string[];
    lastReviewed?: string | null;
    reviewed?: boolean;
  } | null;
  homePage: { heroEyebrow?: string; heroHeadline?: string; heroSubtext?: string; primaryCtaLabel?: string; secondaryCtaLabel?: string } | null;
  servicesPage: { heroEyebrow?: string; heroHeading?: string; heroIntroPara1?: string; heroIntroPara2?: string } | null;
  recruitmentPage: { heroEyebrow?: string; heroHeadline?: string; heroSubtext?: string; primaryCtaLabel?: string; secondaryCtaLabel?: string } | null;
  enDetallePage: {
    introText?: string;
    experienceHeading?: string;
    experienceBody?: string;
    archiveNote?: string;
    overviewImage?: SanityPhotoFragment;
    step1Heading?: string;
    step1Body?: string;
    step1Image?: SanityPhotoFragment;
    step2Heading?: string;
    step2Body?: string;
    step2ImageA?: SanityPhotoFragment;
    step2ImageB?: SanityPhotoFragment;
    step2BodyExtra?: string;
    step2ImageC?: SanityPhotoFragment;
    step2ImageD?: SanityPhotoFragment;
    step3Heading?: string;
    step3Body?: string;
    step3Image?: SanityPhotoFragment;
    closingText?: string;
  } | null;
  seoSettings: {
    home?: RawSeoEntry;
    servicios?: RawSeoEntry;
    sobreOltenia?: RawSeoEntry;
    trabajaConNosotros?: RawSeoEntry;
    contacto?: RawSeoEntry;
  } | null;
  teamMembers: { name?: string; role?: string; bio?: string[]; photo?: SanityPhotoFragment }[];
  services: {
    serviceId?: ServiceId;
    name?: string;
    summary?: string;
    activities?: ServiceActivity[];
    details?: string[];
    photo?: SanityPhotoFragment;
  }[];
  vacancies: {
    id?: string | null;
    status?: "open" | "closed";
    title?: string;
    datePosted?: string | null;
    validThrough?: string | null;
    location?: string | null;
    summary?: string | null;
    responsibilities?: string[];
    requiredExperience?: string[];
    requiredQualifications?: string[];
    drivingLicence?: string | null;
    schedule?: string | null;
    contractType?: ContractType | null;
    salaryRange?: { min: number; max: number; period: "hora" | "mes" | "año"; gross: boolean } | null;
    benefits?: string[];
    applicationInstructions?: string | null;
  }[];
  photos: (SanityPhotoFragment & { collection?: "proyectos" | "equipo" | "instalaciones"; isHistoricalArchive?: boolean })[];
  careerStages: {
    id?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    responsibilities?: string[];
    competencies?: string[];
    quote?: string | null;
    note?: string | null;
    relatedContent?: RelatedContentLink[];
    order?: number;
  }[];
};

/** Builds the app's existing CompanyContent shape from the raw Sanity query result, so every
 * existing component and page keeps working against the same types it always has. */
export function toCompanyContent(raw: RawSiteQueryResult): CompanyContent {
  const projectPhotos = raw.photos.filter((p) => (p.collection ?? "proyectos") === "proyectos" && !p.isHistoricalArchive);
  const teamPhotos = raw.photos.filter((p) => p.collection === "equipo");
  const workplacePhotos = raw.photos.filter((p) => p.collection === "instalaciones");

  const teamMembers: TeamMember[] = raw.teamMembers.map((m) => ({
    name: m.name ?? "",
    role: m.role ?? "",
    bio: strings(m.bio),
    photo: toPhoto(m.photo ?? null),
  }));

  const services: Service[] = raw.services.map((s) => ({
    id: (s.serviceId ?? "ventilacion") as ServiceId,
    name: s.name ?? "",
    summary: s.summary ?? "",
    activities: (s.activities ?? []) as ServiceActivity[],
    details: strings(s.details),
    photo: toPhoto(s.photo ?? null),
  }));

  const logoPhoto = toPhoto(raw.siteSettings?.logo ?? null);

  const vacancies: Vacancy[] = raw.vacancies.map((v) => ({
    id: v.id ?? "",
    status: v.status ?? "closed",
    title: v.title ?? "",
    datePosted: v.datePosted ?? null,
    validThrough: v.validThrough ?? null,
    location: v.location ?? null,
    summary: v.summary ?? null,
    responsibilities: strings(v.responsibilities),
    requiredExperience: strings(v.requiredExperience),
    requiredQualifications: strings(v.requiredQualifications),
    drivingLicence: v.drivingLicence ?? null,
    schedule: v.schedule ?? null,
    contractType: v.contractType ?? null,
    salaryRange: v.salaryRange ? { ...v.salaryRange, currency: "EUR" } : null,
    benefits: strings(v.benefits),
    applicationInstructions: v.applicationInstructions ?? null,
  }));

  return {
    publication: {
      approved: raw.siteSettings?.publicationApproved ?? false,
      approvedBy: raw.siteSettings?.approvedBy ?? null,
      approvedOn: raw.siteSettings?.approvedOn ?? null,
    },
    brand: {
      name: raw.siteSettings?.brandName ?? "Oltenia",
      logo: logoPhoto ? { src: logoPhoto.src, width: logoPhoto.width, height: logoPhoto.height } : null,
    },
    location: {
      city: raw.siteSettings?.locationCity ?? "Zaragoza",
      country: raw.siteSettings?.locationCountry ?? "España",
    },
    intro: {
      short: raw.companyInfo?.shortIntro ?? "",
      history: strings(raw.companyInfo?.history),
      team: strings(raw.companyInfo?.team),
      workingApproach: strings(raw.companyInfo?.workingApproach),
    },
    teamMembers,
    customerContact: {
      phone: raw.contactInfo?.customerPhone ?? null,
      whatsapp: raw.contactInfo?.customerWhatsapp ?? null,
      email: raw.contactInfo?.customerEmail ?? null,
      address: toAddress(raw.contactInfo?.customerAddress ?? null),
      mapUrl: raw.contactInfo?.customerMapUrl ?? null,
      openingHours: (raw.contactInfo?.openingHours ?? [])
        .filter((h): h is { days: string; hours: string } => Boolean(h.days && h.hours)),
    },
    recruitmentContact: {
      sameAsCustomer: raw.contactInfo?.recruitmentSameAsCustomer ?? true,
      channels: {
        phone: raw.contactInfo?.recruitmentPhone ?? null,
        whatsapp: raw.contactInfo?.recruitmentWhatsapp ?? null,
        email: raw.contactInfo?.recruitmentEmail ?? null,
      },
    },
    recruitment: {
      whatsappMessage: raw.contactInfo?.recruitmentWhatsappMessage ?? "",
      emailSubject: raw.contactInfo?.recruitmentEmailSubject ?? "",
      emailBody: raw.contactInfo?.recruitmentEmailBody ?? "",
    },
    services,
    serviceDetails: {
      sectors: raw.companyInfo?.serviceSectors ?? [],
      serviceArea: raw.companyInfo?.serviceArea ?? null,
      brands: strings(raw.companyInfo?.brands),
    },
    certifications: strings(raw.companyInfo?.certifications),
    vacancies,
    photos: {
      projects: projectPhotos.map((p) => toPhoto(p)).filter((p): p is NonNullable<typeof p> => p !== null),
      team: teamPhotos.map((p) => toPhoto(p)).filter((p): p is NonNullable<typeof p> => p !== null),
      workplace: workplacePhotos.map((p) => toPhoto(p)).filter((p): p is NonNullable<typeof p> => p !== null),
    },
    legal: {
      legalName: raw.legalInfo?.legalName ?? null,
      taxId: raw.legalInfo?.taxId ?? null,
      registeredAddress: toAddress(raw.legalInfo?.registeredAddress ?? null),
      registryDetails: raw.legalInfo?.registryDetails ?? null,
      legalEmail: raw.legalInfo?.legalEmail ?? null,
      dataController:
        raw.legalInfo?.dataControllerName && raw.legalInfo.dataControllerEmail && toAddress(raw.legalInfo.dataControllerAddress ?? null)
          ? {
              name: raw.legalInfo.dataControllerName,
              address: toAddress(raw.legalInfo.dataControllerAddress ?? null)!,
              email: raw.legalInfo.dataControllerEmail,
            }
          : null,
      rightsContact: raw.legalInfo?.rightsContact ?? null,
      termsOfUse: strings(raw.legalInfo?.termsOfUse),
      intellectualProperty: strings(raw.legalInfo?.intellectualProperty),
      applicableLaw: strings(raw.legalInfo?.applicableLaw),
      purposes: strings(raw.legalInfo?.purposes),
      recipients: strings(raw.legalInfo?.recipients),
      legalBases: strings(raw.legalInfo?.legalBases),
      retentionPeriods: strings(raw.legalInfo?.retentionPeriods),
      lastReviewed: raw.legalInfo?.lastReviewed ?? null,
      reviewed: raw.legalInfo?.reviewed ?? false,
    },
  };
}

export function toCareerStages(raw: RawSiteQueryResult["careerStages"]): CareerStage[] {
  return raw.map((s, index) => ({
    id: s.id ?? `stage-${index}`,
    displayOrder: s.order ?? index + 1,
    title: s.title ?? "",
    subtitle: s.subtitle ?? "",
    description: s.description ?? "",
    responsibilities: strings(s.responsibilities),
    competencies: strings(s.competencies),
    quote: s.quote ?? undefined,
    note: s.note ?? undefined,
    relatedContent: s.relatedContent ?? [],
  }));
}

export type HomePageContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtext: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

export function toHomePage(raw: RawSiteQueryResult["homePage"]): HomePageContent {
  return {
    heroEyebrow: raw?.heroEyebrow ?? "Base en Zaragoza · alcance nacional",
    heroHeadline: raw?.heroHeadline ?? "Ventilación y climatización",
    heroSubtext:
      raw?.heroSubtext ??
      "Instalamos sistemas de climatización y ventilación. Conoce nuestro trabajo y descubre cómo formar parte del equipo.",
    primaryCtaLabel: raw?.primaryCtaLabel ?? "Trabaja con nosotros",
    secondaryCtaLabel: raw?.secondaryCtaLabel ?? "Conoce nuestros servicios",
  };
}

export type ServicesPageContent = {
  heroEyebrow: string;
  heroHeading: string;
  heroIntroPara1: string;
  heroIntroPara2: string;
};

export function toServicesPage(raw: RawSiteQueryResult["servicesPage"]): ServicesPageContent {
  return {
    heroEyebrow: raw?.heroEyebrow ?? "Qué hacemos",
    heroHeading: raw?.heroHeading ?? "El recorrido del aire",
    heroIntroPara1: raw?.heroIntroPara1 ?? "",
    heroIntroPara2: raw?.heroIntroPara2 ?? "",
  };
}

export type RecruitmentPageContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtext: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

export function toRecruitmentPage(raw: RawSiteQueryResult["recruitmentPage"]): RecruitmentPageContent {
  return {
    heroEyebrow: raw?.heroEyebrow ?? "Empleo",
    heroHeadline: raw?.heroHeadline ?? "Un oficio que se aprende trabajando.",
    heroSubtext:
      raw?.heroSubtext ??
      "Detrás de cada instalación hay conocimientos, precisión y experiencia. Descubre cómo es trabajar en ventilación y climatización y todo lo que puedes llegar a aprender.",
    primaryCtaLabel: raw?.primaryCtaLabel ?? "Descubre tu camino",
    secondaryCtaLabel: raw?.secondaryCtaLabel ?? "Quiero trabajar en Oltenia",
  };
}

export type EnDetallePageContent = {
  introText: string;
  experienceHeading: string;
  experienceBody: string;
  archiveNote: string;
  overviewImage: ReturnType<typeof toPhoto>;
  step1Heading: string;
  step1Body: string;
  step1Image: ReturnType<typeof toPhoto>;
  step2Heading: string;
  step2Body: string;
  step2ImageA: ReturnType<typeof toPhoto>;
  step2ImageB: ReturnType<typeof toPhoto>;
  step2BodyExtra: string;
  step2ImageC: ReturnType<typeof toPhoto>;
  step2ImageD: ReturnType<typeof toPhoto>;
  step3Heading: string;
  step3Body: string;
  step3Image: ReturnType<typeof toPhoto>;
  closingText: string;
};

export function toEnDetallePage(raw: RawSiteQueryResult["enDetallePage"]): EnDetallePageContent {
  return {
    introText: raw?.introText ?? "",
    experienceHeading: raw?.experienceHeading ?? "Nuestra experiencia en fabricación",
    experienceBody: raw?.experienceBody ?? "",
    archiveNote: raw?.archiveNote ?? "Archivo de Oltenia · Fabricación propia de una etapa anterior",
    overviewImage: toPhoto(raw?.overviewImage ?? null),
    step1Heading: raw?.step1Heading ?? "De una medida a una pieza",
    step1Body: raw?.step1Body ?? "",
    step1Image: toPhoto(raw?.step1Image ?? null),
    step2Heading: raw?.step2Heading ?? "Donde se jugaba la precisión: uniones y perfiles",
    step2Body: raw?.step2Body ?? "",
    step2ImageA: toPhoto(raw?.step2ImageA ?? null),
    step2ImageB: toPhoto(raw?.step2ImageB ?? null),
    step2BodyExtra: raw?.step2BodyExtra ?? "",
    step2ImageC: toPhoto(raw?.step2ImageC ?? null),
    step2ImageD: toPhoto(raw?.step2ImageD ?? null),
    step3Heading: raw?.step3Heading ?? "De la pieza a la instalación",
    step3Body: raw?.step3Body ?? "",
    step3Image: toPhoto(raw?.step3Image ?? null),
    closingText: raw?.closingText ?? "",
  };
}

export type SeoEntry = { metaTitle: string | null; metaDescription: string | null };
export type SeoSettingsContent = {
  home: SeoEntry;
  servicios: SeoEntry;
  sobreOltenia: SeoEntry;
  trabajaConNosotros: SeoEntry;
  contacto: SeoEntry;
};

function toSeoEntry(raw: RawSeoEntry): SeoEntry {
  return { metaTitle: raw?.metaTitle?.trim() || null, metaDescription: raw?.metaDescription?.trim() || null };
}

export function toSeoSettings(raw: RawSiteQueryResult["seoSettings"]): SeoSettingsContent {
  return {
    home: toSeoEntry(raw?.home),
    servicios: toSeoEntry(raw?.servicios),
    sobreOltenia: toSeoEntry(raw?.sobreOltenia),
    trabajaConNosotros: toSeoEntry(raw?.trabajaConNosotros),
    contacto: toSeoEntry(raw?.contacto),
  };
}

export type { RawAddress };
