import { cert, getApps, initializeApp } from "firebase-admin/app";
import {
  getFirestore,
  Timestamp,
  type DocumentSnapshot,
} from "firebase-admin/firestore";
import type { Company } from "@/lib/types";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/firebase/admin.ts must only be imported from server code",
  );
}

const projectId = process.env.FIREBASE_PROJECT_ID || "placeholder-project";
const clientEmail =
  process.env.FIREBASE_CLIENT_EMAIL ||
  "placeholder@placeholder-project.iam.gserviceaccount.com";
const PLACEHOLDER_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5i2UefQHt2fDS\\nFU/t/wNks0C+X/AArdYvmGE1DZvFpYVpb03HKShB6pYJGzFcSLYEjYQMdHDWXG8y\\nKy1/V/+HhghRzWA/s5Qd9CYhEA0OA3xfE84K0cYXvvVKPBhnSW7ABcW5gIkXcolx\\nuEkL7Y0Viz+dVaS2O5BoDRLv+E5ynQjCbpad2kjE3T6PRJsoPq176I5fNqYt+mUJ\\n+beu5C2AiU8ZQJR9YuA4jpdKqCScvxlK2H/vDh9ZIiK+L+bH+62zBm4i2hj9lKNG\\naNWbuAjDdLbd0LZ9EgvjLcDWKyr9dS8x4aY3B/vI7fxHA6d1pLXOuUzKLUKtpXs/\\nostuHqe1AgMBAAECggEAD2Xa0K6pnhJP2rNjlHntD2qT1Sizi27hv0XrTUKRmpOr\\nsG4I+532BhBgfqV30XOETXjsDDeOlK+Ll9N+/Voxbc8I+jbrxaWSxXCZSHWjS7Ys\\n2FwVpY62nIpfo1c85DdzHjLsb4JT/jLmZp5XS4rdgjvx3c35cxka2RO6rlkCM58h\\nwEmMl1su76JKsgO22UiDeQFsADISuXU/OU08n8clO2LliAYHUqsSTp5Zp1YGZvM1\\nr45yJhNwxpu4/olaHze2W7MSoVC/wZYD8hd3lchgBg7bG0Gh44NSfySW8MFvkGKq\\nL4SIH0lmndpIf8NZEJ7hOrGuZ/AT6Sfi913DZYKioQKBgQDvs0hN0WlBpOv8bQ67\\nAIEsrqwz9pnurFlnIzZ3zJ8serzRofWNOMHVp+9VcAhsPS2sBCvaMGEFfMQysqoR\\ntvJkjYxXLFwMvug1GK8KP4JhGrrPx0WBm/gyu5Zg14KkE6UMDrcV/LMeFZRJVeO1\\nQWoOVHmZb6Ly6fFGYFvM3gJd1QKBgQDGKV1uoqF45pPMPr0pAeQWk46PW0CwC1sh\\nxCUTVO4l9YS2eJiwUjmzdyNkdwck/9vEV6YJSMk7a05FOpZ/zvJP6rOy/gFzfPIX\\nirpKxBUXgu9Xr2QkyVIkoejTN30sLumKLQ1rstcoycupXG1fOwWCBLVYsSMtZ4cP\\nnc3uQI+yYQKBgQCXJEj3KJBiIAfdRzb+mzbYYdubeGdfo7VL31w89f14InxlAua+\\ngYdXnWjASsBE396olIjCL7c9qopcHWQ3f1AgL1DKtuHj94ybzlCw+ZLQf/ZDhbdC\\nHoLGGpqbvchWhTyQ+cZgStL2qUyzYUEPzYt+Na3nHgl1eiX05lV8PJDpcQKBgB2+\\nZbzOgmgwS+zzWddG5mKRIWvZKZuDCNnHpD0DmX9vG817yodkwC506oYQ66ydDvKo\\nqU5pc3MMx0HS6nYirPJb6z8pqzQXhAsOkqnYRsYxrBVASUrQQRkoiFbz1EEGhZ1s\\n57/Lp0oDCCPSsMQDiu8aH9JBPGN7T6WDbT6eyDLhAoGAS34CXQwgHKKRmP2euxT1\\n2A33TeBX9eupUO4u67Rs0tzg0+fvQqjo9yGjExfbn5myXOJY6otqqWkuQRXbcWai\\nBa1RWuh8psMhWyYLKsNDWjII/N/Dl5iNDfcdD1imvK+C8S929ETrKqyhQPMC3LVD\\nWYKOuqUVIpJ17PBslGK1dEo=\\n-----END PRIVATE KEY-----\\n";

const privateKey = (
  process.env.FIREBASE_PRIVATE_KEY || PLACEHOLDER_PRIVATE_KEY
).replace(/\\n/g, "\n");

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  console.warn(
    "Firebase env vars are missing — set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local (see .env.local.example).",
  );
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

export const db = getFirestore(app);
export const COMPANIES_COLLECTION = "companies";

function toIso(value: unknown): string {
  return value instanceof Timestamp
    ? value.toDate().toISOString()
    : new Date().toISOString();
}

export function docToCompany(doc: DocumentSnapshot): Company {
  const data = doc.data() ?? {};
  return {
    id: doc.id,
    slug: data.slug,
    name: data.name,
    tagline: data.tagline ?? null,
    description: data.description ?? null,
    logo_url: data.logo_url ?? null,
    theme_color: data.theme_color,
    whatsapp: data.whatsapp ?? null,
    facebook: data.facebook ?? null,
    instagram: data.instagram ?? null,
    tiktok: data.tiktok ?? null,
    twitter: data.twitter ?? null,
    website: data.website ?? null,
    created_at: toIso(data.created_at),
    updated_at: toIso(data.updated_at),
  };
}
