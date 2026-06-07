# Consolidated Refactoring Internal Coherence Tracker

This tracker replaces the previous internal-coherence plan.

It is derived from:

- [consolidated-refactoring-internal-coherence-instructions.md](./consolidated-refactoring-internal-coherence-instructions.md)

It is the execution source for the next refactor pass.

## Scope Normalization

The consolidated instructions contain repository-name drift. This tracker uses the actual repository structure.

- `componentes/` in the instructions means `components/` in this repository.
- `store/` in the instructions means `stores/` in this repository.
- `constants/` is treated as a root-level barrel export folder in this repository.

## Validation Gate

Every step in this tracker closes only when:

- `npm run format` has been executed;
- `prettier`, `eslint --fix`, and `tsc --noEmit` pass;
- the only remaining failure is missing `pt-BR` translations;
- `Traducoes faltantes em EN: []`.

## Frozen Folders

Do not edit unless a build failure makes it unavoidable and the exception is documented with a block comment:

- `types/api/**`
- `schemas/api/**`

## Rule Resolution for This Repository

The consolidated instructions contain one important internal conflict around `features/`.

The document says both:

- `features/` should behave like a first-nested public barrel root; and
- `features/` is a special exception with a single root `features/index.ts` that exports only route-facing `.tsx` files consumed directly by `app/`.

For this repository, use the explicit `features/` exception:

- `features/index.ts` is the only root-level public features barrel;
- it exports only route-facing `.tsx` files consumed directly by `app/`;
- do not create broad `features/<direct-child>/index.ts` files just to satisfy the general nested-barrel rule;
- if non-`app` code needs something across feature boundaries, that thing likely belongs in `components/composite/`, not in another feature.

The consolidated instructions also place `constants/` in the first-nested public-barrel group.

Do not follow that part for this repository.

For this repository:

- `constants/index.ts` is the public constants barrel;
- consumers should import shared constants from `@/constants`;
- root `constants/*.ts` files are implementation slices that export upward into `constants/index.ts`;
- only move a constant out of the root constants barrel when its usage is not root-shared and a lower local scope is more accurate.

## Step 1: Inspection

- [x] Read the consolidated instructions fully.
- [x] Confirm actual root folders in the repository:
  - `api/`
  - `app/`
  - `auth/`
  - `components/`
  - `constants/`
  - `contexts/`
  - `features/`
  - `hooks/`
  - `i18n/`
  - `schemas/`
  - `stores/`
  - `types/`
  - `utils/`
- [x] Confirm package scripts and the step validation gate from `package.json`.
- [x] Confirm current first-level barrel surfaces:
  - `api/{services,web}`
  - `components/{composite,primitives}`
  - `types/{api,client}`
  - `schemas/{api,client}`
- [x] Confirm `constants/` currently behaves as a root barrel with file-based slices beneath it.
- [x] Confirm `features/` currently has no root `index.ts`.
- [x] Confirm `features/` currently has no first-level `index.ts` files.
- [x] Confirm there is no `features/shared/` folder.
- [x] Confirm the consolidated-rule import violations are still present in live code.

## Inspection Findings

### A. Root Import Boundary Violations

The new rules do not allow the current root-level imports below.

- [x] Replace root `@/api` imports with `@/api/services` or `@/api/web`.
  - Current hotspot patterns:
    - `app/api/v1/**/route.ts`
    - feature files still importing `web` from `@/api`
- [x] Replace root `@/components` imports with `@/components/primitives` or `@/components/composite`.
  - Current hotspot patterns:
    - feature pages and drawers
    - hooks using `toast`
    - `app/(auth)/login/page.tsx`
    - `api/web/mutation-toast.ts`
- [x] Replace root `@/types` imports with `@/types/client` or the nearest valid client barrel.
  - Current hotspot patterns:
    - almost every route page under `app/(app)/**`
    - `api/services/**`
    - `api/web/**`
    - `features/**`
    - `hooks/**`
    - `stores/**`
    - `utils/**`
    - `i18n/locale.ts`
