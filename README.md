# Interview Coach — Mission Ready (ADV Mission 3)

A modern AI-powered interview practice application built with Next.js 15, Tailwind CSS, shadcn/ui, and Gemini.

Designed and developed collaboratively by **Rodrigo**, **Koni**, and **Siobhan** as part of Mission Ready’s Level 5 Advanced Program.

## Overview

Interview Coach helps users practice job interviews by generating realistic questions, evaluating their answers, and providing actionable feedback.

The app adapts based on the user’s job title and responses. This repo is a **team scaffold**: shared setup is done, and each role fills in their own files.

## Team Roles

### Rodrigo — Release Engineer

- Project setup, folder layout, shadcn install, env, tests, Vercel, CI
- Own: `config/`, `tests/` setup, `package.json`, `README.md`, GitHub Actions

### Koni — AI & Backend Developer

**Own:** `app/api/interview/route.js`, `lib/gemini.js`, `lib/prompts.js`, `lib/formatters.js`, `lib/validators.js`

**Leave alone:** `lib/utils.js` (shadcn `cn()` helper, shared)

**Already done:** a working Gemini wrapper, interview prompt template, and `POST /api/interview` starter. Expand scoring, JSON formatting, validation, multi-step flow, and conversation memory.

### Siobhan — Frontend UI Developer

**Own:** `app/page.js`, `app/interview/page.js`, `app/results/page.js`, `components/interview/`, `components/results/`, `app/globals.css` (theme), `public/images/`

**Already done:** shadcn primitives in `components/ui/` (button, input, textarea, card, dialog, separator, avatar, scroll-area). Import them; do not recreate them.

**Start here:** build `/interview` from `QuestionCard` + `AnswerForm`. Call `POST /api/interview` from the client. Never put `GEMINI_API_KEY` in a page.

## Tech Stack

- Next.js 15.0.3 (App Router)
- React 18
- Tailwind CSS
- shadcn/ui
- Gemini SDK (`@google/generative-ai`)
- Vitest + React Testing Library
- Vercel

## Project Structure

```
root/
├── app/
│   ├── api/interview/route.js     # Koni — POST /api/interview
│   ├── interview/page.js          # Siobhan — interview UI
│   ├── results/page.js            # Siobhan — results UI
│   └── page.js                    # Siobhan — home
├── components/                    # Siobhan (Frontend UI)
│   ├── ui/                        # shadcn primitives
│   ├── interview/                 # QuestionCard, AnswerForm
│   └── results/                   # ScoreCard, FeedbackBlock
├── lib/
│   ├── utils.js                   # shared — shadcn cn() helper
│   ├── gemini.js                  # Koni — askGemini()
│   ├── prompts.js                 # Koni — interviewPrompt()
│   ├── formatters.js              # Koni — expand
│   └── validators.js              # Koni — expand
├── public/images/                 # Siobhan — add logo.png
├── config/                        # Rodrigo
│   ├── env.example
│   ├── vercel.json
│   └── deployment.md
├── tests/
│   ├── setup.js
│   ├── api.test.js
│   ├── ui.test.js
│   ├── lib.test.js
│   └── integration/
│       └── interview-flow.test.js
├── .github/workflows/tests.yml    # Rodrigo — CI
├── .env.local                     # gitignored Gemini key
├── vitest.config.mjs
├── next.config.mjs
├── package.json
└── README.md
```

## How to run locally

1. Clone the repo and install from the **repo root** (not inside `app/`):

```bash
npm install
```

2. Copy `config/env.example` to `.env.local` and add your key:

```
GEMINI_API_KEY=your_key_here
```

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

Never commit `.env.local` or use the key in client components.

## How to test

```bash
npm test          # single run (also used in CI)
npm run test:watch
npm run verify    # tests + lint + production build
```

Placeholder tests live in `tests/`. Konei can extend `api.test.js` and `lib.test.js`; Siobhan can extend `ui.test.js`. The integration file `tests/integration/interview-flow.test.js` is for the full loop later: typing, submit, and AI response.

## API Route

```
POST /api/interview
```

Starter body:

```json
{
  "question": "Tell me about yourself.",
  "answer": "I switched into software this year."
}
```

Starter response:

```json
{
  "result": "..."
}
```

Konei can change this shape (for example `question`, `feedback`, `questionNumber`).

## How to deploy

See `config/deployment.md`. Short version:

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com). Leave Root Directory blank.
3. Add `GEMINI_API_KEY` in Vercel → Project Settings → Environment Variables.
4. Deploy. Confirm the key never appears in browser network responses.

`config/vercel.json` is the team copy of deploy settings. Vercel only reads `vercel.json` from the **project root**, so copy it there if you add routes or headers.

## How to contribute

1. Work only in the files for your role (see Team Roles).
2. Create a branch from `main`: `feature/your-name-short-description`.
3. Keep commits focused. Do not commit `.env.local` or API keys.
4. Run `npm run verify` before opening a pull request.
5. Open a PR and ask the other two roles to review if you touch a shared file (`package.json`, `app/globals.css`, `lib/utils.js`).

## Design System

Dark theme with thin green accents (Siobhan):

| Token      | Hex       |
| ---------- | --------- |
| Background | `#0D0D0D` |
| Surface    | `#1A1A1A` |
| Accent     | `#00FF88` |
| Text       | `#E5E5E5` |
| Borders    | `#00C46B` |

shadcn/ui: Button, Input, Textarea, Card, Dialog, Separator, Scroll Area, Avatar.

## Contributors

- **Rodrigo** ([RodrigoNunes2004](https://github.com/RodrigoNunes2004)) — Release Engineer
- **Konei** ([Koni-BEI](https://github.com/Koni-BEI)) — AI & Backend Developer
- **Siobhan** ([MasterJedi-crypto](https://github.com/MasterJedi-crypto)) — Frontend UI Developer
