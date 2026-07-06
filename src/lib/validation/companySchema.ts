import { z } from "zod";

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const urlField = z
  .string()
  .trim()
  .refine((value) => value === "" || isValidHttpUrl(value), {
    message: "Enter a valid URL starting with http:// or https://",
  });

export const SOCIAL_FIELDS = [
  "whatsapp",
  "facebook",
  "instagram",
  "tiktok",
  "twitter",
  "website",
] as const;

export type SocialField = (typeof SOCIAL_FIELDS)[number];

export const companySchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(2, "Slug must be at least 2 characters")
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers, and hyphens only",
      ),
    tagline: z.string().trim().optional(),
    description: z.string().trim().optional(),
    themeColor: z
      .string()
      .trim()
      .regex(
        /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
        "Enter a valid hex color, e.g. #1a73e8",
      ),
    logoUrl: urlField,
    whatsapp: urlField,
    facebook: urlField,
    instagram: urlField,
    tiktok: urlField,
    twitter: urlField,
    website: urlField,
  })
  .refine((data) => SOCIAL_FIELDS.some((field) => data[field].trim() !== ""), {
    message: "Add at least one social link",
    path: ["whatsapp"],
  });

export type CompanyFormValues = z.infer<typeof companySchema>;
