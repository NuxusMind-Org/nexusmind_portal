# NexusMind - Development Standards & Guidelines

This document defines the development rules, styles, coding standards, and constraints for the **NexusMind** portal frontend. It is the core reference manual for both software engineers and AI coding assistants.

---

## 1. General Coding Standards

All code written in this repository must prioritize **type-safety**, **readability**, and **maintainability**.

- **TypeScript First**: Write all files in TypeScript. Set strict type-checking configurations. Avoid raw JavaScript modules.
- **Strong Typing**: Avoid using the `any` keyword. If a type cannot be determined immediately, use `unknown` and perform runtime type narrowing. Define precise interfaces for all API payloads and component properties.
- **Clean Architecture Principles**: Maintain clear separation between UI layout code and data fetching or business logic. 
- **Consistency**: Keep the codebase uniform. Follow established directory layouts, structural layers, naming rules, and hooks conventions.

---

## 2. React Best Practices

- **Functional Components**: Build all components using React functional components. Class components are not permitted.
- **Custom Hook Extraction**: Extract complex logic, calculations, and database integrations out of JSX files and place them into custom hooks (e.g., hooks prefix `use`). JSX should focus strictly on UI representation.
- **Composition over Inheritance**: Use component composition (nested elements, children properties) to design flexible layouts.
- **Clean Effects**: Keep `useEffect` usage to a minimum. Use event handlers, layout effects, or queries/mutations triggers instead of writing chains of state synchronizations in `useEffect`.

---

## 3. Component Guidelines

Components inside NexusMind are structured into distinct layers to isolate design systems from business logic.

```
                    ┌─────────────────────────────┐
                    │    Global Components Folder │
                    │       (src/components/)     │
                    └──────────────┬──────────────┘
                                   │
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
    ┌─────────────────────────┐         ┌─────────────────────────┐
    │     Reusable UI Primitives │      │     Shared Components   │
    │      (src/components/ui)│         │ (src/components/shared) │
    └─────────────────────────┘         └─────────────────────────┘
     - Logic-free (Button, Card)         - Shared logic (GlobalNavbar)
     
                                   OR
                                   
                    ┌─────────────────────────────┐
                    │    Feature-Local Folder     │
                    │ (src/features/{feat}/comp)  │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │ Business Component  │
                        └─────────────────────┘
                         - Domain logic (PatientCard)
```

### Global UI Components (`src/components/ui/`)
- Must contain strictly reusable, logic-free primitive elements (e.g., Button, Modal, Avatar, Dropdown, Table).
- Do not import hooks, api endpoints, user contexts, or state stores in this directory. All properties are received strictly via component properties (props).
- These elements represent our custom design system primitives (similar to Shadcn UI components).

### Shared Components (`src/components/shared/`)
- Contains cross-feature UI containers that contain generic logic, such as sidebar navigation wrappers, page layouts header wrappers, or universal error indicators.

### Feature Components (`src/features/{featureName}/components/`)
- Contains components mapped directly to business contexts (e.g., `PatientTimeline`, `PsychologistScheduler`).
- These components are allowed to trigger feature-local queries, call Zustand store contexts, validate using schemas, and read database models.

---

## 4. State Management Rules

- **Zustand (Global Client State)**:
  - Use Zustand strictly for UI states (sidebar toggles, themes), authentication metrics, and active session user parameters.
  - Do not use Zustand to cache API payloads or entity directories.
- **TanStack Query (Global Server State)**:
  - All database entries, patient profiles, session records, and settings loaded from APIs must be fetched and cached via TanStack Query.
  - Use custom feature-level query hooks (`useQuery` wrappers) to share server-side states. Do not copy server responses to local states or Zustand stores.

---

## 5. Form Management

- **React Hook Form**: All forms must be managed using `react-hook-form`. Avoid manual local state forms (`useState` per input).
- **Zod Schemas**: Every form must have a corresponding Zod validation schema defined in the feature's `schemas/` directory (e.g., `loginSchema.ts`).
- **Resolver**: Use `@hookform/resolvers/zod` to bind Zod validation schemas directly into the form instances.
- **Layout isolation**: Keep form inputs inside a structured, grid layout. Validate on submission or on field focus change (blur).

---

## 6. Naming Conventions

- **PascalCase folders**: Component folders inside `components/` and `features/` must be named in PascalCase. Each must contain an `index.tsx` file for main exports.
- **camelCase Hooks**: All custom hooks must be camelCase and start with the prefix `use` (e.g., `usePatientDetails.ts`).
- **camelCase Utilities**: General helpers, formatters, and mathematical utilities must be camelCase (e.g., `patientMapper.ts`, `cn.ts`).
- **API Files**: Named in camelCase and end with the `Api` suffix (e.g., `patientApi.ts`, `sessionApi.ts`).
- **TypeScript Types**: Files defining types/interfaces must be camelCase (e.g., `patient.ts`, `session.ts`).
- **Constants**: Files detailing options list, column arrays, or permissions constants must be camelCase (e.g., `patientColumns.ts`).

---

## 7. Performance & Optimization

- **Code Splitting**: Dynamic lazy-loading (`React.lazy`) must be implemented on all routes. Each page chunk should load as needed.
- **Avoid Premature Optimization**: Do not wrap every variable or function in `useMemo` or `useCallback` by default. Only implement memoization hooks when:
  - Passing object/array parameters to heavily rendering children.
  - Doing heavy mathematical or transformation work inside components.
- **Image Optimization**: Always declare explicit dimensions (`width`, `height`) on images. Use vector assets (SVGs) for logos and icons.

---

## 8. Robust Error & Feedback Management

- **API Failure Resilience**: Standardize API error formatting inside `src/types/api.ts`. Interceptors must catch global authentication errors (`401`) and route users back to login.
- **Validation Errors**: Catch validation failures directly in input elements using Zod error lists.
- **User Feedback**: Implement loading indicators (skeleton cards, spinners) during active queries and display clear states (e.g. "No patients found") when lists return empty.

---

## 9. AI Assistant Execution Rules

AI assistants working on this codebase must adhere strictly to these rules:

1. **Follow the Existing Architecture**: Do not reorganize directories, create custom top-level folder systems, or introduce other routing/state paradigms.
2. **Ensure File Alignment**: Place new components, hooks, api hooks, and page files into their corresponding feature subfolders. Do not create massive shared pages.
3. **Naming Strictness**: Maintain the exact PascalCase/camelCase conventions outlined in this documentation.
4. **Prioritize Consistency Over Creativity**: Maintain uniform patterns across different features. Match the design and data retrieval flow of existing pages.
5. **No Overwrites of Unrelated Files**: Only change files directly related to the user request. Do not refactor unrelated classes or clear comments.

---

## 10. Future Scalability Configurations

Every design choice should assume future expansions:
- **Tenant Scalability**: Code must not contain hardcoded tenant IDs or assume single-tenant limits. Always resolve the active tenant dynamically.
- **Multi-Role Integration**: Dashboard views and layout frames must adapt depending on roles, allowing seamless additions of new user profiles (e.g., billing managers, auditors) in the future.
- **Integration Readiness**: Build layout blocks and components assuming future AI transcriptions or VR expos integrations will plug directly into the schemas.

---

## 11. Architecture Protection Rule

> The architecture defined in this project is considered the project's source of truth. AI assistants and developers must not rename, move, or reorganize the project structure without explicit approval. Every new feature should follow the existing architecture and naming conventions. If a new feature does not clearly fit the current structure, request confirmation before introducing new top-level directories or architectural changes.
