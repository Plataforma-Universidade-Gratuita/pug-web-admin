# Refactoring Internal Coherence Tracker

## Status

- [x] Step 1: Inspect the target folders
- [x] Step 2: Protect frozen API type and schema folders
- [x] Step 3: Normalize exports
- [x] Step 4: Normalize imports
- [x] Step 5: Move utilities and constants
- [x] Step 6: Move types, interfaces, and schemas
- [x] Step 7: Refactor TSX files
- [ ] Step 8: Remove `features/shared`
- [ ] Step 9: Promote cross-feature components
- [ ] Step 10: Extract repeated React patterns
- [ ] Step 11: Validate naming
- [ ] Step 12: Run validation
- [ ] Step 13: Fix regressions

## Frozen Folders

- [x] Keep `types/api/**` untouched
- [x] Keep `schemas/api/**` untouched
- [x] Keep the frozen-folder rule active for every subsequent step

## Step 1 Inspection Findings

These are inventory findings captured during inspection. They are not all expected
to be complete before Step 4. Each subsection below feeds a later numbered step.

### Root-Level Observations

- [x] `stores/` root folder exists and must be included in the coherence pass
- [x] `i18n/` root folder exists but is missing `i18n/index.ts`
- [x] `types/client/features/docs/` still exists as an empty leftover folder and must be removed

### Missing `index.ts` Files

These folders already exist and are missing required barrels:

- [x] Add `api/academic/index.ts`
- [x] Add `api/geo/index.ts`
- [x] Add `api/identity/index.ts`
- [x] Add `api/partner/index.ts`
- [x] Add `api/project/index.ts`
- [x] Add `i18n/index.ts`

### Remaining Relative Imports

These files still use relative imports and must be either:

1. replaced with the highest available `@/` barrel import, or
2. kept as relative imports with the required block comment explaining why.

#### Replace or justify

- [x] `api/web/identity/admins/mutations.ts`
  - `./endpoints`
  - `./keys`
- [x] `auth/session.ts`
  - `./utils`
- [x] `features/academic/courses/CourseEditorDrawer.tsx`
  - `./CourseEditorForm`
- [x] `features/geo/cities/CitiesFilters.tsx`
  - `./CitiesFiltersDrawer`
- [x] `features/geo/cities/CitiesPage.tsx`
  - `./CitiesFilters`
  - `./CitiesRowActions`
- [x] `features/geo/cities/city/CityPage.tsx`
  - `../utils`
- [x] `features/identity/admins/AdminsFilters.tsx`
  - `./AdminsFiltersDrawer`
- [x] `features/identity/users/UsersFilters.tsx`
  - `./UsersFiltersDrawer`

### Highest-Barrel Import Hotspots

These files still import deep API paths and should be normalized to the highest barrel path, which is now `@/api`, followed by local destructuring on the next line.

#### Highest-priority feature files still importing `@/api/web/**`

- [x] `features/academic/former-students/FormerStudentsPage.tsx`
- [x] `features/home/HomeCommandCenterPage.tsx`
- [x] `features/project/enrollments/EnrollmentsPage.tsx`
- [x] `features/project/enrollments/EnrollmentEditorDrawer.tsx`
- [x] `features/partner/staff/StaffPage.tsx`
- [x] `features/project/attendances/AttendanceEditorDrawer.tsx`
- [x] `features/project/attendances/AttendancesPage.tsx`
- [x] `features/identity/admins/AdminsPage.tsx`
- [x] `features/project/enrollments/enrollment/EnrollmentPage.tsx`
- [x] `features/academic/former-students/FormerStudentEditorDrawer.tsx`
- [x] `features/project/projects/ProjectsEditorDrawer.tsx`
- [x] `features/academic/former-students/former-student/FormerStudentPage.tsx`
- [x] `features/academic/courses/CourseEditorDrawer.tsx`
- [x] `features/partner/staff/StaffEditorDrawer.tsx`
- [x] `features/academic/courses/CoursesPage.tsx`
- [x] `features/project/projects/ProjectsPage.tsx`
- [x] `features/identity/admins/AdminsUpdateDrawer.tsx`
- [x] `features/project/attendances/attendance/AttendancePage.tsx`
- [x] `features/app-shell/Sidebar/AccountMenu/index.tsx`
- [x] `features/partner/entities/EntitiesPage.tsx`

