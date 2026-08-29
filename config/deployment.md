# Deployment

Vercel auto-detects Next.js from `package.json` and `next.config.mjs` at the repo root.

`config/vercel.json` is the team copy of deploy settings. Vercel only reads a `vercel.json` that lives in the **project root**. Copy it to the root if you need custom regions, routes, or headers.

Set `GEMINI_API_KEY` in the Vercel dashboard (Project Settings → Environment Variables). Do not put a real key in `vercel.json`. The `"@gemini_api_key"` value in `config/vercel.json` is a placeholder name, not a secret.

## Checklist

1. Push the project to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Set Root Directory to the repo root (leave blank).
4. Add `GEMINI_API_KEY` for Production, Preview, and Development.
5. Deploy. Confirm `/` loads and `POST /api/interview` does not leak the API key to the browser.

## Local vs production env

| File | Git | Purpose |
| --- | --- | --- |
| `.env.local` | gitignored | Local Gemini key |
| `config/env.example` | committed | Shows teammates which keys exist, with no secrets |

Do not commit `.env.local`.
