import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Servicio",
  type: "document",
  fields: [
    defineField({
      name: "serviceId",
      title: "Identificador",
      type: "string",
      options: {
        list: [
          { title: "Ventilación", value: "ventilacion" },
          { title: "Climatización", value: "climatizacion" },
          { title: "Aire acondicionado", value: "aire-acondicionado" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "name", title: "Nombre visible", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "summary", title: "Descripción", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: "activities",
      title: "Actividades confirmadas",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Instalación", value: "instalacion" },
          { title: "Mantenimiento", value: "mantenimiento" },
          { title: "Reparación", value: "reparacion" },
        ],
      },
      description: "Deja vacío hasta confirmar. Solo lo confirmado se muestra.",
    }),
    defineField({ name: "details", title: "Detalles adicionales", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "photo", title: "Foto", type: "imageWithAlt" }),
    defineField({ name: "order", title: "Orden", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Orden manual", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", media: "photo" },
  },
});
