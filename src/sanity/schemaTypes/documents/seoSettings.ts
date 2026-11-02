import { defineField, defineType } from "sanity";

const seoPage = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "metaTitle", title: "Título (SEO)", type: "string", validation: (Rule) => Rule.max(60).warning("Los buscadores suelen cortar títulos de más de 60 caracteres.") }),
      defineField({ name: "metaDescription", title: "Descripción (SEO)", type: "text", rows: 2, validation: (Rule) => Rule.max(160).warning("Los buscadores suelen cortar descripciones de más de 160 caracteres.") }),
    ],
  });

export const seoSettings = defineType({
  name: "seoSettings",
  title: "SEO por página",
  type: "document",
  description: "Títulos y descripciones para buscadores y redes sociales. Déjalos vacíos para usar el texto por defecto generado por el sitio.",
  fields: [
    seoPage("home", "Inicio"),
    seoPage("servicios", "Servicios"),
    seoPage("sobreOltenia", "Quiénes somos"),
    seoPage("trabajaConNosotros", "Trabaja con nosotros"),
    seoPage("contacto", "Contacto"),
  ],
  preview: { prepare: () => ({ title: "SEO por página" }) },
});
