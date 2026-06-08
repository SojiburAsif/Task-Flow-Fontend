# TaskFlow Frontend

TaskFlow frontend is the Next.js application for the collaboration platform. It provides the role-based UI for Admins, Project Managers, and Team Members, including authentication, dashboards, project and task management, comments, notifications, analytics, and image uploads.

## Highlights

- Role-aware routing and dashboard layouts for the three supported user roles.
- Authentication pages, protected routes, and session-aware navigation.
- Project, task, comment, notification, and user management screens.
- Dashboard analytics, charts, activity timelines, and summary cards.
- Server actions and proxy logic that forward requests to the backend API.
- Shared UI primitives built with Tailwind CSS, Radix primitives, Framer Motion, Recharts, and sonner/toast components.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Recharts
- Zod validation
- shadcn-style UI components

## Repository Layout

- `src/app/` contains the app router, layouts, pages, and route groups.
- `src/components/` contains dashboard, shared, provider, and UI components.
- `src/lib/env.ts` validates browser and server-side environment variables.
- `src/proxy.ts` handles proxying and auth headers for backend calls.
- `src/services/` contains actions and data-fetching helpers.
- `src/router/` contains role-based route helpers.

## Setup

1. Install dependencies in the `fontend/` folder.
2. Copy `.env.example` to `.env.local` and update the values.
3. Make sure the backend API is running and reachable from `NEXT_PUBLIC_API_BASE_URL`.
4. Start the dev server with `pnpm dev`.

## Scripts

- `pnpm dev` starts the Next.js development server.
- `pnpm build` builds the production app.
- `pnpm start` starts the production server.
- `pnpm lint` runs ESLint.

## Environment Variables

The frontend reads these values from `.env.local`.

Public values used in the browser:

- `NEXT_PUBLIC_API_BASE_URL` - backend API base URL exposed to the client.
- `NEXT_PUBLIC_APP_NAME` - display name used in the UI.
- `NEXT_PUBLIC_APP_ORIGIN` - optional public origin of the frontend app.
- `NEXT_PUBLIC_IIMGBB_KEY` - public Imgbb key for upload flows.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - optional Maps key.

Server-side proxy and action values:

- `BASE_API_URL` - backend base URL used by server-side fetch/proxy logic.
- `JWT_ACCESS_SECRET` - secret used by frontend-side auth helpers.
- `JWT_REFRESH_SECRET` - refresh token secret used by auth helpers.
- `IIMGBB_KEY` - server-side Imgbb key for upload flows.

## Notes

- `src/lib/env.ts` is the source of truth for frontend environment validation.
- If you change the backend URL, update both `NEXT_PUBLIC_API_BASE_URL` and `BASE_API_URL`.
- The frontend can run locally while pointing to a remote backend, or both apps can run locally together.