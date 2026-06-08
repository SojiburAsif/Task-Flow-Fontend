# ⚡ TaskFlow Frontend

TaskFlow frontend is the high-performance Next.js application for our smart collaboration platform. It provides a seamless, role-based user interface for **Admins, Project Managers, and Team Members**, featuring robust authentication, interactive dashboards, dynamic project management, and real-time analytics.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

---

## ✨ Key Highlights

- **🔒 Role-Aware Architecture:** Dynamic routing and isolated dashboard layouts tailored specifically for Admins, Project Managers, and Team Members.
- **🛡️ Secure Authentication:** Fully protected routes, session-aware navigation, and seamless login/signup flows.
- **📊 Interactive Dashboards:** Comprehensive analytics, visual charts (via Recharts), activity timelines, and real-time summary KPI cards.
- **💼 Complete Workspace Control:** Advanced screens for managing projects, assigning tasks, handling notifications, and moderating user comments.
- **⚙️ React Server Actions:** Highly optimized server actions and proxy logic that securely forward requests to the backend API without exposing sensitive credentials.
- **🎨 Premium UI/UX:** Shared UI primitives crafted with Tailwind CSS v4, Radix UI, Framer Motion, and Sonner toast notifications for a brutalist, sharp aesthetic.

---

## 🛠️ Tech Stack

### Core Frameworks
- **[Next.js 16](https://nextjs.org/)** (App Router)
- **[React 19](https://react.dev/)**
- **TypeScript**

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Framer Motion](https://www.framer.com/motion/)** (Animations)
- **[Recharts](https://recharts.org/)** (Data Visualization)
- **[shadcn/ui](https://ui.shadcn.com/)** (Component Primitives)
- **Sonner** (Toast Notifications)

### Validation & Utilities
- **[Zod](https://zod.dev/)** (Schema validation)

---

## 📂 Repository Layout

The project follows a modular and scalable directory structure:

```text
src/
├── app/               # App router, layouts, pages, and route groups
├── components/        # Dashboard, shared, provider, and UI components
├── lib/               # Utilities (e.g., env.ts for strict environment validation)
├── router/            # Role-based route definitions and navigation helpers
├── services/          # Server actions and data-fetching handlers
└── proxy.ts           # Handles proxying and auth headers for backend API calls
🚀 Getting StartedFollow these steps to set up the frontend locally:Install dependencies: Navigate to the frontend/ directory and run:Bashpnpm install
Configure Environment Variables: Copy the example environment file and update the values:Bashcp .env.example .env.local
Backend Sync: Ensure the backend API is running and accessible via the URL defined in NEXT_PUBLIC_API_BASE_URL.Start the Development Server:Bashpnpm dev
Open http://localhost:3000 to view the application.📜 Available ScriptsCommandDescriptionpnpm devStarts the Next.js development server with hot-reload.pnpm buildCreates an optimized production build.pnpm startStarts the production server using the built app.pnpm lintRuns ESLint to find and fix code style issues.⚙️ Environment VariablesThe frontend relies on strictly validated environment variables via src/lib/env.ts. These should be defined in your .env.local file.Public Variables (Client-Side)VariableDescriptionNEXT_PUBLIC_API_BASE_URLThe backend API base URL exposed to the browser.NEXT_PUBLIC_APP_NAMEThe display name used across the UI.NEXT_PUBLIC_APP_ORIGIN(Optional) The public origin/domain of the frontend app.NEXT_PUBLIC_IIMGBB_KEYPublic Imgbb key for direct client-side upload flows.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY(Optional) Google Maps integration key.Private Variables (Server-Side Proxy & Actions)VariableDescriptionBASE_API_URLThe backend base URL used strictly by server-side fetch/proxy logic.JWT_ACCESS_SECRETSecret key used by frontend-side authentication helpers.JWT_REFRESH_SECRETSecret key used for handling refresh tokens.IIMGBB_KEYServer-side Imgbb key for secure upload operations.📌 Important NotesStrict Environment Validation: src/lib/env.ts is the absolute source of truth. If a required environment variable is missing, the build/app will intentionally fail to prevent runtime errors.API Routing: If you change the backend endpoint, you must update both NEXT_PUBLIC_API_BASE_URL (for client fetches) and BASE_API_URL (for server actions/proxy).Flexible Development: The frontend can be run locally while pointing to a remote staging backend, or both frontend and backend can be spun up together in a local development environment.
