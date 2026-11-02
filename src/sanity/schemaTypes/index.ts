import type { SchemaTypeDefinition } from "sanity";
import { imageWithAlt } from "./objects/imageWithAlt";
import { openingHour } from "./objects/openingHour";
import { postalAddress } from "./objects/postalAddress";
import { relatedContentLink } from "./objects/relatedContentLink";
import { salaryRange } from "./objects/salaryRange";

import { careerStage } from "./documents/careerStage";
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

/** Singleton documents: exactly one instance each, edited in place (no create/delete in the Studio UI). */
export const singletonTypes = [
  "siteSettings",
  "companyInfo",
  "contactInfo",
  "legalInfo",
  "homePage",
  "servicesPage",
  "recruitmentPage",
  "enDetallePage",
  "seoSettings",
] as const;

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  postalAddress,
  openingHour,
  imageWithAlt,
  relatedContentLink,
  salaryRange,
  // Singletons
  siteSettings,
  companyInfo,
  contactInfo,
  legalInfo,
  homePage,
  servicesPage,
  recruitmentPage,
  enDetallePage,
  seoSettings,
  // Collections
  teamMember,
  service,
  vacancy,
  photo,
  careerStage,
];
