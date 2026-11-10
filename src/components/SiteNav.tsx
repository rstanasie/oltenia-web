"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { buttonClasses } from "@/components/Button";
import { enDetalleNav, mainNav, recruitmentNav } from "@/lib/navigation";

function isCurrent(pathname: string, href: string) {
  const [path] = href.split("#");
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const recruitmentCurrent = isCurrent(pathname, recruitmentNav.href);
  const enDetalleCurrent = isCurrent(pathname, enDetalleNav.href);

  return (
    <>
      <nav aria-label="Principal" className="hidden md:block">
        <ul className="flex items-center gap-1">
          {mainNav.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`relative inline-flex min-h-11 items-center px-3 text-[0.95rem] font-semibold transition-colors motion-reduce:transition-none ${
                    current ? "text-navy-900" : "text-muted hover:text-navy-900"
                  } after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:rounded-full ${
                    current ? "after:bg-accent" : "after:bg-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-3">
            <Link
              href={recruitmentNav.href}
              aria-current={recruitmentCurrent ? "page" : undefined}
              className={buttonClasses("primary", `min-h-11 py-2 ${recruitmentCurrent ? "ring-2 ring-accent ring-offset-2" : ""}`)}
            >
              {recruitmentNav.label}
            </Link>
          </li>
          <li>
            <Link
              href={enDetalleNav.href}
              aria-current={enDetalleCurrent ? "page" : undefined}
              className={`relative inline-flex min-h-11 items-center px-3 text-[0.95rem] font-semibold transition-colors motion-reduce:transition-none ${
                enDetalleCurrent ? "text-navy-900" : "text-muted hover:text-navy-900"
              } after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:rounded-full ${
                enDetalleCurrent ? "after:bg-accent" : "after:bg-transparent"
              }`}
            >
              {enDetalleNav.label}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-2 md:hidden">
        <div className="hidden min-[440px]:block">
          <Link
            href={recruitmentNav.href}
            aria-current={recruitmentCurrent ? "page" : undefined}
            className={buttonClasses("primary", "min-h-11 whitespace-nowrap px-4 py-2 text-sm")}
          >
            {recruitmentNav.label}
          </Link>
        </div>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            setOpenedAt(pathname);
            setOpen((value) => !value);
          }}
          className="inline-flex size-11 items-center justify-center rounded-md border border-line text-navy-900 hover:bg-navy-100"
        >
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-white shadow-lg md:hidden"
      >
        <nav aria-label="Principal móvil" className="mx-auto max-w-site px-5 py-4 sm:px-8">
          <ul className="flex flex-col">
            <li className="pb-3">
              <Link
                href={recruitmentNav.href}
                aria-current={recruitmentCurrent ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={buttonClasses("primary", "w-full")}
              >
                {recruitmentNav.label}
              </Link>
            </li>
            {mainNav.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href} className="border-t border-line first:border-t-0">
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-12 items-center justify-between py-3 text-lg font-semibold ${
                      current ? "text-accent" : "text-navy-900"
                    }`}
                  >
                    {item.label}
                    {current ? <span aria-hidden="true" className="text-sm font-medium text-muted">Página actual</span> : null}
                  </Link>
                </li>
              );
            })}
            <li className="border-t border-line">
              <Link
                href={enDetalleNav.href}
                aria-current={enDetalleCurrent ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex min-h-12 items-center justify-between py-3 text-lg font-semibold ${
                  enDetalleCurrent ? "text-accent" : "text-navy-900"
                }`}
              >
                {enDetalleNav.label}
                {enDetalleCurrent ? <span aria-hidden="true" className="text-sm font-medium text-muted">Página actual</span> : null}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