#### Non-feature files to normalize after barrels are in place

- [x] `app/layout.tsx`
- [x] `app/providers.tsx`
- [x] `contexts/locale.tsx`
- [x] `contexts/theme.tsx`
- [x] `components/primitives/overlays/popover/Popover.tsx`

### `features/shared` Still Exists

Deferred target: Step 8.

This folder still exists and violates the target rule.

#### Existing files under `features/shared`

- [ ] `features/shared/entity-pages/EntityPageShell.tsx`
- [ ] `features/shared/module-pages/ModulePageComingSoon.tsx`
- [ ] `features/shared/module-pages/ModulePageShell.tsx`
- [ ] `features/shared/service-pages/ServicePageEditorDrawer.tsx`
- [ ] `features/shared/service-pages/ServicePageFiltersDrawer.tsx`
- [ ] `features/shared/service-pages/ServicePageHeader.tsx`
- [ ] `features/shared/service-pages/ServicePageHeaderActions.tsx`
- [ ] `features/shared/service-pages/ServicePagePagination.tsx`
- [ ] `features/shared/service-pages/ServicePageShell.tsx`
- [ ] `features/shared/service-pages/ServicePageTableSection.tsx`

### TSX Files Over 500 Lines

Deferred target: Step 7.

These files must be split.

- [x] `features/home/HomeCommandCenterPage.tsx` - reduced to 491 lines
- [x] `components/primitives/display/table/Table.tsx` - reduced to 246 lines
- [x] `features/academic/former-students/utils.tsx` - reduced to 7 lines via barrel split
- [x] `features/project/attendances/utils.tsx` - reduced to 6 lines via barrel split
- [x] `features/project/enrollments/utils.tsx` - reduced to 6 lines via barrel split
- [x] `features/project/attendances/AttendancesPage.tsx` - reduced to 188 lines
- [x] `features/project/projects/ProjectsPage.tsx` - reduced to 178 lines
- [x] `features/project/enrollments/EnrollmentsPage.tsx` - reduced to 171 lines
- [x] `features/project/projects/utils.tsx` - reduced to 6 lines via barrel split
- [x] `features/academic/former-students/FormerStudentsPage.tsx` - reduced to 477 lines

### Inline Interfaces Still Declared Inside TSX Files

Deferred target: Step 6.

These must move to `types/client/**`:

- [x] `features/academic/areas-of-expertise/area-of-expertise/AreaOfExpertiseDetailsContent.tsx`
- [x] `features/academic/courses/course/CourseOwnDetailsContent.tsx`
- [x] `features/academic/former-students/former-student/FormerStudentOwnDetailsContent.tsx`
- [x] `features/home/HomeCommandCenterPage.tsx`
  - `HomePriorityItem`
  - `HomePulseMetric`
  - `HomeRecentItem`
  - `HomeUpcomingItem`
- [x] `features/partner/entities/entity/EntityDetailsContent.tsx`
- [x] `features/project/attendances/AttendanceQrCodeDialog.tsx`
- [x] `features/project/projects/project/ProjectOwnDetailsContent.tsx`

### Constants Still Declared Inside TSX or `utils.tsx` Files

Deferred target: Step 5.

These need to move to the lowest valid `constants.ts`:

- [x] `features/identity/accounts/utils.tsx`
  - `TABLE_IDENTIFIER_TEXT_WIDTH`
- [x] `features/identity/admins/AdminsPage.tsx`
  - `ADMIN_ALL_PAGE_SIZE`
- [x] `features/identity/admins/utils.tsx`
  - `TABLE_IDENTIFIER_TEXT_WIDTH`
- [x] `features/partner/entities/utils.tsx`
  - `TABLE_IDENTIFIER_TEXT_WIDTH`
  - `TABLE_ADDRESS_TEXT_WIDTH`
