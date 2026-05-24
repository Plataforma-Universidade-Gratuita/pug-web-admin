# DEVELOPMENT GUIDANCE

This file is the working development contract for `pug-web-admin`.

Use it for day-to-day implementation rules, repo conventions, validation steps, and UI/system constraints. Keep broader architectural overview and cross-project documentation in `pug-docs`.

## Project baseline

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
- Do not use inline object type definitions in function or component parameters.
- For components, define props under `types/` and name them `<ComponentName>Props`.
- For non-component argument objects, define a named type or interface under `types/` instead of annotating the object inline.
- Keep Zod schemas under `schemas/`.
- Keep provider contexts under `contexts/`.
- Keep reusable or pure helper functions out of `.tsx` files when they are not tightly coupled to local component state. Put them in adjacent `utils.ts` when local to a feature/component folder.
- Keep page and component files under `400` lines unless there is a real documented reason they must exceed it.
- If a file starts pushing past that limit, split it into adjacent feature-local pieces such as:
  - detail dialog
  - filter drawer
  - row actions
  - editor form surface
  - feature-local action hook
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
  - `scripts/with-env.mjs`
  - `npm run dev:mock`
- The mock scripts do not rely on `node --env-file`. They use `scripts/with-env.mjs` to load `mock-api.env` and spawn the command with the merged environment.
- The mock backend logic itself no longer lives in this repo. It lives in `../pug-mocks` and must be started there.
- `mock-api.env` is still the place where `pug-web-admin` points itself at the mock backend target.
- The web app should stay ignorant to whether the backend is the real service or the shared mock. Switching between them must happen through environment and external process wiring, not feature-level code branches.

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
- `/docs/primitives`
- `/docs/primitives/actions`
- `/docs/primitives/display`
- `/docs/primitives/forms`
- `/docs/primitives/navigation`
- `/docs/primitives/overlays`
- `/docs/primitives/structure`
- `/docs/routing`
- `/docs/routing/not-found`
- `/docs/routing/error`
- `/docs/routing/global-error`

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
  - feature-local mutation hooks live in feature-local `mutations.ts`
  - when page or drawer mutation orchestration starts bloating the parent file, move that orchestration into an adjacent feature-local hook
  - components consume query hooks instead of calling `webFetch` directly
- Bounded read-only reference catalogs may fetch once and filter client-side inside feature-local helpers when the dataset is intentionally small.
  - current example: `features/geo/city`
  - do not generalize this to large operational lists; those should stay backend-filtered
- Current established examples:
  - `features/identity/account/queries.ts`
  - `features/identity/admin/queries.ts`
  - `features/identity/admin/mutations.ts`
  - `features/identity/user/queries.ts`
- Shared helpers that should be preferred before open-coded page logic:
  - `hooks/useQueryErrorToast.ts`
  - `hooks/useQueryErrorToasts.ts`
  - `hooks/useDeferredUndoAction.ts`
  - `hooks/useHydratedFormOnOpen.ts`
  - `hooks/useDraftFilters.ts`
  - `hooks/useServicePageDetailState.ts`
  - `hooks/useServicePageEditorState.ts`
- Current query key style:
  - domain-local object with `all` plus narrower key builders such as `me()`
- When adding mutations:
  - use `useMutation`
  - keep mutation hooks in feature-local `mutations.ts`
  - prefer direct cache writes for bounded entity graphs that already own stable list/detail/linked query keys
  - update the smallest coherent cache surface needed so the UI reflects the change without an unnecessary refetch
  - invalidate relevant domain keys when the mutation result cannot be applied confidently to the local cache
  - use `createToastMutationOptions` for opt-in mutation success/error toasts instead of hand-rolling Sonner calls in every mutation
- Current mutation cache pattern:
  - list and detail caches should stay in sync after explicit user mutations
  - `me()` and linked-record caches should also be updated when the mutation changes those records
  - current example: `features/identity/admin/mutations.ts`
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
- Form field semantics:
  - `Input` is the default single-line field
  - use `TextArea` only for genuinely long-form content such as notes, feedback, and explanations
  - `Combobox` is the searchable single-selection field for longer option sets; it is not the multi-select pattern
  - `Checkbox` is for independent choices
  - `RadioGroup` is for one required or mutually exclusive choice within a set
  - `Switch` is for live binary settings that read naturally as enabled or disabled
