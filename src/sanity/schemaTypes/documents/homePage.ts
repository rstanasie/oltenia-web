import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Página de inicio",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Texto superior del titular", type: "string", initialValue: "Base en Zaragoza · alcance nacional" }),
    defineField({ name: "heroHeadline", title: "Titular", type: "string", initialValue: "Ventilación y climatización", validation: (Rule) => Rule.required() }),
    defineField({
      name: "heroSubtext",
      title: "Texto de apoyo",
      type: "text",
      rows: 3,
      initialValue: "Instalamos sistemas de climatización y ventilación. Conoce nuestro trabajo y descubre cómo formar parte del equipo.",
    }),
    defineField({ name: "primaryCtaLabel", title: "Botón principal", type: "string", initialValue: "Trabaja con nosotros" }),
    defineField({ name: "secondaryCtaLabel", title: "Botón secundario", type: "string", initialValue: "Conoce nuestros servicios" }),
  ],
  preview: { prepare: () => ({ title: "Página de inicio" }) },
});
