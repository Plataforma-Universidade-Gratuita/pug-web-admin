# Copy Refactor Plan

## Scope

This plan is only about copy and locale coherence.

Goals:

- remove keys used in code that are missing from `public/locales/en-US/common.json`
- remove all remaining `"$t(...)"` indirections from `common.json`
- move reused wording into `common.*` where that actually reduces duplication
- avoid reintroducing page namespaces that only proxy other page namespaces
- finish with `Traducoes faltantes em EN: []` and no code paths pointing at missing keys

## Audit Method

I swept the repo in batches to avoid a heavy single-pass scan.

### Batch 1

- roots scanned: `app/`, `api/`, `auth/`
- result: no translation-key literals found here
- implication: these folders are not the source of copy drift

### Batch 2

- roots scanned: `components/`, `constants/`, `contexts/`, `features/`
- result:
  - 1115 translation-key literals found
  - 216 missing keys
- implication: most copy drift lives in feature code and feature-owned constants/components

### Batch 3

- roots scanned: `hooks/`, `i18n/`, `schemas/`, `stores/`, `types/`, `utils/`
- result:
  - 64 translation-key literals found
  - 17 missing keys
- implication: these folders mainly reference validation and support copy for the same broken page namespaces

### Locale-file sweep

- file scanned: `public/locales/en-US/common.json`
- result:
  - 28 remaining `"$t(...)"` indirections
- implication: some of the remaining breakage is locale-structure debt, not only missing leaf values

## Current Missing-Key Summary

Total missing keys referenced by code: `233`

Grouped by namespace:

- [ ] `academic.formerStudentPage` -> `145`
- [ ] `academic.areaOfExpertisePage` -> `63`
- [x] `common.fields` -> `8`
- [x] `project.attendancePage` -> `6`
- [x] `home.currentAccount` -> `3`
- [ ] `project.enrollmentPage` -> `2`
- [x] `common.resetConfirm` -> `2`
- [x] `common.reset` -> `1`
- [x] `identity.adminPage` -> `1`
- [x] `identity.accountPage` -> `1`
- [x] `partner.staffPage` -> `1`

## High-Confidence Findings

### 1. `academic.areaOfExpertisePage.*` is largely missing

This is not just `title` and `description`. The page namespace is missing most of the subtree used by code.

Files using it heavily:

- `features/academic/areas-of-expertise/AreasOfExpertisePage.tsx`
- `features/academic/areas-of-expertise/AreaOfExpertiseEditorDrawer.tsx`
- `features/academic/areas-of-expertise/AreaOfExpertiseEditorForm.tsx`
- `features/academic/areas-of-expertise/AreasOfExpertiseFiltersDrawer.tsx`
- `features/academic/areas-of-expertise/utils.ts`
- `features/academic/areas-of-expertise/area-of-expertise/AreaOfExpertisePage.tsx`
- `components/composite/features/details-content/AreaOfExpertiseDetailsContent.tsx`
- `features/academic/AcademicOverviewPage.tsx`

Missing branches include:

- [ ] `create.*`
- [ ] `delete.*`
- [ ] `dialog.*`
- [ ] `duplicate.*`
- [ ] `editor.*`
- [ ] `empty.*`
- [ ] `feedback.*`
- [ ] `filters.*`
- [ ] `loading.*`
- [ ] `table.*`
- [ ] `update.*`

### 2. `academic.formerStudentPage.*` is largely missing

This is the biggest broken namespace.

Files using it heavily:

- `features/academic/former-students/FormerStudentsPage.tsx`
- `features/academic/former-students/FormerStudentEditorDrawer.tsx`
- `features/academic/former-students/FormerStudentEditorForm.tsx`
- `features/academic/former-students/FormerStudentsFiltersDrawer.tsx`
- `features/academic/former-students/former-student/FormerStudentPage.tsx`
- `features/academic/former-students/components/*.tsx`
- `features/academic/former-students/table/utils.tsx`
- `features/academic/former-students/toast/utils.ts`
- `features/academic/former-students/filter/utils.ts`
- `components/composite/features/details-content/FormerStudentOwnDetailsContent.tsx`
- `features/academic/AcademicOverviewPage.tsx`

Missing branches include:

- [ ] `create.*`
- [ ] `delete.*`
- [ ] `dialog.*`
- [ ] `duplicate.*`
- [ ] `editor.*`
- [ ] `empty.*`
- [ ] `feedback.*`
- [ ] `filters.*`
- [ ] `loading.*`
- [ ] `metadata.*`
- [ ] `table.*`
- [ ] `update.*`

