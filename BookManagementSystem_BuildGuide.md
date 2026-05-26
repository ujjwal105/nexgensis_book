# 📚 Book Management System — Complete Build Guide
> Hand this document to Claude Code / Codex phase by phase. Execute each phase fully before moving to the next.

---

## Project Overview

Build a **React-based Book Management System** with full CRUD operations, search, filtering, a modern aesthetic UI, and deployment to Vercel/Netlify. The mock API will be hosted on [MockAPI.io](https://mockapi.io) (free tier).

**Stack:**
- React + Vite
- Tailwind CSS + shadcn/ui
- React Query (TanStack Query v5) for server state
- React Hook Form + Zod for form validation
- Axios for HTTP
- MockAPI.io as the hosted REST backend
- React Router v6 for routing
- Framer Motion for animations
- Lucide React for icons

---

## Design Language

The UI should feel like a modern SaaS product — think Notion meets Linear.

- **Color palette:** Deep navy `#0F172A` sidebar, off-white `#F8FAFC` background, indigo `#6366F1` as primary accent, emerald `#10B981` for success, rose `#F43F5E` for delete actions.
- **Typography:** Inter font (via Google Fonts). Large, confident headings. Subtle muted body text.
- **Cards:** Rounded-xl, soft shadow, hover lift effect (`hover:-translate-y-1 transition-all`).
- **Spacing:** Generous padding, clear visual hierarchy.
- **Animations:** Subtle fade-in on list items, slide-in for modals, skeleton loaders while fetching.

---

## Phase 1 — Project Scaffolding

**Goal:** Set up the Vite + React project with all dependencies installed and configured.

### Steps

1. **Bootstrap with Vite**
```bash
npm create vite@latest book-management-system -- --template react
cd book-management-system
npm install
```

2. **Install all dependencies**
```bash
npm install \
  @tanstack/react-query \
  axios \
  react-router-dom \
  react-hook-form \
  @hookform/resolvers \
  zod \
  framer-motion \
  lucide-react \
  clsx \
  tailwind-merge

npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms
npx tailwindcss init -p
```

3. **Install shadcn/ui**
```bash
npx shadcn-ui@latest init
```
When prompted:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

Then add components:
```bash
npx shadcn-ui@latest add button input label select badge dialog toast card skeleton
```

4. **Configure Tailwind** — Replace `tailwind.config.js` with:
```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        navy: "#0F172A",
        primary: "#6366F1",
        success: "#10B981",
        danger: "#F43F5E",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { transform: "translateY(16px)", opacity: 0 }, "100%": { transform: "translateY(0)", opacity: 1 } },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

5. **Add Inter font** — In `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

6. **Global CSS** — In `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: "Inter", sans-serif;
  background-color: #F8FAFC;
  color: #0F172A;
}
```

### Expected Folder Structure After Phase 1
```
book-management-system/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
└── vite.config.js
```

---

## Phase 2 — MockAPI Setup & API Service Layer

**Goal:** Create the hosted mock API and write all API service functions.

### Step 1: Create MockAPI Resource

Go to [https://mockapi.io](https://mockapi.io) and:

1. Create a free account and a new project (e.g., `book-system`)
2. Add a resource called `books`
3. Define the schema:

| Field | Type | Example |
|---|---|---|
| `id` | String (auto) | `"1"` |
| `title` | String | `"The Great Gatsby"` |
| `author` | String | `"F. Scott Fitzgerald"` |
| `genre` | String | `"Fiction"` |
| `publicationYear` | Number | `1925` |
| `description` | String | `"A novel about..."` |
| `coverColor` | String | `"#6366F1"` |
| `createdAt` | String (auto) | ISO date |

4. Generate 10–15 mock entries using MockAPI's faker options.
5. Copy your base URL (format: `https://[project-id].mockapi.io/api/v1`)

### Step 2: Environment Variable

Create `.env` in project root:
```
VITE_API_BASE_URL=https://YOUR_MOCKAPI_PROJECT_ID.mockapi.io/api/v1
```

Also create `.env.example`:
```
VITE_API_BASE_URL=https://your-mockapi-project.mockapi.io/api/v1
```

Add `.env` to `.gitignore`.

### Step 3: Axios Instance

Create `src/services/api.js`:
```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
```

### Step 4: Book Service Functions

Create `src/services/bookService.js`:
```js
import api from "./api";

export const bookService = {
  // GET all books (with optional search/filter params)
  getBooks: async ({ search = "", genre = "", page = 1, limit = 12 } = {}) => {
    const params = { page, limit };
    if (search) params.search = search; // MockAPI supports ?search=
    if (genre) params.genre = genre;
    const response = await api.get("/books", { params });
    return response.data;
  },

  // GET single book by ID
  getBook: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // POST create new book
  createBook: async (bookData) => {
    const response = await api.post("/books", bookData);
    return response.data;
  },

  // PUT update entire book
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // DELETE book
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};
```

### Step 5: React Query Hooks

Create `src/hooks/useBooks.js`:
```js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookService } from "../services/bookService";

export const BOOKS_QUERY_KEY = "books";

// Fetch all books with filters
export function useBooks(filters) {
  return useQuery({
    queryKey: [BOOKS_QUERY_KEY, filters],
    queryFn: () => bookService.getBooks(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    keepPreviousData: true,
  });
}

// Fetch single book
export function useBook(id) {
  return useQuery({
    queryKey: [BOOKS_QUERY_KEY, id],
    queryFn: () => bookService.getBook(id),
    enabled: !!id,
  });
}

// Create book
export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookService.createBook,
    onSuccess: () => qc.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] }),
  });
}

// Update book
export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => bookService.updateBook(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] }),
  });
}

// Delete book
export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookService.deleteBook,
    onSuccess: () => qc.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] }),
  });
}
```

---

## Phase 3 — App Shell & Routing

**Goal:** Build the layout shell — sidebar, topbar, and route setup.

### Step 1: Wrap App with Providers

Update `src/main.jsx`:
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
```

### Step 2: App Routes

Update `src/App.jsx`:
```jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetailPage />} />
      </Route>
    </Routes>
  );
}
```

### Step 3: Layout Component

Create `src/components/Layout/Layout.jsx`:

The layout must have:
- A **fixed left sidebar** (width: 240px, background: `#0F172A`) with:
  - App logo/name at top ("BookShelf" with a book icon)
  - Navigation links: Dashboard (Home icon), Books (BookOpen icon), Add Book (PlusCircle icon)
  - Active link highlight: indigo left border + indigo text + light indigo background
  - Footer: version number at bottom
