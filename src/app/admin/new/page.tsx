import Link from "next/link";
import CompanyForm from "@/components/admin/CompanyForm";

export default function NewCompanyPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-10">
      <Link href="/admin" className="text-sm underline">
        ← Back to companies
      </Link>
      <h1 className="mt-4 text-xl font-semibold">New company</h1>
      <div className="mt-6">
        <CompanyForm />
      </div>
    </main>
  );
}
