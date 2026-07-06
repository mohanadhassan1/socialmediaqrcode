"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { COMPANIES_COLLECTION, db } from "@/lib/firebase/admin";
import { companySchema, SOCIAL_FIELDS } from "@/lib/validation/companySchema";

export interface CompanyActionResult {
  error?: string;
  fieldErrors?: Record<string, string>;
  id?: string;
  slug?: string;
}

const TEXT_FIELDS = [
  "name",
  "slug",
  "tagline",
  "description",
  "themeColor",
  "logoUrl",
  ...SOCIAL_FIELDS,
] as const;

function readFormValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const field of TEXT_FIELDS) {
    values[field] = (formData.get(field) as string | null)?.trim() ?? "";
  }
  return values;
}

function fieldErrorsFrom(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const snapshot = await db
    .collection(COMPANIES_COLLECTION)
    .where("slug", "==", slug)
    .get();
  return snapshot.docs.some((doc) => doc.id !== excludeId);
}

function toRow(data: ReturnType<typeof companySchema.parse>) {
  return {
    slug: data.slug,
    name: data.name,
    tagline: data.tagline || null,
    description: data.description || null,
    logo_url: data.logoUrl || null,
    theme_color: data.themeColor,
    whatsapp: data.whatsapp || null,
    facebook: data.facebook || null,
    instagram: data.instagram || null,
    tiktok: data.tiktok || null,
    twitter: data.twitter || null,
    website: data.website || null,
  };
}

export async function createCompany(
  formData: FormData,
): Promise<CompanyActionResult> {
  const parsed = companySchema.safeParse(readFormValues(formData));
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const data = parsed.data;

  if (await isSlugTaken(data.slug)) {
    return { fieldErrors: { slug: "That slug is already taken" } };
  }

  const docRef = await db.collection(COMPANIES_COLLECTION).add({
    ...toRow(data),
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  });

  revalidatePath("/admin");
  revalidatePath(`/${data.slug}`);

  return { id: docRef.id, slug: data.slug };
}

export async function updateCompany(
  id: string,
  formData: FormData,
): Promise<CompanyActionResult> {
  const parsed = companySchema.safeParse(readFormValues(formData));
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const data = parsed.data;

  const docRef = db.collection(COMPANIES_COLLECTION).doc(id);
  const existing = await docRef.get();

  if (!existing.exists) {
    return { error: "Company not found" };
  }

  if (await isSlugTaken(data.slug, id)) {
    return { fieldErrors: { slug: "That slug is already taken" } };
  }

  const existingSlug = existing.data()?.slug as string | undefined;

  await docRef.update({
    ...toRow(data),
    updated_at: FieldValue.serverTimestamp(),
  });

  revalidatePath("/admin");
  revalidatePath(`/${data.slug}`);
  if (existingSlug && existingSlug !== data.slug) {
    revalidatePath(`/${existingSlug}`);
  }

  return { id, slug: data.slug };
}

export async function deleteCompany(id: string): Promise<{ error?: string }> {
  const docRef = db.collection(COMPANIES_COLLECTION).doc(id);
  const existing = await docRef.get();

  await docRef.delete();

  const existingSlug = existing.data()?.slug as string | undefined;
  if (existingSlug) {
    revalidatePath("/admin");
    revalidatePath(`/${existingSlug}`);
  }

  return {};
}