- A **main content area** (flex-1, overflow-y-auto) with:
  - A sticky topbar: page title (passed via context or derived from route), a notification bell icon, and a user avatar placeholder
  - `<Outlet />` below the topbar

Styling specifics:
- Sidebar nav links: `px-4 py-2.5 rounded-lg mx-2 flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/10 transition-all`
- Active link: `text-white bg-indigo-600/30 border-l-4 border-indigo-500`
- Topbar: `bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10`

### Step 4: Utility Helper

Create `src/lib/utils.js`:
```js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

---

## Phase 4 — Core UI Components

**Goal:** Build all reusable components before building pages.

### 4.1 BookCard Component
`src/components/Books/BookCard.jsx`

A card that displays a single book. Design:
- Rounded-xl card with white background and shadow (`shadow-sm hover:shadow-md transition-all hover:-translate-y-1`)
- Top section: a colored banner (use `book.coverColor` as background, height 80px) with a large book emoji or stylized initial of the title
- Body: title (font-semibold, truncate), author (text-sm text-slate-500), year badge, genre badge
- Footer: Edit button (ghost, indigo) and Delete button (ghost, rose) with icons
- On delete click: show an inline confirmation (`"Are you sure?"` with Confirm/Cancel)
- Props: `book`, `onEdit(book)`, `onDelete(id)`

### 4.2 BookForm Component
`src/components/Books/BookForm.jsx`

A controlled form using React Hook Form + Zod. Fields:

| Field | Type | Validation |
|---|---|---|
| Title | text input | required, min 2 chars |
| Author | text input | required, min 2 chars |
| Genre | select dropdown | required, one of preset genres |
| Publication Year | number input | required, 1000–current year |
| Description | textarea | optional, max 500 chars |
| Cover Color | color picker (type="color") | optional, defaults to `#6366F1` |

Preset genres: `["Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery", "Biography", "History", "Romance", "Thriller", "Self-Help", "Technology", "Other"]`

Zod schema:
```js
const bookSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  author: z.string().min(2, "Author name required"),
  genre: z.string().min(1, "Please select a genre"),
  publicationYear: z.coerce.number()
    .min(1000, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  description: z.string().max(500).optional(),
  coverColor: z.string().optional().default("#6366F1"),
});
```

Styling:
- Form fields use shadcn `Input`, `Label`, `Select`
- Inline error messages below each field (text-rose-500 text-sm)
- Submit button: full-width, indigo, shows spinner when submitting
- Props: `onSubmit(data)`, `defaultValues` (for edit), `isLoading`

### 4.3 BookFormModal Component
`src/components/Books/BookFormModal.jsx`

Wraps `BookForm` in a shadcn `Dialog`. Features:
- Title changes: "Add New Book" vs "Edit Book"
- Smooth fade-in animation using Framer Motion
- Close on backdrop click or Escape key
- Props: `isOpen`, `onClose`, `book` (null for create, book object for edit), `onSuccess`

