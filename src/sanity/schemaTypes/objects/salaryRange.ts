import { defineField, defineType } from "sanity";

export const salaryRange = defineType({
  name: "salaryRange",
  title: "Rango salarial",
  type: "object",
  description: "Déjalo vacío si no se quiere publicar el salario.",
  fields: [
    defineField({ name: "min", title: "Mínimo", type: "number", validation: (Rule) => Rule.required().positive() }),
    defineField({
      name: "max",
      title: "Máximo",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .positive()
          .custom((max, context) => {
            const min = (context.parent as { min?: number } | undefined)?.min;
            if (typeof max === "number" && typeof min === "number" && max < min) {
              return "El máximo debe ser mayor o igual que el mínimo.";
            }
            return true;
          }),
    }),
    defineField({
      name: "period",
      title: "Periodo",
      type: "string",
      options: { list: [{ title: "Por hora", value: "hora" }, { title: "Por mes", value: "mes" }, { title: "Por año", value: "año" }] },
      initialValue: "mes",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "gross", title: "¿Importe bruto?", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { min: "min", max: "max", period: "period" },
    prepare: ({ min, max, period }) => ({ title: `${min}–${max} € / ${period}` }),
  },
});
