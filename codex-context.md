# PUG Web Admin Context

This file is the working contract for `pug-web-admin`. If you follow it closely, you should be able to complete most tasks in this repo without any prior conversation context.

## What this project is

- `pug-web-admin` is a Next.js 16 App Router admin interface for the PUG platform.
- It uses React 19, TypeScript strict mode, Tailwind 4 utility classes, Radix primitives under local wrappers, React Hook Form, Zod, TanStack Query, i18next, Zustand, and Sonner.
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
- Current core runtime baseline:
  - `next` `16.2.4`
  - `react` / `react-dom` `19.2.5`
  - `typescript` `5.9.3`
  - `eslint` `9.39.4`
  - `eslint-config-next` `16.2.4`
- Main scripts:
  - `npm run dev`
  - `npm run dev:mock`
  - `npm run dev:turbo`
  - `npm run dev:mock:turbo`
  - `npm run build`
  - `npm run lint`
  - `npm run lint:fix`
  - `npm run format`
  - `npm run format:check`
- There is a mock API workflow through:
  - `mock-api.env`
  - `scripts/mock-api.mjs`
  - `scripts/with-env.mjs`
  - `npm run dev:mock`
  - `npm run mock:api`
- The mock scripts do not rely on `node --env-file`. They use `scripts/with-env.mjs` to load `mock-api.env` and spawn the command with the merged environment.

## High-level folder contract

- `app/`: route tree, layouts, route boundaries, global styles, providers
- `components/`: shared design-system primitives
- `constants/`: raw static configuration, route maps, option lists, design-system config
- `contexts/`: React providers and related hooks
- `hooks/`: shared custom hooks
- `features/`: app features and docs feature surfaces
- `schemas/`: Zod schemas
- `store/`: Zustand client-state stores
- `types/`: app and UI type contracts
- `utils/`: cross-cutting helpers
- `api/`: fetch clients and API-layer helpers
- `public/locales/`: i18n dictionaries

## Route structure

### App Router groups

- `app/(app)` is the authenticated shell area.
- `app/(auth)` is the auth area.
- `app/api` contains the internal API proxy endpoints.
- `proxy.ts` is the Next 16 request gate for auth/session routing behavior.

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
- Request gate behavior lives in `proxy.ts`:
  - `/login` redirects to `/` when a valid access token already exists
  - protected routes continue when the access token is valid
  - if access token is invalid but refresh token exists, the middleware attempts refresh
  - refreshed tokens are written back via session cookie helpers
  - on failure, session cookies are cleared and the request is redirected to `/login`
- The matcher intentionally excludes Next static assets, image routes, favicon, and common image extensions.
- Do not reintroduce `middleware.ts`; Next 16 uses the `proxy.ts` convention here.

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
- The app-wide QueryClient is created in `app/providers.tsx` with defaults from:
  - `constants/react-query.ts`
- React Query Devtools are mounted in `app/providers.tsx` in development only, closed by default.

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
  - the sidebar account area has a right-side popover with authenticated profile information and logout action
- The account popover currently shows:
  - user name from `users/me`
  - account email from `admins/me`
  - formatted campus from `admins/me`
- Shell profile hydration is fetched client-side after authentication and should remain query-driven, not manually fetched inside random components.
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
- Shared API error normalization and mutation toast helpers live under:
  - `utils/api-errors.ts`
  - `utils/mutation-toast.ts`
- Schemas:
  - server/API schemas: `schemas/api`
  - client schemas: `schemas/client`
- Types:
  - API types: `types/api`
  - client/UI/app types: `types/client`

## TanStack Query conventions

- TanStack Query is the default server-state layer.
- Use it for:
  - authenticated `me` endpoints
  - API-backed detail views
  - API-backed lists, tables, filters, and dashboards
  - mutations that should invalidate or refresh cached server state
- Do not use it for:
  - form field state
  - theme or locale state
  - sidebar collapsed state
  - modal/popover open state
  - temporary view-local interaction state
- Query defaults are centralized in:
  - `constants/react-query.ts`
