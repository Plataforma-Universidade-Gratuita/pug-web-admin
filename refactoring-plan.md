# Refactoring Plan

## Purpose

This file is the working checklist for the post-feature cleanup pass.

The product is functionally ready. The remaining work is structural:

- reduce duplication
- normalize naming and copy
- extract stable shared UI/composite pieces
- make service pages easier to maintain
- keep `npm run format` in the same good state:
  - `prettier --write`: pass
  - `npm run lint:fix`: pass with warnings only
  - `tsc --noEmit`: pass
  - `npm run trans`: fail only because of missing `pt-BR` translations

This plan is intentionally detailed because there are now many service-page implementations and enough repetition that ad hoc cleanup will drift.

---

## Ground Rules

- [ ] Do not change product behavior unless the refactor explicitly intends to.
- [ ] Prefer extracting **stable patterns** over creating generic abstractions for one or two call sites.
- [ ] Keep domain-specific business rules local:
  - project status transitions
  - enrollment status transitions
  - attendance validation actions
- [ ] Centralize only the parts that are actually generic:
  - row actions
  - common copy
  - repeated filter field blocks
  - repeated dialog patterns
  - repeated linked-detail blocks
  - common table columns
- [ ] After each batch, run `npm run format`.
- [ ] Do not spend effort on `pt-BR` translation completion during this refactor.

---

## Current Baseline

### Already completed

- [x] Product functionality migration to the current API/schema/types contracts.
- [x] Service pages exist for the target modules:
  - geo
  - identity
  - partner
  - academic
  - project
- [x] Home page implemented.
- [x] Docs pages removed.
- [x] App metadata/assets wired.
- [x] `app/styles/utilities` refactored away from the old flat structure.
- [x] CSS ownership split into per-component/per-feature files.
- [x] Initial `features/shared` reusable pieces moved into `components/composite`.
- [x] `components/composite` reorganized into:
  - `dialogs`
  - `filters`
  - `form-fields`
  - `grids`
  - `linked-blocks`
  - `popovers`
  - `selectors`
- [x] `theme-selector`, `language-selector`, and `floating-page-controls` moved to `components/composite`.
- [x] `npm run format` is back to the desired state:
  - code passes formatting/lint/typecheck
  - only missing `pt-BR` translations remain

### Current structural pain points

- [x] Generic row actions are repeated across many modules.
- [x] Generic action copy is repeated or borrowed from unrelated namespaces.
- [x] Filter drawers repeatedly rebuild the same labeled fields and async combobox blocks.
- [x] Activatable/delete flows are implemented multiple times with mostly the same shape.
- [ ] Account-backed duplicate flows repeat the same fetch/copy/toast logic.
- [x] Editor forms repeat the same account-summary and linked-detail sections.
- [x] Table column factories are local to modules even when the columns are semantically identical.
- [ ] Legacy academic naming still leaks through some code/copy (`school`, `student`) even after route-level migration.

---

## Modules in Scope

These are the primary service-page slices to use as the reference set:

- [x] `features/geo/cities`
- [x] `features/identity/users`
- [x] `features/identity/accounts`
- [x] `features/identity/admins`
- [x] `features/partner/entities`
- [x] `features/partner/staff`
- [x] `features/academic/areas-of-expertise`
- [x] `features/academic/courses`
- [x] `features/academic/former-students`
- [x] `features/project/projects`
- [x] `features/project/enrollments`
- [x] `features/project/attendances`

---

## Execution Order

The order matters. The safest sequence is:

- [x] Phase 1: common copy namespace and naming cleanup
- [x] Phase 2: row-action component abstraction
- [x] Phase 3: filter field composites
- [x] Phase 4: page action hooks/dialog abstraction
- [x] Phase 5: editor shared blocks
- [x] Phase 6: table column factories
- [ ] Phase 7: final naming sweep and cleanup
- [ ] Phase 8: final validation and leftovers review

Do **not** jump straight to column factories or page hooks before copy and action primitives are normalized. That creates churn twice.

---

## Phase 1 - Common Copy Namespace and Naming Cleanup

### Objective

Stop using module-specific copy for generic actions and stop borrowing unrelated namespaces such as identity/date/filter text for other modules.

### 1.1 Create a common action copy namespace

- [x] Add generic action keys under a neutral namespace, for example:
  - `common.table.actions.viewDetails`
  - `common.table.actions.update`
  - `common.table.actions.duplicate`
  - `common.table.actions.delete`
  - `common.table.actions.reactivate`
  - `common.table.actions.deactivate`
  - `common.table.actions.create`
  - `common.table.actions.clear`