- Form field structure:
  - keep a visible `Label` with fields that need a persistent name
  - do not rely on placeholder text as the only field label
  - field-level descriptions are appropriate for checkbox, radio, switch, and combobox items when one extra line clarifies the decision
- Select contract:
  - use select for one value from a defined set when the current value should stay visible in the trigger field
  - placeholder is only for genuinely unselected states; once a value exists, the trigger should show it directly
  - grouped options can use labels and separators for lightweight hierarchy
  - select remains the compact single-value pattern; escalate to combobox for search or to multi-select for many selections
  - if the primitive exposes direct clear behavior, treat it as a convenience on top of the same single-value contract
- Multi-select contract:
  - use multi-select when several values from the same set should stay grouped under one compact trigger
  - the closed trigger summarizes selections with badges instead of listing every option inline
  - selection badges use the brand tone by default and may switch to `neutral`, `success`, `warning`, `danger`, or `info` when the set carries real semantics
  - keep it for compact grouped multi-value choices; escalate when the set becomes heavily searchable or structurally rich
- Date picker contract:
  - the shared date picker is date-only in the UI
  - emitted values still use backend-friendly datetime shape at midnight for the chosen day
  - use `min` and `max` when the valid day window is known
  - keep it for one-off date fields; ranges, presets, recurrence, and richer scheduling logic should become higher-level composite components
- Input contract:
  - keep `Input` for short structured values
  - the password reveal behavior is built into the primitive through `showPasswordToggle`
  - leading or trailing icons should stay supportive rather than replacing the field label
- Text area contract:
  - preserve a comfortable minimum height
  - use it where vertical growth is expected and readable
  - do not swap to `TextArea` just because a layout has spare width
- Combobox contract:
  - use it when search materially improves option picking
  - option rows may carry short supporting metadata
  - if the option set is short and obvious, prefer a normal select-style control instead
- Icon contract:
  - icons are decorative by default when adjacent text already communicates meaning
  - provide `label` only when a standalone icon needs to expose meaning on its own
  - when icons are used inside buttons or other controls, the parent control should own accessibility and tooltip behavior
- Badge contract:
  - use badges for compact semantic metadata such as status, lifecycle stage, compact category, or risk
  - keep badge copy short and glanceable
  - choose tone first based on meaning, then variant only to tune emphasis
  - `primary` is the default emphasized badge treatment
  - `primary` renders solid in light mode and soft in dark mode
  - `secondary` is the outline badge treatment
- EmptyState contract:
  - use empty state to explain why content is absent inside the container that owns that absence
  - match the message to the reason: first use, no results, no access, or temporarily empty data
  - add actions only when there is a meaningful next step; do not fill the surface with decorative buttons
  - keep the title and description short, clear, and scoped to the missing content
  - use `NoContentState` for successful empty results
  - use `SomeErrorState` for recoverable server/query failures that should expose one fixed refresh action
  - use `NotFoundState` for single-record lookups that resolve to missing data without implying a broader transport failure
- Skeleton contract:
  - the base `Skeleton` primitive stays intentionally simple; the consistency work belongs in the premade loading compositions
  - card, section, dialog, drawer, and alert dialog loading states should present as single full-surface loading blocks
  - do not fake internal CTA, metadata, or form structure inside those premade loading states
  - use more detailed skeleton compositions only when a feature explicitly needs manual loading layout inside its own surface
- Section contract:
  - use section as a page-level grouping band for related content
  - section introduces a content group through `SectionHeader`, `SectionTitle`, optional short `SectionDescription`, and optional `SectionActions`
  - section itself should usually stay visually quiet; do not use it as a card substitute
  - if everything inside is one compact framed object, prefer `Card` instead of forcing section to become the surface
  - `SectionActions` belong in the header only when they affect the section as a whole
  - keep the primary action at the far right and support actions to its left
  - use `SectionContent` to host the real body, which may contain cards, tables, forms, lists, or other denser primitives
- Card contract:
  - use card for one bounded unit such as a repeated item, compact summary, or contained tool
  - do not use card as page structure or as an arbitrary wrapper around unrelated content
  - `CardHeader` supports an optional left icon through its `icon` prop; do not manually rebuild icon-plus-title header layout in children
  - `CardDescription` should stay short; if the copy grows into broader page guidance, that content likely belongs in a section instead
  - `CardFooter` is for card-level actions or compact metadata only, such as buttons, badges, or icons
  - if a card has no card-level actions or metadata, omit the footer entirely
  - primary footer action stays on the far right, with support actions to its left
