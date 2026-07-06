import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPANIES_COLLECTION, db, docToCompany } from "@/lib/firebase/admin";
import CompanyForm from "@/components/admin/CompanyForm";
import QrPreview from "@/components/admin/QrPreview";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doc = await db.collection(COMPANIES_COLLECTION).doc(id).get();

  if (!doc.exists) notFound();
  const company = docToCompany(doc);

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-10">
      <Link href="/admin" className="text-sm underline">
        ← Back to companies
      </Link>
      <h1 className="mt-4 text-xl font-semibold">Edit {company.name}</h1>

      <div className="mt-6">
        <QrPreview company={company} />
      </div>

      <div className="mt-6">
        <CompanyForm company={company} />
      </div>
    </main>
  );
}
