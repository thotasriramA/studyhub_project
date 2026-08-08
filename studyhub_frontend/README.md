# StudyHub Frontend (React + Vite + Tailwind)

Instagram-style UI for the StudyHub student social platform.

## Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

> Make sure the backend is running at `http://localhost:8000` first
> (see `../backend/README.md`). The API base URL is set in
> `src/api/axios.js` — change it there if your backend runs elsewhere.

## Pages

| Route | Page |
|---|---|
| `/login` | Log in |
| `/signup` | Create account |
| `/` | Home feed (all posts, searchable) |
| `/communities` | Browse/create/join communities |
| `/community/:slug` | Posts inside one community |
| `/create` | Create a new post |
| `/profile/:id` | View/edit profile |

## Design notes

- Fonts: system UI font (Segoe UI/Helvetica Neue) for body text, and Google
  Font "Grand Hotel" (cursive) for the "StudyHub" logo — mimicking
  Instagram's wordmark style. Change this in `tailwind.config.js` under
  `fontFamily.logo` and in `index.html`'s Google Fonts link if you'd like a
  different look.
- Colors and spacing follow Instagram's actual web app closely: white cards,
  light gray borders (`#dbdbdb`), blue action color (`#0095f6`), red heart
  (`#ed4956`) — all defined in `tailwind.config.js` under `colors.insta`.
- Icons: `lucide-react` (same icon set style used by many modern apps).

## Build for production

```bash
npm run build
```

Output goes to `dist/` — deploy it to Vercel, Netlify, or any static host.