- [x] Add generic form/filter labels under a neutral namespace, for example:
  - `common.filters.name`
  - `common.filters.email`
  - `common.filters.cpf`
  - `common.filters.startDate`
  - `common.filters.endDate`
  - `common.filters.activeOnly.label`
  - `common.filters.activeOnly.description`
  - `common.filters.search`
  - `common.filters.selectPlaceholder`
- [x] Add generic drawer labels:
  - `common.filters.apply`
  - `common.filters.clear`
  - `common.filters.active`
  - `common.filters.more`
  - `common.filters.overhead`
  - `common.filters.title`
  - `common.filters.clearConfirm.*`
- [x] Replace generic row-action usages in source with `common.table.actions.*`.
- [x] Remove redundant page-level generic action keys once no source file references them.
- [x] Run the unused-translation checker and prune dead `en-US` keys before Phase 2.

### 1.2 Replace identity-copy leakage

Current anti-pattern:

- staff/former-student drawers use `identity.accountPage.filters.*`
- this makes other modules semantically depend on identity naming

Tasks:

- [x] Replace borrowed identity filter labels in:
  - `features/partner/staff/StaffFiltersDrawer.tsx`
  - `features/academic/former-students/FormerStudentsFiltersDrawer.tsx`
- [x] Audit and replace remaining borrowed identity filter labels in other project/partner/academic drawers where the labels were generic enough to live under `common.filters.*`
- [x] Replace borrowed docs copy that still resolves generic row actions indirectly.

### 1.3 Normalize academic legacy naming

- [x] Audit `academic.schoolPage.*` and migrate to `academic.areaOfExpertisePage.*` where still appropriate.
- [x] Rename `academic.studentPage.*` to `academic.formerStudentPage.*` in one batch.
- [x] Complete the academic copy-key rename in one batch to avoid mixed namespaces.

### 1.4 Validation

- [x] `npm run format`
- [x] Confirm only `pt-BR` translation failures remain
- [x] Resolve remaining `$t(...)` indirections inside `en-US` and keep `Traducoes faltantes em EN: []`
- [x] Re-run the unused-key checker and confirm `en-US` has no dead keys left

---

## Phase 2 - Row Action Component Abstraction

### Objective

Extract the repeated generic row actions into reusable composite components and reduce copy duplication.

### 2.1 Introduce shared row-action composites

Proposed location:

- `components/composite/row-actions/*`

Proposed components:

- [x] `ViewDetailsRowAction`
  - [x] `UpdateRowAction`
  - [x] `DuplicateRowAction`
  - [x] `DeleteRowAction`
  - [x] `ReactivateRowAction`
  - [x] `DeactivateRowAction`

Each should encapsulate:

- [x] icon
  - [x] label
  - [x] dropdown item tone (`info`, `default`, `danger`, `success`, `warning`)
  - [x] click behavior

### 2.2 Keep domain-specific status actions local

Do **not** genericize these yet:

- [x] project status actions (`start`, `hold`, `complete`, `retake`, `cancel`)
  - [x] enrollment status actions (`accept`, `reject`, `complete`, `remove`, `cancel`)
  - [x] attendance validation actions (`markPresent`, `markAbsent`, `viewQrCode`)

These can still **use** the common primitives for generic actions around them.

### 2.3 Migrate simple row-action files

Simple view-only pages:

- [x] `features/geo/cities/CitiesRowActions.tsx`
  - [x] `features/identity/accounts/AccountsRowActions.tsx`
  - [x] `features/identity/users/UsersRowActions.tsx`

CRUD pages:

- [x] `features/partner/entities/EntitiesRowActions.tsx`
  - [x] `features/academic/areas-of-expertise/AreasOfExpertiseRowActions.tsx`
  - [x] `features/academic/courses/CoursesRowActions.tsx`

Activatable pages:

- [x] `features/identity/admins/AdminsRowActions.tsx`
  - [x] `features/partner/staff/StaffRowActions.tsx`
  - [x] `features/academic/former-students/FormerStudentsRowActions.tsx`

Mixed domain pages:

- [x] `features/project/projects/ProjectsRowActions.tsx`
  - [x] `features/project/enrollments/EnrollmentsRowActions.tsx`
  - [x] `features/project/attendances/AttendancesRowActions.tsx`

### 2.4 Optional follow-up

- [ ] Evaluate whether a `RowActionsSectionSeparator` helper is worth it.
- [ ] Evaluate whether a declarative `buildRowActions()` config is worth it.

Default answer for now: probably **not yet**. Shared action components are enough.

### 2.5 Validation

