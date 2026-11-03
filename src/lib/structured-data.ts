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

/** Returns LocalBusiness data only when the minimum verified details exist and the site is indexable. */
export function localBusinessData(company: CompanyContent, indexable: boolean) {
  const address = publicAddress(company);
  const channels = customerChannels(company);
  const url = absoluteUrl("/");
  if (!indexable || !url || !address || !(channels.phone || channels.email)) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
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
