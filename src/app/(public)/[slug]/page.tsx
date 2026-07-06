import { notFound } from "next/navigation";
import Image from "next/image";
import { COMPANIES_COLLECTION, db, docToCompany } from "@/lib/firebase/admin";
import { buildCompanyUrl } from "@/lib/qrcode";
import { SOCIAL_FIELDS } from "@/lib/validation/companySchema";
import SocialLinkCard from "@/components/public/SocialLinkCard";
import ShareButton from "@/components/public/ShareButton";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const snapshot = await db
    .collection(COMPANIES_COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const company = snapshot.empty ? null : docToCompany(snapshot.docs[0]);

  if (!company) notFound();

  const themeColor = company.theme_color || "#000000";

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--color-surface)" }}
    >
      <section
        className="flex flex-col items-center gap-4 px-6 pb-10 pt-16 text-center text-white"
        style={{
          background: `linear-gradient(180deg, ${themeColor} 0%, ${themeColor}cc 100%)`,
        }}
      >
        {company.logo_url && (
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg">
            <Image
              src={company.logo_url}
              alt={company.name}
              width={96}
              height={96}
              unoptimized
              className="h-full w-full object-contain"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold">
          {company.tagline || company.name}
        </h1>
        {company.description && (
          <p className="max-w-md text-sm text-white/90">
            {company.description}
          </p>
        )}
      </section>

      <section className="mx-auto flex max-w-md flex-col gap-3 px-6 py-8">
        {SOCIAL_FIELDS.filter((field) => company[field]).map((field) => (
          <SocialLinkCard
            key={field}
            platform={field}
            url={company[field] as string}
            themeColor={themeColor}
          />
        ))}
      </section>

      <ShareButton url={buildCompanyUrl(company.slug)} title={company.name} />
    </main>
  );
}