### 4.4 SearchAndFilter Bar
`src/components/Books/SearchAndFilter.jsx`

A horizontal bar with:
- Search input (Search icon inside, placeholder "Search by title or author...", debounced 300ms via custom hook)
- Genre filter dropdown (shadcn Select, "All Genres" as default)
- Results count text: e.g. "Showing 12 books"
- Clear filters button (only visible when filters are active)

### 4.5 SkeletonCard Component
`src/components/Books/SkeletonCard.jsx`

A loading placeholder that mirrors `BookCard` dimensions:
- Uses shadcn `Skeleton` component
- Animate pulse on the colored banner area, title, author, and buttons
- Render 8 of these in a grid while data is loading

### 4.6 EmptyState Component
`src/components/Books/EmptyState.jsx`

Show when no books match the filters:
- Centered layout with a large BookOpen icon (text-slate-300, size 64)
- Heading: "No books found"
- Subtext based on context: "Try adjusting your search or filters" or "Add your first book to get started"
- Optional CTA button: "Add a Book"

### 4.7 Toast Notifications

Use shadcn toast (`useToast` hook). Trigger:
- ✅ Success (green): "Book added!", "Book updated!", "Book deleted!"
- ❌ Error (red): "Failed to save book. Please try again."

---

## Phase 5 — Pages

**Goal:** Build the two main pages using the components above.

### 5.1 BooksPage
`src/pages/BooksPage.jsx`

This is the main page. Structure:

```
BooksPage
├── Page Header (title "My Library", subtitle "Manage your book collection", + "Add Book" button)
├── SearchAndFilter bar
├── Stats row (3 cards: Total Books, Genres, Latest Added)
└── Book Grid
    ├── Loading: 8x SkeletonCard
    ├── Error: ErrorMessage component with retry button
    ├── Empty: EmptyState component
    └── Success: Grid of BookCards (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6)
        └── Pagination controls at bottom
```

Logic:
- Manage `search`, `genre`, `page` state with `useState`
- Debounce search input (300ms) using a custom `useDebounce` hook
- Pass filters to `useBooks(filters)` hook
- On "Add Book" button click → open `BookFormModal` in create mode
- On `onEdit(book)` from BookCard → open `BookFormModal` in edit mode with `defaultValues`
- On `onDelete(id)` from BookCard → call `useDeleteBook` mutation, show toast
- Framer Motion: wrap grid in `AnimatePresence`, wrap each card in `motion.div` with fade+slide-up

### 5.2 BookDetailPage
`src/pages/BookDetailPage.jsx`

Route: `/books/:id`

Shows detailed view of a single book:
- Back button (arrow left icon) → navigates to `/books`
- Large cover color banner (full width, 200px tall) with book title overlaid
- Book metadata in a clean two-column layout: Author, Genre, Year, Description
- Edit and Delete action buttons
- If loading: full-page skeleton
- If error or book not found: 404-style message with back link

---

## Phase 6 — Custom Hooks & Utilities

**Goal:** Extract reusable logic into hooks.

### 6.1 useDebounce
`src/hooks/useDebounce.js`
```js
import { useState, useEffect } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

### 6.2 useLocalFilters
`src/hooks/useLocalFilters.js`

A hook to manage search + genre + page state together and sync with URL search params (so filters persist on page refresh):
```js
import { useSearchParams } from "react-router-dom";

export function useLocalFilters() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const genre = params.get("genre") || "";
  const page = parseInt(params.get("page") || "1", 10);

  const setSearch = (val) => setParams({ search: val, genre, page: 1 });
  const setGenre = (val) => setParams({ search, genre: val, page: 1 });
  const setPage = (val) => setParams({ search, genre, page: val });
  const reset = () => setParams({});

  return { search, genre, page, setSearch, setGenre, setPage, reset };
}
```

---

## Phase 7 — Error Handling & Loading States

**Goal:** Ensure every async operation has proper UX feedback.

### Rules to follow:

1. **Every API call** must have three states handled: loading, error, success — no exceptions.
2. **Loading:** Use `SkeletonCard` grids (not spinners) for list fetches. Use an indigo spinner button for form submits.
3. **Errors:** Show inline error banners (rose background) with the error message and a retry button when queries fail.
4. **Mutations:** Always wrap in try/catch, show toast on success AND on error.
5. **Network errors:** The Axios interceptor in `api.js` converts all errors to human-readable messages.
6. **Empty states:** Distinguish between "no data exists" and "no results match your filter".

### ErrorBanner Component
`src/components/UI/ErrorBanner.jsx`
- Props: `message`, `onRetry`
- Style: rose-50 background, rose-500 border-left, retry button

---

## Phase 8 — Polishing & Animations

**Goal:** Add the final layer of visual polish that makes the UI feel premium.

### Animations to implement with Framer Motion:

1. **Page transition:** Wrap `<Outlet />` in a `motion.div` with `initial={{ opacity: 0, y: 8 }}` → `animate={{ opacity: 1, y: 0 }}` on route change.

2. **Book cards list:** Use `AnimatePresence` + staggered children:
```jsx
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
```

3. **Modal:** `initial={{ opacity: 0, scale: 0.95 }}` → `animate={{ opacity: 1, scale: 1 }}`

4. **Delete confirmation:** Animate expand/collapse inline.

5. **Stats cards:** Count-up animation on numbers when they first appear.

### Additional polish:
- Add `title` attribute to truncated text for tooltip on hover
- All icon buttons need `aria-label` for accessibility
- Focus rings on all interactive elements (Tailwind's `focus-visible:ring-2 ring-indigo-500`)
- Responsive: sidebar collapses to bottom nav on mobile (breakpoint: `md`)

---

## Phase 9 — README & Deployment Prep

**Goal:** Write the README and prepare for deployment.

### README.md

Create `README.md` with these sections:

```markdown
# 📚 Book Management System

