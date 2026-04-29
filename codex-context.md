# PUG Web Admin Context

This file is the working contract for `pug-web-admin`. If you follow it closely, you should be able to complete most tasks in this repo without any prior conversation context.

## What this project is

- `pug-web-admin` is a Next.js 15 App Router admin interface for the PUG platform.
- It uses React 19, TypeScript strict mode, Tailwind 4 utility classes, Radix primitives under local wrappers, React Hook Form, Zod, React Query, i18next, Zustand, and Sonner.
- The app is split into:
  - authenticated application routes under `app/(app)`
  - auth routes under `app/(auth)`
  - internal Next API proxy routes under `app/api`
- The current product surface is:
  - `academic`
  - `partner`
  - `project`
  - `identity`
  - `geo`
  - `docs`

## Non-negotiable rules

- Use `@/` for internal imports.
- Do not introduce new relative imports for internal modules when an `@/` path is appropriate.
- Keep raw static config under `constants/`.
- Keep types and interfaces under `types/`.
- Keep Zod schemas under `schemas/`.
- Keep provider contexts under `contexts/`.
- Keep reusable or pure helper functions out of `.tsx` files when they are not tightly coupled to local component state. Put them in adjacent `utils.ts` when local to a feature/component folder.
- Keep all user-facing copy in locales. Do not add new hardcoded UI copy in pages, components, or features.
- When changing copy, update both:
  - `public/locales/en-US/common.json`
  - `public/locales/pt-BR/common.json`
- Reuse existing primitives and utility CSS before inventing new structures.
- Do not bypass local wrappers to use third-party UI primitives directly unless there is already an established exception and there is a real need.

## Current tech and runtime facts

- Package manager: `npm`
- TypeScript is strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `useUnknownInCatchVariables`.
- Path alias: `@/*`
- Main scripts:
  - `npm run dev`
  - `npm run dev:mock`
  - `npm run build`
  - `npm run lint`
  - `npm run lint:fix`
  - `npm run format`
  - `npm run format:check`
- There is a mock API workflow through:
  - `mock-api.env`
  - `scripts/mock-api.mjs`
  - `npm run dev:mock`
  - `npm run mock:api`

## High-level folder contract

- `app/`: route tree, layouts, route boundaries, global styles, providers
- `components/`: shared design-system primitives
- `constants/`: raw static configuration, route maps, option lists, design-system config
- `contexts/`: React providers and related hooks
- `features/`: app features and docs feature surfaces
- `schemas/`: Zod schemas
- `types/`: app and UI type contracts
- `utils/`: cross-cutting helpers
- `api/`: fetch clients and API-layer helpers
- `public/locales/`: i18n dictionaries

## Route structure

### App Router groups

- `app/(app)` is the authenticated shell area.
- `app/(auth)` is the auth area.
- `app/api` contains the internal API proxy endpoints.

### Current application routes under `app/(app)`

- `/`
- `/academic`
- `/academic/course`
- `/academic/school`
- `/academic/student`
- `/partner`
- `/partner/entity`
- `/partner/staff`
- `/project`
- `/project/attendance`
- `/project/enrollment`
- `/project/project`
- `/identity`
- `/identity/account`
- `/identity/admin`
- `/identity/user`
- `/geo`
- `/geo/city`
- `/docs`
- `/docs/pages`
- `/docs/pages/section-stack`
- `/docs/pages/operations-workspace`
- `/docs/pages/split-detail`
- `/docs/primitives`
- `/docs/primitives/actions`
- `/docs/primitives/display`
- `/docs/primitives/forms`
- `/docs/primitives/navigation`
- `/docs/primitives/overlays`
- `/docs/primitives/structure`
- `/docs/routing`
- `/docs/routing/previews/not-found`
- `/docs/routing/previews/error`
- `/docs/routing/previews/global-error`

### Auth route

- `/login`

## Auth and session behavior

- Auth is cookie-based.
- Session cookies are defined in `constants/auth.ts`:
  - `accessToken`
  - `refreshToken`
- Public routes are currently only:
  - `/login`
- Middleware behavior in `middleware.ts`:
  - `/login` redirects to `/` when a valid access token already exists
  - protected routes continue when the access token is valid
  - if access token is invalid but refresh token exists, the middleware attempts refresh
  - refreshed tokens are written back via session cookie helpers
  - on failure, session cookies are cleared and the request is redirected to `/login`
- The matcher intentionally excludes Next static assets, image routes, favicon, and common image extensions.

## Root app composition

- `app/layout.tsx`:
  - reads theme and language cookies server-side
  - applies initial `lang`, `className`, `data-theme`, and `colorScheme`
  - renders `ThemeScript` in `<head>`
  - wraps children with `Providers`
