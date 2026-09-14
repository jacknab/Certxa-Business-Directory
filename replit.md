# Certxa

Certxa is a search-first local business directory for discovering trusted independent salons, wellness studios, fitness spaces, and service providers.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/certxa/src/App.tsx` — route structure, shared shell, interactive discovery pages, and per-route SEO metadata
- `artifacts/certxa/src/lib/data.ts` — seeded business, city, and category directory content
- `artifacts/certxa/src/index.css` — Certxa visual language and responsive layout styles
- `artifacts/certxa/public/robots.txt` and `artifacts/certxa/public/sitemap.xml` — crawlability and public URL discovery

## Architecture decisions

- The first release is frontend-first with local seed data so the public discovery and indexable listing surface can be evaluated before adding persistence.
- Browser-history routes are used for cities, categories, searches, and business profiles so public URLs are descriptive and shareable.
- SEO metadata and structured data are generated per route; business pages emit LocalBusiness JSON-LD and directory landing pages emit breadcrumb data.

## Product

- Users can search the directory, filter by city and category, sort results, save places locally, and open detailed business profiles.
- Public pages cover the home guide, directory search, category landing pages, city guides, and all seeded businesses.
- Business profiles include services, hours, ratings, contact actions, verification status, and location details.

## User preferences

- The user wants the product branded as Certxa and designed for strong SEO/GEO discoverability.

## Gotchas

- The static sitemap currently uses `certxa.com`; replace that host with the final published domain before launch if the domain changes.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
