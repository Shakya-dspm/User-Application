# UserDesk

A static user management interface connected to the FreeProjectAPI User App service. It uses HTML, CSS, and browser JavaScript modules; no build step is required.

## Features

- Sign in and create users through the API.
- Request and verify a password reset code through the API.
- Browse, search, and paginate API user records.
- View an API-backed record count and recent users.
- Change the signed-in account password through the API.
- Responsive navigation and loading, empty, and error states.

## Run locally

Serve this folder over localhost or HTTPS (for example, with VS Code Live Server) and open `index.html`. The browser must be able to reach `https://api.freeprojectapi.com` and the service must allow cross-origin requests.

## API integration

Base URL: `https://api.freeprojectapi.com/api/UserApp`

The app calls `POST /login`, `POST /CreateNewUser`, `GET /searchUsers`, `POST /send-reset-otp`, `POST /verify-otp-reset-password`, and `PUT /update-password/{customerId}`. Login uses `emailId` and `password`. User creation sends `userId`, `fullName`, `emailId`, and `password`. Search accepts `searchText`, `pageNumber`, and `pageSize`. OTP reset sends `emailId` as a query parameter, then `email`, `otp`, and `newPassword` in its verification request. Password updates send `existingPassword` and `newPassword`.

The account session is kept in `sessionStorage`; no user list is copied into the repository or cached locally. The client maps API records to a small safe view model and drops `password`, `refreshToken`, and other unneeded fields before rendering.

## API data limitation

The live `searchUsers` response currently contains password and refresh-token properties, including plaintext values. The browser must receive the API response before the client can discard those fields, so this static frontend cannot make that response confidential. Do not use real accounts or personal information with this service. A secure deployment requires the API provider to remove secrets from user-list responses and enforce suitable authorization on search. The API's `GetAllUsers` route currently requires a bearer token; the interface uses the documented search route instead.

The password recovery flow uses the request schemas from the live OpenAPI document at `https://api.freeprojectapi.com/swagger/v1/swagger.json`. No demo credentials or local authentication are included.
