import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { Wordmark } from "@/components/Wordmark";
import { getCompany } from "@/content/company";

export async function Header() {
  const company = await getCompany();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="relative mx-auto flex h-18 w-full max-w-site items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="inline-flex min-h-11 items-center" aria-label={`${company.brand.name}, inicio`}>
          <Wordmark brand={company.brand} />
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
