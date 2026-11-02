import { defineField, defineType } from "sanity";

export const relatedContentLink = defineType({
  name: "relatedContentLink",
  title: "Enlace relacionado",
  type: "object",
  description: "Enlaza únicamente a páginas que ya existen en el sitio. No inventes páginas nuevas.",
  fields: [
    defineField({ name: "label", title: "Texto del enlace", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "href",
      title: "Ruta interna",
      type: "string",
      description: 'Ruta dentro del sitio, p. ej. "/en-detalle" o "/servicios#conductos-interior". No pegues una URL completa.',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\/(?!\/)/, { name: "ruta interna que empiece por /" })
          .error('Debe ser una ruta interna que empiece por "/".'),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
