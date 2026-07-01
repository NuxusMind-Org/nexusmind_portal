# NexusMind - Technical Architecture Documentation

This document explains the technical frontend architecture of the **NexusMind** multi-tenant SaaS application. It serves as a guide for engineering layouts, data flows, and code patterns in a highly scalable environment.

---

## 1. Architectural Philosophy

NexusMind is designed with a **Feature-Based Architecture**. 

### Why Feature-Based Architecture?
Traditional React architectures group files by technical role (e.g., all pages in `pages/`, all components in `components/`, all types in `types/`). In large-scale systems (300+ pages), this approach quickly leads to maintenance bottlenecks:
- Developers must search across multiple directories to edit a single feature.
- File coupling becomes tangled and difficult to trace.
- Refactoring or removing a feature requires tracing files scattered throughout the workspace.

### Key Architectural Guidelines
- **Modularity**: Every feature must exist as an independent module that contains its own UI components, state logic, page layouts, validation schemas, and API code.
- **Strict Separation of Concerns**: Unrelated business features must never be nested inside each other. Patients logic must remain inside `features/patients/`, psychologist logic inside `features/psychologists/`, etc.
- **Global vs. Local Boundaries**: Global folders (like `src/components/ui/`) contain strictly generic, reusable primitives that are independent of any business logic.

---

## 2. Directory Layout and Structure

The root of the frontend application is located inside the `src/` directory, mapped out as follows:

```text
src
├── api            # Global API configurations (Axios, endpoints, interceptors)
├── app            # Core application config, provider wrappers, global styles
├── assets         # Global static assets (icons, images, logos, fonts)
├── components     # Reusable, logic-free UI primitives (Buttons, Inputs, Modals)
├── constants      # Static constants (system-wide roles, permissions, storage keys)
├── features       # Isolated business feature domains
├── hooks          # Global generic React hooks (usePagination, useOutsideClick)
├── layouts        # Platform frame templates (Dashboard, Portal, Auth, Blank)
├── lib            # Third-party client instance wrappers (QueryClient, socket, dayjs)
├── permissions    # RBAC utilities, hooks, and route guard components
├── router         # Route trees divided by responsibility
├── store          # System-wide Zustand stores (Authentication, sidebar, theme)
├── types          # Shared system TypeScript types and API response envelopes
├── utils          # Common utility helpers (class mergers, string formatters)
├── main.tsx       # Application entry point
└── vite-env.d.ts  # Vite ambient type definitions
```

---

## 3. Feature Structure

Every directory inside `src/features/` must follow the exact same structural template to maintain modular isolation. Here is an example using the `patients` feature:

```text
src/features/patients
├── api/          # Feature API request files (patientApi.ts)
├── components/   # Feature-specific components (PatientCard, PatientTable)
├── constants/    # Feature constants (patientColumns.ts)
├── hooks/        # Feature custom hooks (usePatients.ts, usePatientDetails.ts)
├── pages/        # Feature pages (PatientDashboard, PatientProfile)
├── schemas/      # Zod validation schemas (patientSchema.ts)
├── types/        # Feature typescript types (patient.ts)
└── utils/        # Feature mappers, data normalizers (patientMapper.ts)
```

### Purpose of Subfolders
* **`api/`**: API query and mutation trigger definitions. Communicates with backend endpoints specific to the feature.
* **`components/`**: UI components that display, manipulate, or render business logic unique to this feature.
* **`constants/`**: Form layouts, table configurations, or option list constants.
* **`hooks/`**: Connects pages or components with API endpoints using TanStack Query, managing local user actions.
* **`pages/`**: Complete views mapped to application routes.
* **`schemas/`**: Forms validation rules designed using Zod.
* **`types/`**: TypeScript interfaces describing entities specific to this module.
* **`utils/`**: Feature-specific helpers (e.g., transforming backend timestamps into clinical format).

---

## 4. Naming Conventions

Strict naming conventions ensure predictability across thousands of files.

| File/Folder Category | Convention | Example |
| :--- | :--- | :--- |
| **Component Folders** | `PascalCase` containing `index.tsx` | `PatientCard/index.tsx`, `DashboardHeader/index.tsx` |
| **Custom Hooks** | `camelCase` starting with `use` | `usePatients.ts`, `useSidebar.ts` |
| **Utility Files** | `camelCase` | `cn.ts`, `dateFormatter.ts`, `patientMapper.ts` |
| **API Client Modules** | `camelCase` ending in `Api` | `patientApi.ts`, `authApi.ts` |
| **TypeScript Types** | `camelCase` noun files | `patient.ts`, `auth.ts`, `session.ts` |
| **Validation Schemas** | `camelCase` ending in `Schema` | `patientSchema.ts`, `loginSchema.ts` |
| **Constants Files** | `camelCase` | `patientColumns.ts`, `storageKeys.ts` |

---

## 5. Routing Architecture

Routes are managed using React Router's data APIs. The route mapping is divided into separate files inside `src/router/` to keep individual files maintainable:

