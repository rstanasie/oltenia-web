"use client";

import { useId, useState } from "react";
import type { ContactChannels } from "@/content/types";
import { mailtoHref, whatsappHref } from "@/lib/contact";

function buildMessage(fields: { name: string; phone: string; message: string }) {
  const lines = [`Nombre: ${fields.name || "—"}`, `Teléfono: ${fields.phone || "—"}`, "", fields.message];
  return lines.join("\n");
}

export function ApplicationForm({ channels, brandName }: { channels: ContactChannels; brandName: string }) {
  const formId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  if (!channels.email && !channels.whatsapp) {
    return (
      <p className="rounded-lg border border-line bg-white px-5 py-4 leading-relaxed text-muted">
        Todavía no hemos publicado un canal de contacto para candidaturas. Cuando esté disponible, aparecerá aquí.
      </p>
    );
  }

  const body = buildMessage({ name, phone, message });
  const subject = `Candidatura para ${brandName}${name ? ` · ${name}` : ""}`;
  const canSubmit = name.trim() !== "" && message.trim() !== "" && (email.trim() !== "" || phone.trim() !== "");

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        const href = channels.email
          ? mailtoHref(channels.email, subject, email ? `${body}\nCorreo de contacto: ${email}` : body)
          : whatsappHref(channels.whatsapp as string, `${subject}\n\n${body}`);
        window.location.href = href;
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className="text-sm font-semibold text-navy-900">
            Nombre completo
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line px-4 py-2 text-navy-900 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className="text-sm font-semibold text-navy-900">
            Correo electrónico
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line px-4 py-2 text-navy-900 focus:border-accent focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-phone`} className="text-sm font-semibold text-navy-900">
            Teléfono
          </label>
          <input
            id={`${formId}-phone`}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line px-4 py-2 text-navy-900 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="text-sm font-semibold text-navy-900">
          Cuéntanos tu experiencia
        </label>
        <textarea
          id={`${formId}-message`}
          rows={3}
          required
          placeholder="Tu experiencia, el tipo de trabajo que buscas y tu disponibilidad."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-line px-4 py-2 text-navy-900 focus:border-accent focus:outline-none"
        />
      </div>

      <p className="text-sm leading-relaxed text-muted">
        Al enviar, se abrirá tu aplicación de correo con este mensaje ya redactado, listo para revisar y enviar a{" "}
        {brandName}.
      </p>

      <button type="submit" disabled={!canSubmit} className="w-full rounded-md bg-accent px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none sm:w-auto">
        Enviar
      </button>
    </form>
  );
}
