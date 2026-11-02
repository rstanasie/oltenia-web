import { defineField, defineType } from "sanity";

export const enDetallePage = defineType({
  name: "enDetallePage",
  title: "Página «En detalle»",
  type: "document",
  description:
    "Contenido educativo sobre el oficio y la antigua fabricación propia de conductos. Importante: Oltenia ya no fabrica conductos; este contenido es histórico y debe quedar claro que pertenece a una etapa anterior, no a un servicio actual.",
  groups: [
    { name: "intro", title: "Introducción", default: true },
    { name: "steps", title: "Pasos del proceso" },
  ],
  fields: [
    defineField({ name: "introText", title: "Párrafo de introducción", type: "text", rows: 3, group: "intro" }),
    defineField({ name: "experienceHeading", title: "Título de la sección de fabricación", type: "string", group: "intro", initialValue: "Nuestra experiencia en fabricación" }),
    defineField({ name: "experienceBody", title: "Texto de la sección de fabricación", type: "text", rows: 3, group: "intro" }),
    defineField({
      name: "archiveNote",
      title: "Nota de archivo",
      type: "string",
      group: "intro",
      initialValue: "Archivo de Oltenia · Fabricación propia de una etapa anterior",
      description: "Aviso breve, visible junto a las fotos, de que esta fabricación pertenece al pasado.",
    }),
    defineField({ name: "overviewImage", title: "Foto general del taller", type: "imageWithAlt", group: "intro" }),

    defineField({ name: "step1Heading", title: "Título: paso 1", type: "string", group: "steps", initialValue: "De una medida a una pieza" }),
    defineField({ name: "step1Body", title: "Texto: paso 1", type: "text", rows: 3, group: "steps" }),
    defineField({ name: "step1Image", title: "Foto: paso 1", type: "imageWithAlt", group: "steps" }),

    defineField({ name: "step2Heading", title: "Título: paso 2", type: "string", group: "steps", initialValue: "Donde se jugaba la precisión: uniones y perfiles" }),
    defineField({ name: "step2Body", title: "Texto: paso 2 (primera parte)", type: "text", rows: 3, group: "steps" }),
    defineField({ name: "step2ImageA", title: "Foto: paso 2a", type: "imageWithAlt", group: "steps" }),
    defineField({ name: "step2ImageB", title: "Foto: paso 2b", type: "imageWithAlt", group: "steps" }),
    defineField({ name: "step2BodyExtra", title: "Texto: paso 2 (segunda parte)", type: "text", rows: 3, group: "steps" }),
    defineField({ name: "step2ImageC", title: "Foto: paso 2c", type: "imageWithAlt", group: "steps" }),
    defineField({ name: "step2ImageD", title: "Foto: paso 2d", type: "imageWithAlt", group: "steps" }),

    defineField({ name: "step3Heading", title: "Título: paso 3", type: "string", group: "steps", initialValue: "De la pieza a la instalación" }),
    defineField({ name: "step3Body", title: "Texto: paso 3", type: "text", rows: 3, group: "steps" }),
    defineField({ name: "step3Image", title: "Foto: paso 3", type: "imageWithAlt", group: "steps" }),

    defineField({ name: "closingText", title: "Párrafo de cierre", type: "text", rows: 3, group: "intro" }),
  ],
  preview: { prepare: () => ({ title: "Página «En detalle»" }) },
});
