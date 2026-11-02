/**
 * Content validation against the live Sanity dataset.
 *
 *   npm run content:check          Draft mode: format errors fail, missing launch info is reported.
 *   npm run content:check:launch   Launch mode: missing launch-critical info also fails.
 *
 * Reads the PUBLISHED dataset (same as visitors see). Run this after editing
 * content in Sanity Studio, or in CI before a production deploy.
 */
import { loadEnvConfig } from "@next/env";
import type { ContactChannels, Photo } from "@/content/types";
import { hasAnyChannel, isCompleteAddress, isSafeHttpsUrl, isValidEmail, isValidPhone, isValidPostalCode } from "@/lib/contact";
import { missingLegalNotice, missingPrivacy } from "@/lib/legal";
import { getEnvSiteConfig } from "@/lib/site";

const launch = process.argv.includes("--launch");
const root = process.cwd();
loadEnvConfig(root, !launch);

async function main() {
  // Imported after loadEnvConfig so the Sanity client picks up .env.local.
  const { client } = await import("@/sanity/lib/client");
  const { SITE_QUERY } = await import("@/sanity/lib/queries");
  const { toCompanyContent } = await import("@/sanity/lib/mappers");

  type Issue = { where: string; problem: string; fix: string };
  const errors: Issue[] = [];
  const blockers: Issue[] = [];
  const notes: Issue[] = [];

  const PLACEHOLDERS: [RegExp, string][] = [
    [/lorem|ipsum/i, "texto de relleno"],
    [/\b(TODO|TBD|TBC|FIXME)\b/, "marcador de tarea"],
    [/x{3,}/i, "secuencia XXX"],
    [/placeholder|dummy|\bfake\b|\bsample\b/i, "palabra de marcador"],
    [/\b(ejemplo|example)\.(com|es|org|net)\b|@(test|ejemplo|example)\./i, "dominio de ejemplo"],
    [/\bpendiente\b|por (definir|confirmar)|a completar/i, "texto pendiente"],
    [/\[[^\]]*\]|\{\{.*\}\}|<[^>]+>/, "corchetes o plantilla"],
    [/123456|(\d)\1{5,}/, "número inventado"],
    [/calle (falsa|ejemplo)|c\/ ejemplo/i, "dirección inventada"],
  ];

  function scanPlaceholders(value: unknown, where: string) {
    if (typeof value === "string") {
      for (const [pattern, label] of PLACEHOLDERS) {
        if (pattern.test(value)) {
          errors.push({
            where,
            problem: `Parece un marcador (${label}): "${value.slice(0, 80)}"`,
            fix: "Sustitúyelo por información confirmada o déjalo vacío en Sanity Studio si aún no se conoce.",
          });
          return;
        }
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => scanPlaceholders(item, `${where}[${i}]`));
    } else if (value && typeof value === "object") {
      for (const [key, item] of Object.entries(value)) scanPlaceholders(item, `${where}.${key}`);
    }
  }

  function checkChannels(channels: ContactChannels, where: string) {
    if (channels.phone !== null && !isValidPhone(channels.phone)) {
      errors.push({ where: `${where}.phone`, problem: `Formato no válido: "${channels.phone}"`, fix: 'Usa formato internacional sin espacios, p. ej. "+34" seguido de los 9 dígitos.' });
    }
    if (channels.whatsapp !== null && !isValidPhone(channels.whatsapp)) {
      errors.push({ where: `${where}.whatsapp`, problem: `Formato no válido: "${channels.whatsapp}"`, fix: 'Usa formato internacional sin espacios, p. ej. "+34" seguido de los 9 dígitos.' });
    }
    if (channels.email !== null && !isValidEmail(channels.email)) {
      errors.push({ where: `${where}.email`, problem: `Correo no válido: "${channels.email}"`, fix: "Revisa la dirección de correo." });
    }
  }

  function checkPhoto(photo: Photo, where: string) {
    if (!isSafeHttpsUrl(photo.src)) {
      errors.push({ where: `${where}.src`, problem: `URL de imagen no válida: "${photo.src}"`, fix: "Vuelve a subir la imagen en Sanity Studio." });
    }
    const alt = photo.alt.trim();
    if (alt.length < 10 || /^(foto|imagen|image|photo)\s*\d*$/i.test(alt)) {
      errors.push({ where: `${where}.alt`, problem: `Texto alternativo insuficiente: "${photo.alt}"`, fix: "Describe lo que muestra la foto en una frase, p. ej. qué instalación y dónde." });
    }
    if (!Number.isInteger(photo.width) || !Number.isInteger(photo.height) || photo.width <= 0 || photo.height <= 0) {
      errors.push({ where, problem: "Dimensiones de imagen no válidas", fix: "Vuelve a subir la imagen en Sanity Studio." });
    }
    if (!photo.publicationApproved) {
      notes.push({ where, problem: "Foto sin aprobación de publicación; no se mostrará.", fix: 'Activa "Permiso de publicación" en Sanity Studio solo con permiso por escrito.' });
    }
  }

  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
  function checkDate(value: string | null, where: string) {
    if (value !== null && (!ISO_DATE.test(value) || Number.isNaN(Date.parse(value)))) {
      errors.push({ where, problem: `Fecha no válida: "${value}"`, fix: "Usa formato AAAA-MM-DD." });
    }
  }

  const raw = await client.fetch(SITE_QUERY);
  const company = toCompanyContent(raw as Parameters<typeof toCompanyContent>[0]);

  // Placeholders in all content.
  scanPlaceholders(company, "company");

  // Contacts.
  checkChannels(company.customerContact, "customerContact");
  if (!company.recruitmentContact.sameAsCustomer) checkChannels(company.recruitmentContact.channels, "recruitmentContact.channels");

  const address = company.customerContact.address;
  const postalCode = address?.postalCode ?? "";
  if (address && !isCompleteAddress(address)) {
    errors.push({
      where: "customerContact.address",
      problem: isValidPostalCode(postalCode) ? "Dirección incompleta" : `Código postal no válido: "${postalCode}"`,
      fix: "Completa calle, código postal de 5 dígitos, localidad, provincia y país en Sanity Studio, o déjala vacía.",
    });
  }
  if (company.customerContact.mapUrl !== null && !isSafeHttpsUrl(company.customerContact.mapUrl)) {
    errors.push({ where: "customerContact.mapUrl", problem: "La URL del mapa debe empezar por https://", fix: "Usa un enlace https o déjalo vacío para generarlo desde la dirección." });
  }
  for (const [i, h] of company.customerContact.openingHours.entries()) {
    if (!h.days.trim() || !h.hours.trim()) {
      errors.push({ where: `customerContact.openingHours[${i}]`, problem: "Horario incompleto", fix: "Rellena días y horas o elimina la entrada en Sanity Studio." });
    }
  }

  const customerOk = hasAnyChannel({
    phone: isValidPhone(company.customerContact.phone) ? company.customerContact.phone : null,
    whatsapp: isValidPhone(company.customerContact.whatsapp) ? company.customerContact.whatsapp : null,
    email: isValidEmail(company.customerContact.email) ? company.customerContact.email : null,
  });
  const rc = company.recruitmentContact;
  const recruitmentOk = rc.sameAsCustomer
    ? customerOk
    : Boolean(isValidPhone(rc.channels.phone) || isValidPhone(rc.channels.whatsapp) || isValidEmail(rc.channels.email));

  if (!customerOk) blockers.push({ where: "contactInfo", problem: "No hay ningún canal de contacto para clientes.", fix: "Añade al menos teléfono, WhatsApp o correo verificados en Sanity Studio." });
  if (!recruitmentOk) blockers.push({ where: "contactInfo", problem: "No hay ningún canal de contacto para candidaturas.", fix: 'Añade un canal de candidaturas, o activa "Usar los mismos canales que clientes".' });
  if (!address) notes.push({ where: "customerContact.address", problem: "Sin dirección pública: no se generan datos LocalBusiness ni enlace de mapa.", fix: "Añádela solo si la empresa quiere publicarla." });

  // Services.
  const serviceIds = new Set<string>();
  for (const [i, s] of company.services.entries()) {
    if (serviceIds.has(s.id)) errors.push({ where: `services[${i}].id`, problem: `id duplicado "${s.id}"`, fix: "Cada servicio necesita un identificador único en Sanity Studio." });
    serviceIds.add(s.id);
    if (s.photo) checkPhoto(s.photo, `services[${i}].photo`);
  }
  if (!company.serviceDetails.serviceArea) notes.push({ where: "serviceDetails.serviceArea", problem: "Zona de trabajo sin confirmar; no se muestra.", fix: "Añade la zona cuando esté confirmada." });

  // Vacancies.
  const vacancyIds = new Set<string>();
  for (const [i, v] of company.vacancies.entries()) {
    const where = `vacancies[${i}]`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.id)) errors.push({ where: `${where}.id`, problem: `identificador no válido "${v.id}"`, fix: "Usa minúsculas, números y guiones en el campo slug." });
    if (vacancyIds.has(v.id)) errors.push({ where: `${where}.id`, problem: `identificador duplicado "${v.id}"`, fix: "Cada oferta necesita un identificador único." });
    vacancyIds.add(v.id);
    checkDate(v.datePosted, `${where}.datePosted`);
    checkDate(v.validThrough, `${where}.validThrough`);
    if (v.salaryRange && (v.salaryRange.min <= 0 || v.salaryRange.min > v.salaryRange.max)) {
      errors.push({ where: `${where}.salaryRange`, problem: "Rango salarial no válido", fix: "El mínimo debe ser mayor que 0 y menor o igual que el máximo." });
    }
    if (v.status === "open") {
      if (!v.title.trim()) errors.push({ where: `${where}.title`, problem: "Oferta abierta sin título", fix: "Añade el título del puesto." });
      if (!v.summary) blockers.push({ where: `${where}.summary`, problem: "Oferta abierta sin descripción", fix: "Añade un resumen confirmado del puesto." });
      if (!v.datePosted) notes.push({ where: `${where}.datePosted`, problem: "Sin fecha de publicación: no se generan datos JobPosting.", fix: "Añade la fecha de publicación." });
      if (v.validThrough && v.validThrough < new Date().toISOString().slice(0, 10)) {
        notes.push({ where: `${where}.validThrough`, problem: "La oferta ha caducado y no se muestra.", fix: 'Cambia el estado a "Cerrada" o actualiza la fecha de validez.' });
      }
    }
  }

  // Photos.
  for (const group of ["projects", "team", "workplace"] as const) {
    company.photos[group].forEach((photo, i) => checkPhoto(photo, `photos.${group}[${i}]`));
  }

  // Publication and legal.
  if (!company.publication.approved) {
    blockers.push({ where: "siteSettings.publicationApproved", problem: "El contenido no está aprobado para publicar.", fix: 'Cuando los propietarios aprueben el contenido, activa "Contenido aprobado para publicar" y rellena quién y cuándo.' });
  } else if (!company.publication.approvedBy || !company.publication.approvedOn) {
    blockers.push({ where: "siteSettings", problem: "Falta quién aprobó el contenido o la fecha.", fix: "Rellena «Aprobado por» y «Fecha de aprobación» en Sanity Studio." });
  }
  checkDate(company.publication.approvedOn, "siteSettings.approvedOn");
  checkDate(company.legal.lastReviewed, "legalInfo.lastReviewed");
  if (company.legal.registeredAddress && !isCompleteAddress(company.legal.registeredAddress)) {
    errors.push({ where: "legalInfo.registeredAddress", problem: "Domicilio social incompleto o con código postal no válido", fix: "Completa todos los campos o déjalo vacío." });
  }
  for (const item of new Set([...missingLegalNotice(company.legal), ...missingPrivacy(company.legal)])) {
    blockers.push({ where: "legalInfo", problem: `Falta: ${item}`, fix: "Solicítalo a la empresa y a su asesor; ver CONTENT_CHECKLIST.md." });
  }

  // Environment.
  const site = getEnvSiteConfig(process.env);
  if (site.siteUrlError) errors.push({ where: "NEXT_PUBLIC_SITE_URL", problem: site.siteUrlError, fix: "Configura el dominio definitivo con https://, sin ruta final." });
  if (!site.siteUrl && !site.siteUrlError) blockers.push({ where: "NEXT_PUBLIC_SITE_URL", problem: "Dominio de producción sin configurar (sin canonical ni sitemap).", fix: "Configúralo en Vercel → Settings → Environment Variables (Production)." });
  if (!site.indexingRequested) blockers.push({ where: "SITE_INDEXING", problem: "La indexación está desactivada (correcto para vistas previas).", fix: "Para el lanzamiento, pon SITE_INDEXING=true solo en el entorno Production." });

  // Report.
  function print(title: string, list: Issue[]) {
    if (list.length === 0) return;
    console.log(`\n${title} (${list.length})`);
    for (const issue of list) {
      console.log(`  • ${issue.where}: ${issue.problem}\n      → ${issue.fix}`);
    }
  }

  console.log(`Validación de contenido — modo ${launch ? "LANZAMIENTO" : "BORRADOR"}`);
  print("✖ Errores", errors);
  print(launch ? "✖ Bloqueos de lanzamiento" : "⚠ Pendiente para el lanzamiento", blockers);
  print("ℹ Notas", notes);

  const failed = errors.length > 0 || (launch && blockers.length > 0);
  if (failed) {
    console.log(
      launch
        ? "\nEl sitio NO está listo para publicarse. Corrige los puntos anteriores en Sanity Studio o en las variables de entorno."
        : "\nHay errores de formato en el contenido. Corrígelos en Sanity Studio.",
    );
    process.exitCode = 1;
    return;
  }
  console.log(
    launch
      ? "\nTodo correcto: el contenido cumple los requisitos de lanzamiento."
      : `\nBorrador válido. ${blockers.length > 0 ? `Quedan ${blockers.length} puntos para el lanzamiento (npm run content:check:launch).` : "Sin puntos pendientes."}`,
  );
}

main().catch((error) => {
  console.error("No se pudo validar el contenido:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
