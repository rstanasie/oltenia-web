import type {
  CompanyContent,
  ContactChannels,
  ContractType,
  Photo,
  Sector,
  ServiceActivity,
  Vacancy,
} from "@/content/types";
import { hasAnyChannel, isCompleteAddress, validChannels } from "@/lib/contact";

export function approvedPhotos(photos: Photo[]): Photo[] {
  return photos.filter(
    (p) => p.publicationApproved && p.alt.trim() !== "" && p.width > 0 && p.height > 0,
  );
}

export function photosByCaptions(photos: Photo[], captions: string[]): Photo[] {
  return photos.filter((photo) => captions.includes(photo.caption ?? ""));
}

/** Looks up one specific approved photo by its original uploaded filename, for hand-picked editorial placement. */
export function findPhoto(photos: Photo[], originalFilename: string): Photo | null {
  return approvedPhotos(photos).find((p) => p.originalFilename === originalFilename) ?? null;
}

export function customerChannels(company: CompanyContent): ContactChannels {
  return validChannels(company.customerContact);
}

export function recruitmentChannels(company: CompanyContent): ContactChannels {
  const { sameAsCustomer, channels } = company.recruitmentContact;
  return sameAsCustomer ? customerChannels(company) : validChannels(channels);
}

export function hasCustomerContact(company: CompanyContent): boolean {
  return hasAnyChannel(customerChannels(company));
}

export function hasRecruitmentContact(company: CompanyContent): boolean {
  return hasAnyChannel(recruitmentChannels(company));
}

export function publicAddress(company: CompanyContent) {
  const { address } = company.customerContact;
  return isCompleteAddress(address) ? address : null;
}

export function openVacancies(company: CompanyContent): Vacancy[] {
  const today = new Date().toISOString().slice(0, 10);
  return company.vacancies.filter(
    (v) =>
      v.status === "open" &&
      v.title.trim() !== "" &&
      (v.validThrough === null || v.validThrough >= today),
  );
}

export const activityLabels: Record<ServiceActivity, string> = {
  instalacion: "Instalación",
  mantenimiento: "Mantenimiento",
  reparacion: "Reparación",
};

export const sectorLabels: Record<Sector, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  industrial: "Industrial",
};

export const contractLabels: Record<ContractType, string> = {
  indefinido: "Indefinido",
  temporal: "Temporal",
  "fijo-discontinuo": "Fijo discontinuo",
  practicas: "Prácticas",
  formacion: "Formación",
  autonomo: "Colaboración como autónomo",
};

export function formatSalary(salary: NonNullable<Vacancy["salaryRange"]>): string {
  const fmt = new Intl.NumberFormat("es-ES", { style: "currency", currency: salary.currency, maximumFractionDigits: 0 });
  const range = salary.min === salary.max ? fmt.format(salary.min) : `${fmt.format(salary.min)} – ${fmt.format(salary.max)}`;
  return `${range} ${salary.gross ? "brutos" : "netos"} / ${salary.period}`;
}

export function areasOfWork(company: CompanyContent): string {
  const names = company.services.map((s) => s.name.toLowerCase());
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}
