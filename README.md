# peopleOS — User Management Demo

A responsive user management application built with React and Vite. It simulates the supplied user API entirely in the browser, using LocalStorage for users, sessions, and password recovery. No backend or network API is used.

## Features

- Registration, sign in, simulated access/refresh sessions, and sign out
- Dashboard statistics, recently joined members, and quick actions
- Searchable, paginated directory with configurable page size
- Profile and password management
- Local demo OTP recovery flow with expiry and attempt limits
- Seeded sample data, responsive layouts, and SPA-ready Vercel rewrites

## Stack

React 18, Vite 6, JavaScript, React Router, Lucide React, CSS, and browser LocalStorage.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with `npm run build`; preview it with `npm run preview`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `Admin@123` |
| Member | `noah@example.com` | `Demo@123` |

The login page includes a demo account shortcut. Seed users are created the first time the app runs and are not replaced on subsequent visits. The app includes a reset demonstration data option in the storage utility (`initializeStorage(true)`) for development.

## Password recovery

Use a registered email on the forgot password page. Since there is no email service, the generated six digit code appears in an in-app demonstration notification. The code expires after five minutes and allows up to five attempts.

## LocalStorage and security

The demo stores user records, demo passwords, simulated tokens, and reset state in browser LocalStorage. Tokens are opaque demonstration values, not signed JWTs. Expired access tokens are renewed locally while the session record remains present. This is not real authentication and does not protect sensitive information. Do not use real personal data or passwords. A production application needs a secure server, hashed passwords, signed tokens, and server delivered recovery codes.

Storage keys are `peopleos.users`, `peopleos.session`, and `peopleos.passwordReset`. Malformed JSON is discarded safely. User and auth logic lives in `src/services/storage.js`; field validation is in `src/utils/validation.js`.

## Project layout

```text
src/
  App.jsx                 Routes, screens, and reusable interface elements
  main.jsx                App entry and sample data initialization
  services/storage.js     Local user, session, and reset workflows
  utils/validation.js     Email and password validation
  styles.css              Responsive application styling
```

## Deploy to Vercel

Import the GitHub repository in Vercel. Use `npm run build` as the build command and `dist` as the output directory. `vercel.json` rewrites application routes to `index.html` so client side routes also work when refreshed. The app needs no environment variables.

## Git workflow

The repository uses `main` for production and `dev` for integration. Feature work is developed on focused `feature/*` branches, merged into `dev`, and promoted to `main` after the production build is verified. Releases use semantic tags (the first release target is `v1.0.0`).

## Limitations

All data belongs to the current browser profile and device. Clearing browser storage removes it. Passwords, sessions, and OTPs are only simulated and can be inspected or changed by the user. This portfolio demo must not be used to manage real users.
