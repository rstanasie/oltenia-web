import { defineField, defineType } from "sanity";

export const recruitmentPage = defineType({
  name: "recruitmentPage",
  title: "Página «Trabaja con nosotros»",
  type: "document",
  description: "Encabezado de la página. Las ofertas se editan en «Ofertas de empleo» y el camino profesional en «Etapas del oficio».",
  fields: [
    defineField({ name: "heroEyebrow", title: "Texto superior del titular", type: "string" }),
    defineField({
      name: "heroHeadline",
      title: "Titular",
      type: "string",
      initialValue: "Un oficio que se aprende trabajando.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtext",
      title: "Texto de apoyo",
      type: "text",
      rows: 3,
      initialValue:
        "Detrás de cada instalación hay conocimientos, precisión y experiencia. Descubre cómo es trabajar en ventilación y climatización y todo lo que puedes llegar a aprender.",
    }),
    defineField({ name: "primaryCtaLabel", title: "Botón principal", type: "string", initialValue: "Descubre tu camino" }),
    defineField({ name: "secondaryCtaLabel", title: "Botón secundario", type: "string", initialValue: "Quiero trabajar en Oltenia" }),
  ],
  preview: { prepare: () => ({ title: "Página «Trabaja con nosotros»" }) },
});