- [x] `npm run format`
- [ ] smoke check row menus in at least:
  - admins
  - staff
  - projects
  - attendances

---

## Phase 3 - Filter Field Composites

### Objective

Reduce repeated filter drawer markup while keeping drawers readable.

### 3.1 Introduce async combobox filter field

Proposed component:

- [x] `AsyncComboboxFilterField`

Responsibilities:

- [x] label
- [x] combobox rendering
- [x] optional `multiple`
- [x] loading/disabled state
- [x] error-state fallback with refresh action
- [x] placeholder/search/empty message props

Primary migration candidates:

- [x] `StaffFiltersDrawer`
- [x] `ProjectsFiltersDrawer`
- [x] `FormerStudentsFiltersDrawer`
- [x] any other drawer using `SomeErrorState + Label + Combobox`

### 3.2 Introduce date range filter field block

Proposed component:

- [x] `DateRangeFilterFields`

Responsibilities:

- [x] `start` label + date picker
- [x] `end` label + date picker
- [x] layout

Use for:

- [x] staff audit date range
- [x] project audit date range
- [x] former-student audit date range
- [x] any other plain dateFrom/dateTo pair

Do **not** replace:

- [x] `AuditInfoFilter`

Reason:

- `AuditInfoFilter` is a different pattern: choose an audit field first, then filter by date.
- It should remain separate from direct business date range fields like `periodFrom/periodTo`.

### 3.3 Consider a generic checkbox filter field

- [ ] Evaluate `CheckboxFilterField` for labeled checkbox + description
- [ ] Only extract if it is used enough beyond `activeOnly` and `includeConcluded`

This is lower priority than combobox/date range.

### 3.4 Standardize header filter wrappers

Current state is mixed:

- some modules use dedicated `*Filters.tsx`
- some inline the header filters inside the page component

Decision to make:

- [x] Choose one convention for header filters:
  - always wrap in `*Filters.tsx`
  - or allow inline only when <=2 simple fields

Recommended convention:

- [x] keep a dedicated `*Filters.tsx` when there is any drawer interaction or more than one frontend control
- [x] inline only for the most trivial single-field pages

### 3.5 Validation

- [x] `npm run format`
- [ ] manual visual check of drawers:
  - staff
  - projects
  - former students

---

## Phase 4 - Page Action Hooks and Dialog Abstractions

### Objective

Collapse the repeated activatable/delete/undo flow without hiding domain behavior.

### 4.1 Shared activatable record hook

Proposed hook:

- [x] `useActivatableRecordActions`

Responsibilities:

- [x] hold pending active toggle target
- [x] hold pending delete target
- [x] provide confirm callbacks
- [x] integrate deferred undo delete
- [x] clear editor/selection on delete success when configured
- [x] expose state for dialogs

Primary adoption candidates:

- [x] admins
- [x] staff
- [x] former students

### 4.2 Shared dialog pair

Proposed component:

- [x] `RecordActionDialogs`

Responsibilities:

- [x] render confirm dialog for active toggle
- [x] render confirm dialog for delete
- [x] use module-provided copy keys or resolved strings

This would replace the duplication in:

- [x] `features/identity/admins/AdminActionDialogs.tsx`
- [x] `features/partner/staff/StaffActionDialogs.tsx`
- [x] inline equivalent in `FormerStudentsPage.tsx`

### 4.3 Shared delete-with-undo helper

Even if the full hook above is not introduced, at minimum:

- [x] consider a helper around `schedule(...)` for standard delete undo toasts

This pattern repeats in:

- [ ] admins
- [ ] staff
- [ ] former students
- [ ] projects
- [ ] enrollments
- [ ] attendances

### 4.4 Validation

- [x] `npm run format`
- [ ] test active toggle and delete/undo in:
  - admins
  - staff
  - former students
  - projects

---

## Phase 5 - Editor Shared Blocks

### Objective

Reduce repeated editor-form sections without trying to genericize whole forms.

### 5.1 Shared account summary badges

Proposed component:

- [x] `AccountSummaryBadges`

Responsibilities:

- [x] account type label/tone
- [x] active label/tone
- [x] two-column layout

Primary users:

- [x] admin editor
- [x] staff editor
- [x] former-student editor

### 5.2 Shared linked detail accordions

Proposed components:

- [x] `LinkedUserAccordion`
- [x] `LinkedEntityAccordion`
- [x] `LinkedCourseAccordion`
- [x] maybe `LinkedAreaOfExpertiseAccordion`

Use where the pattern is:

- [ ] accordion item
- [ ] standard title
- [ ] shared details content component
- [ ] `columns={2}` in drawer context

