import { defineField, defineType } from "sanity";

export const photo = defineType({
  name: "photo",
  title: "Foto",
  type: "document",
  description: "Fotos reales de trabajos, equipo o instalaciones. No uses fotos de banco presentadas como trabajo de Oltenia.",
  fields: [
    defineField({ name: "image", title: "Imagen", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      description: "Describe qué se ve y dónde, en una frase concreta.",
      validation: (Rule) => Rule.required().min(10).error("Describe la foto en al menos 10 caracteres."),
    }),
    defineField({
      name: "caption",
      title: "Pie de foto / categoría",
      type: "string",
      description: 'Se muestra junto a la foto y agrupa fotos de la misma categoría, p. ej. "Conductos en exterior".',
    }),
    defineField({
      name: "collection",
      title: "Colección",
      type: "string",
      options: {
        list: [
          { title: "Proyectos", value: "proyectos" },
          { title: "Equipo", value: "equipo" },
          { title: "Instalaciones", value: "instalaciones" },
        ],
      },
      initialValue: "proyectos",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isHistoricalArchive",
      title: "Archivo histórico (fabricación propia, ya no vigente)",
      type: "boolean",
      initialValue: false,
      description:
        "Actívalo para fotos de la antigua fabricación propia de conductos. Oltenia ya no fabrica: estas fotos solo deben usarse en contenido educativo que explique claramente que pertenecen al pasado.",
    }),
    defineField({
      name: "publicationApproved",
      title: "Permiso de publicación",
      type: "boolean",
      initialValue: false,
      description: "Actívalo solo con permiso por escrito (personas que aparecen, cliente u obra). Mientras esté desactivado, la foto no se muestra en el sitio.",
    }),
    defineField({ name: "order", title: "Orden", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Orden manual", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { media: "image", title: "caption", subtitle: "alt", approved: "publicationApproved" },
    prepare: ({ media, title, subtitle, approved }) => ({
      media,
      title: title || subtitle || "Foto sin descripción",
      subtitle: approved ? undefined : "Sin aprobar para publicar",
    }),
  },
});
