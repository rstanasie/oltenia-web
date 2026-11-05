"use client";

import Link from "next/link";
import { useId, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function SolicitudForm({ vacancyTitle, vacancySlug }: { vacancyTitle: string; vacancySlug: string }) {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (status === "success") {
    return (
      <p className="rounded-lg border border-line bg-white px-5 py-4 leading-relaxed text-navy-900">
        Hemos recibido tu candidatura para <strong>{vacancyTitle}</strong>. Nos pondremos en contacto contigo si tu
        perfil encaja con lo que buscamos.
      </p>
    );
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");
        const form = e.currentTarget;
        const data = new FormData(form);
        data.set("vacancyTitle", vacancyTitle);
        data.set("vacancySlug", vacancySlug);
        data.set("privacyAccepted", data.get("privacyAccepted") ? "true" : "false");
        try {
          const res = await fetch("/api/candidaturas", { method: "POST", body: data });
          const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
          if (!res.ok || !body.ok) {
            setErrorMessage(body.error || "No se pudo enviar la candidatura. Inténtalo de nuevo.");
            setStatus("error");
            return;
          }
          setStatus("success");
        } catch {
          setErrorMessage("No se pudo enviar la candidatura. Comprueba tu conexión e inténtalo de nuevo.");
          setStatus("error");
        }
      }}
    >
      {/* Honeypot: hidden from real visitors, left empty by them, filled only by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-firstName`} className="text-sm font-semibold text-navy-900">
            Nombre
          </label>
          <input
            id={`${formId}-firstName`}
            name="firstName"
            type="text"
            required
            className="mt-1.5 w-full rounded-md border border-line px-4 py-2.5 text-navy-900 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-lastName`} className="text-sm font-semibold text-navy-900">
            Apellidos
          </label>
          <input
            id={`${formId}-lastName`}
            name="lastName"
            type="text"
            required
            className="mt-1.5 w-full rounded-md border border-line px-4 py-2.5 text-navy-900 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className="text-sm font-semibold text-navy-900">
            Correo electrónico
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-md border border-line px-4 py-2.5 text-navy-900 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className="text-sm font-semibold text-navy-900">
            Teléfono
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            required
            className="mt-1.5 w-full rounded-md border border-line px-4 py-2.5 text-navy-900 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="text-sm font-semibold text-navy-900">
          Cuéntanos sobre ti
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          required
          className="mt-1.5 w-full rounded-md border border-line px-4 py-2.5 text-navy-900 focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-cv`} className="text-sm font-semibold text-navy-900">
          Adjuntar CV (PDF, máximo 10 MB)
        </label>
        <input
          id={`${formId}-cv`}
          name="cv"
          type="file"
          required
          accept=".pdf,application/pdf"
          className="mt-1.5 w-full rounded-md border border-line bg-white px-4 py-2 text-navy-900 file:mr-3 file:rounded file:border-0 file:bg-paper file:px-3 file:py-1.5 file:font-semibold focus:border-accent focus:outline-none"
        />
      </div>

      <label htmlFor={`${formId}-privacy`} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
        <input id={`${formId}-privacy`} name="privacyAccepted" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-accent" />
        <span>
          He leído y acepto la{" "}
          <Link href="/privacidad" target="_blank" className="font-semibold text-accent underline-offset-4 hover:underline">
            política de privacidad
          </Link>
          .
        </span>
      </label>

      {status === "error" ? <p className="text-sm font-semibold text-red-700">{errorMessage}</p> : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-accent px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none sm:w-auto"
      >
        {status === "submitting" ? "Enviando…" : "Enviar candidatura"}
      </button>
    </form>
  );
}
