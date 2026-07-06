# Social Media QR Code

A Next.js app for generating QR codes and hosting branded "link-in-bio" pages for companies' social media profiles.

**Live app:** [socialmediaqrcode.vercel.app](https://socialmediaqrcode.vercel.app)

## Overview

The project has two independent parts:

1. **QR Studio** (`/`) — a standalone, no-login QR code generator. Pick a mode (redirect URL, direct website URL, or a plain QR with no logo), tweak size/margin/logo scale, and download a PNG.
2. **Company link-in-bio system** (`/admin`, `/[slug]`) — an admin dashboard for creating "companies," each with a slug, theme color, logo, and social links (WhatsApp, Facebook, Instagram, TikTok, Twitter/X, website). Each company gets a public branded page at `/[slug]` and a downloadable QR code (PNG/SVG) that points to it — useful for print materials, storefronts, etc.

## Features

- **QR Studio** (`src/components/QrGenerator.tsx`)
  - Redirect QR, Website QR, and No-Logo QR modes
  - Adjustable size (300–2000px), margin, and logo size ratio
  - Client-side rendering to `<canvas>` via the `qrcode` package, with the app logo composited on top
  - Download as PNG
- **Admin dashboard** (`/admin`)
  - List, create, edit, and delete companies (Firestore-backed)
  - Form validation with `react-hook-form` + `zod` (`src/lib/validation/companySchema.ts`)
  - Auto-generated, uniqueness-checked slugs
  - At least one social link is required per company
  - QR preview + PNG/SVG download for each company's public URL, with the logo embedded on a theme-colored plate (`src/components/admin/QrPreview.tsx`)
- **Public company page** (`/[slug]`)
  - Branded hero (logo, name, tagline, description, theme-colored gradient)
  - A card per configured social link (`src/components/public/SocialLinkCard.tsx`)
  - Floating share button using the Web Share API, with clipboard-copy fallback (`src/components/public/ShareButton.tsx`)

> **Known limitation:** the `/admin` routes have no authentication. Anyone with the URL can create, edit, or delete companies. Restrict access (e.g. Vercel deployment protection, or add real auth) before using this with production data.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19, with the React Compiler enabled (`next.config.ts`)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4, CSS custom-property design tokens, dark mode via `prefers-color-scheme`
- **Forms:** `react-hook-form` + `@hookform/resolvers/zod` + `zod`
- **QR generation:** `qrcode` (canvas/SVG) with custom logo-overlay compositing
- **Backend/data:** `firebase-admin` (Firestore), accessed only from server components and Server Actions — no REST API routes exist
- **Icons:** `lucide-react` + hand-rolled brand SVG icons (`src/components/icons/`)

## Project Structure

```
src/
  app/
    page.tsx                    # "/" — standalone QR Studio
    admin/
      page.tsx                  # "/admin" — company list
      actions.ts                # Server Actions: createCompany, updateCompany, deleteCompany
      new/page.tsx               # "/admin/new" — create company
      [id]/edit/page.tsx         # "/admin/[id]/edit" — edit company + QR preview
    (public)/[slug]/page.tsx     # "/[slug]" — public company link-in-bio page
  components/
    QrGenerator.tsx              # QR Studio UI
    admin/                       # CompanyForm, CompanyList, QrPreview
    public/                      # SocialLinkCard, ShareButton
    icons/                       # Brand icon SVGs
  lib/
    firebase/admin.ts            # Firebase Admin SDK init, Firestore access, Company mapper
    qrcode.ts                    # QR rendering/logo-overlay/download helpers, buildCompanyUrl
    types.ts                     # Shared Company type
    validation/companySchema.ts  # Zod schema for the company form
```

There is no `app/api` directory — all mutations run as Next.js Server Actions, and all reads happen directly in server components against Firestore.

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore enabled, and a service account

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file in the project root:

```bash
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_SITE_URL=https://socialmediaqrcode.vercel.app
```

| Variable                | Purpose                                                                           |
| ----------------------- | --------------------------------------------------------------------------------- |
| `FIREBASE_PROJECT_ID`   | Firebase project ID, used to initialize the Admin SDK                             |
| `FIREBASE_CLIENT_EMAIL` | Service account email for the Admin SDK                                           |
| `FIREBASE_PRIVATE_KEY`  | Service account private key (keep the `\n` escapes; they're unescaped at runtime) |
| `NEXT_PUBLIC_SITE_URL`  | Public base URL used to build each company's QR target (`{site}/[slug]`)          |

If these aren't set, `src/lib/firebase/admin.ts` falls back to placeholder values and logs a warning — the app will not read/write real data until real credentials are supplied.

Firestore is used with a single collection, `companies`.

### Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # run ESLint
```

## Deployment

The app is deployed on Vercel at [socialmediaqrcode.vercel.app](https://socialmediaqrcode.vercel.app). To deploy your own instance, connect the repo to Vercel and set the environment variables above in the project settings.
