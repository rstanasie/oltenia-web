import { defineField, defineType } from "sanity";

export const careerStage = defineType({
  name: "careerStage",
  title: "Etapa del oficio",
  type: "document",
  description:
    "Contenido educativo e ilustrativo sobre el desarrollo profesional en el oficio. No es una clasificación laboral oficial: verifica los nombres y la redacción contra el convenio colectivo aplicable antes de publicar cambios importantes.",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "subtitle", title: "Subtítulo", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Descripción", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "responsibilities", title: "Qué implica", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "competencies", title: "Competencias técnicas", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "quote", title: "Cita (opcional)", type: "text", rows: 2 }),
    defineField({ name: "note", title: "Nota aclaratoria (opcional)", type: "text", rows: 2, description: "Ej. aclarar que un puesto no es una promoción garantizada." }),
    defineField({
      name: "relatedContent",
      title: "Contenido relacionado",
      type: "array",
      of: [{ type: "relatedContentLink" }],
      description: "Enlaces a páginas educativas que ya existen en el sitio (p. ej. «En detalle»). No inventes páginas nuevas.",
    }),
    defineField({ name: "order", title: "Orden", type: "number", description: "Determina la posición en el camino profesional.", validation: (Rule) => Rule.required() }),
  ],
  orderings: [{ title: "Orden manual", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "subtitle", order: "order" },
    prepare: ({ title, subtitle, order }) => ({ title: `${order}. ${title}`, subtitle }),
  },
});