- Table contract:
  - table is the shared primitive for dense operational lists that still need predictable empty, loading, and overflow behavior
  - keep feature-owned data columns in the passed `columns` array
  - when a row-level action menu is needed, use `getRowActions`
  - `getRowActions` appends a built-in last action column owned by the primitive
  - when `getRowActions` resolves to one actionable item, the primitive renders that action directly as the row-action cell
  - when `getRowActions` resolves to two or more actionable items, the primitive renders the three-dots trigger and dropdown shell
  - features should pass only the dropdown menu items for that row; do not rebuild the trigger or action-column plumbing per feature
  - the action column stays narrow, fixed-width, and last; it is not a sortable data column
  - the action column is sticky on the right so it remains visible while the rest of the table scrolls horizontally
  - sticky behavior is implemented with `position: sticky; right: 0` on both the header cell and each body cell of the action column
  - the sticky cells carry a matching background so content scrolling beneath them stays hidden
  - shared table sorting is accent-insensitive by default; if a feature adds client-side table filtering, it should use the same normalized comparison behavior
  - keep heavier behaviors such as row selection, pagination, and virtualization out of the primitive until a real feature requires them
- Label contract:
  - use `Label` to bind visible field text to the control directly
  - labels belong to inputs, text areas, comboboxes, and other named fields that remain discoverable after interaction begins
- Separator contract:
  - use separators sparingly to reinforce grouping, metadata rhythm, or section transitions
  - separators support hierarchy; they do not replace spacing and layout decisions
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
- Tabs contract:
  - default tabs are label-based
  - `TabsList` supports:
    - `variant="default"`
    - `variant="icon"`
  - icon-only tabs should provide `tooltipContent` on each `TabsTrigger` so the label remains discoverable
  - tabs use the shared `ScrollArea` for horizontal overflow
  - keep tab lists on one line and let them scroll horizontally when the set exceeds the available width
- Breadcrumb contract:
  - breadcrumb is primarily a shell/page-layout support primitive, not a general feature-surface primitive
  - the expected real use case is the shared app-shell route path
  - keep `Breadcrumb` in the component system because the shell uses it
  - do not treat breadcrumb as a broadly reusable docs primitive unless a real second product use case appears
- Accordion contract:
  - accordion is a secondary-disclosure primitive for stacked content inside the current page flow
  - use it for:
    - compact operational guidance
    - metadata breakdowns
    - advanced settings groups
    - FAQ/reference-style supporting content
  - do not use it for:
    - primary navigation
    - main page switching
    - replacing tabs
    - replacing drawers or dialogs
  - keep one visual pattern only; do not add casual presentation variants without a real product need
  - `type="single"` is the default mindset when sections should compete for attention
  - `type="multiple"` is for review/compare cases where several supporting groups may need to remain open together
  - `AccordionTrigger` owns the chevron and disclosure behavior; consumers should not rebuild that trigger-row pattern manually
- Dropdown menu contract:
  - dropdown menus now use one constrained pattern: compact row-action menus
  - every menu item must include an icon
  - the first option is the primary row action and should use the brand-accented item pattern
  - regular supporting options stay neutral
  - if the menu includes meaningful actions at the end, use the dedicated semantic components:
    - `DropdownMenuSuccessItem`
    - `DropdownMenuWarningItem`
    - `DropdownMenuDangerItem`
  - those semantic final-group items are optional, but if present they must appear in this order:
    - success / save
    - warning / archive
    - danger / delete
  - meaningful final-group actions should trigger an `AlertDialog` confirmation before execution
  - dropdown item structure is owned by the primitive itself; consumers should pass:
    - `icon`
    - `label`
    - optional `current`
    - optional semantic item component choice
      and should not manually compose icon-plus-label children markup
