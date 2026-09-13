# Ned Contact

A lead-capture app for Ned's freelance web design portfolio, with a private owner inbox.

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

- `artifacts/ned-contact` — public contact form and private owner interface
- `artifacts/api-server/src/routes/leads.ts` — lead and owner-session endpoints
- `lib/api-spec/openapi.yaml` — API contract
- `lib/db/src/schema/leads.ts` — lead storage schema

## Architecture decisions

- Owner access uses the `OWNER_PASSWORD` secret and an HTTP-only, signed session cookie.
- The public form never exposes owner-only lead data.

## Product

- Visitors can submit project enquiries and receive a clear confirmation.
- The owner can sign in at `/owner`, review stored leads, and sign out.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