### 3. some newer shared keys were adopted in code but never added to locale

Missing `common.*` keys in active use:

- [x] `common.reset`
- [x] `common.resetConfirm.title`
- [x] `common.resetConfirm.description`
- [x] `common.fields.entityEmptyMessage`
- [x] `common.fields.entityPlaceholder`
- [x] `common.fields.entitySearchPlaceholder`
- [x] `common.fields.projectEmptyMessage`
- [x] `common.fields.projectId`
- [x] `common.fields.projectPlaceholder`
- [x] `common.fields.projectSearchPlaceholder`
- [x] `common.fields.statusPlaceholder`

Primary code users:

- `features/project/attendances/AttendanceEditorDrawer.tsx`
- `features/project/enrollments/EnrollmentEditorDrawer.tsx`
- `features/partner/staff/StaffEditorForm.tsx`
- `features/partner/staff/StaffFiltersDrawer.tsx`
- `features/project/projects/ProjectsEditorForm.tsx`
- `features/project/projects/ProjectsFiltersDrawer.tsx`
- `features/project/attendances/AttendanceEditorForm.tsx`
- `features/project/enrollments/EnrollmentEditorForm.tsx`

### 4. some feature keys are missing in smaller clusters

Missing `project.attendancePage.*` keys:

- [x] `project.attendancePage.feedback.createError.title`
- [x] `project.attendancePage.feedback.createError.description`
- [x] `project.attendancePage.feedback.updateError.title`
- [x] `project.attendancePage.feedback.updateError.description`
- [x] `project.attendancePage.feedback.deleteError.title`
- [x] `project.attendancePage.feedback.deleteError.description`

Primary code user:

- `features/project/attendances/toast/utils.ts`

Missing `project.enrollmentPage.*` keys:

- [x] `project.enrollmentPage.editor.actions.reset`
- [ ] `project.enrollmentPage.editor.loading`

Primary code user:

- `features/project/enrollments/EnrollmentEditorDrawer.tsx`

Missing `home.currentAccount.*` keys still used by code:

- [x] `home.currentAccount.error.title`
- [x] `home.currentAccount.error.description`
- [x] `home.currentAccount.error.retry`

Primary code user:

- `features/app-shell/Sidebar/AccountMenu/index.tsx`

Single missing leafs still referenced:

- [x] `identity.accountPage.dialog.linkedUser.overhead`
- [x] `identity.adminPage.dialog.linkedAccount.overhead`
- [x] `partner.staffPage.dialog.linkedAccount.overhead`

## Remaining `$t(...)` Indirections in `common.json`

Current count: `28`

These are concentrated in these areas:

- [ ] `geo.cityPage.table.columns.name`
- [ ] `identity.accountPage.dialog.active.*`
- [ ] `identity.accountPage.dialog.fields.*`
- [ ] `identity.accountPage.filters.accountType.label`
- [ ] `identity.accountPage.table.*`
- [ ] `identity.adminPage.dialog.fields.*`
- [ ] `identity.adminPage.dialog.linkedUser.*`
- [ ] `identity.adminPage.feedback.linkedUserError.*`
- [ ] `identity.adminPage.update.fields.*`
- [ ] `identity.userPage.dialog.fields.*`
- [ ] `identity.userPage.filters.frontend.cpf.label`
- [ ] `identity.userPage.table.columns.cpf`
- [ ] `partner.staffPage.feedback.linkedAccountError.*`

Current bad source targets include:

- [ ] `docs.combobox.cards.city.label`
- [ ] `docs.multiSelect.cards.status.options.active`
- [ ] `docs.drawer.examples.filters.groups.status.title`
- [ ] `home.currentAccount.fields.type`
- [ ] `home.currentAccount.values.inactive`
- [ ] `identity.accountPage.dialog.linkedUser.*`
- [ ] `identity.accountPage.feedback.linkedUserError.*`
- [ ] `partner.staffPage.dialog.linkedAccount.error.*`

Important finding:

- [ ] there are no direct `docs.*` usages left in code from the scanned roots
- [ ] `docs.*` survives here through locale indirections only

## Refactor Strategy

### Phase 1: restore missing keys without renaming code yet

Purpose:

- stop runtime missing-copy failures first
- avoid mixing structural rename work with simple restoration work

Tasks:

