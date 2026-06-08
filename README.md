# ⚡ TaskFlow Frontend

**High-performance, role-based collaboration platform interface.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

> Seamless UI for Admins, Project Managers, and Team Members featuring robust authentication, interactive dashboards, and real-time analytics.

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

### 🔹 Core Frameworks
* **Next.js 16** (App Router)
* **React 19**
* **TypeScript**

### 🔹 Styling & UI
* **Tailwind CSS v4**
* **Framer Motion** (Animations)
* **Recharts** (Data Visualization)
* **shadcn/ui** (Component Primitives)
* **Sonner** (Toast Notifications)

### 🔹 Utilities
* **Zod** (Schema Validation)

---

## 📂 Repository Layout

The project follows a highly modular directory structure:

```text
src/
├── app/               # App router, layouts, pages, and route groups
├── components/        # Dashboard, shared, provider, and UI components
├── lib/               # Utilities (e.g., env.ts for strict environment validation)
├── router/            # Role-based route definitions and navigation helpers
├── services/          # Server actions and data-fetching handlers
└── proxy.ts           # Handles proxying and auth headers for backend API calls
