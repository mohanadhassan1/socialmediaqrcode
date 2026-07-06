export interface Company {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  theme_color: string;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  twitter: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}
