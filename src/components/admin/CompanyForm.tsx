"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  companySchema,
  CompanyFormValues,
  SOCIAL_FIELDS,
  SocialField,
} from "@/lib/validation/companySchema";
import { createCompany, updateCompany } from "@/app/admin/actions";
import type { Company } from "@/lib/types";

const SOCIAL_LABELS: Record<
  SocialField,
  { label: string; placeholder: string }
> = {
  whatsapp: { label: "WhatsApp", placeholder: "https://wa.me/201234567890" },
  facebook: { label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  instagram: {
    label: "Instagram",
    placeholder: "https://instagram.com/yourpage",
  },
  tiktok: { label: "TikTok", placeholder: "https://tiktok.com/@yourpage" },
  twitter: { label: "Twitter / X", placeholder: "https://x.com/yourpage" },
  website: { label: "Website", placeholder: "https://yourcompany.com" },
};

const inputClass =
  "mt-2 w-full rounded-[var(--radius-control)] border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10";
const labelClass = "text-sm font-medium";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CompanyForm({ company }: { company?: Company }) {
  const router = useRouter();
  const isEdit = Boolean(company);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name ?? "",
      slug: company?.slug ?? "",
      tagline: company?.tagline ?? "",
      description: company?.description ?? "",
      themeColor: company?.theme_color ?? "#1a73e8",
      logoUrl: company?.logo_url ?? "",
      whatsapp: company?.whatsapp ?? "",
      facebook: company?.facebook ?? "",
      instagram: company?.instagram ?? "",
      tiktok: company?.tiktok ?? "",
      twitter: company?.twitter ?? "",
      website: company?.website ?? "",
    },
  });

  const themeColor = watch("themeColor");
  const logoUrl = watch("logoUrl");

  const [formError, setFormError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setValue("name", value, { shouldValidate: true });
    if (!isEdit && !touchedFields.slug) {
      setValue("slug", slugify(value), { shouldValidate: true });
    }
  };

  const onSubmit = async (values: CompanyFormValues) => {
    setFormError(null);

    const formData = new FormData();
    (
      Object.entries(values) as [keyof CompanyFormValues, string | undefined][]
    ).forEach(([key, value]) => {
      formData.set(key, value ?? "");
    });

    const result =
      isEdit && company
        ? await updateCompany(company.id, formData)
        : await createCompany(formData);

    if (result.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof CompanyFormValues, { message });
      });
      return;
    }

    if (result.error) {
      setFormError(result.error);
      return;
    }

    router.push(`/admin/${result.id}/edit?created=${isEdit ? "0" : "1"}`);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {formError && (
        <div
          className="rounded-[var(--radius-control)] border p-3 text-sm"
          style={{
            background: "var(--color-danger-bg)",
            borderColor: "var(--color-danger-border)",
            color: "var(--color-danger)",
          }}
        >
          {formError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Company name</label>
          <input
            className={inputClass}
            style={{ borderColor: "var(--color-border)" }}
            {...register("name", {
              onChange: (e) => handleNameChange(e.target.value),
            })}
            placeholder="Elle Boutique"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Slug</label>
          <input
            className={inputClass}
            style={{ borderColor: "var(--color-border)" }}
            {...register("slug")}
            placeholder="elle-boutique"
          />
          {errors.slug && (
            <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Tagline</label>
        <input
          className={inputClass}
          style={{ borderColor: "var(--color-border)" }}
          {...register("tagline")}
          placeholder="Elle Boutique goes social"
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          className={inputClass}
          style={{ borderColor: "var(--color-border)" }}
          rows={3}
          {...register("description")}
          placeholder="Now you can do more than just shop..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Theme color</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="color"
              value={
                /^#([0-9a-fA-F]{6})$/.test(themeColor) ? themeColor : "#000000"
              }
              onChange={(e) =>
                setValue("themeColor", e.target.value, { shouldValidate: true })
              }
              className="h-10 w-12 cursor-pointer rounded border"
              style={{ borderColor: "var(--color-border)" }}
            />
            <input
              className={inputClass + " mt-0"}
              style={{ borderColor: "var(--color-border)" }}
              {...register("themeColor")}
              placeholder="#1a73e8"
            />
          </div>
          {errors.themeColor && (
            <p className="mt-1 text-xs text-red-600">
              {errors.themeColor.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Logo URL</label>
          <div className="mt-2 flex items-center gap-3">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="Logo preview"
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 rounded-lg border object-contain"
              />
            )}
            <input
              className={inputClass + " mt-0"}
              style={{ borderColor: "var(--color-border)" }}
              {...register("logoUrl")}
              placeholder="https://yoursite.com/logo.png"
            />
          </div>
          {errors.logoUrl && (
            <p className="mt-1 text-xs text-red-600">
              {errors.logoUrl.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Social links</h3>
        <p className="mt-1 text-xs" style={{ color: "var(--color-muted)" }}>
          Fill in at least one. Leave the rest blank to hide them from the page.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field}>
              <label className={labelClass}>{SOCIAL_LABELS[field].label}</label>
              <input
                className={inputClass}
                style={{ borderColor: "var(--color-border)" }}
                {...register(field)}
                placeholder={SOCIAL_LABELS[field].placeholder}
              />
              {errors[field] && (
                <p className="mt-1 text-xs text-red-600">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="rounded-[var(--radius-control)] bg-black px-4 py-2.5 text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? "Saving..."
          : isEdit
            ? "Save changes"
            : "Create company"}
      </button>
    </div>
  );
}
