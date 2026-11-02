import { defineField, defineType } from "sanity";

export const openingHour = defineType({
  name: "openingHour",
  title: "Horario",
  type: "object",
  fields: [
    defineField({ name: "days", title: "Días", type: "string", description: 'Ej. "Lunes a viernes".', validation: (Rule) => Rule.required() }),
    defineField({ name: "hours", title: "Horas", type: "string", description: 'Ej. "8:00–14:00".', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { days: "days", hours: "hours" },
    prepare: ({ days, hours }) => ({ title: `${days}: ${hours}` }),
  },
});