- [x] `features/partner/staff/utils.tsx`
  - `TABLE_IDENTIFIER_TEXT_WIDTH`
- [x] `features/project/attendances/utils.tsx`
  - `TABLE_IDENTIFIER_TEXT_WIDTH`
- [x] `features/project/enrollments/utils.tsx`
  - `TABLE_IDENTIFIER_TEXT_WIDTH`
- [x] `features/project/projects/utils.tsx`
  - `TABLE_IDENTIFIER_TEXT_WIDTH`
  - `TABLE_DESCRIPTION_TEXT_WIDTH`

### Schemas Still Declared Inside TSX Files

- [x] No `z.object(...)` schema declarations were found inside `app/**/*.tsx`, `components/**/*.tsx`, or `features/**/*.tsx` during the initial scan

## Exact Task Breakdown By Next Step

### Step 2: Protect Frozen API Type and Schema Folders

- [x] Add a note to the refactor batch that `types/api/**` must not be edited
- [x] Add a note to the refactor batch that `schemas/api/**` must not be edited
- [x] Avoid moving imports inside frozen folders unless the build breaks and a block comment is added

### Step 3: Normalize Exports

- [x] Add `api/academic/index.ts`
- [x] Add `api/geo/index.ts`
- [x] Add `api/identity/index.ts`
- [x] Add `api/partner/index.ts`
- [x] Add `api/project/index.ts`
- [x] Add `i18n/index.ts`
- [x] Remove empty `types/client/features/docs/`
- [x] Audit `components/**/index.ts` files for duplicate or redundant re-exports
- [x] Audit `types/client/components/index.ts` for duplicate barrel exports

### Step 4: Normalize Imports

- [x] Replace remaining deep `@/api/web/**` imports in feature files with `@/api`
- [x] Replace remaining direct `@/auth/*` imports with `@/auth` where the barrel is sufficient
- [x] Replace remaining direct `@/i18n/*` imports with `@/i18n` after `i18n/index.ts` is added
- [x] Replace remaining direct `@/contexts/*` imports with `@/contexts` where the barrel is sufficient
- [x] Review every remaining relative import listed above
- [x] Add required `/* */` explanation comments above any relative import that must remain

### Step 5: Move Utilities and Constants

#### Root-level utility cleanup

- [x] Audit `contexts/utils.ts`
  - split text normalization helpers from theme helpers if they do not share the same lowest valid scope
  - move cross-root shared helpers back to root `utils/` if required by the scope rule
- [x] Audit `utils/index.ts`
  - remove compatibility re-exports that no longer belong at root after import normalization is complete
- [x] Audit `api/utils.ts` and `api/web/utils.ts`
  - keep only transport-layer helpers there
- [x] Audit `app/api/utils.ts`
  - keep only route-handler helpers there

#### Move constants out of TSX and `utils.tsx`

- [x] Create or update the correct `constants.ts` files for the constant list above
- [x] Update imports after moving each constant

### Step 6: Move Types, Interfaces, and Schemas

- [x] Move `AreaOfExpertiseDetailsContent` props/interface to `types/client/features/academic/areas-of-expertise.ts`
- [x] Move `CourseOwnDetailsContent` props/interface to `types/client/features/academic/courses.ts`
- [x] Move `FormerStudentOwnDetailsContent` props/interface to `types/client/features/academic/former-students.ts`
- [x] Move `HomeCommandCenterPage` local interfaces to `types/client/features/home.ts`
- [x] Move `EntityDetailsContent` props/interface to `types/client/features/partner/entities.ts`
- [x] Move `AttendanceQrCodeDialog` props/interface to `types/client/features/project/attendances.ts`
- [x] Move `ProjectOwnDetailsContent` props/interface to `types/client/features/project/projects.ts`
- [x] Re-run the TSX schema scan after the moves to confirm no new local schemas were introduced

### Step 7: Refactor TSX Files

#### Split oversized page files

- [x] Split `features/home/HomeCommandCenterPage.tsx`
  - created `features/home/components/`
  - extracted dashboard panels and metric cards
  - moved local formatting and derived-data helpers into `features/home/utils.ts`
