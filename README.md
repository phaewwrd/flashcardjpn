# かな — Hiragana Flashcards

A minimalist hiragana learning app: flashcard quizzes with multiple-choice
answers, per-user progress tracking with mastery levels, categorized lessons,
Google sign-in, and an admin panel for managing content.

**Stack:** Next.js 14 (App Router) · TypeScript · Prisma · NeonDB (Postgres) ·
NextAuth.js (Google provider) · Tailwind CSS

---

## 1. Prerequisites

- Node.js 18.18+ (Node 20 LTS recommended)
- A [Neon](https://neon.tech) Postgres database (free tier is fine)
- A Google Cloud project with an OAuth 2.0 Client ID

---

## 2. Set up NeonDB

1. Create a project at https://console.neon.tech.
2. In the Neon dashboard, grab **two** connection strings from the "Connect"
   panel:
   - The **pooled** connection string → `DATABASE_URL`
   - The **direct** connection string (toggle "Pooled connection" off) →
     `DIRECT_URL`
3. Both should end in `?sslmode=require`.

## 3. Set up Google OAuth

1. Go to https://console.cloud.google.com/apis/credentials.
2. Create an **OAuth client ID** of type "Web application".
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local dev)
   - `https://yourdomain.com/api/auth/callback/google` (production)
4. Copy the generated Client ID and Client Secret.

## 4. Configure environment variables

```bash
cp .env.example .env
```

Fill in `DATABASE_URL`, `DIRECT_URL`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, and generate a secret for `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

## 5. Install dependencies & set up the database

```bash
npm install
npm run db:push     # creates all tables in your Neon database
npm run db:seed     # seeds categories + hiragana words (gojūon, dakuten, yōon)
```

## 6. Run the app

```bash
npm run dev
```

Visit http://localhost:3000, sign in with Google, and start studying.

## 7. Make yourself an admin

New users are created with `isAdmin = false`. After your first sign-in,
promote your account directly in the database — easiest via Prisma Studio:

```bash
npm run db:studio
```

Open the `users` table, find your row (by email), and set `isAdmin` to `true`.
Reload the app — an "Admin" link will appear in the nav, and `/admin` becomes
accessible for managing categories and words.

Alternatively, run a one-off SQL statement against your Neon database:

```sql
UPDATE users SET "isAdmin" = true WHERE email = 'you@example.com';
```

---

## Project structure

```
prisma/
  schema.prisma       # User/Account/Session + Category/Word/Progress models
  seed.ts             # Full gojūon + dakuten/handakuten + yōon dataset

src/
  app/
    login/            # Google sign-in page
    (main)/           # Authenticated learner routes (nav + guard)
      home/           # Dashboard: overall progress, "continue learning"
      categories/     # Browse all categories
      study/[id]/     # Flashcard quiz session for one category
      progress/       # Detailed per-category, per-character mastery view
    admin/            # Admin-only routes (isAdmin guard)
      categories/     # CRUD for categories
      words/          # CRUD for words
    api/
      auth/[...nextauth]/   # NextAuth handler
      progress/             # POST: record a quiz answer, update mastery
      categories/           # GET: list categories (learner-facing)
      admin/categories/     # CRUD API for categories
      admin/words/          # CRUD API for words
  lib/
    prisma.ts         # Prisma client singleton
    auth.ts           # NextAuth config (Google + Prisma adapter)
    mastery.ts         # Mastery level thresholds (New/Learning/Familiar/Mastered)
  components/
    Nav.tsx           # Top nav bar
    SessionProvider.tsx
```

## How mastery levels work

Each `Progress` row tracks `correctCount` / `incorrectCount` per user per
word. Levels are derived (see `src/lib/mastery.ts`):

| Level | Label     | Condition                                 |
|-------|-----------|--------------------------------------------|
| 0     | New       | Never answered correctly                   |
| 1     | Learning  | 1–2 correct answers                        |
| 2     | Familiar  | 3–5 correct answers                        |
| 3     | Mastered  | 6+ correct answers with ≥75% accuracy      |

## Deploying

This app deploys cleanly to Vercel:

1. Push this repo to GitHub.
2. Import it in Vercel, add the same environment variables from `.env`.
3. Update `NEXTAUTH_URL` to your production URL, and add the matching
   redirect URI in Google Cloud credentials.
4. After the first deploy, run `npm run db:push && npm run db:seed` locally
   (pointed at the same Neon database) or via a one-off Vercel deployment
   hook — Neon is reachable from anywhere, so your local machine works fine.
