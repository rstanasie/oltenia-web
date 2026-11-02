import { defineField, defineType } from "sanity";

/** Reusable image + required alt text, for photos embedded directly in a page (not part of a shared gallery). */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Imagen",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      description: "Describe lo que se ve en la foto, en una frase. Obligatorio para accesibilidad y SEO.",
      validation: (Rule) => Rule.required().min(10).error("Describe la foto en al menos 10 caracteres."),
    }),
  ],
});
