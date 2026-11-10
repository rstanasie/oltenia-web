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
      <h1 className="text-4xl font-extrabold sm:text-5xl">No encontramos esta página</h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed">
        Puede que la dirección esté mal escrita o que la página ya no exista.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/trabaja-con-nosotros#puestos-abiertos" variant="secondary">
          Trabaja con nosotros
        </ButtonLink>
      </div>
    </Container>
  );
}