- [x] Split `features/project/attendances/AttendancesPage.tsx`
  - extracted dialogs and filters into `components/AttendancesPageControls.tsx`
  - moved page/query state into `useAttendancesPage.tsx`
- [x] Split `features/project/enrollments/EnrollmentsPage.tsx`
  - extracted dialogs and filters into `components/EnrollmentsPageControls.tsx`
  - moved page/query state into `useEnrollmentsPage.tsx`
- [x] Split `features/project/projects/ProjectsPage.tsx`
  - extracted dialogs and filters into `components/ProjectsPageControls.tsx`
  - moved page/query state into `useProjectsPage.tsx`
- [x] Split `features/academic/former-students/FormerStudentsPage.tsx`
  - extracted dialog blocks and header/filter sections into local components
  - page now sits below the 500-line cap

#### Split oversized component files

- [x] Split `components/primitives/display/table/Table.tsx`
  - extracted row-actions menu
  - extracted scrollbars into `useTableScrollbars.ts`
  - kept sort icon and body rendering in dedicated local files
- [x] Split `features/academic/former-students/utils.tsx`
  - separated table columns, filter helpers, duplicate helpers, and formatter helpers
- [x] Split `features/project/attendances/utils.tsx`
  - separated table columns, filter helpers, form helpers, and toast helpers
- [x] Split `features/project/enrollments/utils.tsx`
  - separated table columns, filter helpers, form helpers, and toast helpers
- [x] Split `features/project/projects/utils.tsx`
  - separated columns, backend filter mapping, local filter helpers, and formatters

### Step 8: Remove `features/shared`

- [ ] Move `features/shared/entity-pages/*` to `components/composite/features/entity-pages/*`
- [ ] Move `features/shared/module-pages/*` to `components/composite/features/module-pages/*`
- [ ] Move `features/shared/service-pages/*` to `components/composite/features/service-pages/*`
- [ ] Update all imports to consume these through `@/components`
- [ ] Delete `features/shared/**` once empty

### Step 9: Promote Cross-Feature Components

- [ ] After moving `features/shared/**`, verify whether any remaining feature-local component is imported by more than one feature path
- [ ] Promote any such component into `components/composite/features/**`
- [ ] Ensure promoted components are exported from the highest valid component barrel

### Step 10: Extract Repeated React Patterns

#### Evaluate after structural cleanup

- [ ] Review page-controller patterns shared by:
  - `features/project/projects/ProjectsPage.tsx`
  - `features/project/attendances/AttendancesPage.tsx`
  - `features/project/enrollments/EnrollmentsPage.tsx`
  - `features/academic/former-students/FormerStudentsPage.tsx`
  - `features/partner/staff/StaffPage.tsx`
- [ ] Review repeated drawer hydration/form wiring across editor drawers
- [ ] Review repeated dialog orchestration across service pages
- [ ] Extract only if the pattern is used by three or more components and the abstraction reduces complexity

### Step 11: Validate Naming

- [ ] Ensure every moved utility file is named `utils.ts` or `utils.tsx` only when JSX is required
- [ ] Ensure every moved constants file is named `constants.ts`
- [ ] Ensure every moved component filename matches the exported component name
- [ ] Ensure every newly created local feature split component uses short names inside local `components/`

### Step 12: Run Validation

- [ ] Inspect `package.json` again before choosing the final command set
- [ ] Run `npm run lint` if available
- [ ] Run `npm run typecheck` if available
- [ ] Run `npm run test` if available
- [ ] Run `npm run build` if available

### Step 13: Fix Regressions

- [ ] Fix TypeScript regressions first
- [ ] Fix broken imports second
- [ ] Fix circular dependencies third
- [ ] Fix lint regressions fourth
- [ ] Fix test/build regressions after that

## Notes For Execution

- `features/` remains a special case: do not start adding barrels throughout feature subfolders just to remove relative imports.
- If a feature-local relative import must stay private, keep it relative and add the required block comment.
- The first high-risk move is the removal of `features/shared`; do not combine that with large `.tsx` splits in the same patch unless typecheck stays clean after each sub-batch.
