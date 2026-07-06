import Link from "next/link";
import { COMPANIES_COLLECTION, db, docToCompany } from "@/lib/firebase/admin";
import CompanyList from "@/components/admin/CompanyList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const snapshot = await db
    .collection(COMPANIES_COLLECTION)
    .orderBy("updated_at", "desc")
    .get();
  const companies = snapshot.docs.map(docToCompany);

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Companies</h1>
        <Link
          href="/admin/new"
          className="rounded-[var(--radius-control)] bg-black px-4 py-2.5 text-sm font-semibold text-white"
        >
          New company
        </Link>
      </div>

      <div className="mt-6">
        <CompanyList companies={companies} />
      </div>
    </main>
  );
}
