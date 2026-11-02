import type { LegalIdentity } from "@/content/types";
import { isCompleteAddress, isValidEmail } from "@/lib/contact";

export function missingLegalNotice(l: LegalIdentity): string[] {
  const missing: string[] = [];
  if (!l.legalName) missing.push("Razón social (legal.legalName)");
  if (!l.taxId) missing.push("NIF/CIF (legal.taxId)");
  if (!isCompleteAddress(l.registeredAddress)) missing.push("Domicilio social completo (legal.registeredAddress)");
  if (!l.registryDetails) missing.push("Datos registrales, si corresponden (legal.registryDetails)");
  if (!isValidEmail(l.legalEmail)) missing.push("Correo electrónico de contacto legal (legal.legalEmail)");
  if (l.termsOfUse.length === 0) missing.push("Condiciones de uso (legal.termsOfUse)");
  if (l.intellectualProperty.length === 0) missing.push("Propiedad intelectual (legal.intellectualProperty)");
  if (l.applicableLaw.length === 0) missing.push("Legislación aplicable (legal.applicableLaw)");
  if (!l.reviewed) missing.push("Revisión por un asesor cualificado (legal.reviewed)");
  return missing;
}

export function missingPrivacy(l: LegalIdentity): string[] {
  const missing: string[] = [];
  if (!l.dataController) missing.push("Responsable del tratamiento (legal.dataController)");
  if (l.purposes.length === 0) missing.push("Finalidades del tratamiento (legal.purposes)");
  if (l.recipients.length === 0) missing.push("Destinatarios y encargados del tratamiento (legal.recipients)");
  if (l.legalBases.length === 0) missing.push("Bases legales del tratamiento (legal.legalBases)");
  if (l.retentionPeriods.length === 0) missing.push("Plazos de conservación (legal.retentionPeriods)");
  if (!l.rightsContact) missing.push("Dirección para ejercer derechos (legal.rightsContact)");
  if (!l.reviewed) missing.push("Revisión por un asesor cualificado (legal.reviewed)");
  return missing;
}
