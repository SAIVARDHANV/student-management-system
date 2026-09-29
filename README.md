# Student Management System

## Requirements

- Node.js 18 or newer
- npm

## Run locally

Install dependencies in each application:

```powershell
cd server
npm install
Copy-Item .env.example .env
npm start
```

In a second terminal:

```powershell
cd client
npm install
npm run dev
```

The client runs at `http://localhost:5173` and the API at `http://localhost:5000`.

## Logout flow

The login screen accepts an auth token issued by an authentication provider. The protected dashboard checks for `authToken` in local storage. Logout posts that token to `/api/auth/logout`, revokes it for the lifetime of the API process, clears the token and browser storage, and returns to `/login`.

This starter does not include a login or token-issuing endpoint. The in-memory blacklist is cleared when the server restarts; use a persistent store and validate tokens on protected API routes before using this pattern in production.