- The current defaults intentionally favor predictable admin-app behavior:
  - `retry: 1`
  - `staleTime: 5 minutes`
  - `refetchOnWindowFocus: false`
- Query ownership pattern:
  - raw HTTP calls remain in `api/web/**`
  - feature-local query keys and query hooks live in feature-local `queries.ts`
  - components consume query hooks instead of calling `webFetch` directly
- Current established examples:
  - `features/identity/account/queries.ts`
  - `features/identity/admin/queries.ts`
  - `features/identity/user/queries.ts`
- Current query key style:
  - domain-local object with `all` plus narrower key builders such as `me()`
- When adding mutations:
  - use `useMutation`
  - invalidate relevant domain keys on success
  - prefer conservative invalidation over premature optimistic updates
  - use `createToastMutationOptions` for opt-in mutation success/error toasts instead of hand-rolling Sonner calls in every mutation
- Query error rule:
  - do not globally toast query failures by default
  - prefer inline empty/error states for query surfaces
- Mutation toast rule:
  - success toasts are opt-in and should be reserved for explicit user actions
  - error toasts should go through `getApiErrorToastContent` / `createToastMutationOptions`
  - do not build blanket transport-level success toasts for all API calls
- Avoid:
  - ad hoc string query keys scattered in components
  - mixing server-state copies into Zustand
  - direct page/component `fetch` calls for shared authenticated data

## Zustand conventions

- Zustand is the default client shared-state layer when state should outlive one component but should not be treated as server state.
- Store files belong under:
  - `store/`
- Current established example:
  - `store/app-shell.ts`
- Store types belong under:
  - `types/client/store.ts`
- Use Zustand for:
  - app-shell UI state
  - persisted client preferences
  - route-level shared workspace state
  - client coordination state shared across siblings or distant components
- Do not use Zustand for:
  - API-backed data that belongs in TanStack Query
  - form field state that belongs in React Hook Form
  - theme and locale, which already live in dedicated contexts
- Keep stores small and domain-oriented. Prefer multiple focused stores over one monolithic global store.

## Authenticated profile hydration

- The final shell pattern is:
  1. login establishes the secure session/token state
  2. authenticated shell clients fetch profile data from `admins/me` and `users/me`
  3. shell UI reads those cached query results
- This is the current source of truth for shell identity UI.
- The sidebar account popover in `features/app-shell/Sidebar/AccountMenu` should keep using these `me` queries rather than decoding JWT payloads for display data.
- On logout:
  - session cookies are cleared through the auth API
  - related query cache should be invalidated/cleared before redirecting back to `/login`

## Tooling and upgrade realities

- This repo has already been moved onto the current compatible version set for its stack. Do not assume "absolute latest" is automatically usable.
- In particular:
  - `eslint` 10 was not left in place
  - `typescript` 6 was not left in place
- Current rule of thumb:
  - upgrade to the latest compatible version, not blindly to the newest published major
  - validate with `npm run lint` and `npx tsc --noEmit` after dependency changes
- The repo now uses Next 16's flat ESLint config path in:
  - `eslint.config.mjs`
- Do not reintroduce the older `FlatCompat` bridge pattern unless the repo explicitly changes direction again.
- The current lint/tooling stack is stricter than before and will flag patterns such as synchronous `setState` calls inside effects. Prefer deriving state from props/pathname or using lazy initial state instead of resetting state in effects just to satisfy UI behavior.

## Form and validation conventions

- React Hook Form + Zod is the standard form stack.
- Localized Zod form setup is centralized in:
  - `hooks/useLocalizedZodForm.ts`
- Hook types live in:
  - `types/client/forms.ts`
- Use `useLocalizedZodForm` when a form schema is translation-aware.
- This hook currently standardizes:
  - schema creation from `t`
  - resolver wiring through `zodResolver`
  - revalidation on language change so existing field errors retranslate
- Keep this separation:
  - `useLocalizedZodForm` for field validation wiring
  - feature component for submit behavior
  - feature component for API/server error handling
  - feature component for toasts and redirects
