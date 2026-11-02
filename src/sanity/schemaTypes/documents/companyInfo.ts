import { defineField, defineType } from "sanity";

export const companyInfo = defineType({
  name: "companyInfo",
  title: "Presentación de la empresa",
  type: "document",
  groups: [
    { name: "intro", title: "Presentación", default: true },
    { name: "work", title: "Forma de trabajar" },
  ],
  fields: [
    defineField({
      name: "shortIntro",
      title: "Descripción breve",
      type: "text",
      rows: 2,
      group: "intro",
      description: "Frase factual usada en el pie de página y en los metadatos. No exageres ni inventes datos.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "history",
      title: "Historia",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      group: "intro",
      description: "Opcional. Un párrafo por elemento. Se oculta si está vacío.",
    }),
    defineField({
      name: "team",
      title: "Equipo (texto general)",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      group: "intro",
      description: "Presentación general del equipo, aparte de las biografías individuales.",
    }),
    defineField({
      name: "workingApproach",
      title: "Forma de trabajar",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      group: "work",
      description: "Opcional. Un párrafo por elemento.",
    }),
    defineField({
      name: "certifications",
      title: "Certificaciones",
      type: "array",
      of: [{ type: "string" }],
      group: "work",
      description: "Solo certificaciones reales, con documentación disponible.",
    }),
    defineField({
      name: "serviceSectors",
      title: "Tipos de trabajo",
      type: "array",
      group: "work",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Residencial", value: "residencial" },
          { title: "Comercial", value: "comercial" },
          { title: "Industrial", value: "industrial" },
        ],
      },
    }),
    defineField({
      name: "serviceArea",
      title: "Zona de trabajo",
      type: "string",
      group: "work",
      description: 'Ej. "Zaragoza y alrededores".',
    }),
    defineField({
      name: "brands",
      title: "Marcas con las que se trabaja",
      type: "array",
      of: [{ type: "string" }],
      group: "work",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Presentación de la empresa" }),
  },
});
