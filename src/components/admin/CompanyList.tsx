"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCompany } from "@/app/admin/actions";
import type { Company } from "@/lib/types";

export default function CompanyList({ companies }: { companies: Company[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDelete = (company: Company) => {
    if (!window.confirm(`Delete "${company.name}"? This cannot be undone.`)) return;

    setPendingId(company.id);
    startTransition(async () => {
      await deleteCompany(company.id);
      setPendingId(null);
      router.refresh();
    });
  };

  if (companies.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] border p-6 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}>
        No companies yet. Create one to get started.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border" style={{ borderColor: "var(--color-border)" }}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
              <td className="px-4 py-3 font-medium">{company.name}</td>
              <td className="px-4 py-3">
                <a href={`/${company.slug}`} target="_blank" rel="noopener noreferrer" className="underline">
                  /{company.slug}
                </a>
              </td>
              <td className="px-4 py-3" style={{ color: "var(--color-muted)" }}>
                {new Date(company.updated_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">
                  <Link href={`/admin/${company.id}/edit`} className="underline">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(company)}
                    disabled={isPending && pendingId === company.id}
                    className="cursor-pointer underline disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ color: "var(--color-danger)" }}
                  >
                    {isPending && pendingId === company.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