- Do not build a broad global form context for unrelated forms. The shared abstraction here is a hook, not app-wide form state.

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
- For API-driven mutation feedback:
  - normalize API/Web API errors through `utils/api-errors.ts`
  - prefer `createToastMutationOptions` over open-coded toast `onSuccess`/`onError` branches
- `ScrollArea` is the shared scroll container primitive.
- `Tooltip`, `Popover`, `Dialog`, `Drawer`, `AlertDialog`, `DropdownMenu`, `Tabs`, `Accordion`, and form controls are all wrapped locally.
- Icons should use the local `Icon` primitive where that contract already exists.
- Button contract:
  - the canonical button variants are `primary` and `secondary`
  - `variant="primary"` is the main filled action pattern
  - `variant="secondary"` is the lower-emphasis ghost action pattern
  - default button contract is:
    - `variant="primary"`
    - `usage="primary"`
    - `size="md"`
  - when `variant="secondary"` is used without an explicit `usage`, it should render with the neutral grey action treatment
  - `usage` still controls semantic color meaning:
    - `primary`
    - `secondary`
    - `success`
    - `info`
    - `warning`
    - `danger`
  - `flat` and `ghost` remain compatibility aliases only; do not prefer them in new code
- Button action ordering rule:
  - in grouped actions, the primary action belongs at the far right
  - secondary and fallback actions stack to the left in decreasing emphasis
- Toggle contract:
  - single `Toggle` is the default neutral-surface pressed-action pattern
  - `ToggleGroup` now has constrained variants:
    - `spaced`
    - `pill`
  - `ToggleGroup` color variants are:
    - `default`
    - `chrome`
  - use `chrome` only on colored surfaces such as the app-shell topbar
  - `ToggleGroupItem` supports `tooltipContent` directly; do not rebuild selector-specific tooltip wrappers around theme/language controls

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

## Responsiveness

- The project already has a strong responsive baseline. New work should preserve that quality.
- Mobile and tablet behavior are first-class requirements, not follow-up polish.
- Default rule: if a surface is not clearly useful on smaller screens, remove it or collapse it instead of forcing it to fit.
- Prefer responsive simplification over dense scaling. Hiding secondary support panels on smaller screens is often correct.
- Text must always fit its container without overlap, clipping, or accidental horizontal scroll.
- Avoid layouts that depend on one fixed desktop proportion to remain usable.
- Preserve stable heights and widths for repeated controls where hover states, loading states, or longer labels could shift layout.
- Shared scroll areas should keep scrolling contained to the intended region and should not introduce horizontal overflow unless that is explicitly the pattern.
- For app-shell work:
  - sidebar, topbar, breadcrumbs, and content scroll behavior must remain coherent across breakpoints
  - collapsed/expanded states should still be usable on smaller viewports
  - support surfaces such as login heroes should be hidden below desktop when they stop helping the flow
- Before finishing responsive UI work, check at least:
  - small mobile width
  - tablet width
  - desktop width

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
- Authenticated shell profile display should come from `admins/me` and `users/me`, not from hardcoded values or JWT-only assumptions.
- Shared server-state should use TanStack Query with feature-local `queries.ts`.
- Shared localized form wiring should use `useLocalizedZodForm` instead of repeating schema/resolver/language-sync code.
- Request gating should use `proxy.ts`, not `middleware.ts`.
- Mock runtime scripts should use `scripts/with-env.mjs`, not `node --env-file=...`.
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
5. If adding shared custom hook logic, put it in `hooks/`.
6. If adding non-trivial reusable helpers, move them to `utils.ts`.
7. If adding copy, update both locale files.
8. If adding a primitive, add the matching docs particle.
9. Run lint and any necessary type checks.

## Exceptions and judgment

- Next.js framework exports that must stay in route/layout files, such as `metadata` or route `config`, should remain in those files.
- React contexts are runtime objects and stay in `contexts/`; they are not “raw constants”.
- Component declarations exported as `const` through `forwardRef` are still components, not misplaced constants.
- Do not move logic out of a `.tsx` file just to satisfy formality when it is tightly coupled to local state and would become harder to read.

If there is any conflict between an existing file and this document, prefer the repo’s currently working shared patterns, then update this context file when the architectural rule has clearly changed.