A modern full-stack-like React application for managing your book collection.

## Live Demo
[https://your-deployment-url.vercel.app](https://your-deployment-url.vercel.app)

## Features
- View, add, edit, delete books
- Real-time search by title/author (debounced)
- Filter by genre
- Pagination
- Responsive design
- Animated UI with loading states and error handling

## Tech Stack
- React 18 + Vite
- Tailwind CSS + shadcn/ui
- TanStack Query v5
- React Hook Form + Zod
- Axios + MockAPI.io
- Framer Motion
- React Router v6

## Setup Instructions

1. Clone the repo:
   git clone https://github.com/your-username/book-management-system.git
   cd book-management-system

2. Install dependencies:
   npm install

3. Set up environment variables:
   cp .env.example .env
   # Edit .env and add your MockAPI base URL

4. Start the development server:
   npm run dev

5. Open http://localhost:5173

## MockAPI Setup
1. Go to https://mockapi.io and create a free account
2. Create a project and add a `books` resource
3. Add fields: title, author, genre, publicationYear, description, coverColor
4. Copy the base URL and add to .env

## Deployment
Deploy to Vercel:
1. Push to GitHub
2. Import project at https://vercel.com
3. Add VITE_API_BASE_URL as an Environment Variable
4. Deploy
```

### Vite Config for Deployment

Update `vite.config.js`:
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

### .gitignore additions
```
.env
node_modules/
dist/
```

---

## Phase 10 — Deployment

**Goal:** Deploy live and get the URL.

### Deploy to Vercel (recommended):

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "feat: initial book management system"
git remote add origin https://github.com/YOUR_USERNAME/book-management-system.git
git push -u origin main
```

2. Go to [https://vercel.com](https://vercel.com) → New Project → Import from GitHub

3. In project settings, add **Environment Variable**:
   - Key: `VITE_API_BASE_URL`
   - Value: your MockAPI base URL

4. Click **Deploy**. Vercel auto-detects Vite.

5. Copy the live URL (format: `https://book-management-system-xxx.vercel.app`)

---

## Final Checklist Before Submitting

Go through every item before submitting:

- [ ] All CRUD operations work (create, read, update, delete)
- [ ] Search by title/author works with debounce
- [ ] Genre filter works
- [ ] Loading skeletons appear during API calls
- [ ] Error states show with retry option
- [ ] Empty states show correctly
- [ ] Form validation shows inline errors
- [ ] Toast notifications appear on success/error
- [ ] Responsive on mobile (sidebar collapses)
- [ ] No console errors in production build (`npm run build`)
- [ ] `.env` is in `.gitignore` and not pushed to GitHub
- [ ] `.env.example` IS pushed to GitHub
- [ ] README has setup instructions
- [ ] Live URL works end-to-end (including API)
- [ ] GitHub repo is public

---

## File Structure (Final)

```
src/
├── components/
│   ├── Books/
│   │   ├── BookCard.jsx
│   │   ├── BookForm.jsx
│   │   ├── BookFormModal.jsx
│   │   ├── SearchAndFilter.jsx
│   │   ├── SkeletonCard.jsx
│   │   └── EmptyState.jsx
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   └── UI/
│       └── ErrorBanner.jsx
├── hooks/
│   ├── useBooks.js
│   ├── useDebounce.js
│   └── useLocalFilters.js
├── lib/
│   └── utils.js
├── pages/
│   ├── BooksPage.jsx
│   └── BookDetailPage.jsx
├── services/
│   ├── api.js
│   └── bookService.js
├── App.jsx
├── main.jsx
└── index.css
```

---

*Build phase by phase, test each phase before moving on. Good luck! 🚀*
