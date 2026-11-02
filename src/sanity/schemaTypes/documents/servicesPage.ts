import { defineField, defineType } from "sanity";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Página de servicios",
  type: "document",
  description: "Solo el encabezado. Los tres servicios (ventilación, climatización, aire acondicionado) se editan en «Servicios».",
  fields: [
    defineField({ name: "heroEyebrow", title: "Texto superior del titular", type: "string", initialValue: "Qué hacemos" }),
    defineField({ name: "heroHeading", title: "Titular", type: "string", initialValue: "El recorrido del aire" }),
    defineField({
      name: "heroIntroPara1",
      title: "Primer párrafo de introducción",
      type: "text",
      rows: 3,
      initialValue:
        "Cuando entras en un edificio bien acondicionado, no piensas en el aire que respiras. Pero detrás de esa sensación de confort hay un recorrido completo: equipos que tratan el aire, conductos que lo transportan y salidas que lo reparten donde sea necesario.",
    }),
    defineField({
      name: "heroIntroPara2",
      title: "Segundo párrafo de introducción",
      type: "text",
      rows: 3,
      initialValue:
        "Hacer posible ese recorrido exige más que montar piezas: hay que interpretar planos, tomar medidas y resolver cómo encaja la instalación en una obra donde cada espacio plantea retos distintos. Es un oficio que combina precisión, habilidad manual y criterio técnico, y en el que siempre hay algo nuevo que aprender.",
    }),
  ],
  preview: { prepare: () => ({ title: "Página de servicios" }) },
});
