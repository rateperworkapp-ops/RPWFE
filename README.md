# Factory Worker Productivity and Salary Management Frontend

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local environment file from the example:
   ```bash
   copy .env.example .env
   ```
   On macOS/Linux use:
   ```bash
   cp .env.example .env
   ```
3. Start the app:
   ```bash
   npm run dev
   ```

## Env
Local development uses `VITE_API_BASE_URL` from `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Production builds use `.env.production` by default:
```env
VITE_API_BASE_URL=https://rpwbe.onrender.com/api
```

## Vercel Env
This frontend reads the backend base URL from `VITE_API_BASE_URL` at build time.
On Vercel, set `VITE_API_BASE_URL` in Project Settings -> Environment Variables if you want to override `.env.production`, then redeploy the project.

## Run Commands
- Development: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## Backend API Base URL Setup
This frontend uses `VITE_API_BASE_URL` for Axios base URL.
Fallbacks:
- Development fallback: `http://localhost:5000/api`
- Production fallback: `https://rpwbe.onrender.com/api`

## Page Overview
- `/register`: manager registration page.
- `/login`: manager login page.
- `/`: dashboard summary cards (today production/salary, worker count, department count).
- `/departments`: add/edit/delete departments.
- `/workers`: add/edit/delete workers.
- `/work-entries`: create daily work entries and list entries.
- `/reports`: daily/weekly/monthly reports with payout actions for weekly/monthly.
- `/payouts`: list all generated payouts, filter by period type/status, mark pending payouts as paid.

## Payout Workflow
1. Open **Reports** page.
2. Select **Weekly** or **Monthly** tab and load report.
3. Per worker row:
   - If no payout exists for selected range: click **Generate Payout**.
   - If payout exists and pending: click **Mark as Paid**.
   - If payout exists and paid: row shows **Paid** state.
4. Open **Payouts** page to view all generated payouts and mark any pending payout as paid.

## Auth Behavior
- Registration uses `POST /api/auth/register`, then redirects the user to `/login`.
- JWT token is stored in localStorage key `auth_token`.
- Minimal user object is stored in localStorage key `auth_user`.
- Protected routes redirect unauthenticated users to `/login`.
- Authenticated users visiting `/login` or `/register` are redirected to `/`.
- API `401` responses clear auth storage and redirect to `/login`.
