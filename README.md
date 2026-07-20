# Where's My Coffee? — Coffee Shop Finder

## Problem Statement

It's hard to find independent, locally owned coffee shops and to know which ones are worth visiting without wading through review platforms dominated by chains and paid placement. Where's My Coffee? is a small, focused directory just for local coffee shops, where people can search, rate, review, and save their favorites.

## Target User

Coffee drinkers who want to discover and support independent coffee shops in their area.

## Features

- Browse all coffee shops with average rating and review count
- Search shops by name and filter by city or state
- Sort shops by name, rating, or newest
- Interactive map showing pins for every shop currently in view (auto-geocoded from address/city/state)
- View a shop's full details and all of its reviews
- Create an account and log in (JWT-based auth)
- Add a new shop listing (logged in)
- Edit or delete shops you created
- Leave a star rating and written review on any shop (logged in)
- Delete your own reviews
- Favorite/unfavorite shops and view your favorites list
- Loading, error, and empty states throughout the UI
- Responsive, mobile-friendly layout

## Technology

- React + Vite (frontend)
- React Router (client-side routing)
- Leaflet + React Leaflet (interactive map, OpenStreetMap tiles, no API key required)
- Node.js + Express (backend REST API)
- PostgreSQL (database)
- Prisma ORM + `@prisma/adapter-pg`
- `bcrypt` for password hashing, `jsonwebtoken` for auth tokens
- Docker Compose (local PostgreSQL)
- Git and GitHub

## Database Design

Four related tables:

- **users** — accounts (`id`, `email` unique, `password_hash`, `name`, `created_at`)
- **shops** — coffee shop listings, the main resource (`id`, `name`, `address`, `city`, `state`, `description`, `website`, `latitude`, `longitude`, `created_by` → `users.id`, `created_at`)
- **reviews** — one row per review (`id`, `shop_id` → `shops.id`, `user_id` → `users.id`, `rating` 1–5, `comment`, `created_at`)
- **favorites** — join table linking `users` to the `shops` they've saved (`id`, `user_id` → `users.id`, `shop_id` → `shops.id`, unique on `(user_id, shop_id)`)

See [`docs/er-diagram.md`](docs/er-diagram.md) for the full entity relationship diagram, [`docs/proposal.md`](docs/proposal.md) for the project proposal, [`docs/api-plan.md`](docs/api-plan.md) for the endpoint plan, and [`docs/component-plan.md`](docs/component-plan.md) for the React component tree.

## API Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/auth/register` | Create an account | No |
| POST | `/api/auth/login` | Log in, receive a JWT | No |
| GET | `/api/auth/me` | Get the logged-in user | Yes |
| GET | `/api/shops` | List shops (`?search=`, `?city=`, `?state=`, `?sort=`) | No |
| GET | `/api/shops/:id` | Get one shop with its reviews | No |
| POST | `/api/shops` | Create a shop | Yes |
| PUT | `/api/shops/:id` | Update a shop you created | Yes (owner) |
| DELETE | `/api/shops/:id` | Delete a shop you created | Yes (owner) |
| POST | `/api/shops/:id/reviews` | Add a review | Yes |
| PUT | `/api/reviews/:id` | Update your own review | Yes (owner) |
| DELETE | `/api/reviews/:id` | Delete your own review | Yes (owner) |
| GET | `/api/favorites` | List your favorited shops | Yes |
| POST | `/api/favorites` | Favorite a shop | Yes |
| DELETE | `/api/favorites/:shopId` | Un-favorite a shop | Yes |

## Project structure

```text
.
├── README.md
├── .gitignore
├── docker-compose.yml
├── docs/
│   ├── proposal.md
│   ├── er-diagram.md
│   ├── api-plan.md
│   └── component-plan.md
└── apps/
    ├── frontend/
    │   └── src/
    │       ├── api/
    │       ├── components/
    │       ├── context/
    │       ├── pages/
    │       ├── App.jsx
    │       └── main.jsx
    └── backend/
        ├── prisma/
        │   ├── schema.prisma
        │   └── seed.js
        ├── database/
        │   ├── schema.sql
        │   └── seed.sql
        └── server/
            ├── db/prisma.js
            ├── middleware/auth.js
            ├── controllers/
            ├── routes/
            └── server.js
```

## Requirements

- Node.js and npm
- Docker Desktop (for local PostgreSQL)
- PostgreSQL client tools if you want to use `psql` directly

## Environment variables

All secret values live in `.env` files, which are git-ignored. Never commit real credentials.

1. Go to `apps/backend`
2. Copy `.env.example` to `.env`
3. Update the values if needed

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/backend-db?schema=public"
PORT=3001
JWT_SECRET=replace-with-a-long-random-string
```

## How to create the PostgreSQL database

From `apps/backend`:

```bash
npm run db:up
```

This starts the PostgreSQL container defined in the root `docker-compose.yml`. To stop it: `npm run db:down`. To view logs: `npm run db:logs`.

## Installation

```bash
git clone <repository-url>
cd full-stack-template
```

### Backend setup

```bash
cd apps/backend
npm install
cp .env.example .env
npm run db:up
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run db:seed
npm run dev
```

The backend runs at `http://localhost:3001`.

Two demo accounts are created by the seed data (password for both: `password123`):
- `maria@example.com`
- `devon@example.com`

### Frontend setup

Open a second terminal:

```bash
cd apps/frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## How to run `schema.sql` / `seed.sql` (raw SQL path)

As an alternative to Prisma migrations, you can set up the tables manually with the raw SQL files in `apps/backend/database`. From `apps/backend`, with `.env` configured and PostgreSQL running:

```bash
npm run sql:schema
npm run sql:seed
```

## Prisma workflow

- `prisma.config.ts` configures the Prisma CLI
- `schema.prisma` defines the `User`, `Shop`, `Review`, and `Favorite` models
- `database/schema.sql` and `database/seed.sql` are a hand-written raw-SQL mirror of the same schema, for students who want to practice plain SQL

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:studio
npm run db:seed
npm run db:reset
```

When you change `schema.prisma`, run `npm run prisma:migrate -- --name describe-your-change` — don't hand-write migration files.

## Git and GitHub workflow

1. Create a new GitHub repository from this template
2. Clone the repository
3. Create a new branch for your work
4. Commit your changes regularly with meaningful messages
5. Push your branch to GitHub

## AI Usage Reflection

*(Fill this section in yourself before submitting — it should describe your own experience working on this project, not be generated for you.)*

- **How did you use AI?**
- **What did AI help you understand?**
- **What incorrect or incomplete AI response did you encounter?**
- **How did you test the AI-generated code?**
- **What part of the project can you explain without AI assistance?**
