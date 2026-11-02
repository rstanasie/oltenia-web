import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent">Error 404</p>
      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">No encontramos esta página</h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed">
        Puede que la dirección esté mal escrita o que la página ya no exista.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/trabaja-con-nosotros" variant="secondary">
          Trabaja con nosotros
        </ButtonLink>
      </div>
    </Container>
  );
}
