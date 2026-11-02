import Image from "next/image";
import type { CompanyContent } from "@/content/types";

export function Wordmark({ brand, tone = "dark" }: { brand: CompanyContent["brand"]; tone?: "dark" | "light" }) {
  const { logo, name } = brand;
  if (logo) {
    return <Image src={logo.src} alt={name} width={logo.width} height={logo.height} className="h-8 w-auto" priority />;
  }
  return (
    <span className={`inline-flex items-baseline gap-1 text-[1.4rem] font-extrabold uppercase leading-none tracking-[0.14em] ${tone === "light" ? "text-white" : "text-navy-900"}`}>
      {name}
      <span aria-hidden="true" className={`inline-block size-2 rounded-full ${tone === "light" ? "bg-accent-soft" : "bg-accent"}`} />
    </span>
  );
}
