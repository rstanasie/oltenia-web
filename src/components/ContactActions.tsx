import type { ReactNode } from "react";
import type { ContactChannels } from "@/content/types";
import { buttonClasses } from "@/components/Button";
import { formatPhone, hasAnyChannel, mailtoHref, telHref, whatsappHref } from "@/lib/contact";

type Props = {
  channels: ContactChannels;
  whatsappMessage?: string;
  emailSubject?: string;
  emailBody?: string;
  tone?: "light" | "dark";
  /** Shown when no valid channel is configured. */
  emptyMessage: string;
};

export function ContactActions({ channels, whatsappMessage, emailSubject, emailBody, tone = "light", emptyMessage }: Props) {
  if (!hasAnyChannel(channels)) {
    return (
      <p
        className={`rounded-lg border px-5 py-4 leading-relaxed ${
          tone === "dark" ? "border-white/20 bg-white/5 text-navy-200" : "border-line bg-white text-muted"
        }`}
      >
        {emptyMessage}
      </p>
    );
  }

  const secondary = tone === "dark" ? "secondary-dark" : "secondary";
  const actions = [
    channels.whatsapp && {
      key: "whatsapp",
      href: whatsappHref(channels.whatsapp, whatsappMessage),
      external: true,
      icon: <WhatsAppIcon />,
      label: "Escribir por WhatsApp",
    },
    channels.email && {
      key: "email",
      href: mailtoHref(channels.email, emailSubject, emailBody),
      external: false,
      icon: <MailIcon />,
      label: "Enviar un correo",
    },
    channels.phone && {
      key: "phone",
      href: telHref(channels.phone),
      external: false,
      icon: <PhoneIcon />,
      label: `Llamar al ${formatPhone(channels.phone)}`,
    },
  ].filter((action) => Boolean(action)) as {
    key: string;
    href: string;
    external: boolean;
    icon: ReactNode;
    label: string;
  }[];

  return (
    <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {actions.map((action, index) => (
        <li key={action.key}>
          <a
            href={action.href}
            {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={buttonClasses(index === 0 ? "primary" : secondary, "w-full sm:w-auto")}
          >
            {action.icon}
            {action.label}
            {action.external ? <span className="sr-only"> (se abre en una ventana nueva)</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

const iconProps = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  className: "size-5 shrink-0",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

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

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}