- [x] Replace root `@/schemas` imports with `@/schemas/client` or `@/schemas/api`, except frozen files.
  - Current hotspot patterns:
    - `api/services/**`
    - `api/web/**`
    - `schemas/client/**`
  - Excluded from edits unless required:
    - `schemas/api/**`
- [x] Replace root `@/features/...deep path` app imports with the final `features/index.ts` public route-facing exports.
  - Current app imports are deep and route-specific, for example:
    - `app/(app)/academic/**/page.tsx`
    - `app/(app)/geo/**/page.tsx`
    - `app/(app)/identity/**/page.tsx`
    - `app/(app)/partner/**/page.tsx`
    - `app/(app)/project/**/page.tsx`
    - `app/(app)/layout.tsx`
    - `app/(app)/page.tsx`
    - `app/(auth)/login/page.tsx`

### B. Export Surface Gaps

- [x] Create `features/index.ts`.
  - It must export only route-facing `.tsx` files consumed directly by `app/`.
- [x] Audit `api/index.ts`.
  - Keep only exports that support the allowed first-level public API boundary.
  - Consumers should end up importing from `@/api/services` or `@/api/web`, not `@/api`.
- [x] Audit `components/index.ts`.
  - Keep only what is required internally or for safe transition.
  - Consumers should end up importing from `@/components/primitives` or `@/components/composite`.
- [x] Audit `constants/index.ts`.
  - It is a real public root barrel in this repository.
  - Final callers should import shared constants from `@/constants`.
  - Remove only dead or redundant exports.
- [x] Audit `types/index.ts`.
  - Final callers should import from `@/types/client` or `@/types/api`.
- [x] Audit `schemas/index.ts`.
  - Final callers should import from `@/schemas/client` or `@/schemas/api`.

### C. Utility and Constant Scope Re-Audit

The previous pass improved placement, but the consolidated rules are stricter: root `utils/` and `constants/` must contain only content shared across two or more root folders.

- [ ] Audit `utils/index.ts` and root `utils/*.ts`.
- [ ] Audit `constants/*.ts`.
- [ ] Move anything that is now used by only one root folder back down to the lowest valid `utils.ts` or `constants.ts`.
- [ ] Re-check prior moved infrastructure files after the new import cleanup:
  - `api/utils.ts`
  - `api/web/utils.ts`
  - `app/api/utils.ts`
  - `contexts/utils.ts`
  - `components/primitives/overlays/utils.ts`
  - `auth/**`
  - `i18n/locale.ts`

### D. Repeated Logic Re-Audit

The consolidated rules explicitly require a 3+ component reuse threshold for hooks, contexts, and stores.

- [ ] Re-audit extracted hooks under `hooks/`.
- [ ] Re-audit extracted context utilities under `contexts/`.
- [ ] Re-audit extracted stores under `stores/`.
- [ ] Collapse abstractions that do not clear the 3+ reuse threshold unless they still earn their keep through clear separation of responsibilities.
- [ ] Extract only the duplicated React logic that still appears in 3+ places after the import/boundary cleanup.

## Step 2: Protect Frozen Folders

- [x] Leave `types/api/**` untouched.
- [x] Leave `schemas/api/**` untouched.
- [x] Do not rewrite imports inside those folders unless a build failure forces it.
- [x] If a forced exception is required, add the required block comment above the import.

### Frozen-Scope Decision Record

- `types/api/**` and `schemas/api/**` are excluded from the root-barrel cleanup in this pass.
- Existing imports inside those folders that do not match the new public-boundary rules are tolerated because the folders are frozen.
- The existing lint warning in `types/api/shared/shared.ts` remains accepted for the same reason.
- No forced exception comment was needed in this step because no edit inside the frozen scope was required to keep the repo building.

## Step 3: Normalize Exports

### Root-Barrel Folders

- [x] Verify `auth/index.ts`.
- [x] Verify `constants/index.ts`.
- [x] Verify `contexts/index.ts`.
- [x] Verify `hooks/index.ts`.
- [x] Verify `i18n/index.ts`.
- [x] Verify `stores/index.ts`.
- [x] Verify `utils/index.ts`.

