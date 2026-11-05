import { defineField, defineType } from "sanity";

export const jobApplication = defineType({
  name: "jobApplication",
  title: "Candidatura",
  type: "document",
  description: "Creada automáticamente cuando alguien envía el formulario de candidatura del sitio web. No se edita desde aquí, solo se revisa.",
  fields: [
    defineField({ name: "firstName", title: "Nombre", type: "string", readOnly: true, validation: (Rule) => Rule.required() }),
    defineField({ name: "lastName", title: "Apellidos", type: "string", readOnly: true, validation: (Rule) => Rule.required() }),
    defineField({ name: "email", title: "Correo electrónico", type: "string", readOnly: true, validation: (Rule) => Rule.required() }),
    defineField({ name: "phone", title: "Teléfono", type: "string", readOnly: true }),
    defineField({
      name: "vacancyTitle",
      title: "Puesto",
      type: "string",
      readOnly: true,
      description: '"Candidatura general" si no se presentó a un puesto concreto.',
    }),
    defineField({ name: "vacancySlug", title: "Puesto (slug)", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Mensaje / experiencia", type: "text", rows: 4, readOnly: true }),
    defineField({ name: "cv", title: "Currículum", type: "file", readOnly: true }),
    defineField({ name: "privacyAccepted", title: "Aceptó la política de privacidad", type: "boolean", readOnly: true }),
    defineField({ name: "submittedAt", title: "Fecha de envío", type: "datetime", readOnly: true }),
    defineField({ name: "reviewed", title: "Revisada", type: "boolean", initialValue: false }),
  ],
  orderings: [{ title: "Más recientes primero", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { firstName: "firstName", lastName: "lastName", subtitle: "vacancyTitle", reviewed: "reviewed" },
    prepare: ({ firstName, lastName, subtitle, reviewed }) => ({
      title: [firstName, lastName].filter(Boolean).join(" "),
      subtitle: `${subtitle || "Candidatura general"}${reviewed ? "" : " · Sin revisar"}`,
    }),
  },
});