### 5.3 Shared drawer error blocks

Current editor forms repeatedly implement:

- not found handling
- generic error handling
- linked resource error handling

Do not overdo this, but evaluate:

- [ ] small helper wrappers for `NotFoundState` / `SomeErrorState` where the shape is identical

This is optional. Do it only if the call sites become meaningfully smaller.

### 5.4 Preserve local form ownership

- [x] Do **not** try to unify `AdminEditorContent`, `StaffEditorForm`, and `FormerStudentEditorForm` into one generic editor.
- [x] Keep domain fields local.
- [x] Extract only the repeated visual blocks.

### 5.5 Validation

- [x] `npm run format`
- [ ] visual pass on:
  - admin editor
  - staff editor
  - former-student editor

---

## Phase 6 - Table Column Factories

### Objective

Reduce repeated `createXColumns(...)` noise for semantically identical columns.

### 6.1 Introduce shared column builders

Proposed location:

- [x] `components/composite/table-columns/*`
- [x] or `features/shared/service-pages/table-columns/*`

Implemented factories:

- [x] shared text column builder (used for `id` and other truncated text cells)
- [x] shared active badge column builder
- [x] shared datetime column builder
- [ ] shared generic badge-only column builder

### 6.2 Adopt incrementally

Start with low-risk modules:

- [x] cities
- [x] accounts
- [x] users

Then move to:

- [x] entities
- [x] admins
- [x] staff
- [x] former students
- [x] projects

### 6.3 Keep domain columns local

Do not try to genericize:

- [ ] project status columns
- [ ] enrollment progress/status columns
- [ ] attendance QR/status columns
- [ ] former-student academic metrics columns

### 6.4 Validation

- [x] `npm run format`
- [ ] visual pass on table rendering and widths

---

## Phase 7 - Duplicate Workflow Cleanup

### Objective

Reduce repeated account-backed duplicate logic while keeping payload assembly explicit.

### 7.1 Stabilize shared duplicate helpers

Candidates:

- [ ] centralize copy-email collision handling
- [ ] centralize copy-name suffix handling where used
- [ ] centralize “fetch linked account/user before duplicate” workflow if the shape is stable enough

### 7.2 Apply to current pages

- [ ] admins
- [ ] staff
- [ ] former students
- [ ] projects (`appendCopyToProjectName`)

### 7.3 Do not force one generic mutation helper

- [ ] Keep final request body construction local to each module

Reason:

- admin/staff/former-student payloads differ enough that forcing one generic helper will make the code harder to read.

### 7.4 Validation

- [ ] `npm run format`
- [ ] duplicate the same record multiple times in:
  - admins
  - staff
  - former students
  - projects

---

## Phase 8 - Naming and Structure Sweep

### Objective

Finish the cleanup after the abstraction work lands.

### 8.1 Review imports after component moves

- [ ] ensure `features/shared` is not re-exporting too many component-level pieces that now belong directly to `components/composite`
- [ ] remove stale compatibility exports if they are no longer needed

### 8.2 Review naming consistency

- [ ] service-page feature file names
- [ ] editor file naming
- [ ] detail content file naming
- [ ] copy namespaces

### 8.3 Review dead helpers

- [ ] remove old helper functions made obsolete by new shared abstractions
- [ ] remove stale props/types no longer referenced
- [ ] remove any dead copy keys in `en-US`

### 8.4 Final validation

- [ ] `npm run format`
- [ ] confirm:
  - `prettier` passes
  - `lint:fix` has warnings only
  - `tsc --noEmit` passes
  - `trans` fails only on missing `pt-BR`

---

## Explicit Non-Goals

These should **not** be attempted during this pass unless a concrete need appears:

- [ ] do not build a meta-framework that generates whole service pages
- [ ] do not genericize project/enrollment/attendance status machines
- [ ] do not merge all editor forms into one configurable editor
- [ ] do not solve `pt-BR` translation completion here
- [ ] do not rewrite modules that are already behaviorally stable just to fit an abstraction

---

## Recommended First Batch

If resuming this plan from a fresh session, start here:

- [x] create common copy keys for generic table actions and generic filters
  - [x] replace current duplicate `viewDetails/update/duplicate/delete/reactivate/deactivate` labels with those common keys
  - [x] introduce `components/composite/row-actions/*`
  - [x] migrate `CitiesRowActions`, `AccountsRowActions`, `UsersRowActions`
  - [x] migrate `AdminsRowActions`, `StaffRowActions`, `FormerStudentsRowActions`
  - [x] rerun `npm run format`

That batch is high-value, low-risk, and clears the path for the rest of the cleanup.