- **[authRoutes.tsx](file:///Users/rafiqsafarov/Documents/projects/nexusmind_portal/src/router/authRoutes.tsx)**: Handles public pages (Login, Forgot Password, Reset Password) inside `AuthLayout`.
- **[organizationRoutes.tsx](file:///Users/rafiqsafarov/Documents/projects/nexusmind_portal/src/router/organizationRoutes.tsx)**: Handles local workspace administration pages (users, organization settings) for Org Admins inside `DashboardLayout`.
- **[platformRoutes.tsx](file:///Users/rafiqsafarov/Documents/projects/nexusmind_portal/src/router/platformRoutes.tsx)**: Portal settings, analytics, and billing modules for Platform Super Admins.
- **[psychologistRoutes.tsx](file:///Users/rafiqsafarov/Documents/projects/nexusmind_portal/src/router/psychologistRoutes.tsx)**: Clinical features (patients list, therapy diaries, calendar scheduling) for Psychologists.
- **[index.tsx](file:///Users/rafiqsafarov/Documents/projects/nexusmind_portal/src/router/index.tsx)**: Integrates the route segments under the global `AuthGuard` or `GuestGuard` routes and exports the central router object.

---

## 6. Layout System

Layouts are located in `src/layouts/` as PascalCase folders containing `index.tsx`. They define the shell of different pages:

* **`DashboardLayout`**: The layout containing side navigation, top status bars, and central workspaces for platform/organization admins and psychologists.
* **`PortalLayout`**: Patient-facing frame with top navigation bars, simpler menus, and a client-focused profile workspace.
* **`AuthLayout`**: Frameless centered layout for user authentication, passwords recovery, and registration.
* **`BlankLayout`**: Clear container for fullscreen applications (e.g., active video telehealth calls or clinical assessment surveys).

---

## 7. State Management Guidelines

State management is divided based on state category to avoid performance bottlenecks:

```
                          ┌───────────────────────────┐
                          │     Application State     │
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
    ┌─────────────────────────┐                   ┌─────────────────────────┐
    │      Client State       │                   │      Server State       │
    │  (Zustand Global Store)  │                   │     (TanStack Query)    │
    └─────────────────────────┘                   └─────────────────────────┘
     - Auth token & User info                      - API data (patients list)
     - Theme state (Dark/Light)                    - Cache management
     - Sidebar UI open/close                       - Network status sync
```

1. **Client State (Zustand)**: Used exclusively for global UI toggles, authentication statuses, themes, and current user parameters. Shared store definitions live in `src/store/`.
2. **Server State (TanStack Query)**: Used for data fetching, caching, mutation triggers, synchronization, and pagination metadata. Do not copy server response data into Zustand; access it using custom React hooks (e.g., `useQuery`).

---

## 8. API Architecture

The networking layer is built around **Axios** with feature-scoped API endpoints.

- **Global Instance**: Mapped inside [axios.ts](file:///Users/rafiqsafarov/Documents/projects/nexusmind_portal/src/api/axios.ts) using standard settings (base URLs, default timeouts, content type).
- **Interceptors**: Mapped inside [interceptors.ts](file:///Users/rafiqsafarov/Documents/projects/nexusmind_portal/src/api/interceptors.ts) to automatically inject JWT authentication and multi-tenant headers (`X-Tenant-ID`) on outgoing requests, and capture `401` authentication failures.
- **Feature-Local Files**: Requests to endpoint subsets are defined within their corresponding feature `api` folder (e.g. `src/features/patients/api/patientApi.ts`). Do not compile all system endpoints into a single global API client.

---

## 9. Security & Access Control (RBAC)

RBAC controls are evaluated dynamically at runtime.

- **Role Definitions**: Standard user roles (`platform_admin`, `org_admin`, `psychologist`, `patient`) are declared as constants inside `src/constants/roles.ts`.
- **Permission Checking**:
  - `useHasRole()`: Custom React hook to check user roles.
  - `useHasPermission()`: Custom React hook to check individual functional permissions (e.g., `sessions:cancel`).
- **Route Protection**: The routing system uses layout-level guards defined inside [guards.tsx](file:///Users/rafiqsafarov/Documents/projects/nexusmind_portal/src/permissions/guards.tsx):
  - `AuthGuard`: Prevents unauthenticated access.
  - `GuestGuard`: Redirects logged-in users away from auth pages.
  - `RoleGuard`: Limits path access to specific system roles.
  - `PermissionGuard`: Restricts routes using a specific functional permission check.

---

## 10. Scalability & Code Splitting

As the platform scales to 300+ pages, bundling becomes critical.

- **Lazy Loading**: Route configurations in the future must import pages dynamically using `React.lazy` to divide the final bundle size.
- **Feature Encapsulation**: Because features are fully self-contained, adding a new feature or deleting an obsolete one requires no modifications to existing feature code. We only need to register the new routes inside `src/router/` to activate the feature.
