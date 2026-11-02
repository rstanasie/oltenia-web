import Link from "next/link";
import { Container } from "@/components/Container";
import { Wordmark } from "@/components/Wordmark";
import { getCompany } from "@/content/company";
import { formatPhone, mailtoHref, telHref, whatsappHref } from "@/lib/contact";
import { customerChannels } from "@/lib/content";
import { contactNav, enDetalleNav, legalNav, mainNav, recruitmentNav } from "@/lib/navigation";

export async function Footer() {
  const company = await getCompany();
  const channels = customerChannels(company);
  const year = new Date().getFullYear();
  const linkClass = "inline-flex min-h-10 items-center text-navy-200 hover:text-white hover:underline underline-offset-4";

  return (
    <footer className="on-dark mt-auto bg-navy-950 text-navy-200">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex min-h-11 items-center" aria-label={`${company.brand.name}, inicio`}>
            <Wordmark brand={company.brand} tone="light" />
          </Link>
          <p className="mt-4 leading-relaxed">{company.intro.short}</p>
          <p className="mt-3 font-semibold text-white">
            {company.location.city}, {company.location.country}
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Navegación</h2>
          <ul className="mt-3">
            {[...mainNav, enDetalleNav, contactNav, recruitmentNav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-8">
          {channels.phone || channels.whatsapp || channels.email ? (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Contacto</h2>
              <ul className="mt-3">
                {channels.phone ? (
                  <li>
                    <a href={telHref(channels.phone)} className={linkClass}>
                      {formatPhone(channels.phone)}
                    </a>
                  </li>
                ) : null}
                {channels.whatsapp ? (
                  <li>
                    <a href={whatsappHref(channels.whatsapp)} className={linkClass} rel="noopener noreferrer" target="_blank">
                      WhatsApp<span className="sr-only"> (se abre en una ventana nueva)</span>
                    </a>
                  </li>
                ) : null}
                {channels.email ? (
                  <li>
                    <a href={mailtoHref(channels.email)} className={`${linkClass} break-all`}>
                      {channels.email}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Legal</h2>
            <ul className="mt-3">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-5 text-sm">
          © {year} {company.brand.name}
        </Container>
      </div>
    </footer>
  );
}
