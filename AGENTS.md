<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Commands

- `npm run dev` — dev server at localhost:3000
- `npm run lint` — ESLint (flat config)
- `npx tsc --noEmit` — typecheck (no npm script exists)
- `npm run build` — production build
- Verify with lint → typecheck → build. There is no test suite.
- After installing deps or changing `prisma/schema.prisma`, always run `npx prisma generate`.

## Next.js 16 quirks

- `cacheComponents: true` in `next.config.ts`: dynamic data needs `use cache` or `<Suspense>`. Several layouts/pages opt out via `export const instant = false` (marked TODO for Cache Components migration) — keep those opt-outs when editing.
- There is **no** `src/app/layout.tsx`. Each route group renders its own `<html lang="th">`: `(front)/layout.tsx` (public site + Navbar) and `(auth)/layout.tsx` (login/signup). UI text and many comments are in Thai.

## Prisma 7 + MariaDB

- Driver-adapter client: import the singleton from `src/lib/prisma.ts`; never instantiate `PrismaClient` or import from `@prisma/client` directly.
- Generated client goes to `generated/prisma`, which is **gitignored** — missing after fresh clone until `npx prisma generate` runs.
- Env vars (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`) load from `.env` via `dotenv` in `prisma.config.ts` and `src/lib/prisma.ts`.
- No `prisma/migrations`. Schema only holds better-auth tables (User/Session/Account/Verification); e-commerce tables are created/seeded by raw SQL in `docs/create_table_ecommerce.sql` and `docs/insert_data_ecom_example_50_products.sql`. Local DB is MariaDB in Docker per `docs/install_mariadb_with_docker.txt`.
- Known broken state: `src/app/(front)/product/page.tsx` calls `prisma.product.findMany()`, but schema.prisma has no `Product` model, so typecheck fails until the model is added and the client regenerated.
- Prisma `Decimal` fields (e.g. `price`) must be converted to `number` before passing to Client Components (see pattern in the product page).

## Architecture

- Auth is better-auth email/password: server config `src/lib/auth.ts`, browser client `src/lib/auth-client.ts`, handler at `src/app/api/auth/[...all]/route.ts`.
- Cart is client-side only: zustand persisted to localStorage key `skill-cart` (`src/lib/cart-store.ts`) — no cart API or table.
- shadcn/ui components live in `src/components/ui` (style `radix-rhea`, add with `npx shadcn add`); path alias `@/*` → `src/*`. Tailwind v4 tokens in `src/app/globals.css`.
- Remote images must be allow-listed in `next.config.ts` → `images.remotePatterns`.

## Gotchas

- `.env` is tracked in git. README says to rename `.env.example`, but that file doesn't exist.
- Dockerfile copies `.next/standalone`, but `output: 'standalone'` is absent from `next.config.ts` — `docker build` will fail at the runner stage until it's added.
- `CLAUDE.md` just includes this file (`@AGENTS.md`).
