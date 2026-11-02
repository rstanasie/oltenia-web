import { defineField, defineType } from "sanity";

const E164 = /^\+[1-9]\d{7,14}$/;
const phoneField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    description: 'Formato internacional sin espacios: "+34" seguido de los 9 dígitos.',
    validation: (Rule) => Rule.regex(E164, { name: "teléfono en formato internacional +34XXXXXXXXX" }),
  });

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contacto",
  type: "document",
  groups: [
    { name: "customer", title: "Clientes", default: true },
    { name: "recruitment", title: "Candidaturas" },
  ],
  fields: [
    phoneField("customerPhone", "Teléfono"),
    phoneField("customerWhatsapp", "WhatsApp"),
    defineField({ name: "customerEmail", title: "Correo electrónico", type: "email", group: "customer" }),
    defineField({
      name: "customerAddress",
      title: "Dirección pública",
      type: "postalAddress",
      group: "customer",
      description: "Déjala vacía si la empresa no quiere publicar la dirección.",
    }),
    defineField({
      name: "customerMapUrl",
      title: "Enlace al mapa (opcional)",
      type: "url",
      group: "customer",
      description: "Si se deja vacío y hay dirección, se genera un enlace de Google Maps automáticamente.",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "openingHours",
      title: "Horario de atención",
      type: "array",
      group: "customer",
      of: [{ type: "openingHour" }],
    }),
    defineField({
      name: "recruitmentSameAsCustomer",
      title: "Usar los mismos canales que clientes para candidaturas",
      type: "boolean",
      group: "recruitment",
      initialValue: true,
    }),
    defineField({
      name: "recruitmentPhone",
      title: "Teléfono (candidaturas)",
      type: "string",
      group: "recruitment",
      description: 'Formato internacional sin espacios: "+34" seguido de los 9 dígitos.',
      hidden: ({ document }) => Boolean(document?.recruitmentSameAsCustomer),
      validation: (Rule) => Rule.regex(E164, { name: "teléfono en formato internacional +34XXXXXXXXX" }),
    }),
    defineField({
      name: "recruitmentWhatsapp",
      title: "WhatsApp (candidaturas)",
      type: "string",
      group: "recruitment",
      hidden: ({ document }) => Boolean(document?.recruitmentSameAsCustomer),
      validation: (Rule) => Rule.regex(E164, { name: "teléfono en formato internacional +34XXXXXXXXX" }),
    }),
    defineField({
      name: "recruitmentEmail",
      title: "Correo electrónico (candidaturas)",
      type: "email",
      group: "recruitment",
      hidden: ({ document }) => Boolean(document?.recruitmentSameAsCustomer),
    }),
    defineField({
      name: "recruitmentWhatsappMessage",
      title: "Mensaje prellenado de WhatsApp",
      type: "text",
      rows: 3,
      group: "recruitment",
      initialValue:
        "Hola, me interesa trabajar en Oltenia. Me gustaría consultar si tenéis oportunidades disponibles. Mi experiencia es…",
    }),
    defineField({
      name: "recruitmentEmailSubject",
      title: "Asunto del correo",
      type: "string",
      group: "recruitment",
      initialValue: "Quiero trabajar en Oltenia",
    }),
    defineField({
      name: "recruitmentEmailBody",
      title: "Cuerpo del correo",
      type: "text",
      rows: 4,
      group: "recruitment",
      initialValue:
        "Hola,\n\nme interesa trabajar en Oltenia. Me gustaría consultar si tenéis oportunidades disponibles.\n\nMi experiencia es…\n\nMi disponibilidad es…\n",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contacto" }),
  },
});
