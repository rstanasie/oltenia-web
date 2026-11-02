import type { Route } from "next";

export type NavItem = { href: Route; label: string };

export const mainNav: NavItem[] = [
  { href: "/servicios", label: "Qué hacemos" },
  { href: "/sobre-oltenia", label: "Quiénes somos" },
];

export const enDetalleNav: NavItem = { href: "/en-detalle", label: "En detalle" };

export const contactNav: NavItem = { href: "/contacto", label: "Contáctanos" };

export const recruitmentNav: NavItem = { href: "/trabaja-con-nosotros", label: "Trabaja con nosotros" };

export const legalNav: NavItem[] = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Privacidad" },
];