### First-Level Public Barrels

- [x] Verify `api/services/index.ts`.
- [x] Verify `api/web/index.ts`.
- [x] Verify `components/primitives/index.ts`.
- [x] Verify `components/composite/index.ts`.
- [x] Verify `types/client/index.ts`.
- [x] Verify `schemas/client/index.ts`.

### Features Exception

- [x] Create `features/index.ts`.
- [x] Export only route-facing `.tsx` files consumed directly by `app/`.
- [x] Export all current route-facing feature entries:
  - `Navbar`
  - `HomeCommandCenterPage`
  - `LoginForm`
  - `LoginHero`
  - `AcademicOverviewPage`
  - `AreasOfExpertisePage`
  - `AreaOfExpertisePage`
  - `CoursesPage`
  - `CoursePage`
  - `FormerStudentsPage`
  - `FormerStudentPage`
  - `GeoOverviewPage`
  - `CitiesPage`
  - `CityPage`
  - `IdentityOverviewPage`
  - `AccountsPage`
  - `AccountPage`
  - `AdminsPage`
  - `AdminPage`
  - `UsersPage`
  - `UserPage`
  - `PartnerOverviewPage`
  - `EntitiesPage`
  - `EntityPage`
  - `StaffDirectoryPage`
  - `StaffPage`
  - `ProjectOverviewPage`
  - `ProjectsPage`
  - `ProjectPage`
  - `AttendancesPage`
  - `AttendancePage`
  - `EnrollmentsPage`
  - `EnrollmentPage`
- [x] Do not create broad `features/<direct-child>/index.ts` files unless a specific local need justifies them.

### Step 3 Notes

- `api/index.ts`, `components/index.ts`, `types/index.ts`, and `schemas/index.ts` were restored as temporary compatibility barrels for the next import-normalization step.
- They are intentionally not the target public boundaries under the consolidated rules.
- `features/index.ts` uses `StaffDirectoryPage` for the staff list route because the repository already has two different route-facing files that export `StaffPage`.

## Step 4: Normalize Imports

### App Routes and Layouts

- [x] Update all `app/(app)/**/page.tsx` and `app/(auth)/**/page.tsx` imports to the final public feature boundary.
- [x] Update all route prop type imports in `app/**` from `@/types` to `@/types/client`.
- [x] Update `app/api/v1/**/route.ts` imports from `@/api` to `@/api/services`.

### API Layers

- [x] Update `api/services/**` imports:
  - `@/constants` -> keep or normalize to the root constants barrel
  - `@/schemas` -> `@/schemas/api` or `@/schemas/client`
  - `@/types` -> `@/types/api` or `@/types/client`
- [x] Update `api/web/**` imports:
  - `@/components` -> `@/components/primitives` or `@/components/composite`
  - `@/constants` -> keep or normalize to the root constants barrel
  - `@/schemas` -> `@/schemas/api` or `@/schemas/client`
  - `@/types` -> `@/types/client`
  - `@/api` -> `@/api/web` or `@/api/services` only where allowed
- [x] Preserve local intra-service imports when a higher barrel would create a cycle.
- [x] Add block comments above any relative imports that must remain.

### Components, Hooks, Contexts, Stores, i18n, Utils

- [x] Update all `components/**` imports away from root `@/components`, `@/types`, and `@/schemas`.
- [x] Update all `hooks/**` imports away from root `@/components` and `@/types`.
- [x] Update all `contexts/**` imports away from root `@/types`.
- [x] Update all `stores/**` imports away from root `@/types`.
- [x] Update `i18n/locale.ts` imports away from root `@/types`.
- [x] Update `utils/**` imports away from root `@/types`.
- [x] Keep shared constant consumers on `@/constants` unless a constant is moved down to a lower scope.

### Features

