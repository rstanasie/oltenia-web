import type { PostalAddress } from "@/content/types";
import { addressLines, formatPhone, mailtoHref, mapHref, telHref, whatsappHref } from "@/lib/contact";

const iconProps = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  className: "size-5 shrink-0 text-accent",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.6z" />
      <path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.2-1.2 1.8.8c-.2 1.3-1.2 2-2.4 1.9C11 15.2 8.8 13 8.5 10.4 8.4 9.2 9.1 8.2 10.4 8l.8 1.8z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5L12 13l8.5-6.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      {icon}
      <div className="min-w-0">{children}</div>
    </li>
  );
}

export function DirectContactCard({
  phone,
  whatsapp,
  email,
  address,
  mapUrl,
}: {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: PostalAddress | null;
  mapUrl: string | null;
}) {
  if (!phone && !whatsapp && !email && !address) return null;

  return (
    <div className="flex h-full flex-col rounded-lg border border-line bg-white p-6">
      <h3 className="text-lg font-bold text-navy-900">Contacta directamente con nosotros</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        ¿Prefieres hablar directamente? Puedes llamarnos, escribirnos o encontrarnos en Zaragoza.
      </p>

      <ul className="mt-6 grid flex-1 content-start gap-6">
        {phone ? (
          <Row icon={<PhoneIcon />}>
            <a href={telHref(phone)} className="font-semibold text-navy-900 underline-offset-4 hover:underline">
              {formatPhone(phone)}
            </a>
          </Row>
        ) : null}
        {whatsapp ? (
          <Row icon={<WhatsAppIcon />}>
            <a
              href={whatsappHref(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-navy-900 underline-offset-4 hover:underline"
            >
              WhatsApp
              <span className="sr-only"> (se abre en una ventana nueva)</span>
            </a>
          </Row>
        ) : null}
        {email ? (
          <Row icon={<MailIcon />}>
            <a href={mailtoHref(email)} className="font-semibold text-navy-900 underline-offset-4 hover:underline break-all">
              {email}
            </a>
          </Row>
        ) : null}
        {address ? (
          <Row icon={<PinIcon />}>
            <a
              href={mapHref(address, mapUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-navy-900 underline-offset-4 hover:underline"
            >
              {addressLines(address).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="sr-only"> (abre Google Maps en una ventana nueva)</span>
            </a>
          </Row>
        ) : null}
      </ul>
    </div>
  );
}
