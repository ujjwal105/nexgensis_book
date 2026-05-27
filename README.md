# Nexgensis Books

A React + Vite book management app with a hosted read-only catalog, local custom book CRUD, clean library routes, responsive sidebar navigation, and browser-ready favicon support.

## Overview

This project combines:

- remote public book data for browsing
- local browser persistence for create, edit, and delete
- custom library views for `All Books`, `Want to Read`, `Finished`, and `My Samples`
- detail pages with contextual back navigation
- Vercel-ready SPA routing configuration

## Screenshots

Add your UI screenshots in this section later.

Suggested structure:

```md
## Screenshots

### Overview
![Overview](./docs/screenshots/overview.png)

### All Books
![All Books](./docs/screenshots/all-books.png)

### Want to Read
![Want to Read](./docs/screenshots/want-to-read.png)

### Finished
![Finished](./docs/screenshots/finished.png)

### My Samples
![My Samples](./docs/screenshots/my-samples.png)

### Book Detail
![Book Detail](./docs/screenshots/book-detail.png)
```

You can create a folder like `docs/screenshots/` and add the images there later.

## Features

- Browse a hosted public catalog of books
- Add, edit, and delete local custom books
- Library routes:
  - `/books`
  - `/books/all`
  - `/books/want-to-read`
  - `/books/finished`
  - `/books/my-samples`
- Move books between `Want to Read` and `Finished`
- Context-aware back navigation from detail pages
- Search page
- Toast and Sonner feedback states
- Responsive sidebar and mobile bottom navigation
- Favicon setup for Chrome, Safari, and installed web app contexts

## Tech Stack

- React 19
- Vite 8
- TypeScript
- React Router 7
- TanStack Query 5
- Tailwind CSS 4
- Framer Motion
- React Hook Form
- Zod
- Axios
- Sonner
- Lucide React

## How Data Works

The app uses a hybrid model:

- remote reads come from `https://api.freeapi.app/api/v1/public/books`
- local create, update, and delete are stored in browser `localStorage`

Important:

- custom books are browser-specific
- local changes do not sync between devices
- deleting or editing a remote book is handled locally as an override in browser storage

## Installation

### Requirements

- Node.js 20+ recommended
- npm

### 1. Clone the project

```bash
git clone <your-repository-url>
cd nexgensis_book
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

If you have an `.env.example`, copy it:

```bash
cp .env.example .env
```

Use this value:

```env
VITE_API_BASE_URL=https://api.freeapi.app/api/v1
```

If you do not have `.env.example`, create `.env` manually with the same value.

### 4. Start development server

```bash
npm run dev
```

The app will usually run at:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Build for Production

```bash
npm run build
```

Production output is generated in:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
src/
├── assets/
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

public/
├── apple-touch-icon.png
├── favicon-96x96.png
├── favicon.ico
├── favicon.svg
├── site.webmanifest
├── web-app-manifest-192x192.png
└── web-app-manifest-512x512.png
```

## Routing

The app uses client-side routing with React Router.

Main routes:

- `/overview`
- `/books`
- `/books/all`
- `/books/want-to-read`
- `/books/finished`
- `/books/my-samples`
- `/books/:id`
- `/search`

## Vercel Deployment

This project is already configured for Vercel.

### Included config

- [vercel.json](/Users/ujjwaltyagi/Desktop/nexgensis_book/vercel.json)

That file rewrites all routes to `index.html`, which prevents router 404 errors on refresh or direct URL access for pages like:

- `/books/want-to-read`
- `/books/finished`
- `/books/123`

### Deploy steps

1. Push the project to GitHub, GitLab, or Bitbucket.
2. Open Vercel.
3. Click `Add New Project`.
4. Import the repository.
5. Keep the default detected framework as Vite.
6. Confirm these values if Vercel asks:

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

7. Deploy.

### Environment variable on Vercel

If needed, add:

```text
VITE_API_BASE_URL=https://api.freeapi.app/api/v1
```

## Favicon Setup

The app is configured to support common browser favicon behavior, including Chrome and Safari tabs.

Referenced in [index.html](/Users/ujjwaltyagi/Desktop/nexgensis_book/index.html):

- `/favicon-96x96.png`
- `/favicon.svg`
- `/favicon.ico`
- `/apple-touch-icon.png`
- `/site.webmanifest`

Manifest icons:

- `/web-app-manifest-192x192.png`
- `/web-app-manifest-512x512.png`

## Notes for Screenshots and Assets

You asked for space in the README so you can add screenshots later. The `Screenshots` section above is intentionally left ready for that.

Recommended approach:

1. Create `docs/screenshots/`
2. Add PNG or JPG files there
3. Replace the sample markdown paths with your actual filenames

Example:

```md
![My Samples](./docs/screenshots/my-samples.png)
```

## Known Constraints

- Remote API is read-only
- Local CRUD is browser-specific
- Counts and library organization depend on local browser storage for custom actions

## Recommended Cleanup

These public assets are useful for favicon support:

- `apple-touch-icon.png`
- `favicon-96x96.png`
- `favicon.ico`
- `favicon.svg`
- `site.webmanifest`
- `web-app-manifest-192x192.png`
- `web-app-manifest-512x512.png`

This file is not required if you are not using it anywhere:

- `public/favicon copy.svg`

`public/icons.svg` is also not part of the favicon setup unless you use it elsewhere.

## Troubleshooting

### Route shows 404 on deployed app

Make sure `vercel.json` exists and is deployed with the repo.

### Custom books are missing on another browser or device

That is expected. Local CRUD uses browser `localStorage`.

### Favicon does not update immediately

Browsers cache favicons aggressively. Try:

- hard refresh
- opening in an incognito/private window
- redeploying and reopening the deployed URL

## License

Add your preferred license here if needed.
