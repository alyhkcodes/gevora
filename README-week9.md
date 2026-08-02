# Week 9: Production Deployment

Gevora is now fully deployed and live in production. This document covers the deployment process, architecture, environment configuration, and issues encountered along the way.

## Live URLs

- **Frontend (Vercel):** https://gevora-pink.vercel.app
- **Backend API (Render):** https://gevora-api.onrender.com
- **Health check:** https://gevora-api.onrender.com/api/health

## Deployment Architecture

- **Frontend:** Next.js (App Router, TypeScript) deployed on **Vercel**
- **Backend:** Node.js / Express deployed on **Render** (Free tier Web Service)
- **Database:** MongoDB Atlas (cloud-hosted)
- **AI:** Google Gemini API for review insight generation
- **Auth:** JWT-based sessions + Google OAuth 2.0 (Passport.js)

## Deployment Steps

### 1. Prepared the codebase for production
- Replaced hardcoded `http://localhost:5000` API URLs with an environment variable (`NEXT_PUBLIC_API_URL`) across the frontend, with a localhost fallback for local development.
- Updated backend CORS configuration to read the allowed origin from `FRONTEND_URL` instead of a hardcoded value.
- Verified no `.env` files were ever committed to git history (`git log --full-history`).
- Confirmed no debug `console.log` statements remained (only intentional startup/error logs kept).

### 2. Deployed the backend to Render
- Created a new Web Service on Render, connected to the GitHub repo with root directory set to `backend`.
- Build command: `npm install`
- Start command: `npm start`
- Added all required environment variables (Mongo connection string, JWT/session secrets, Google OAuth credentials, Gemini API key, frontend URL).
- Verified successful MongoDB Atlas connection and a working `/api/health` endpoint.

### 3. Deployed the frontend to Vercel
- Imported the GitHub repo into Vercel with root directory set to `frontend`.
- Framework preset auto-detected as Next.js.
- Added `NEXT_PUBLIC_API_URL` environment variable pointing to the live Render backend.
- Deployed and verified the production build.

### 4. Connected frontend and backend
- Updated `FRONTEND_URL` on Render to the live Vercel domain so CORS allows requests from production.
- Updated the Google OAuth redirect logic to use `FRONTEND_URL` instead of a hardcoded localhost address.
- Added the production domain and callback URL to Google Cloud Console's OAuth client (Authorized JavaScript origins + Authorized redirect URIs).

## Environment Variables

**Backend (Render):**
| Variable | Purpose |
|---|---|
| `PORT` | Server port |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Signs authentication tokens |
| `SESSION_SECRET` | Session security |
| `GOOGLE_CLIENT_ID` | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `GEMINI_API_KEY` | AI review insight generation |
| `FRONTEND_URL` | Used for CORS + OAuth redirect target |

**Frontend (Vercel):**
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for all backend API calls |

## Issues Encountered & Fixes

1. **Build failure: `useSearchParams()` not wrapped in Suspense**
   Next.js requires any component using `useSearchParams()` to be wrapped in a `<Suspense>` boundary when statically prerendered. Fixed by extracting the logic into an inner component wrapped in `<Suspense>` on the `/oauth-success` page.

2. **Stale Vercel deployments**
   The "Redeploy" button on Vercel re-runs the exact commit it's attached to rather than fetching the latest push. Resolved by pushing a new commit to trigger a fresh build tied to the latest code.

3. **OAuth redirect hardcoded to localhost**
   The Google OAuth callback redirected users to `http://localhost:3000` regardless of environment, breaking login in production. Fixed by reading the redirect target from `process.env.FRONTEND_URL`.

4. **Double `/api` in AI insights request**
   The Insights page constructed its API URL assuming `NEXT_PUBLIC_API_URL` did not include `/api`, while the rest of the app assumed it did — resulting in requests to `/api/api/ai/insights` and a 404. Standardized the convention so `API_BASE` always includes `/api`.

5. **Case-sensitive filename mismatch (logo not loading)**
   The logo file was saved locally as `logo.PNG`, while the code referenced `/logo.png`. Windows filesystems are case-insensitive so this worked in local development, but Vercel's Linux-based servers are case-sensitive, causing a broken image in production. Fixed by renaming the file (via a two-step `git mv` to force git to register the case change) to match the lowercase reference in code.

## Testing Performed

- ✅ User registration (email/password)
- ✅ User login (email/password)
- ✅ Google OAuth sign-in end-to-end
- ✅ AI-powered review insight generation (Gemini API)
- ✅ CRUD persistence verified (data survives page refresh, confirming database writes)
- ✅ CORS correctly scoped to production frontend origin

## Author
**Aly Husain Khan**