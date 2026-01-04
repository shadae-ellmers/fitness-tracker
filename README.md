# Fitness Tracker

A full-stack fitness tracking app built with Next.js, Prisma, and Auth0. Users can create workouts, add multiple exercises, and log sets, reps, and weights.

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Database](#database)
* [Scripts](#scripts)
* [Folder Structure](#folder-structure)
* [License](#license)

## Features

* User authentication via Auth0
* CRUD operations for Workouts and Exercises
* Multi-select searchable exercises using `react-select`
* Logs sets, reps, and weight for each exercise
* Counts exercises in each workout
* Responsive and mobile-friendly UI

## Tech Stack

* Frontend: Next.js 13, React
* Styling: CSS modules
* Backend: Next.js API routes, Prisma ORM
* Database: PostgreSQL
* Authentication: Auth0

## Getting Started

1. Clone the repository:

```bash
git clone <repo-url>
cd fitness-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see below)
4. Set up the database (see "Database" section)
5. Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
AUTH0_SECRET="your_auth0_secret"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://YOUR_DOMAIN"
AUTH0_CLIENT_ID="YOUR_CLIENT_ID"
AUTH0_CLIENT_SECRET="YOUR_CLIENT_SECRET"
```

## Database

This project uses Prisma ORM with PostgreSQL.

1. Run migrations to create tables:

```bash
npx prisma migrate dev --name init
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Seed data (optional):

```bash
npx prisma db seed
```

## Scripts

* `npm run dev` – run dev server
* `npm run build` – build for production
* `npm run start` – run production build
* `npx prisma migrate dev` – run migrations
* `npx prisma studio` – open Prisma Studio

## Folder Structure

* /app – Next.js app directory
* /components – React components
* /prisma – Prisma schema and migrations
* /styles – CSS modules and global styles
* /lib – Auth0 and helper functions

## License

MIT
