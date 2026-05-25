# karyabi-pt-frontend

## Setup

1. Install dependencies with `npm install`
2. Optionally define `VITE_API_BASE_URL`
3. Start dev server with `npm run dev`

## Key Notes

- The UI is RTL-first and Persian-first.
- The GDPR modal blocks the full interface until consent is accepted.
- Google sign-in is initiated through the backend `/api/auth/google` route.
- After authentication, users land on `/dashboard` and are routed to role-specific pages under `/dashboard/*`.
- Dashboard routes are role-protected on the client.
- Local API target can be configured with `VITE_API_BASE_URL`.

## Tests

Run:

```bash
npm test
```
