import type { CompanyContent, ContractType, PostalAddress, Vacancy } from "@/content/types";
import { customerChannels, publicAddress } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

function postalAddress(address: PostalAddress) {
  return {
    "@type": "PostalAddress",
    streetAddress: address.street,
    postalCode: address.postalCode,
    addressLocality: address.locality,
    addressRegion: address.province,
    addressCountry: "ES",
  };
}

/** Stable @id for the shared Organization node, referenced (not redeclared) from every page's structured data. */
export function organizationId(orgUrl: string): string {
  return `${orgUrl}#organization`;
}

export function websiteId(orgUrl: string): string {
  return `${orgUrl}#website`;
}

/**
 * Minimal, always-eligible Organization entity (name, url, logo if uploaded).
 * No `sameAs`: no social profile field exists in the content model yet — add
 * one here only once an official profile URL is confirmed and stored in
 * Sanity, never a guessed/typical handle.
 */
export function organizationData(company: CompanyContent, indexable: boolean) {
  const url = absoluteUrl("/");
  if (!indexable || !url) return null;
  const logo = company.brand.logo;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(url),
    name: company.brand.name,
    url,
    ...(logo ? { logo: { "@type": "ImageObject", url: logo.src, width: logo.width, height: logo.height } } : {}),
  };
}

export function websiteData(company: CompanyContent, indexable: boolean) {
  const url = absoluteUrl("/");
  if (!indexable || !url) return null;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(url),
    url,
    name: company.brand.name,
    publisher: { "@id": organizationId(url) },
  };
}

/**
 * Generic page-level entity (WebPage or a more specific subtype like
 * ContactPage/AboutPage/CollectionPage), referencing the shared Organization
 * and WebSite nodes by @id instead of redeclaring them.
 */
export function pageEntityData({
  indexable,
  path,
  type = "WebPage",
  name,
  description,
  extra = {},
}: {
  // Kept in the signature for consistency with the other *Data functions and
  // so callers can pass the same { company, indexable, ... } shape — not
  // used internally since org/site identity comes from the URL, not company.
  company: CompanyContent;
  indexable: boolean;
  path: string;
  type?: string;
  name: string;
  description?: string | null;
  extra?: Record<string, unknown>;
}) {
  const pageUrl = absoluteUrl(path);
  const orgUrl = absoluteUrl("/");
  if (!indexable || !pageUrl || !orgUrl) return null;

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name,
    ...(description ? { description } : {}),
    about: { "@id": organizationId(orgUrl) },
    isPartOf: { "@id": websiteId(orgUrl) },
    ...extra,
  };
}

/** Service entities for the Servicios page, attached to the WebPage via mainEntity. Only real, already-published service content — no Product/Offer. */
export function servicesPageData(company: CompanyContent, indexable: boolean, path: string, name: string, description: string) {
  const orgUrl = absoluteUrl("/");
  if (!indexable || !orgUrl) return null;

  const services = company.services
    .filter((service) => service.summary)
    .map((service) => ({
      "@type": "Service",
      name: service.name,
      description: service.summary,
      provider: { "@id": organizationId(orgUrl) },
      ...(company.serviceDetails.serviceArea ? { areaServed: company.serviceDetails.serviceArea } : {}),
    }));

  return pageEntityData({
    company,
    indexable,
    path,
    name,
    description,
    extra: services.length > 0 ? { mainEntity: services } : {},
  });
}

/**
 * Trabaja con nosotros: CollectionPage with an ItemList of the currently open
 * vacancies when there is at least one, otherwise a plain WebPage — the type
 * reflects whatever is actually published, not a fixed choice.
 */
export function vacancyCollectionData(
  company: CompanyContent,
  indexable: boolean,
  path: string,
  name: string,
  description: string,
  vacancies: Vacancy[],
) {
  if (vacancies.length === 0) {
    return pageEntityData({ company, indexable, path, name, description });
  }

  const orgUrl = absoluteUrl("/");
  if (!orgUrl) return pageEntityData({ company, indexable, path, name, description });

  const itemListElement = vacancies
    .map((vacancy, index) => {
      const vacancyUrl = absoluteUrl(`/puestos/${vacancy.id}`);
      if (!vacancyUrl) return null;
      return { "@type": "ListItem", position: index + 1, url: vacancyUrl, name: vacancy.title };
    })
    .filter((item): item is { "@type": string; position: number; url: string; name: string } => item !== null);

  return pageEntityData({
    company,
    indexable,
    path,
    type: "CollectionPage",
    name,
    description,
    extra: itemListElement.length > 0 ? { mainEntity: { "@type": "ItemList", itemListElement } } : {},
  });
}

/** Returns LocalBusiness data only when the minimum verified details exist and the site is indexable. Shares @id with organizationData so both are read as the same entity, not a duplicate. */
export function localBusinessData(company: CompanyContent, indexable: boolean) {
  const address = publicAddress(company);
  const channels = customerChannels(company);
  const url = absoluteUrl("/");
  if (!indexable || !url || !address || !(channels.phone || channels.email)) return null;

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "HVACBusiness"],
    "@id": organizationId(url),
    name: company.brand.name,
    url,
    address: postalAddress(address),
    ...(channels.phone ? { telephone: channels.phone } : {}),
    ...(channels.email ? { email: channels.email } : {}),
    ...(company.serviceDetails.serviceArea ? { areaServed: company.serviceDetails.serviceArea } : {}),
  };
}

const employmentTypes: Partial<Record<ContractType, string>> = {
  temporal: "TEMPORARY",
  practicas: "INTERN",
  formacion: "INTERN",
  autonomo: "CONTRACTOR",
};

const salaryUnits = { hora: "HOUR", mes: "MONTH", año: "YEAR" } as const;

/** Returns JobPosting data only for confirmed open vacancies with the required fields, when the site is indexable. */
export function jobPostingData(company: CompanyContent, vacancy: Vacancy, indexable: boolean) {
  const address = publicAddress(company) ?? company.legal.registeredAddress;
  const orgUrl = absoluteUrl("/");
  if (
    !indexable ||
    !orgUrl ||
    vacancy.status !== "open" ||
    !vacancy.summary ||
    !vacancy.datePosted ||
    !address
  ) {
    return null;
  }

  const description = [
    vacancy.summary,
    ...vacancy.responsibilities,
    ...vacancy.essentialRequirements,
    ...vacancy.desirableRequirements,
  ]
    .map((line) => `<p>${line.replace(/[<>&]/g, "")}</p>`)
    .join("");

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.title,
    description,
    datePosted: vacancy.datePosted,
    ...(vacancy.validThrough ? { validThrough: vacancy.validThrough } : {}),
    ...(vacancy.contractType && employmentTypes[vacancy.contractType]
      ? { employmentType: employmentTypes[vacancy.contractType] }
      : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: company.legal.legalName ?? company.brand.name,
      sameAs: orgUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: postalAddress(address),
    },
    ...(vacancy.salaryRange
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: vacancy.salaryRange.currency,
            value: {
              "@type": "QuantitativeValue",
              minValue: vacancy.salaryRange.min,
              maxValue: vacancy.salaryRange.max,
              unitText: salaryUnits[vacancy.salaryRange.period],
            },
          },
        }
      : {}),
  };
}
