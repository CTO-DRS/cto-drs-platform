# CTO-DRS Official Apps & Projects Hub

A multilingual-ready (Arabic-first RTL) catalog for CTO-DRS applications and projects, built with Next.js App Router and TypeScript.

## Current scope

- Home, application catalog, per-app details, projects, documentation, and support pages.
- Catalog content is maintained in `content/apps.json`, so GitHub is the source of truth.
- No fabricated download URLs, version numbers, release dates, or download statistics.
- Download buttons are shown only when valid HTTP(S) links are explicitly added to an app entry.
- Static generation for app detail routes; deployable to compatible free hosting.
- Optional Supabase SQL starter migration for a future database-backed support/catalog extension.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Validate a production build:

```bash
npm run build
```

## Publish catalog entries safely

Edit `content/apps.json` in GitHub. Each app uses a stable `slug` and localized fields (`ar`, `en`). Add only verified repository, website, privacy, and download URLs. For a released application:
1. Upload the real release artifact to a trusted official release page (for example GitHub Releases).
2. Verify that the URL resolves to the correct file.
3. Set `status` to `released`, enter the real version and release date, and add download link(s).
4. Add requirements, feature descriptions, changelog, and privacy policy where applicable.
5. Set `verified` to `true` only after review.

Never store access tokens, passwords, Supabase service-role keys, or signing keys in the catalog or repository.

## Free hosting

Recommended starter: deploy this Git repository to Vercel's Hobby plan (subject to current eligibility/usage limits) or another host supporting Next.js. Configure:
- `NEXT_PUBLIC_SITE_URL` to the actual production URL.
- `NEXT_PUBLIC_GITHUB_OWNER` to `CTO-DRS`.
- `NEXT_PUBLIC_SUPPORT_EMAIL` to `cto.drs@gmail.com`.

Do not claim the custom domain is connected until you own it and configure its DNS.

## GitHub as CMS

This starter intentionally uses Git-managed JSON instead of a custom admin panel. Review catalog changes through pull requests and Git history. A later admin workflow can create pull requests using a server-side GitHub App/token; never put a write token in browser code.

## Optional database

`supabase/migrations/202610240001_initial_support.sql` is an optional starter schema for support tickets and app metadata. The current site does not call Supabase yet; apply it only after creating a Supabase project and configuring RLS. Do not deploy a database just to serve this static catalog.

## Before production

- Replace placeholder project descriptions with reviewed facts.
- Confirm the correct GitHub repository for each project.
- Add only actual APK/store/release links.
- Publish privacy policies and support procedures.
- Test mobile layout, keyboard navigation, contrast, and real release links.
- Set a canonical production URL and verify custom-domain DNS.
