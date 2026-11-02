import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "secondary-dark";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-base font-semibold leading-tight transition-colors duration-150 motion-reduce:transition-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  secondary: "border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white",
  "secondary-dark": "border-2 border-white/70 text-white hover:border-white hover:bg-white hover:text-navy-900",
};

export function buttonClasses(variant: ButtonVariant = "primary", className = ""): string {
  return `${base} ${variants[variant]} ${className}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: Route;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, className)}>
      {children}
    </Link>
  );
}