- Alert dialog contract:
  - alert dialog now follows one fixed confirmation pattern
  - it should always have:
    - a required title
    - an optional supporting description
    - a footer with exactly two buttons
  - it should not use a free-form content/body section for arbitrary layout
  - the footer owns the button pattern; consumers should not manually compose cancel/confirm buttons inside it
  - footer actions are always:
    - neutral secondary cancel button
    - primary confirm button
  - the separator above the footer is always present
  - supported variants are:
    - `default`
    - `success`
    - `warning`
    - `danger`
  - variant behavior:
    - `default`: brand primary confirm button, no overhead by default
    - `success`: success confirm button, positive-action overhead by default
    - `warning`: warning confirm button, cautionary-action overhead by default
    - `danger`: danger confirm button, destructive-action overhead by default
  - confirm intent in the alert dialog first, then decide whether the action executes immediately or enters a deferred destructive flow
- Dialog contract:
  - dialog now follows one fixed content pattern and should be visually distinct from alert dialog
  - it supports:
    - optional overhead
    - required title
    - required content/body
  - it does not support:
    - subtitle/description below the title
    - footer actions
  - the header always includes:
    - title block
    - top-right close button
    - separator below the header
  - the content area always uses the shared `ScrollArea` for vertical overflow
  - use dialog for focused supporting content, notes, and short read/review surfaces
  - use alert dialog instead when the user is confirming intent for an action
- Drawer contract:
  - drawer is the workflow overlay for:
    - heavy filtering
    - creation flows
    - denser subordinate work that should remain attached to the current page
  - drawers in this app are right-side panels; do not vary the side by feature
  - the header supports:
    - optional overhead
    - required title
    - short supporting description
    - top-right close button
  - the separator below the header is always present
  - the body is required and vertically scrollable through the shared `ScrollArea`
  - tabs and accordion are appropriate inside drawers when the workflow is genuinely dense:
    - use tabs for peer workflow sections
    - use accordion for secondary disclosure inside the panel
  - create, duplicate, and update flows may reuse the same drawer when the workflow surface is the same and only the initial data changes
  - duplicate mode should prefill from the source entity but remain an explicit create flow rather than an opaque backend clone when the contract still requires user-owned input
  - the footer is always present and task-oriented:
    - clear action on the left
    - primary action on the right
  - do not place a close action in the drawer footer; dismissal belongs in the header
  - the clear action should confirm through `AlertDialog`
  - primary drawer action semantics:
    - `Apply filters` uses `info`
    - `Create` uses `success`
  - primary drawer actions execute directly; only destructive reset/clear requires confirmation
- Tooltip contract:
  - tooltips are short contextual hints for compact controls and inline UI
  - they reinforce an existing trigger and should not carry essential meaning by themselves
  - for icon buttons, prefer the button primitive's built-in tooltip resolution through `tooltipContent`, `title`, or accessible label
  - if the content becomes instructional or multi-step, move to helper text, popover, dialog, or another richer pattern
- Popover contract:
  - use popover for compact anchored content that belongs to the current surface
  - good fits are quick filters, tiny local choices, account/support panels, and short metadata blocks
  - keep each popover single-purpose and compact; it should not grow into a full workflow
  - popover does not have a footer pattern and should not behave like a mini dialog
  - if the content becomes a short action list, prefer dropdown menu
  - if the content becomes heavy filtering, create/edit work, or dense review, escalate to drawer
  - if the content becomes focused reading or supporting information that deserves its own interruption, escalate to dialog
- Toast contract:
  - use the local toast primitive for transient feedback only
  - neutral toast is the default for routine confirmations
  - semantic toasts (`info`, `success`, `warning`, `danger`) are for states that need stronger meaning or urgency
  - the title carries the main message; description adds one useful extra line of context only when needed
  - use `toast.promise` for async lifecycle feedback instead of stacking separate loading and success calls
  - use `toast.undo` for deferred destructive actions when the product intentionally allows a short cancellation window before the mutation executes
  - do not use toast as a substitute for inline validation, dialog, or alert dialog

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
- Docs static config is now centralized in:
  - `constants/docs.ts`
- Docs types live in:
  - `types/client/docs.ts`
- Docs feature surfaces live in:
  - `features/docs`
- The docs home page at `/docs` is a real entry page and should stay focused on the two live docs jobs:
  - primitive contracts
  - routing boundary contracts
- The docs home composition currently uses:
  - left main content with explanatory sections
  - right sticky rail with safe routing previews
- Do not turn the docs home back into a loose index of stale areas or exploratory examples.

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
- There are safe preview routes for those boundaries under `/docs/routing/*`.
- Boundary screen helper functions are centralized in:
  - `features/docs/routing/utils.ts`

