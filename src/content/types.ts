export type ServiceId = "ventilacion" | "climatizacion" | "aire-acondicionado";

export type ServiceActivity = "instalacion" | "mantenimiento" | "reparacion";

export type Sector = "residencial" | "comercial" | "industrial";

export type ContractType =
  | "indefinido"
  | "temporal"
  | "fijo-discontinuo"
  | "practicas"
  | "formacion"
  | "autonomo";

export type Photo = {
  /** Image URL — a Sanity CDN URL, already sized/optimized. */
  src: string;
  /** Description of what the photo shows. Required and must be specific. */
  alt: string;
  width: number;
  height: number;
  caption: string | null;
  /** Set to true only when there is written permission to publish this photo. */
  publicationApproved: boolean;
  /** Original uploaded filename, if known. Used to hand-pick a specific photo for editorial placement — see findPhoto(). */
  originalFilename: string | null;
};

export type PostalAddress = {
  street: string;
  postalCode: string;
  locality: string;
  province: string;
  country: string;
};

export type OpeningHours = {
  /** Visitor-facing label, e.g. "Lunes a viernes". */
  days: string;
  /** Visitor-facing label, e.g. "8:00–14:00". */
  hours: string;
};

export type ContactChannels = {
  /** E.164 format: "+34" followed by the number, no spaces. */
  phone: string | null;
  /** E.164 format number registered on WhatsApp. */
  whatsapp: string | null;
  email: string | null;
};

export type CustomerContact = ContactChannels & {
  /** Public business address. Leave null if the address must not be published. */
  address: PostalAddress | null;
  /** Optional explicit https map link. If null, one is built from the address. */
  mapUrl: string | null;
  openingHours: OpeningHours[];
};

export type RecruitmentContact = {
  /** When true, the customer contact channels are used for recruitment too. */
  sameAsCustomer: boolean;
  /** Used only when sameAsCustomer is false. */
  channels: ContactChannels;
};

export type Service = {
  id: ServiceId;
  name: string;
  summary: string;
  /** Confirmed activities only. Leave empty until confirmed. */
  activities: ServiceActivity[];
  /** Optional confirmed, service-specific details. */
  details: string[];
  /** Optional photo shown with the service. */
  photo: Photo | null;
};

export type TeamMember = {
  name: string;
  role: string;
  /** Biography paragraphs, confirmed by the person. */
  bio: string[];
  photo: Photo | null;
};

export type Vacancy = {
  /** URL-safe identifier, unique. */
  id: string;
  status: "open" | "closed";
  title: string;
  /** ISO date (YYYY-MM-DD) when the vacancy was published. */
  datePosted: string | null;
  /** ISO date (YYYY-MM-DD) after which the vacancy is no longer valid. */
  validThrough: string | null;
  /** Short description for the vacancy card, e.g. "Primeros pasos". */
  shortDescription: string | null;
  location: string | null;
  summary: string | null;
  /** "Qué harás". */
  responsibilities: string[];
  /** "Qué necesitas" — genuinely required for this role. */
  essentialRequirements: string[];
  /** "Qué necesitas" — valued but not required. */
  desirableRequirements: string[];
  /** "Qué puedes aprender" in this role. */
  learningOpportunities: string[];
  drivingLicence: string | null;
  schedule: string | null;
  /** Confirmed travel expectations for this specific role, if any. */
  travelExpectations: string | null;
  contractType: ContractType | null;
  /** Internal draft only — keep null until the owners approve a figure to publish. */
  salaryRange: {
    min: number;
    max: number;
    currency: "EUR";
    period: "hora" | "mes" | "año";
    gross: boolean;
  } | null;
  benefits: string[];
  applicationInstructions: string | null;
};

export type LegalIdentity = {
  /** Razón social. */
  legalName: string | null;
  /** NIF / CIF. */
  taxId: string | null;
  registeredAddress: PostalAddress | null;
  /** Registro Mercantil data, if applicable. */
  registryDetails: string | null;
  /** Contact email for legal notices. */
  legalEmail: string | null;
  dataController: {
    name: string;
    address: PostalAddress;
    email: string;
  } | null;
  /** Email or postal address for exercising data protection rights. */
  rightsContact: string | null;
  /** Aviso legal: conditions of use paragraphs, written or reviewed by an adviser. */
  termsOfUse: string[];
  /** Aviso legal: intellectual property paragraphs. */
  intellectualProperty: string[];
  /** Aviso legal: applicable law and jurisdiction paragraphs. */
  applicableLaw: string[];
  /** Privacidad: purposes of processing, one per item. */
  purposes: string[];
  /** Privacidad: recipients and processors (hosting, email provider…), one per item. */
  recipients: string[];
  /** Visitor-facing description of legal bases, one per purpose, reviewed by an adviser. */
  legalBases: string[];
  /** Visitor-facing description of retention periods, reviewed by an adviser. */
  retentionPeriods: string[];
  /** ISO date of the last legal review. */
  lastReviewed: string | null;
  /** Set to true only after a qualified review of both legal pages. */
  reviewed: boolean;
};

export type CompanyContent = {
  publication: {
    /** Set to true only when the owners have approved all published content. */
    approved: boolean;
    approvedBy: string | null;
    /** ISO date. */
    approvedOn: string | null;
  };
  brand: {
    name: string;
    /** Path inside /public to an SVG or PNG logo. Null uses the text wordmark. */
    logo: { src: string; width: number; height: number } | null;
  };
  location: {
    city: string;
    country: string;
  };
  intro: {
    /** Short, factual description used in the footer and metadata. */
    short: string;
    history: string[];
    team: string[];
    workingApproach: string[];
  };
  teamMembers: TeamMember[];
  customerContact: CustomerContact;
  recruitmentContact: RecruitmentContact;
  recruitment: {
    whatsappMessage: string;
    emailSubject: string;
    emailBody: string;
  };
  services: Service[];
  serviceDetails: {
    /** Confirmed sectors only. */
    sectors: Sector[];
    /** Visitor-facing description, e.g. "Zaragoza y alrededores". */
    serviceArea: string | null;
    brands: string[];
  };
  certifications: string[];
  vacancies: Vacancy[];
  photos: {
    projects: Photo[];
    team: Photo[];
    workplace: Photo[];
  };
  legal: LegalIdentity;
};
