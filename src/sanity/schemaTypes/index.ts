import type { SchemaTypeDefinition } from "sanity";
import { imageWithAlt } from "./objects/imageWithAlt";
import { openingHour } from "./objects/openingHour";
import { postalAddress } from "./objects/postalAddress";
import { salaryRange } from "./objects/salaryRange";

import { companyInfo } from "./documents/companyInfo";
import { contactInfo } from "./documents/contactInfo";
import { enDetallePage } from "./documents/enDetallePage";
import { homePage } from "./documents/homePage";
import { legalInfo } from "./documents/legalInfo";
import { photo } from "./documents/photo";
import { recruitmentPage } from "./documents/recruitmentPage";
import { seoSettings } from "./documents/seoSettings";
import { service } from "./documents/service";
import { servicesPage } from "./documents/servicesPage";
import { siteSettings } from "./documents/siteSettings";
import { teamMember } from "./documents/teamMember";
import { vacancy } from "./documents/vacancy";
import { workingConditions } from "./documents/workingConditions";

/** Singleton documents: exactly one instance each, edited in place (no create/delete in the Studio UI). */
export const singletonTypes = [
  "siteSettings",
  "companyInfo",
  "contactInfo",
  "legalInfo",
  "homePage",
  "servicesPage",
  "recruitmentPage",
  "workingConditions",
  "enDetallePage",
  "seoSettings",
] as const;

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  postalAddress,
  openingHour,
  imageWithAlt,
  salaryRange,
  // Singletons
  siteSettings,
  companyInfo,
  contactInfo,
  legalInfo,
  homePage,
  servicesPage,
  recruitmentPage,
  workingConditions,
  enDetallePage,
  seoSettings,
  // Collections
  teamMember,
  service,
  vacancy,
  photo,
];
