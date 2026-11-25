# PeopleDesk - User Management

A responsive, static user management demo built with semantic HTML, custom CSS, vanilla JavaScript modules, Bootstrap 5, and browser LocalStorage. There is no backend, framework, package manager, or build step.

## Features

- Login, registration, client-side access and refresh token simulation, and logout.
- Dashboard statistics, recent accounts, profile, and password changes.
- Searchable, paginated user directory.
- Demonstration password recovery with an expiring, attempt-limited OTP.
- Eight initialized demo accounts and a reset demo data action.
- Responsive navigation and layouts for small screens.

## Run locally

Password hashing uses Web Crypto, so serve the folder from `localhost` or HTTPS. In VS Code, install/use Live Server and open `index.html` with **Open with Live Server**. Any static HTTP server is also suitable. Do not open the HTML file directly with `file://`.

Demo sign in:

| Email | Password |
| --- | --- |
| `admin@example.com` | `Admin@123` |

There are seven additional accounts. Their passwords are `Olivia@123`, `Noah@123`, `Amara@123`, `Leo@12345`, `Maya@12345`, `Ethan@123`, and `Sofia@123` respectively, matching the account names shown in the demo data.

## Structure

```text
index.html                 Login
register.html              Registration
forgot-password.html       Request demo OTP
verify-otp.html             Verify demo OTP
reset-password.html        Reset password
dashboard.html             Overview
users.html                 Searchable directory
profile.html               Current user profile
change-password.html       Update password
404.html                   Not found
assets/css/style.css       Shared visual system and responsive styles
assets/js/app.js           Page rendering and event wiring
assets/js/auth.js          Session and authentication operations
assets/js/token.js         Simulated access/refresh token lifecycle
assets/js/storage.js       User LocalStorage operations and demo setup
assets/js/password.js      Web Crypto password hashing and validation
assets/js/recovery.js      Demonstration OTP flow
assets/js/users.js         Search and pagination
assets/js/config.js        Storage keys and sample records
```

## Local data

The app uses `peopledesk.users`, `peopledesk.session`, and `peopledesk.reset` in LocalStorage. New passwords are salted and hashed with the browser Web Crypto SHA-256 API. The login page explains the demo credentials. Use **Reset demo data** in the sidebar to clear local accounts/session state and regenerate the original eight accounts.

Forgot-password creates a code locally and displays it on the verification page. No message is sent. The code expires after ten minutes and has a maximum of five verification attempts.

## Security limitations

This application is a portfolio demonstration, not a system for real customer accounts. LocalStorage can be read or changed by the user, and browser-only checks cannot provide trusted authentication or authorization. The simulated random tokens are not signed JWTs and are not sent to any API. Client-side password hashing does not replace a server-side password KDF and secure account service. Do not store real personal information or reuse production credentials here.

## Deployment

The site is static and can be deployed directly to Vercel with no build command and no output directory. Import the repository, choose `main` as the production branch, and leave the framework preset as **Other**. Vercel serves the root HTML pages and `assets/` paths directly and recognizes the custom `404.html` page. The application can also be hosted on any static host with the same file layout.

## Git workflow

The repository uses `main` for production and `dev` for integration, with feature branches for focused work. Use Conventional Commit messages. The earlier framework-based files have been removed from `dev`; this version is a static website with no build step.