- `app/providers.tsx` currently composes:
  - `I18nextProvider`
  - `ThemeProvider`
  - `LocaleProvider`
  - `QueryClientProvider`
  - `ToastProvider`

## Application shell

- The authenticated shell is implemented in `features/app-shell`.
- The shell contains:
  - top bar
  - sidebar
  - route breadcrumbs
  - scrollable content area
- Current shell behavior to preserve:
  - sidebar collapsed state is stored in `localStorage` under `SIDEBAR_STORAGE_KEY`
  - clicking outside the expanded shell surface collapses the sidebar
  - the content area uses the shared `ScrollArea`
  - the sidebar uses the shared `ScrollArea`
  - collapsed sidebar groups open popovers
  - collapsed sidebar items use the shared `Tooltip`
  - the sidebar account area has a right-side popover with logout action
- Shell-specific styling belongs in:
  - `app/styles/utilities/app-shell.css`

## Navigation system

- Navigation config is centralized in:
  - `constants/navigation.ts`
- App-shell constants are centralized in:
  - `constants/app-shell.ts`
- The sidebar and breadcrumbs are config-driven.
- Navigation types live in:
  - `types/client/navigation.ts`
- When adding a new application route under `app/(app)`:
  1. add the route page
  2. add the route to `SIDEBAR_NAV_GROUPS`
  3. add the route label to `APP_ROUTE_LABELS`
  4. add all required locale keys
  5. ensure breadcrumb labels resolve through the route map

## Data and API conventions

- External API base URL is centralized in:
  - `constants/api.ts`
- Route bases exist for:
  - external API routes: `API_ROUTE_BASES`
  - internal web proxy routes: `WEB_API_ROUTE_BASES`
- The `api/` folder contains client-facing API helpers.
- `app/api/**/route.ts` acts as the internal proxy layer.
- Shared API utilities live under `utils/` and `api/web/`.
- Schemas:
  - server/API schemas: `schemas/api`
  - client schemas: `schemas/client`
- Types:
  - API types: `types/api`
  - client/UI/app types: `types/client`

## Component system

### Shared primitives

- Shared primitives live in `components/`.
- Primitive groups:
  - `actions`
  - `display`
  - `forms`
  - `navigation`
  - `overlays`
  - `structure`
- Public exports should flow through:
  - `components/index.ts`

### Primitive design rules

- Use the project primitive first, not raw Radix or ad hoc markup, when a shared primitive already exists.
- Keep disabled behavior and visuals aligned when a primitive supports `disabled`.
- Favor clean controlled/uncontrolled APIs that mirror native or Radix behavior.
- Keep public component contracts typed through `types/client/components/**`.
- If helper logic becomes reusable or pure, move it to adjacent `utils.ts`.

### Important current primitive conventions

- `sonner` must be consumed through the local toast primitive, not directly in feature code.
- `ScrollArea` is the shared scroll container primitive.
- `Tooltip`, `Popover`, `Dialog`, `Drawer`, `AlertDialog`, `DropdownMenu`, `Tabs`, `Accordion`, and form controls are all wrapped locally.
- Icons should use the local `Icon` primitive where that contract already exists.

## Styling system

- Global style entrypoints are under `app/styles/`.
- Important files:
  - `tokens.css`
  - `themes.css`
  - `base.css`
  - `scrollbar.css`
  - `utilities/index.css`
- Reusable utility styling belongs under:
  - `app/styles/utilities/*.css`
- Current utility styling files include:
  - `actions.css`
  - `app-shell.css`
  - `badges.css`
  - `buttons.css`
  - `display.css`
  - `forms.css`
  - `layout.css`
  - `navigation.css`
  - `overlays.css`
  - `toasts.css`

### Styling rules

- Prefer utility class contracts already defined in `app/styles/utilities`.
- Do not add long one-off visual contracts inline if a repeated pattern exists or should exist.
- If a visual pattern repeats, promote it into utility CSS.
- Toast styling is a special case and stays in the toast utility/wrapper path.
- App-shell visuals should continue using `app-shell.css`, not feature-specific inline styling.

### Surface model

- The app uses a three-surface depth model.
- General rule:
  - darker surfaces sit farther back
  - lighter surfaces move closer to the user
- Default to visible contrast between first-layer and second-layer content.
- Sections do not always need their own new surface, but cards should contrast against their immediate background.
- The third surface level is optional and should only be used when another depth step helps.
- Use shadows intentionally to reinforce depth or importance, not mechanically everywhere.

## Localization

