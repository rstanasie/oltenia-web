import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Persona del equipo",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "role", title: "Cargo", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "bio",
      title: "Biografía",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      description: "Un párrafo por elemento, confirmado por la persona.",
    }),
    defineField({ name: "photo", title: "Foto", type: "imageWithAlt" }),
    defineField({ name: "order", title: "Orden", type: "number", description: "Determina el orden en la página «Quiénes somos».", initialValue: 0 }),
  ],
  orderings: [{ title: "Orden manual", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
