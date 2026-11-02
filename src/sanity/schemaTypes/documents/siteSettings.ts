import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Marca y publicación",
  type: "document",
  groups: [
    { name: "brand", title: "Marca", default: true },
    { name: "publication", title: "Publicación" },
  ],
  fields: [
    defineField({ name: "brandName", title: "Nombre comercial", type: "string", group: "brand", initialValue: "Oltenia", validation: (Rule) => Rule.required() }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "brand",
      description: "Opcional. Mientras no haya logo, el sitio usa el logotipo tipográfico «Oltenia».",
    }),
    defineField({ name: "locationCity", title: "Ciudad", type: "string", group: "brand", initialValue: "Zaragoza", validation: (Rule) => Rule.required() }),
    defineField({ name: "locationCountry", title: "País", type: "string", group: "brand", initialValue: "España", validation: (Rule) => Rule.required() }),
    defineField({
      name: "publicationApproved",
      title: "Contenido aprobado para publicar",
      type: "boolean",
      group: "publication",
      initialValue: false,
      description:
        "Actívalo solo cuando los propietarios hayan revisado y aprobado todo el contenido del sitio. Mientras esté desactivado, el sitio se sirve en modo vista previa (no indexable).",
    }),
    defineField({
      name: "approvedBy",
      title: "Aprobado por",
      type: "string",
      group: "publication",
      hidden: ({ document }) => !document?.publicationApproved,
    }),
    defineField({
      name: "approvedOn",
      title: "Fecha de aprobación",
      type: "date",
      group: "publication",
      hidden: ({ document }) => !document?.publicationApproved,
    }),
  ],
  preview: {
    select: { title: "brandName", approved: "publicationApproved" },
    prepare: ({ title, approved }) => ({ title, subtitle: approved ? "Publicado" : "Vista previa (no publicado)" }),
  },
});