## Page architecture rules

- The default page grammar is section-based page composition.
- Use `Section` for page-level grouping and `Card` for bounded inner units.
- Keep docs overview pages calm and explanatory. Push dense examples down into the primitive and routing pages that actually own them.
- Do not use page-level `Card` wrappers where `Section` should own the page structure.

### Overlay rules

- Overlays support pages. They do not replace page architecture.
- Use:
  - `Popover` for quick filters, tiny decisions, and compact supporting panels
  - `AlertDialog` for confirmations and meaningful destructive or cautionary actions
  - `Dialog` for focused supporting information and short read/review surfaces
  - `Drawer` for subordinate create/edit/review flows tied to the current page

### Service page pattern

- Small service pages should reuse the shared service-page grammar under:
  - `features/shared/service-pages`
- The current pattern is:
  - `PageShell` with a two-row layout
  - `ServicePageShell` as the page-level wrapper for that layout
  - `ServicePageHeader` for:
    - title
    - description
    - metadata popover
    - optional page-level filter actions
    - optional page-level primary create action
    - filter content area
  - `ServicePageHeaderActions` for the common:
    - clear filters
    - primary create action
      header action pair
  - `ServicePageTableSection` for the main table surface
  - `ServicePageFiltersDrawer` for secondary filter groups that do not belong in the always-visible header row
  - `ServicePageConfirmDialog` for reusable destructive/state-change confirmation shells
  - `ServicePageLinkedAccountBlock` and `ServicePageLinkedUserBlock` for detail dialogs that need linked identity data
- Current reusable service-page filters are:
  - `TextFieldFilter`
  - `NumberFieldFilter`
  - `AuditInfoFilterFields`
  - `AuditInfoFilter`
- `AuditInfoFilter` is the shared pattern when an entity exposes `auditInfo` date fields and the page needs a compact date-range refinement flow.
- `AuditInfoFilterFields` is the shared field group when the same audit-date refinement needs to live directly inside a heavier surface such as a drawer.
- When a service page accumulates several secondary filters, keep the primary lookup field visible in the header and move the heavier secondary filters into a filter drawer instead of flattening every control into one row.
- Keep page-specific filtering logic, empty-state copy, query hooks, and table columns inside the owning feature. The shared components only own layout and control composition.
- Keep service-page entry files as orchestration layers.
  - page file owns query selection, filter state, and high-level wiring
  - detail dialogs, filter drawers, row action menus, editor forms, and action hooks should live beside the page in the same feature folder
- Prefer the shared service-page hooks before open-coding repeated page state:
  - `useServicePageDetailState` for selected detail ids and dialog open/close wiring
  - `useServicePageEditorState` for create/update/duplicate drawer state and deferred row-action opening
  - `useDraftFilters` for draft vs applied secondary filter state
  - `useQueryErrorToasts` when a page or drawer needs multiple query-error toasts
- A service page may start read-only and later evolve into a lightweight directory workflow:
  - keep the shared header and table grammar
  - add the primary create action to the header
  - keep row-level mutations in the table action column
  - use drawer for create, duplicate, and update
  - use alert dialog for confirmable state changes such as deactivate/reactivate and delete
- Destructive service-page flows may be two-stage:
  - confirm in `AlertDialog`
  - show an undo toast
  - only execute the delete mutation after the undo window expires

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
- Shared mocked backend routes and mock data now belong in `pug-mocks`, not under `pug-web-admin`.
- The shell and docs areas already use shared `ScrollArea` and overlay primitives; keep that consistency.
- The docs area now has only two live branches:
  - `primitives`
  - `routing`
- Do not reintroduce generic page-pattern docs unless they are rebuilt from real current product archetypes.

## What to check before finishing work

- Use `npm run format` as the default validation command when checking work. It already runs formatting, lint fix, typecheck, and translation validation.
- If there is a specific reason to run something narrower, prefer that as a follow-up rather than replacing the default validation step silently.
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
- React contexts are runtime objects and stay in `contexts/`; they are not "raw constants".
- Component declarations exported as `const` through `forwardRef` are still components, not misplaced constants.
- Do not move logic out of a `.tsx` file just to satisfy formality when it is tightly coupled to local state and would become harder to read.

If there is any conflict between an existing file and this document, prefer the repo's currently working shared patterns, then update this context file when the architectural rule has clearly changed.
