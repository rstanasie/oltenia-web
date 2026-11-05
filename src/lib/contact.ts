import type { ContactChannels, PostalAddress } from "@/content/types";

const E164 = /^\+[1-9]\d{7,14}$/;
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const POSTAL_CODE_ES = /^\d{5}$/;

export function isValidPhone(value: string | null): value is string {
  return value !== null && E164.test(value);
}

export function isValidEmail(value: string | null): value is string {
  return value !== null && value.length <= 254 && EMAIL.test(value);
}

export function isValidPostalCode(value: string): boolean {
  return POSTAL_CODE_ES.test(value);
}

export function isCompleteAddress(address: PostalAddress | null): address is PostalAddress {
  if (!address) return false;
  return (
    address.street.trim() !== "" &&
    isValidPostalCode(address.postalCode) &&
    address.locality.trim() !== "" &&
    address.province.trim() !== "" &&
    address.country.trim() !== ""
  );
}

export function isSafeHttpsUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function formatPhone(e164: string): string {
  if (e164.startsWith("+34") && e164.length === 12) {
    const n = e164.slice(3);
    return `+34 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  }
  return e164;
}

export function telHref(e164: string): string {
  return `tel:${e164}`;
}

export function whatsappHref(e164: string, message?: string): string {
  const base = `https://wa.me/${e164.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mailtoHref(email: string, subject?: string, body?: string): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}${params.length ? `?${params.join("&")}` : ""}`;
}

export function formatAddress(address: PostalAddress): string {
  const { street, postalCode, locality, province, country } = address;
  const sameAsLocality = province.trim().toLowerCase() === locality.trim().toLowerCase();
  const provincePart = province && !sameAsLocality ? `, ${province}` : "";
  return `${street}, ${postalCode} ${locality}${provincePart}, ${country}`;
}

/** Same address, broken into display lines: street / postal code + locality (+ province if different) / country. */
export function addressLines(address: PostalAddress): string[] {
  const { street, postalCode, locality, province, country } = address;
  const sameAsLocality = province.trim().toLowerCase() === locality.trim().toLowerCase();
  const line2 = sameAsLocality ? `${postalCode} ${locality}` : `${postalCode} ${locality}, ${province}`;
  return [street, line2, country];
}

export function mapHref(address: PostalAddress, explicitUrl: string | null): string {
  if (isSafeHttpsUrl(explicitUrl)) return explicitUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(address))}`;
}

/** Returns only channels with a valid format, so invalid values never render as broken links. */
export function validChannels(channels: ContactChannels): ContactChannels {
  return {
    phone: isValidPhone(channels.phone) ? channels.phone : null,
    whatsapp: isValidPhone(channels.whatsapp) ? channels.whatsapp : null,
    email: isValidEmail(channels.email) ? channels.email : null,
  };
}

export function hasAnyChannel(channels: ContactChannels): boolean {
  return Boolean(channels.phone || channels.whatsapp || channels.email);
}
