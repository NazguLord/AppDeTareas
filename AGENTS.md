# AGENTS

## Repo Shape (not a monorepo workspace)
- Work in `client/` (Vite + React) and `backend/` (Express + MySQL) as two separate Node projects; run installs and scripts inside each folder.
- Root `package.json` only lists a few shared deps and has no scripts; do not assume root-level `npm run` commands exist.

## Reliable Dev Commands
- Client: `npm run dev` (Vite on port `3000`), `npm run build`, `npm run test` from `client/`.
- Backend: `npm start` (nodemon entry `index.js`) from `backend/`.
- Backend has no real test script (`npm test` intentionally fails), so verify backend changes with focused API calls/manual checks.

## Environment + Cross-App Contract
- Backend loads env strictly from `backend/.env` via `src/config/env.js` (not from cwd).
- Required backend vars are `DB_HOST`, `DB_USER`, `DB_NAME`, `JWT_SECRET`; server startup also requires a reachable MySQL instance because `src/server.js` tests a DB connection before `listen()`.
- Frontend API base URL is `import.meta.env.VITE_API_URL` with fallback `http://localhost:8800` (`client/src/api.js`). `client/.env.example` still uses old `REACT_APP_API_URL` naming; use `VITE_API_URL` for actual behavior.
- Auth uses cookie-based JWT (`access_token`) with `withCredentials: true`; keep CORS `origin` aligned with `CLIENT_URL` when changing local ports.

## Backend Architecture Notes
- Main flow is `routes -> controllers -> services -> queries`; SQL strings live under `backend/src/queries/*.queries.js`.
- Route mounting is centralized in `backend/src/routes/index.js`; some resources are prefixed (`/contactos`, `/medicamentos`) while others are mounted at root (`/login`, `/register`, `/tareas`, `/bootlegs`, `/upload`). Check route files before assuming endpoint paths.
- File upload middleware writes directly into frontend source folders (`client/src/uploads` and `client/src/img`) from backend code (`backend/src/middlewares/upload.js`); avoid accidental cleanup/refactors that break this coupling.

## Frontend Wiring Notes
- Router is defined in `client/src/App.jsx` with `createBrowserRouter`; shared layout wraps most pages with `Navbar`/`Footer`.
- Vite config includes a custom `js-as-jsx` transform for `.js` files under `src/`; preserve it if touching build config or mixed `.js`/JSX files can break.
