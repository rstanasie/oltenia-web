import { defineField, defineType } from "sanity";

export const vacancy = defineType({
  name: "vacancy",
  title: "Oferta de empleo",
  type: "document",
  description: "Solo publica ofertas reales y confirmadas por la empresa. No crees ofertas de ejemplo.",
  groups: [
    { name: "main", title: "Datos principales", default: true },
    { name: "details", title: "Detalles" },
    { name: "conditions", title: "Condiciones" },
  ],
  fields: [
    defineField({ name: "title", title: "Título del puesto", type: "string", group: "main", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Identificador",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      group: "main",
      options: { list: [{ title: "Abierta", value: "open" }, { title: "Cerrada", value: "closed" }], layout: "radio" },
      initialValue: "closed",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Descripción breve (para la tarjeta)",
      type: "string",
      group: "main",
      description: 'Ej. "Primeros pasos" o "Trabajo autónomo". No repitas aquí lo que ya dice la introducción de la sección.',
    }),
    defineField({ name: "location", title: "Ubicación", type: "string", group: "main" }),
    defineField({
      name: "summary",
      title: "Introducción del puesto",
      type: "text",
      rows: 3,
      group: "main",
      description: "Obligatorio para publicar la oferta como abierta.",
      validation: (Rule) => Rule.custom((value, context) => {
        const doc = context.document as { status?: string } | undefined;
        if (doc?.status === "open" && !value) return "Las ofertas abiertas necesitan una introducción.";
        return true;
      }),
    }),
    defineField({ name: "datePosted", title: "Fecha de publicación", type: "date", group: "main" }),
    defineField({ name: "validThrough", title: "Válida hasta", type: "date", group: "main" }),

    defineField({ name: "responsibilities", title: "Qué harás", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({
      name: "essentialRequirements",
      title: "Qué necesitas — imprescindible",
      type: "array",
      of: [{ type: "string" }],
      group: "details",
      description: "Solo lo realmente imprescindible para hacer el trabajo. No añadas requisitos que no sean necesarios.",
    }),
    defineField({
      name: "desirableRequirements",
      title: "Qué necesitas — valorable",
      type: "array",
      of: [{ type: "string" }],
      group: "details",
      description: "Se valora pero no es obligatorio para presentarse.",
    }),
    defineField({ name: "learningOpportunities", title: "Qué puedes aprender", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "drivingLicence", title: "Carné de conducir", type: "string", group: "details" }),
    defineField({ name: "benefits", title: "Qué se ofrece", type: "array", of: [{ type: "string" }], group: "details", description: "Solo condiciones reales." }),
    defineField({ name: "applicationInstructions", title: "Cómo presentarse", type: "text", rows: 2, group: "details" }),

    defineField({ name: "schedule", title: "Horario", type: "string", group: "conditions" }),
    defineField({
      name: "travelExpectations",
      title: "Desplazamientos para este puesto",
      type: "text",
      rows: 2,
      group: "conditions",
      description: "Solo si este puesto concreto tiene expectativas de desplazamiento distintas de las condiciones generales.",
    }),
    defineField({
      name: "contractType",
      title: "Tipo de contrato",
      type: "string",
      group: "conditions",
      options: {
        list: [
          { title: "Indefinido", value: "indefinido" },
          { title: "Temporal", value: "temporal" },
          { title: "Fijo discontinuo", value: "fijo-discontinuo" },
          { title: "Prácticas", value: "practicas" },
          { title: "Formación", value: "formacion" },
          { title: "Colaboración como autónomo", value: "autonomo" },
        ],
      },
    }),
    defineField({
      name: "salaryRange",
      title: "Salario",
      type: "salaryRange",
      group: "conditions",
      description:
        "Deja vacío hasta que el rango esté aprobado por la empresa y comprobado contra el convenio aplicable. No publiques una cifra sin esa confirmación.",
    }),
  ],
  orderings: [{ title: "Más recientes primero", name: "datePostedDesc", by: [{ field: "datePosted", direction: "desc" }] }],
  preview: {
    select: { title: "title", status: "status" },
    prepare: ({ title, status }) => ({ title, subtitle: status === "open" ? "Abierta" : "Cerrada" }),
  },
});
