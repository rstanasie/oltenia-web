/**
 * Shared types for the illustrative professional development path shown on
 * "Trabaja con nosotros". The actual content now lives in Sanity (document
 * type `careerStage`, see src/sanity/schemaTypes/documents/careerStage.ts)
 * and is fetched through src/sanity/lib/mappers.ts#toCareerStages.
 *
 * This is editorial content, not an official employment classification. The
 * category names (Peón, Oficial de 1ª/2ª/3ª, Encargado) are common terms in
 * the Spanish metal and installation trades, but actual professional
 * classification depends on the applicable collective agreement and the
 * functions genuinely performed by each worker.
 */

export type RelatedContentLink = {
  label: string;
  href: string;
};

export type CareerStage = {
  id: string;
  displayOrder: number;
  title: string;
  subtitle: string;
  description: string;
  responsibilities: string[];
  competencies: string[];
  /** Short illustrative quote. Optional — only used where it adds something concrete. */
  quote?: string;
  /** Caveat shown with this stage, e.g. about progression not being guaranteed. */
  note?: string;
  /** Links to existing pages/sections only — never invent a destination. */
  relatedContent?: RelatedContentLink[];
};
