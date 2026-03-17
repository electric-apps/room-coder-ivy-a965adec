# Todo App

A reactive, real-time todo list application built with Electric SQL + TanStack DB. Changes sync instantly across all open browser tabs — add a task in one tab and watch it appear in another.

## Screenshot

![Todo App Screenshot](screenshot.png)

## Features

- Add, complete, and delete tasks
- Real-time sync across browser tabs via Electric SQL
- Optimistic mutations — UI updates instantly before server confirms
- Separate views for pending and completed tasks
- Clear all completed tasks at once

## Getting Started

```bash
pnpm install
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
pnpm dev:start
```

Then open `http://localhost:8080`.

## Tech Stack

- **[Electric SQL](https://electric-sql.com)** — Real-time Postgres sync to the client via shapes
- **[TanStack DB](https://tanstack.com/db)** — Reactive collections and optimistic mutations
- **[Drizzle ORM](https://orm.drizzle.team)** — Schema definitions and migrations
- **[TanStack Start](https://tanstack.com/start)** — React meta-framework with SSR + server functions
- **[Radix UI Themes](https://www.radix-ui.com/themes)** — UI component system

## License

MIT