- [ ] add the full missing `academic.areaOfExpertisePage.*` subtree required by current code
- [ ] add the full missing `academic.formerStudentPage.*` subtree required by current code
- [ ] add missing `common.reset*` keys
- [ ] add missing `common.fields.*` keys listed above
- [ ] add missing `project.attendancePage.feedback.*` error keys
- [ ] add missing `project.enrollmentPage.editor.*` keys
- [ ] add missing `home.currentAccount.error.*` keys, unless we decide in Phase 3 to rename that consumer immediately
- [ ] add the three missing overhead keys under `identity.accountPage`, `identity.adminPage`, and `partner.staffPage`

Acceptance check:

- [ ] code sweep shows `0` missing keys used from source
- [ ] `Traducoes faltantes em EN: []`

### Phase 2: remove all remaining `$t(...)` locale indirections

Purpose:

- flatten `common.json`
- stop locale namespaces from proxying other namespaces

Tasks:

- [ ] replace each of the 28 `"$t(...)"` values with direct leaf strings
- [ ] where the same wording is truly shared, create or reuse a `common.*` key and point code to that key directly
- [ ] do not keep page keys that only exist to alias another page key

Preferred normalization targets:

- [ ] `docs.combobox.cards.city.label` -> likely `common.fields.city` or a direct `geo.cityPage.table.columns.name` leaf
- [ ] `docs.multiSelect.cards.status.options.active` -> `common.status.active`
- [ ] `home.currentAccount.values.inactive` -> `common.status.inactive`
- [ ] `home.currentAccount.fields.type` -> `common.fields.accountType`
- [ ] `docs.drawer.examples.filters.groups.status.title` -> `common.fields.active` or `common.fields.status` depending actual usage
- [ ] `identity.accountPage.dialog.linkedUser.fields.cpf` / `.name` -> either direct account-page leaves or new `common.linkedUser.fields.*`
- [ ] linked-user error/not-found copy reused by admin/user/account pages -> move to a neutral `common.linkedUser.*` namespace if wording is identical
- [ ] linked-account error copy reused across partner/admin pages -> move to a neutral `common.linkedAccount.*` namespace if wording is identical

Acceptance check:

- [ ] `Select-String` over `common.json` finds `0` occurrences of `$t(`

### Phase 3: collapse over-specific keys into `common.*` where page context already supplies meaning

Purpose:

- reduce locale surface area without losing clarity

Candidates already evident from code:

- [ ] reset CTA and reset-confirm copy -> `common.reset*`
- [ ] entity/project/status selector placeholders -> `common.fields.*`
- [ ] account-type / active / inactive wording -> `common.fields.*` and `common.status.*`
- [ ] shared linked-user / linked-account overhead and error copy -> neutral `common.*` namespace

Guardrails:

- [ ] only move to `common.*` when wording is genuinely shared across 2+ page families
- [ ] keep feature-local copy local when domain wording differs materially
- [ ] do not create `common.*` keys that are still page-specific in tone or semantics

### Phase 4: code-side cleanup after locale flattening

Purpose:

- remove stale references after locale structure is improved

Tasks:

- [ ] rewrite code references that still point at old owner namespaces only kept for compatibility
- [ ] replace any code path still depending on `home.currentAccount.*` if those values are moved to `common.*` or `appShell.*`
- [ ] replace any feature code still using keys that were flattened into `common.*`
- [ ] remove dead locale keys after the rename pass

Acceptance check:

- [ ] `node scripts/checkUnusedTranslations.js` reports no dead `en-US` keys introduced by the cleanup

## Recommended Execution Order

1. [ ] restore missing `common.*`, `project.*`, and `home.currentAccount.error.*` leafs
2. [ ] restore `academic.areaOfExpertisePage.*`
3. [ ] restore `academic.formerStudentPage.*`
4. [ ] flatten the 28 `$t(...)` indirections
5. [ ] introduce any new neutral `common.*` namespaces justified by that flattening
6. [ ] update code references to the final key owners
7. [ ] prune dead locale keys
8. [ ] run validation sweep again

## Validation Checklist

After each batch of changes:

- [ ] `npm run format`
- [ ] confirm only `pt-BR` is missing
- [ ] confirm `Traducoes faltantes em EN: []`
- [ ] re-run a key-usage scan against source if a namespace was renamed

## Notes

- `app/`, `api/`, and `auth/` are not current copy hotspots.
- There are no direct `docs.*` key usages in active code from the scanned roots.
- The current drift is mostly concentrated in:
  - `academic.areaOfExpertisePage.*`
  - `academic.formerStudentPage.*`
  - stale locale indirections in `common.json`
  - a few shared/common keys that were adopted in code before being added to locale