- i18n is initialized through the app provider stack.
- Locale helpers live in:
  - `utils/locale.ts`
  - `utils/lang.ts`
- Locale state is handled by:
  - `contexts/locale.tsx`
- Theme state is handled by:
  - `contexts/theme.tsx`
- Keep new UI copy out of code.
- If you find legacy hardcoded copy in existing files, do not treat that as permission to add more. Prefer moving new or touched copy into locales.

## Docs system

- `docs` is an internal reference area for:
  - shared primitives
  - route boundary previews
  - page pattern guidance
- Docs static config is now centralized in:
  - `constants/docs.ts`
- Docs types live in:
  - `types/client/docs.ts`
- Docs feature surfaces live in:
  - `features/docs`

### Primitive docs rules

- Every shared primitive should have a matching docs particle under:
  - `features/docs/primitives/<category>`
- New primitive particles should be exported from:
  - `features/docs/index.ts`
- Particle pages should demonstrate meaningful states, including disabled states when relevant.

### Route boundary docs rules

- The project already documents:
  - `not-found.tsx`
  - `error.tsx`
  - `global-error.tsx`
- There are safe preview routes for those boundaries under `/docs/routing/previews/*`.
- Boundary screen helper functions are centralized in:
  - `features/docs/routing/utils.ts`

## Page architecture rules

- The default page grammar is `Section Stack`.
- The current docs area documents three page patterns:
  - `Section Stack`
  - `Operations Workspace`
  - `Split Detail`

### Section Stack

- Use it by default for overview and calmer reference pages.
- Structure:
  - centered app shell
  - optional breadcrumb
  - one clear page header
  - stacked `Section` surfaces below

### Operations Workspace

- Use it for collection pages with frequent search, filters, triage, queue-like flows, or rapid state changes.
- Preferred targets:
  - students
  - projects
  - enrollments
  - attendances
  - staff
  - possibly partner entities if the page becomes operationally dense

### Split Detail

- Use it for important single-record pages that need persistent context while reading or editing related information.
- Preferred targets:
  - `student/:id`
  - `project/:id`
  - `partner-entity/:id`
  - `school/:id` only if it grows beyond simple reference detail

### Overlay rules

- Overlays support pages. They do not replace page architecture.
- Use:
  - `Popover` for filters, row actions, tiny decisions
  - `Dialog`/modal for confirmations and short one-shot actions
  - `Drawer` for subordinate create/edit/review flows tied to the current page

## Import and organization rules

- Internal imports should use `@/`.
- Keep module barrels clean and intentional.
- Static config belongs in `constants/`.
- Types belong in `types/`.
- Pure reusable helpers belong in `utils.ts` near the owning component/feature, or in `utils/` when cross-cutting.
- Component-local closures that depend directly on state, refs, or render context may stay inside `.tsx`.

## Known project-specific patterns to preserve

- The app shell navigation is config-driven and translation-key driven.
- Breadcrumb labels should resolve from route label config instead of ad hoc title-casing.
- The login screen is the only public route.
- Login should redirect to `/` when the user is already authenticated.
- The sidebar does not include a login destination.
- Account/logout lives in the shell account popover, not in the main navigation list.
- The shell and docs areas already use shared `ScrollArea` and overlay primitives; keep that consistency.

## What to check before finishing work

- Run `npm run lint`.
- If the change is structural or type-heavy, also run `tsc --noEmit` when appropriate.
- Verify new routes are reflected in navigation config and locale labels.
- Verify new copy exists in both locale files.
- Verify constants, types, and helper functions are in the correct folders.
- Verify internal imports use `@/`.
- Verify new UI uses existing primitives and utility styling before adding bespoke patterns.

## Practical default workflow for changes

1. Read the relevant route, feature, primitive, and config files first.
2. Reuse existing patterns instead of inventing a new structure.
3. If adding static config, put it in `constants/`.
4. If adding or moving types, put them in `types/`.
5. If adding non-trivial reusable helpers, move them to `utils.ts`.
6. If adding copy, update both locale files.
7. If adding a primitive, add the matching docs particle.
8. Run lint and any necessary type checks.

## Exceptions and judgment

- Next.js framework exports that must stay in route/layout files, such as `metadata` or route `config`, should remain in those files.
- React contexts are runtime objects and stay in `contexts/`; they are not “raw constants”.
- Component declarations exported as `const` through `forwardRef` are still components, not misplaced constants.
- Do not move logic out of a `.tsx` file just to satisfy formality when it is tightly coupled to local state and would become harder to read.

If there is any conflict between an existing file and this document, prefer the repo’s currently working shared patterns, then update this context file when the architectural rule has clearly changed.
