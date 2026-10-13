# Virtual Office Hub — Cloudflare deployment

This repository remains the source of truth for the original animated Virtual Office Hub. The target hostname is `https://office.getcryptodomains.com`; the main GetCryptoDomains site remains separate.

## GitHub Actions setup

Add these repository **Actions secrets** in Settings → Secrets and variables → Actions → New repository secret:

- `CLOUDFLARE_API_TOKEN` — a token with permission to deploy Workers and manage Workers custom domains for the account.
- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID.
- `SUPABASE_URL` — URL for the Supabase project that owns this office's data.
- `SUPABASE_PUBLISHABLE_KEY` — public/publishable key for that same Supabase project.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only service-role key for that same project. Never use this as a Vite variable or expose it in client code.
- `LOVABLE_API_KEY` — the key for the Lovable AI Gateway used by the existing manager/employee generation code.

The workflow also uses `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` at build time as `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. It validates that all required secrets exist before deployment.

## Data and authentication

Before inviting users, make sure the Supabase project is the correct one for this app and apply the repository's SQL migrations in order. The app uses Supabase Auth, row-level security, and server-side privileged queries. Do not point it at an unrelated production database. Test sign-in, owner isolation, approvals, task execution, and audit records with a non-production account first.

## Important existing service dependency

AI managers and employees currently call the Lovable AI Gateway through `LOVABLE_API_KEY`; they are real model requests, not simulated agents. Cloudflare hosts the app, but does not replace that AI provider. Moving the AI calls to Cloudflare Workers AI is a separate migration and should not be implied until implemented and tested.

## Deploy behavior

The GitHub Actions workflow installs from the committed Bun lockfile, runs tests, builds, verifies the Cloudflare output, deploys the Worker, and applies the required runtime secrets. The Worker custom domain is configured in `wrangler.jsonc`. Do not remove the current GetCryptoDomains root-domain Worker when deploying this app.
