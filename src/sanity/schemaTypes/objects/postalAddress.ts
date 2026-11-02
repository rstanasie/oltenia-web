import { defineField, defineType } from "sanity";

export const postalAddress = defineType({
  name: "postalAddress",
  title: "Dirección postal",
  type: "object",
  fields: [
    defineField({ name: "street", title: "Calle y número", type: "string" }),
    defineField({
      name: "postalCode",
      title: "Código postal",
      type: "string",
      validation: (Rule) => Rule.regex(/^\d{5}$/, { name: "código postal de 5 dígitos" }),
    }),
    defineField({ name: "locality", title: "Localidad", type: "string" }),
    defineField({ name: "province", title: "Provincia", type: "string" }),
    defineField({ name: "country", title: "País", type: "string", initialValue: "España" }),
  ],
  preview: {
    select: { street: "street", locality: "locality" },
    prepare: ({ street, locality }) => ({ title: [street, locality].filter(Boolean).join(", ") || "Sin dirección" }),
  },
});
