# ApniSec Issues Portal (Next.js 15 + OOP Backend + MongoDB)

A full-stack Next.js (App Router) application with:
- Custom JWT auth (login/register/logout/me)
- Protected pages (`/dashboard`, `/profile`)
- OOP backend architecture (handlers, services, repositories, validators, errors)
- Custom rate limiting (100 req / 15 min / IP / endpoint)
- Resend email integration (welcome, issue created, profile updated)
- **Prisma + MongoDB** (works with **MongoDB Compass**)

## 1) Setup

### Prerequisites
- Node.js 18+ (recommended 20+)
- MongoDB (either **local** or **MongoDB Atlas**)

### Install

```bash
npm install
cp .env.example .env
```

### Database (Prisma + MongoDB)

```bash
npm run prisma:generate
npm run prisma:push
```

> Prisma uses `db push` for MongoDB (no SQL migrations).

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## 2) Use MongoDB Compass

1. Open **MongoDB Compass**
2. Paste the same connection string you put in `.env` (`DATABASE_URL`)
3. Connect → you will see collections after you register/login and create issues:
   - `User`
   - `Issue`
   - `RefreshToken`
   - `Note`

## 3) API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET  /api/auth/me` (protected)

### Profile
- `GET /api/users/profile` (protected)
- `PUT /api/users/profile` (protected)

### Issues
- `GET /api/issues?type=cloud-security` (protected)
- `POST /api/issues` (protected)
- `GET /api/issues/[id]` (protected)
- `PUT /api/issues/[id]` (protected)
- `DELETE /api/issues/[id]` (protected)

### Notes (Optional)
- `GET /api/notes` (protected)
- `POST /api/notes` (protected)

## 4) OOP Backend Structure

All backend logic is implemented via classes:
- `src/server/core/*` (errors, response, base handler, container)
- `src/server/auth/*` (validator, service, guard, handlers)
- `src/server/users/*` (repo, service, validator, handler)
- `src/server/issues/*` (repo, service, validator, handlers)
- `src/server/notes/*` (repo, service, validator, handler)
- `src/server/rateLimit/*` (rate limiter class)

## 5) Rate Limiting

Default: **100 requests / 15 minutes** per IP per endpoint group.
Headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## 6) Notes

- The edge `middleware.ts` protects page routes by presence of the `access_token` cookie.
- All API routes enforce auth by verifying JWT server-side.
- Emails are sent in a fire-and-forget manner so they don't block core flows.