- [x] Update all `features/**` imports away from root `@/components`.
- [x] Update all `features/**` imports away from root `@/types`.
- [x] Update all `features/**` imports away from root `@/schemas`.
- [x] Update all `features/**` imports away from root `@/api`.
- [x] Keep shared constant consumers on `@/constants` unless a constant is moved down to a lower scope.
- [x] If a feature needs something from another feature path, stop and evaluate whether that thing belongs in `components/composite/`.

### Step 4 Notes

- `app/**` now consumes route-facing pages only through `@/features`.
- `app/api/v1/**/route.ts` now imports service clients only through `@/api/services`.
- Root `@/components` imports were split into `@/components/primitives` and `@/components/composite`.
- Root `@/api` imports were split into `@/api/services` and `@/api/web`.
- Root `@/schemas` imports were split into `@/schemas/api` and `@/schemas/client`.
- Root `@/types` imports were not mapped blindly to `@/types/client`; they were split between `@/types/api` and `@/types/client` based on the actual symbol ownership.

## Step 5: Re-Audit Utilities and Constants

### Utilities

- [ ] Build a usage map for every root utility export.
- [ ] Move each utility to the lowest valid folder scope.
- [ ] Keep a utility in root `utils/` only if it is used across two or more root folders.
- [ ] Keep `utils.tsx` only where JSX is actually required.
- [ ] Remove dead compatibility re-exports from `utils/index.ts`.

### Constants

- [ ] Build a usage map for every symbol in `constants/*.ts`.
- [ ] Move each constant to the lowest valid folder scope.
- [ ] Keep a constant in root `constants/` when it is root-shared or intentionally part of the public constants barrel.
- [ ] Make `constants/index.ts` the canonical public entry for shared constants.
- [ ] Remove only dead or redundant re-exports from `constants/index.ts`.

## Step 6: Re-Audit Types and Schemas

- [ ] Re-scan `app/`, `auth/`, `components/`, `contexts/`, `features/`, `hooks/`, `i18n/`, `stores/`, and `utils/` for inline client types/interfaces.
- [ ] Move any remaining client types into `types/client/**`.
- [ ] Use `types/client/global.ts` only for client types shared across two or more root folders.
- [ ] Re-scan the same folders for client schemas.
- [ ] Move any remaining client schemas into `schemas/client/**`.
- [ ] Use `schemas/client/global.ts` only for schemas shared across two or more root folders.
- [ ] Keep `import type` usage correct after moves.

## Step 7: Re-Audit TSX Discipline

- [ ] Re-check every `.tsx` file under `components/**` and `features/**`.
- [ ] Ensure helpers stay in `utils.ts` or `utils.tsx`.
- [ ] Ensure constants stay in `constants.ts`.
- [ ] Ensure files remain under 500 lines.
- [ ] Split any file that grows again during this pass.
- [ ] Keep filenames aligned with exported component names.

## Step 8: Re-Audit Cross-Feature Ownership

- [ ] Confirm there is still no `features/shared/`.
- [ ] Re-audit feature-owned components that are imported outside their own feature path.
- [ ] Promote any remaining cross-feature reusable component to `components/composite/`.
- [ ] Keep feature-local composition private.

## Step 9: Re-Audit Repeated React Patterns

- [ ] Re-check repeated hooks used by 3+ components.
- [ ] Re-check repeated context patterns used by 3+ components.
- [ ] Re-check repeated store patterns used by 3+ components.
- [ ] Extract only where the 3+ threshold is actually met.
- [ ] Remove overly high abstractions that no longer meet that threshold and do not provide material separation value.

## Step 10: Final Validation and Exceptions

- [ ] Run `npm run format` after every completed step.
- [ ] If a rule exception is still required, add the required block comment directly above the relevant import or declaration.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Record any remaining non-locale warnings separately from blocker failures.

## Current Starting Point

At the time this tracker was created:

- root import boundary violations are still widespread;
- `features/index.ts` does not exist;
- `features/` has no nested index files either;
- `features/shared/` is already gone;
- the repo already has `components/`, not `componentes/`;
- the repo already has `stores/`, not `store/`;
- `npm run format` is expected to fail only on missing `pt-BR` translations once a step is clean.
