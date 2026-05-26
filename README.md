# Book Management System

A modern React application for browsing and managing a book catalog with a hosted read API and local CRUD persistence.

## Features

- Browse a live hosted catalog of books
- Search by title or author with debounce
- Filter by genre
- Paginate through the catalog
- View detailed book pages
- Add, edit, and delete locally persisted books
- Inline loading, error, empty, and toast feedback states
- Responsive app shell with animated transitions

## Tech Stack

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- TanStack Query v5
- React Router
- React Hook Form + Zod
- Axios
- Framer Motion
- Lucide React

## Data Model

This project currently uses a hybrid backend approach:

- Read operations use `https://api.freeapi.app/api/v1/public/books`
- Create, update, and delete operations are persisted in `localStorage`

That keeps the app functional without requiring a paid or authenticated mock backend.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env
```

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:5173`

## Environment Variables

`.env.example` includes:

```env
VITE_API_BASE_URL=https://api.freeapi.app/api/v1
```

You can replace this later with your own compatible backend.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Project Structure

```text
src/
├── components/
│   ├── books/
│   ├── layout/
│   └── ui/
├── hooks/
├── lib/
├── pages/
├── services/
├── types/
├── App.tsx
├── main.tsx
└── router.tsx
```

## Deployment Notes

This app is ready to deploy to Vercel or Netlify.

### Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add `VITE_API_BASE_URL` in project environment variables if you want to override the default.
4. Deploy.

### Netlify

1. Connect the repository.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add `VITE_API_BASE_URL` if needed.

## Current Constraints

- Hosted reads come from FreeAPI, so remote writes are not available.
- Local CRUD entries are browser-specific because they are stored in `localStorage`.

## Next Improvements

- Replace local write persistence with a real writable backend
- Add route-level tests
- Add authentication and per-user collections
- Split additional heavy UI code if the bundle grows further
