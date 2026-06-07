# Codex Refactoring Internal Coherence — Consolidated Instructions

## Purpose

This file merges the five refactoring instruction documents into one Codex-agent-ready guide for reviewing and refactoring the target folders.

It combines:

1. import/export normalization;
2. misplaced utility content detection;
3. misplaced constant value detection;
4. repeated code and reusable abstraction detection;
5. the original internal-coherence refactoring rules.

## Target Root Folders

Apply these instructions to:

```txt
api/
app/
auth/
componentes/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

## Precedence Rule

The four newer rule documents override older or conflicting rules from **Refactoring Internal Coherence**.

When two sections conflict, apply this precedence order:

1. **Import and Export Refactor Rules**
2. **Misplaced Utility Content Rules**
3. **Misplaced Constant Values Rules**
4. **Repeated Code and Reusable Abstractions Rules**
5. **Legacy Base Rules: Refactoring Internal Coherence**

In practical terms:

- use the updated import/export boundary model from the import/export section;
- use the newer utility placement rules for utility content;
- use the newer constant placement rules for constant values;
- use the newer repeated-code rules for hooks, contexts, Zustand stores, and shared components;
- use the legacy internal-coherence rules only where they do not conflict with the four newer sections.

## Folder Naming Note

The active target folder name is `componentes/`.

If the legacy internal-coherence section says `components/`, interpret it as `componentes/` unless the repository itself actually contains and uses `components/`.

Do not rename `componentes/` unless explicitly instructed.

## Global Exception Comment Rule

If a rule cannot be safely enforced because of a valid technical reason, add a block comment immediately above the relevant declaration or import.

Use this format:

```ts
/*
 * Explain the specific reason this rule cannot be enforced here.
 */
```

Do not use `//` comments for rule exceptions.

---

# Part 1: Import and Export Refactor Rules

## Fix Imports and Exports

### Objective

Inspect and refactor imports and exports across the following project root folders:

```txt
api/
app/
auth/
componentes/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

The goal is to enforce consistent barrel exports and consistent imports through the highest allowed public path for each root folder.

This task is not only an analysis task. The Codex agent should fix imports and exports directly when safe to do so.

The refactor must:

- create or update the correct `index.ts` barrel files;
- remove invalid or unnecessary deep imports;
- replace relative imports with `@/` imports where possible;
- keep imports inside the allowed export boundary for each root folder;
- avoid creating circular dependencies;
- avoid exposing implementation details that should remain private;
- preserve `app/` structure as-is.

---

### Target Root Folders

Apply this task to:

```txt
api/
app/
auth/
componentes/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

> Note: The project folder is named `componentes/`. Use the existing folder name. Do not rename it unless explicitly instructed.

> Note: The user referred to `stores/`, but the current target folder is `store/`. Apply the rule to `store/`.

---

### Global Import Rule

Prefer `@/` alias imports over relative imports.

Use relative imports only when strictly necessary, usually because:

- the file is intentionally private to the same local folder;
- using the barrel would create a circular dependency;
- the import is between files that should not be publicly exported;
- the import is required by framework or tooling constraints.

When a relative import must remain, add a block comment immediately above it explaining why.

Use this comment format:

```ts
/*
 * This relative import is required because importing through the barrel would
 * create a circular dependency between this private implementation file and
 * the folder index.
 */
import { privateHelper } from "./private-helper";
```

Do not use `//` comments for these exceptions.

---

### Highest Allowed Export Boundary Rule

The highest import path is not always the root folder itself.

Different root folders have different public export boundaries.

Use the following rules.

---

## 1. App

### Folder

```txt
app/
```

### Export Rule

Keep `app/` as-is.

Do not force barrel exports in `app/`.

Do not add index files unless they already exist and are clearly needed by the framework or project conventions.

### Import Rule

Files inside and outside `app/` should still use `@/` imports where appropriate, but do not restructure `app/` exports.

Allowed:

```ts
import { something } from "@/features/identity";
```

Avoid unnecessary `app/` imports from other folders. Route files should usually consume features/components/hooks/etc., not be consumed by them.

---

## 2. Root-Level Barrel Export Folders

The following folders should have their highest public `index.ts` export file at the root folder level:

```txt
auth/
contexts/
hooks/
i18n/
store/
utils/
```

This means consumers may import from the root folder path itself.

Examples:

```ts
import { AuthProvider } from "@/auth";
import { IdentityContextProvider } from "@/contexts";
import { useDisclosure } from "@/hooks";
import { I18nProvider } from "@/i18n";
import { useFeatureStore } from "@/store";
import { formatDate } from "@/utils";
```

### Required Export Structure

Each of these folders must have a root-level `index.ts`:

```txt
auth/index.ts
contexts/index.ts
hooks/index.ts
i18n/index.ts
store/index.ts
utils/index.ts
```

Nested folders may also have `index.ts` files when needed to support clean barrel exports.

Example:

```txt
hooks/
  index.ts
  features/
    index.ts
    academic/
      index.ts
      useAcademicFilters.ts
```

Expected exports:

```ts
// hooks/features/academic/index.ts
export * from "./useAcademicFilters";
```

```ts
// hooks/features/index.ts
export * from "./academic";
```

```ts
// hooks/index.ts
export * from "./features";
```

### Highest Import Path

If a symbol is exported from the root-level index, import it from the root folder.

Prefer:

```ts
import { useAcademicFilters } from "@/hooks";
```

Instead of:

```ts
import { useAcademicFilters } from "@/hooks/features/academic";
```

Or:

```ts
import { useAcademicFilters } from "@/hooks/features/academic/useAcademicFilters";
```

### Exception

If importing from the root-level barrel causes a circular dependency, keep the import at the nearest safe lower barrel path and add an explanatory block comment.

---

## 3. First-Nested-Level Barrel Export Folders

The following folders should have their highest public `index.ts` export files at the first nested folder level, meaning direct children of the root folder:

```txt
api/
componentes/
constants/
features/
schemas/
types/
```

This means consumers should not normally import directly from:

```txt
@/api
@/componentes
@/constants
@/features
@/schemas
@/types
```

Instead, consumers should import from the direct child scope.

Examples:

```ts
import { users } from "@/api/web";
import { Button } from "@/componentes/ui";
import { ROUTES } from "@/constants/routes";
import { AccountsPage } from "@/features/identity";
import { accountSchema } from "@/schemas/client";
import type { Account } from "@/types/client";
```

### Required Export Structure

Each direct child folder must have an `index.ts` file.

Examples:

```txt
api/web/index.ts
api/mobile/index.ts

componentes/ui/index.ts
componentes/composite/index.ts

constants/routes/index.ts
constants/query-keys/index.ts

features/identity/index.ts
features/academic/index.ts

schemas/client/index.ts
schemas/api/index.ts

types/client/index.ts
types/api/index.ts
```

The root folder itself should not be the highest public barrel for these folders.

That means these root-level imports should generally be avoided:

```ts
import { users } from "@/api";
import { Button } from "@/componentes";
import { ROUTES } from "@/constants";
import { AccountsPage } from "@/features";
import { accountSchema } from "@/schemas";
import type { Account } from "@/types";
```

Prefer first nested scope imports:

```ts
import { users } from "@/api/web";
import { Button } from "@/componentes/ui";
import { ROUTES } from "@/constants/routes";
import { AccountsPage } from "@/features/identity";
import { accountSchema } from "@/schemas/client";
import type { Account } from "@/types/client";
```

### Root-Level `index.ts` Handling

For these folders, root-level `index.ts` files are optional and should not be used as the main public import boundary.

If a root-level `index.ts` already exists, inspect whether it is required by the project.

Allowed actions:

1. leave it if removing it is risky;
2. reduce its usage by updating imports to first-nested-level paths;
3. avoid adding new root-level exports unless required;
4. avoid deleting it unless clearly safe and no imports depend on it.

Do not create or encourage imports from the root-level barrel for these folders.

---

## 4. Import Boundary Matrix

Use this matrix when deciding the highest allowed import path.

| Root folder    | Highest allowed public import path    | Example                                               |
| -------------- | ------------------------------------- | ----------------------------------------------------- |
| `app/`         | Keep as-is; no enforced public barrel | Avoid consuming `app/` from other roots               |
| `auth/`        | `@/auth`                              | `import { AuthProvider } from "@/auth";`              |
| `contexts/`    | `@/contexts`                          | `import { UserContextProvider } from "@/contexts";`   |
| `hooks/`       | `@/hooks`                             | `import { useDisclosure } from "@/hooks";`            |
| `i18n/`        | `@/i18n`                              | `import { useTranslation } from "@/i18n";`            |
| `store/`       | `@/store`                             | `import { useAppStore } from "@/store";`              |
| `utils/`       | `@/utils`                             | `import { formatDate } from "@/utils";`               |
| `api/`         | `@/api/<direct-child>`                | `import { users } from "@/api/web";`                  |
| `componentes/` | `@/componentes/<direct-child>`        | `import { Button } from "@/componentes/ui";`          |
| `constants/`   | `@/constants/<direct-child>`          | `import { ROUTES } from "@/constants/routes";`        |
| `features/`    | `@/features/<direct-child>`           | `import { AccountsPage } from "@/features/identity";` |
| `schemas/`     | `@/schemas/<direct-child>`            | `import { accountSchema } from "@/schemas/client";`   |
| `types/`       | `@/types/<direct-child>`              | `import type { Account } from "@/types/client";`      |

---

### Export Rules by Folder

### `auth/`

- Highest public barrel: `auth/index.ts`.
- Consumers should import from `@/auth`.
- Ensure nested folders export upward to `auth/index.ts`.
- Do not expose private implementation details unnecessarily.

Good:

```ts
import { AuthProvider, getSession } from "@/auth";
```

Avoid:

```ts
import { AuthProvider } from "@/auth/providers/AuthProvider";
```

---

### `contexts/`

- Highest public barrel: `contexts/index.ts`.
- Consumers should import from `@/contexts`.
- Context providers, context hooks, and context objects may be exported through this root barrel if they are public.

Good:

```ts
import { IdentityContextProvider } from "@/contexts";
```

Avoid:

```ts
import { IdentityContextProvider } from "@/contexts/features/identity/IdentityContext";
```

---

### `hooks/`

- Highest public barrel: `hooks/index.ts`.
- Consumers should import from `@/hooks`.
- Nested hook folders should export upward to the root barrel.

Good:

```ts
import { useDisclosure, useTableFilters } from "@/hooks";
```

Avoid:

```ts
import { useTableFilters } from "@/hooks/features/academic/useTableFilters";
```

---

### `i18n/`

- Highest public barrel: `i18n/index.ts`.
- Consumers should import from `@/i18n`.
- Export public i18n setup, helpers, providers, and hooks through the root barrel.

Good:

```ts
import { i18n, useTranslation } from "@/i18n";
```

Avoid:

```ts
import { useTranslation } from "@/i18n/hooks/useTranslation";
```

---

### `store/`

- Highest public barrel: `store/index.ts`.
- Consumers should import from `@/store`.
- Export public Zustand stores, selectors, and store helpers through the root barrel.
- Keep implementation-only store slices private when appropriate.

Good:

```ts
import { useAccountStore } from "@/store";
```

Avoid:

```ts
import { useAccountStore } from "@/store/features/accounts/useAccountStore";
```

---

### `utils/`

- Highest public barrel: `utils/index.ts`.
- Consumers should import shared root-level utilities from `@/utils`.
- Local scoped utilities should remain local and do not need to be exposed through root `utils/index.ts`.

Good for root shared utilities:

```ts
import { formatDate, buildAccountComplexSearchRequest } from "@/utils";
```

Avoid for root shared utilities:

```ts
import { formatDate } from "@/utils/datetime";
```

Allowed for local private utility when necessary:

```ts
/*
 * This relative import is required because this helper is scoped only to this
 * folder and should not be exported through a public barrel.
 */
import { getLocalTableColumns } from "./utils";
```

---

### `api/`

- Highest public barrel: first nested folder level.
- Consumers should import from `@/api/<direct-child>`.
- Do not use `@/api` as the normal public import path.
- Each direct child under `api/` must have an `index.ts`.

Example structure:

```txt
api/
  web/
    index.ts
    identity/
      index.ts
      account/
        index.ts
        queries.ts
```

Good:

```ts
import { identity, users } from "@/api/web";
```

Avoid:

```ts
import { identity, users } from "@/api";
```

Avoid deep imports when exported by `@/api/web`:

```ts
import { getAccount } from "@/api/web/identity/account/queries";
```

Prefer:

```ts
import { identity } from "@/api/web";

const { account } = identity;
const { getAccount } = account;
```

or, if the project exports `getAccount` directly from `@/api/web`:

```ts
import { getAccount } from "@/api/web";
```

Use the existing API barrel style consistently.

---

### `componentes/`

- Highest public barrel: first nested folder level.
- Consumers should import from `@/componentes/<direct-child>`.
- Do not use `@/componentes` as the normal public import path.

Example direct child folders:

```txt
componentes/ui/
componentes/composite/
componentes/layout/
```

Good:

```ts
import { AccountSearchDrawer } from "@/componentes/composite";
import { Button, Input } from "@/componentes/ui";
```

Avoid:

```ts
import { Button } from "@/componentes";
```

Avoid deep imports when exported by the first nested barrel:

```ts
import { Button } from "@/componentes/ui/Button";
```

Prefer:

```ts
import { Button } from "@/componentes/ui";
```

---

### `constants/`

- Highest public barrel: first nested folder level.
- Consumers should import from `@/constants/<direct-child>`.
- Do not use `@/constants` as the normal public import path.

Example:

```txt
constants/routes/index.ts
constants/query-keys/index.ts
constants/storage/index.ts
```

Good:

```ts
import { QUERY_KEYS } from "@/constants/query-keys";
import { ROUTES } from "@/constants/routes";
```

Avoid:

```ts
import { ROUTES, QUERY_KEYS } from "@/constants";
```

---

### `features/`

- Highest public barrel: first nested folder level.
- Consumers should import from `@/features/<direct-child>`.
- Do not use `@/features` as the normal public import path.
- Direct child indexes should export only feature files that are meant to be used outside that feature group.
- Do not expose local implementation components unnecessarily.

Example:

```txt
features/
  identity/
    index.ts
    accounts/
      AccountsPage.tsx
      components/
        Filters.tsx
```

Good:

```ts
import { AccountsPage } from "@/features/identity";
```

Avoid:

```ts
import { AccountsPage } from "@/features";
```

Avoid importing local composition components from outside their feature scope:

```ts
import { Filters } from "@/features/identity/accounts/components/Filters";
```

If `Filters` is needed outside its local feature scope, it should likely be promoted to `componentes/composite/`.

---

### `schemas/`

- Highest public barrel: first nested folder level.
- Consumers should import from `@/schemas/<direct-child>`.
- Usually this means:
  - `@/schemas/client`
  - `@/schemas/api`

Good:

```ts
import { accountFormSchema } from "@/schemas/client";
```

Avoid:

```ts
import { accountFormSchema } from "@/schemas";
```

Avoid deep imports when exported by `@/schemas/client`:

```ts
import { accountFormSchema } from "@/schemas/client/features/identity/accounts";
```

Prefer:

```ts
import { accountFormSchema } from "@/schemas/client";
```

Exception:

If importing from `@/schemas/client` creates a circular dependency or exposes too much, use the nearest safe child barrel and document the reason.

---

### `types/`

- Highest public barrel: first nested folder level.
- Consumers should import from `@/types/<direct-child>`.
- Usually this means:
  - `@/types/client`
  - `@/types/api`

Good:

```ts
import type { AccountDto } from "@/types/api";
import type { AccountFilters } from "@/types/client";
```

Avoid:

```ts
import type { AccountFilters } from "@/types";
```

Avoid deep imports when exported by the first nested barrel:

```ts
import type { AccountFilters } from "@/types/client/features/identity/accounts";
```

Prefer:

```ts
import type { AccountFilters } from "@/types/client";
```

Use `import type` for type-only imports.

---

## Destructuring Imported Namespaces or Objects

When a first-level barrel exports a grouped object or namespace-like value, import the grouped value from the highest allowed path and destructure after the import.

Example:

```ts
import { users } from "@/api/web";

const { list, search, get, getMe, userKeys } = users;
```

Do not attempt nested destructuring inside the import statement.

Invalid:

```ts
import { { list, search, get } = users } from "@/api/web";
```

Avoid deep imports only to grab a nested member if the higher barrel exports a grouped object.

Avoid:

```ts
import { list, search } from "@/api/web/users";
```

Prefer:

```ts
import { users } from "@/api/web";

const { list, search } = users;
```

unless the project intentionally exports `list` and `search` directly from `@/api/web`.

---

## Index File Creation Rules

### For Root-Level Barrel Folders

Ensure this chain exists where needed:

```txt
root/index.ts
root/child/index.ts
root/child/grandchild/index.ts
```

Each index should export its public siblings upward.

Example:

```ts
export * from "./child";
```

### For First-Nested-Level Barrel Folders

Ensure every direct child has an index.

Example:

```txt
api/web/index.ts
componentes/ui/index.ts
constants/routes/index.ts
features/identity/index.ts
schemas/client/index.ts
types/client/index.ts
```

Nested indexes may exist and may export upward into the direct child index.

The direct child index is the highest normal public boundary.

Example:

```txt
features/identity/accounts/index.ts
features/identity/index.ts
```

`features/identity/index.ts` may export public pages from `features/identity/accounts`.

But consumers should import from:

```ts
import { AccountsPage } from "@/features/identity";
```

Not:

```ts
import { AccountsPage } from "@/features";
```

---

## Export Hygiene Rules

Do not export everything blindly.

Before exporting a symbol, determine whether it is public to consumers outside the folder.

Public examples:

- route-facing feature page used by `app/`;
- shared UI component;
- public hook;
- public context provider;
- public Zustand store;
- public utility in root `utils/`;
- public schema/type meant to be reused.

Private examples:

- local feature composition component;
- local helper;
- test helper;
- file used only by one sibling;
- implementation-only store slice;
- private API helper used only by one query file.

Private files can be imported relatively if exposing them through a barrel would be wrong.

Add a block comment above unavoidable relative imports explaining why.

---

## Import Normalization Procedure

Follow this process.

### Step 1: Build the Export Boundary Map

Classify each root folder as one of:

```txt
keep-as-is:
  app/

root-level-barrel:
  auth/
  contexts/
  hooks/
  i18n/
  store/
  utils/

first-nested-level-barrel:
  api/
  componentes/
  constants/
  features/
  schemas/
  types/
```

### Step 2: Inspect Existing Index Files

Find existing index files:

```sh
find api app auth componentes constants contexts features hooks i18n schemas store types utils -name "index.ts" -o -name "index.tsx"
```

Identify:

- missing required indexes;
- root-level indexes that should not be used as public boundaries;
- stale exports;
- duplicate exports;
- exports that expose private implementation details;
- barrels that create circular dependencies.

### Step 3: Add or Update Missing Indexes

For `auth/`, `contexts/`, `hooks/`, `i18n/`, `store/`, and `utils/`:

- ensure root `index.ts` exists;
- ensure nested public folders export upward to the root;
- root import path should be usable.

For `api/`, `componentes/`, `constants/`, `features/`, `schemas/`, and `types/`:

- ensure each direct child has an `index.ts`;
- ensure nested public modules export upward to the direct child;
- do not rely on the root folder index as the public boundary.

For `app/`:

- do not restructure.

### Step 4: Replace Deep Imports

Find deep imports that can be replaced by the correct highest allowed path.

Examples:

```ts
import { useDisclosure } from "@/hooks/useDisclosure";
```

Replace with:

```ts
import { useDisclosure } from "@/hooks";
```

Example:

```ts
import { Button } from "@/componentes/ui/Button";
```

Replace with:

```ts
import { Button } from "@/componentes/ui";
```

Example:

```ts
import type { AccountFilters } from "@/types/client/features/identity/accounts";
```

Replace with:

```ts
import type { AccountFilters } from "@/types/client";
```

### Step 5: Replace Root Imports That Are No Longer Allowed

For first-nested-level barrel folders, replace root imports.

Avoid:

```ts
import { users } from "@/api";
```

Use:

```ts
import { users } from "@/api/web";
```

Avoid:

```ts
import { Button } from "@/componentes";
```

Use:

```ts
import { Button } from "@/componentes/ui";
```

Avoid:

```ts
import { ROUTES } from "@/constants";
```

Use:

```ts
import { ROUTES } from "@/constants/routes";
```

Avoid:

```ts
import { AccountsPage } from "@/features";
```

Use:

```ts
import { AccountsPage } from "@/features/identity";
```

Avoid:

```ts
import { accountFormSchema } from "@/schemas";
```

Use:

```ts
import { accountFormSchema } from "@/schemas/client";
```

Avoid:

```ts
import type { AccountFilters } from "@/types";
```

Use:

```ts
import type { AccountFilters } from "@/types/client";
```

### Step 6: Replace Relative Imports When Safe

Replace relative imports with `@/` imports when:

- the imported symbol is public through the correct barrel;
- replacing it does not create a circular dependency;
- it does not expose private implementation details.

Keep relative imports when:

- the file is private/local only;
- the import is between implementation files in the same folder;
- adding it to a barrel would expose internals;
- using the barrel creates a circular dependency.

Document exceptions with a block comment.

### Step 7: Use Type-Only Imports

Convert imports used only as TypeScript types to `import type`.

Good:

```ts
import type { AccountFilters } from "@/types/client";
```

Avoid:

```ts
import { AccountFilters } from "@/types/client";
```

Use mixed imports only when the same path provides both runtime and type values and project lint rules allow it.

Otherwise split:

```ts
import { accountSchema } from "@/schemas/client";
import type { AccountFilters } from "@/types/client";
```

### Step 8: Preserve Side-Effect Imports

Do not convert side-effect imports into named imports.

Example:

```ts
import "@/i18n/setup";
```

If this import is required for initialization, leave it as-is unless the project has a better established pattern.

### Step 9: Check Circular Dependencies

After updating barrels and imports, watch for circular dependency risks.

Common circular dependency sources:

- a folder index exports a file that imports from the same folder index;
- a local implementation file imports from its parent barrel;
- `features/index.ts` or direct child feature index exports too much;
- `utils/index.ts` exports a utility that imports from a consumer folder;
- `types/client/index.ts` exports files that import runtime code.

If a barrel import creates a cycle, use the nearest safe lower-level import and document the exception.

---

## Suggested Search Commands

Use these commands as starting points.

### Find Relative Imports

```sh
rg "from [\"']\\.\\.?/" api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Deep Alias Imports

```sh
rg "from [\"']@/(api|componentes|constants|features|schemas|types|auth|contexts|hooks|i18n|store|utils)/.*/" api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Root Imports for First-Nested-Level Folders

```sh
rg "from [\"']@/(api|componentes|constants|features|schemas|types)[\"']" api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Type Imports Not Using import type

```sh
rg "^import \\{.*\\} from [\"']@/types" api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Existing Index Files

```sh
find api app auth componentes constants contexts features hooks i18n schemas store types utils -name "index.ts" -o -name "index.tsx"
```

### Find Potential Barrel Cycles

```sh
rg "from [\"']@/(auth|contexts|hooks|i18n|store|utils)[\"']" auth contexts hooks i18n store utils
```

```sh
rg "from [\"']@/(api|componentes|constants|features|schemas|types)/[^\"']+[\"']" api componentes constants features schemas types
```

Adapt these commands to the repository tooling and path alias configuration.

---

## Acceptance Criteria

The import/export refactor is complete when:

- `app/` was left structurally as-is;
- `auth/`, `contexts/`, `hooks/`, `i18n/`, `store/`, and `utils/` have usable root-level `index.ts` barrels;
- consumers import public symbols from `@/auth`, `@/contexts`, `@/hooks`, `@/i18n`, `@/store`, and `@/utils`;
- `api/`, `componentes/`, `constants/`, `features/`, `schemas/`, and `types/` expose public symbols from direct child indexes;
- consumers import public symbols from `@/api/<direct-child>`, `@/componentes/<direct-child>`, `@/constants/<direct-child>`, `@/features/<direct-child>`, `@/schemas/<direct-child>`, and `@/types/<direct-child>`;
- root imports from `@/api`, `@/componentes`, `@/constants`, `@/features`, `@/schemas`, and `@/types` were removed or justified;
- deep imports were replaced with the correct highest allowed barrel path where safe;
- relative imports were replaced with `@/` imports where safe;
- remaining relative imports have `/* */` block comments explaining why;
- type-only imports use `import type`;
- private implementation details were not unnecessarily exported;
- no circular dependencies were introduced;
- validation commands pass or remaining failures are documented as pre-existing/unrelated.

---

## Validation Commands

Before changing code, inspect `package.json` and identify the package manager and available scripts.

After changing imports/exports, run the available validation commands.

Prefer the repository package manager.

Possible commands:

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

If the project uses `pnpm`, use `pnpm`.

If the project uses `yarn`, use `yarn`.

If the project uses `bun`, use `bun`.

Do not invent scripts that do not exist.

---

## Required Final Report

After completing the import/export refactor, provide a concise Markdown report:

```md
## Import/Export Refactor Report

### Summary

Brief summary of changes.

### Export Boundaries Applied

- Root-level barrel folders:
- First-nested-level barrel folders:
- App handling:

### Index Files Created or Updated

List relevant index files.

### Import Updates

Summarize replaced deep imports, root imports, and relative imports.

### Exceptions

List remaining relative imports or deep imports and why they are necessary.

### Circular Dependency Notes

List any detected or avoided cycles.

### Validation

List commands run and results.

### Remaining Follow-Up

List anything that could not be safely changed.
```

---

## Final Instruction to Codex

Act as a senior TypeScript architecture refactoring agent.

Your job is to make imports and exports predictable without overexposing private files.

Use the updated export boundary model:

```txt
app/ -> keep as-is

auth/
contexts/
hooks/
i18n/
store/
utils/
  -> highest index.ts at root folder level

api/
componentes/
constants/
features/
schemas/
types/
  -> highest index.ts at first nested folder level
```

Prefer the highest allowed public import path, not necessarily the root folder path.

Do not create broad root barrels for folders whose boundary is the first nested level.

Do not convert private implementation details into public exports just to remove a relative import.

When a rule cannot be safely enforced, keep the safer import and document the reason with a block comment.

---

# Part 2: Misplaced Utility Content Rules

## Find Misplaced Utility Content

### Objective

Inspect the project root folders listed below and identify utility content that is declared in the wrong scope.

Target folders:

```txt
api/
app/
auth/
componentes/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

The goal is to find utility functions, utility objects, helper methods, formatter functions, parser functions, mappers, builders, normalizers, and similar utilitary content that should be moved to a better location according to its actual usage scope.

This task is primarily an analysis and recommendation task.

Do not move files or rewrite code unless explicitly instructed after the report is reviewed.

---

### Real Example of the Problem

The current codebase contains a case like this:

```ts
import { buildAccountComplexSearchRequest } from "@/features/identity/accounts/utils";
```

This import appears in:

```txt
api/web/identity/account/queries.ts
```

The utility is defined under:

```txt
features/identity/accounts/utils.ts
```

But it is used by both:

```txt
features/
api/
```

Because two or more root folders use this utility, it should not live inside `features/`.

It should be moved to the root-level `utils/` folder, in a file named according to the utility scope.

For example:

```txt
utils/account-search.ts
utils/request-builders.ts
utils/search-requests.ts
utils/identity.ts
```

Choose the filename based on the real semantic scope of the utility.

---

### Definition of Utility Content

For this task, utility content means reusable non-component logic such as:

- formatter functions;
- parser functions;
- mapper functions;
- normalizer functions;
- transformer functions;
- request builder functions;
- query builder functions;
- route builder functions;
- object builders;
- object sanitizers;
- data grouping functions;
- sorting helpers;
- filtering helpers;
- date/time helpers;
- string helpers;
- number helpers;
- array helpers;
- object helpers;
- permission helper functions;
- type guard functions;
- reusable validation helper functions that are not schemas;
- reusable constants incorrectly placed inside a utility file;
- domain-specific helper functions reused outside their local scope.

Examples:

```ts
export function formatDate(value: Date) {
	// ...
}
```

```ts
export function buildAccountComplexSearchRequest(filters: AccountFilters) {
	// ...
}
```

```ts
export function normalizeUserPayload(payload: UserPayload) {
	// ...
}
```

```ts
export function mapApiAccountToAccountViewModel(account: ApiAccount) {
	// ...
}
```

---

### What Is Not Utility Content

Do not classify these as utility content unless they are clearly being used as reusable helpers:

- React components;
- React hooks;
- React contexts;
- Zustand stores;
- schemas;
- type-only declarations;
- interfaces;
- route pages;
- API client functions that directly perform network requests;
- generated API contract code;
- framework-specific files;
- files under `types/api/`;
- files under `schemas/api/`.

If a file mixes utility content with non-utility content, report the utility parts that should be moved.

---

### Do Not Modify Frozen API Type/Schema Contracts

Do not modify anything under:

```txt
types/api/
schemas/api/
```

These folders are considered correct and should not be changed as part of this task.

You may inspect them only if needed to understand usage, but do not edit, move, rename, or re-export anything inside them.

---

### Utility Placement Rule

A utility must live at the lowest scope that contains all files that use it.

The correct location is determined by actual imports/usages, not by where the utility was originally created.

---

## 1. Scoped Utility Rule

Given a folder structure like this:

```txt
root/
  firstLevel/
    FirstLevelComponent.tsx
    utils.ts
    secondLevel/
      SecondLevelComponent.tsx
      utils.ts
```

Use the following rules.

### Utility Used Only by the Second Level

A utility method used only by `SecondLevelComponent` or files inside:

```txt
root/firstLevel/secondLevel/
```

Should live under:

```txt
root/firstLevel/secondLevel/utils.ts
```

Example:

```txt
features/identity/accounts/details/utils.ts
```

### Utility Used Only by the First Level

A utility method used only by `FirstLevelComponent` or files directly under:

```txt
root/firstLevel/
```

Should live under:

```txt
root/firstLevel/utils.ts
```

Example:

```txt
features/identity/accounts/utils.ts
```

### Parent Can Serve Children

A utility defined under:

```txt
root/firstLevel/utils.ts
```

May be used by files inside nested folders such as:

```txt
root/firstLevel/secondLevel/
root/firstLevel/secondLevel/thirdLevel/
```

This is allowed because the utility is defined at an ancestor scope.

### Child Cannot Serve Parent

A file under:

```txt
root/firstLevel/
```

Must not import a utility from:

```txt
root/firstLevel/secondLevel/utils.ts
```

This is an upward dependency on a child scope.

If a parent-level file needs a utility currently defined in a child folder, move the utility up to:

```txt
root/firstLevel/utils.ts
```

Bad:

```ts
import { normalizeAccount } from "@/features/identity/accounts/details/utils";
```

From:

```txt
features/identity/accounts/AccountPage.tsx
```

Good destination:

```txt
features/identity/accounts/utils.ts
```

### Sibling Folders Need Parent Scope

If two sibling folders use the same utility, move it to their nearest shared parent folder.

Example:

```txt
features/identity/accounts/list/ListPage.tsx
features/identity/accounts/details/DetailsPage.tsx
```

If both use `normalizeAccount`, it should live in:

```txt
features/identity/accounts/utils.ts
```

Not in:

```txt
features/identity/accounts/list/utils.ts
```

And not in:

```txt
features/identity/accounts/details/utils.ts
```

---

## 2. Cross-Root Utility Rule

If two or more root folders use the same utility, it must live under the root-level:

```txt
utils/
```

Root folders include:

```txt
api/
app/
auth/
componentes/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

Example:

```txt
api/web/identity/account/queries.ts
features/identity/accounts/AccountsPage.tsx
```

If both use:

```ts
buildAccountComplexSearchRequest;
```

Then the utility must not live under:

```txt
features/identity/accounts/utils.ts
```

It should live under:

```txt
utils/
```

With a semantic filename, such as:

```txt
utils/account-search.ts
utils/request-builders.ts
utils/search-requests.ts
utils/identity.ts
```

Choose the filename that best describes the utility's real responsibility.

---

## 3. Root-Level Utility File Naming

When moving or recommending a utility to root-level `utils/`, do not create vague files unless the project already has a convention for them.

Avoid overly generic files like:

```txt
utils/helpers.ts
utils/misc.ts
utils/common.ts
```

Prefer semantic names:

```txt
utils/formatters.ts
utils/datetime.ts
utils/account-search.ts
utils/request-builders.ts
utils/query-params.ts
utils/routes.ts
utils/strings.ts
utils/arrays.ts
utils/objects.ts
utils/permissions.ts
```

A root-level utility file should be named by the utility method's scope, domain, or operation.

Examples:

- date formatter -> `utils/datetime.ts` or `utils/formatters.ts`;
- account search request builder -> `utils/account-search.ts` or `utils/search-requests.ts`;
- route builder -> `utils/routes.ts`;
- query string builder -> `utils/query-params.ts`;
- permission helper -> `utils/permissions.ts`;
- object cleanup helper -> `utils/objects.ts`.

---

## 4. Local Utility File Naming

For scoped utilities, use a local file named:

```txt
utils.ts
```

or, if JSX is required:

```txt
utils.tsx
```

Examples:

```txt
features/identity/accounts/utils.ts
features/identity/accounts/details/utils.ts
componentes/table/utils.ts
hooks/features/academic/utils.ts
```

Use `utils.tsx` only when the utility file must contain JSX.

If a local utility file contains JSX-returning helper code, recommend either:

1. promoting it to a proper component if it behaves like a component; or
2. renaming `utils.ts` to `utils.tsx` if it is truly a JSX utility.

---

## 5. Misplacement Patterns to Find

Look for the following issues.

### A. Cross-Root Import from Local Utility

A file in one root folder imports from another root folder's local `utils.ts`.

Example:

```ts
import { buildAccountComplexSearchRequest } from "@/features/identity/accounts/utils";
```

From:

```txt
api/web/identity/account/queries.ts
```

This is likely misplaced if the imported symbol is utility content.

Recommendation:

```txt
Move the utility to root-level utils/.
```

### B. Parent Imports Utility from Child

A parent folder imports a utility from a nested child folder.

Example:

```txt
features/identity/accounts/AccountPage.tsx
```

imports from:

```txt
features/identity/accounts/details/utils.ts
```

Recommendation:

```txt
Move the utility to features/identity/accounts/utils.ts.
```

### C. Sibling Imports Utility from Sibling

One sibling folder imports a utility from another sibling folder.

Example:

```txt
features/identity/accounts/list/ListPage.tsx
```

imports from:

```txt
features/identity/accounts/details/utils.ts
```

Recommendation:

```txt
Move the utility to features/identity/accounts/utils.ts.
```

### D. Utility Defined Too High

A utility is placed higher than necessary.

Example:

```txt
utils/formatters.ts
```

But it is only used by files under:

```txt
features/identity/accounts/
```

Recommendation:

```txt
Move it down to features/identity/accounts/utils.ts.
```

Do not keep utilities at root level unless they are used by two or more root folders.

### E. Utility Defined Inside Component File

A reusable helper is defined inside a `.tsx` component file and used or duplicated elsewhere.

Recommendation:

- move to local `utils.ts` if used only within the local scope;
- move to root `utils/` if used by multiple root folders.

### F. Utility Defined Inside API File but Used Outside API

A helper is defined inside an API module and imported by feature/client code.

Recommendation:

- if it is a true API request function, keep it in `api/`;
- if it is a generic request builder, mapper, formatter, or payload transformer used outside `api/`, move it to root `utils/` or the nearest shared scope.

### G. Feature Utility Used by API

A helper under `features/` is used by `api/`.

This is usually a strong signal that the helper is misplaced.

Feature folders should not serve API modules with generic utilities.

Recommendation:

```txt
Move the utility to root-level utils/.
```

### H. Utility in Root `utils/` Used by Only One Root Folder

A root-level utility that is only used inside one root folder is probably too high.

Recommendation:

```txt
Move it down to the lowest common local scope.
```

### I. Utility File Contains Constants

If a `utils.ts` file contains exported constants that are not implementation details of the utility functions, recommend moving them to `constants.ts` or root `constants/` according to their usage scope.

### J. Utility File Contains Types

If a `utils.ts` file contains exported reusable types or interfaces, recommend moving them to `types/client/` according to the existing type placement rule.

Do not touch `types/api/`.

### K. Utility File Contains Schemas

If a `utils.ts` file contains reusable schemas, recommend moving them to `schemas/client/` according to the existing schema placement rule.

Do not touch `schemas/api/`.

---

## 6. Import Direction Checks

For each utility import, determine:

1. the importing file path;
2. the imported utility file path;
3. the root folder of the importer;
4. the root folder of the imported utility;
5. the nearest common folder between importer and all other usages;
6. whether the import direction is valid.

Valid direction:

```txt
ancestor utils.ts -> descendant file
same folder utils.ts -> sibling file
root utils/ -> any root folder
```

Potentially invalid direction:

```txt
child utils.ts -> parent file
sibling utils.ts -> sibling file
feature utils.ts -> api file
component utility -> api file
root utils/ -> only one local root folder usage
```

---

## 7. Suggested Search Strategy

Use ripgrep and repository-aware search.

### Find Utility Files

```sh
find api app auth componentes constants contexts features hooks i18n schemas store types utils \\
  -type f \\( -name "utils.ts" -o -name "utils.tsx" -o -path "utils/*.ts" -o -path "utils/*.tsx" \\)
```

### Find Imports from Utility Files

```sh
rg "from [\\"']@/.*/utils[\\"']|from [\\"']@/.*/utils\\.tsx?[\\"']|from [\\"']@/utils" \\
  api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Relative Imports from Utility Files

```sh
rg "from [\\"']\\.\\.?/.*/utils[\\"']|from [\\"']\\.\\.?/.*/utils\\.tsx?[\\"']|from [\\"']\\.\\.?/utils[\\"']" \\
  api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Exported Utility Symbols

```sh
rg "export function|export const|export async function|export \\{" \\
  api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Potential Helpers Inside TSX Files

```sh
rg "function [a-z]|const [a-zA-Z0-9_]+ = \\(|const [a-zA-Z0-9_]+ = \\([^)]*\\) =>" \\
  app componentes features
```

### Find Feature Utilities Imported by API

```sh
rg "from [\\"']@/features/.*/utils" api
```

### Find API Utilities Imported by Features

```sh
rg "from [\\"']@/api/.*/utils" features componentes app hooks contexts store
```

### Find Root Utils Usage

```sh
rg "from [\\"']@/utils" \\
  api app auth componentes constants contexts features hooks i18n schemas store types utils
```

These commands are suggestions. Adapt them to the repository structure, alias configuration, and package manager.

---

## 8. Classification Categories

Classify every finding into one of these categories:

```txt
cross-root-utility
parent-imports-child-utility
sibling-imports-sibling-utility
utility-defined-too-high
utility-defined-too-low
utility-inside-component
utility-inside-api-but-used-outside
feature-utility-used-by-api
root-utility-used-by-single-root
utility-file-contains-constants
utility-file-contains-types
utility-file-contains-schemas
no-action
```

Use `no-action` when the utility is correctly placed or when moving it would make the code worse.

---

## 9. Priority Levels

Use these priority levels.

### P0 — Critical

Use when the misplaced utility creates architectural boundary violations or likely circular dependency risks.

Examples:

- `api/` imports from `features/`;
- `store/` imports from `features/`;
- `types/client/` imports runtime utility code from feature folders;
- root infrastructure code depends on route-facing feature code.

### P1 — High

Use when the utility is clearly reused across multiple scopes and should be moved.

Examples:

- utility under one feature used by multiple features;
- utility under one root folder used by another root folder;
- sibling folders importing from each other's local `utils.ts`.

### P2 — Medium

Use when placement is suboptimal but not actively harmful.

Examples:

- root `utils/` function used only by one root folder;
- utility defined one folder too high;
- helper inside component file duplicated elsewhere.

### P3 — Low

Use when the utility is slightly misplaced, but the benefit of moving it is small.

Examples:

- small helper in local component file used only once;
- naming issue in root `utils/`;
- utility could move lower but current placement is acceptable.

---

## 10. Risk Levels

Use these risk levels.

### Low Risk

- moving a pure function;
- no behavior change;
- imports are easy to update;
- utility has no side effects.

### Medium Risk

- utility depends on domain types;
- utility has several consumers;
- utility is coupled to feature naming;
- moving requires index/barrel updates;
- some call sites may need import path updates.

### High Risk

- utility has side effects;
- utility touches API payloads, auth, permissions, routing, or global state;
- utility depends on React hooks or runtime context;
- moving may create circular dependencies;
- utility is imported by many files across many root folders.

---

## 11. Required Finding Format

For each misplaced utility finding, report:

```md
#### Finding N: <short descriptive name>

- Category:
- Priority:
- Risk:
- Utility symbol(s):
- Current utility location:
- Current consumers:
- Problem:
- Recommended destination:
- Recommended filename:
- Required import updates:
- Notes:
```

Example:

```md
#### Finding 1: Account complex search request builder lives under features but is used by API

- Category: feature-utility-used-by-api
- Priority: P0
- Risk: Medium
- Utility symbol(s): `buildAccountComplexSearchRequest`
- Current utility location: `features/identity/accounts/utils.ts`
- Current consumers:
  - `api/web/identity/account/queries.ts`
  - `features/identity/accounts/...`
- Problem: The utility is defined under `features/`, but it is consumed by both `features/` and `api/`. This creates an architectural dependency from API code to feature code.
- Recommended destination: `utils/`
- Recommended filename: `account-search.ts` or `search-requests.ts`
- Required import updates:
  - Replace imports from `@/features/identity/accounts/utils` with `@/utils`.
- Notes: Choose the final filename based on nearby root utility naming conventions.
```

---

## 12. Required Final Report Structure

Produce a Markdown report with this structure:

```md
## Misplaced Utility Content Report

### Summary

Briefly summarize the number of findings by category and priority.

### Target Folders Inspected

- `api/`
- `app/`
- `auth/`
- `componentes/`
- `constants/`
- `contexts/`
- `features/`
- `hooks/`
- `i18n/`
- `schemas/`
- `store/`
- `types/`
- `utils/`

### P0 / P1 Findings

List the most important findings first.

### Detailed Findings

#### Finding 1: <name>

- Category:
- Priority:
- Risk:
- Utility symbol(s):
- Current utility location:
- Current consumers:
- Problem:
- Recommended destination:
- Recommended filename:
- Required import updates:
- Notes:

### Correctly Placed Utilities Worth Keeping

List important utilities that were inspected and appear correctly scoped.

### No-Action Duplicates or Borderline Cases

List cases where the utility may look misplaced but should stay where it is.

### Potential Circular Dependency Risks

List any recommended moves that may require careful barrel export handling.

### Recommended Refactor Order

Give a safe order for applying the recommended moves.

### Validation Commands

List the commands that should be run after applying changes.
```

---

## 13. Recommended Refactor Order

When later applying changes, use this order:

1. Move P0 cross-root utilities first.
2. Move feature utilities imported by API or infrastructure code.
3. Move sibling-shared utilities to their nearest parent folder.
4. Move child utilities used by parents up to the parent scope.
5. Move root-level utilities down if they are used by only one root folder.
6. Split constants/types/schemas out of utility files if found.
7. Update barrel exports.
8. Update imports to use the highest available `@/` path.
9. Run validation.

---

## 14. Validation Commands

After applying any future refactor, inspect `package.json` and run the available validation commands.

Prefer the repository's package manager.

Possible commands:

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

If the project uses `pnpm`, use `pnpm`.

If the project uses `yarn`, use `yarn`.

If the project uses `bun`, use `bun`.

Do not invent scripts that do not exist.

---

## 15. Acceptance Criteria

The analysis is complete when:

- all target root folders were inspected recursively;
- every local `utils.ts` and `utils.tsx` file was checked for usage scope;
- root-level `utils/` files were checked for whether they are truly cross-root;
- utility imports between root folders were identified;
- parent-to-child utility imports were identified;
- sibling-to-sibling utility imports were identified;
- feature utilities imported by API were identified;
- utilities defined too high or too low were identified;
- utility files containing constants, types, or schemas were reported;
- every finding has a recommended destination;
- every finding has priority and risk;
- no code changes were made unless explicitly requested;
- no changes were made to `types/api/` or `schemas/api/`.

---

## 16. Final Instruction to Codex

Act as a senior frontend architecture reviewer.

The main architectural question is:

> Is this utility declared at the lowest correct scope that contains all of its consumers?

If yes, leave it alone.

If no, report where it should move and why.

Prioritize architectural boundary violations first, especially cases where:

```txt
api/ imports from features/
store/ imports from features/
contexts/ imports from features/
root infrastructure imports from route-facing feature code
```

Do not recommend moving utilities to root-level `utils/` just because they might be reusable someday.

Only recommend root-level `utils/` when actual usage crosses two or more root folders.

---

# Part 3: Misplaced Constant Values Rules

## Find Misplaced Constant Values

### Objective

Inspect the project root folders listed below and identify constant values that are declared in the wrong scope.

Target folders:

```txt
api/
app/
auth/
componentes/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

The goal is to find constants, repeated literal values, configuration objects, enum-like objects, option arrays, route paths, query keys, storage keys, labels, default values, magic numbers, and other reusable constant content that should be moved to a better location according to its actual usage scope.

This task is primarily an analysis and recommendation task.

Do not move files or rewrite code unless explicitly instructed after the report is reviewed.

---

### Real Example of the Problem

A misplaced constant follows the same architectural problem as a misplaced utility.

Example:

```ts
import { ACCOUNT_QUERY_KEYS } from "@/features/identity/accounts/constants";
```

If this import appears in:

```txt
api/web/identity/account/queries.ts
```

And the constant is defined under:

```txt
features/identity/accounts/constants.ts
```

But it is used by both:

```txt
features/
api/
```

Then the constant is misplaced.

Because two or more root folders use this constant, it should not live inside `features/`.

It should be moved to the root-level `constants/` folder, in a file named according to the constant scope.

For example:

```txt
constants/account.ts
constants/account-query-keys.ts
constants/query-keys.ts
constants/identity.ts
```

Choose the filename based on the real semantic scope of the constant.

---

### Definition of Constant Content

For this task, constant content means reusable static values such as:

- route paths;
- query keys;
- mutation keys;
- local storage keys;
- session storage keys;
- cookie names;
- default page sizes;
- default pagination values;
- default filter values;
- default form values;
- status labels;
- enum-like objects;
- option arrays;
- select options;
- tabs configuration;
- table column static configuration;
- static permissions;
- static role names;
- magic numbers;
- repeated strings;
- repeated object literals;
- repeated array literals;
- API endpoint fragments when they are not part of an API client implementation;
- feature flags;
- layout dimensions;
- breakpoint values;
- date/time format strings;
- currency/locale constants;
- reusable error messages;
- reusable success messages;
- reusable empty-state messages;
- static regex patterns;
- static maps or dictionaries.

Examples:

```ts
export const DEFAULT_PAGE_SIZE = 10;
```

```ts
export const ACCOUNT_QUERY_KEYS = {
	all: ["accounts"],
	detail: (id: string) => ["accounts", id],
};
```

```ts
export const ACCOUNT_STATUS_OPTIONS = [
	{ label: "Active", value: "ACTIVE" },
	{ label: "Inactive", value: "INACTIVE" },
];
```

```ts
export const DATE_FORMAT = "dd/MM/yyyy";
```

---

### What Is Not Constant Content

Do not classify these as constant content unless they are clearly reusable static values:

- React components;
- React hooks;
- React contexts;
- Zustand stores;
- utility functions;
- schemas;
- type-only declarations;
- interfaces;
- API client functions that directly perform network requests;
- generated API contract code;
- framework-specific files;
- values under `types/api/`;
- values under `schemas/api/`.

If a file mixes constants with non-constant content, report the constant parts that should be moved.

---

### Do Not Modify Frozen API Type/Schema Contracts

Do not modify anything under:

```txt
types/api/
schemas/api/
```

These folders are considered correct and should not be changed as part of this task.

You may inspect them only if needed to understand usage, but do not edit, move, rename, or re-export anything inside them.

---

### Constant Placement Rule

A constant must live at the lowest scope that contains all files that use it.

The correct location is determined by actual imports/usages, not by where the constant was originally created.

---

## 1. Scoped Constant Rule

Given a folder structure like this:

```txt
root/
  firstLevel/
    FirstLevelComponent.tsx
    constants.ts
    secondLevel/
      SecondLevelComponent.tsx
      constants.ts
```

Use the following rules.

### Constant Used Only by the Second Level

A constant used only by `SecondLevelComponent` or files inside:

```txt
root/firstLevel/secondLevel/
```

Should live under:

```txt
root/firstLevel/secondLevel/constants.ts
```

Example:

```txt
features/identity/accounts/details/constants.ts
```

### Constant Used Only by the First Level

A constant used only by `FirstLevelComponent` or files directly under:

```txt
root/firstLevel/
```

Should live under:

```txt
root/firstLevel/constants.ts
```

Example:

```txt
features/identity/accounts/constants.ts
```

### Parent Can Serve Children

A constant defined under:

```txt
root/firstLevel/constants.ts
```

May be used by files inside nested folders such as:

```txt
root/firstLevel/secondLevel/
root/firstLevel/secondLevel/thirdLevel/
```

This is allowed because the constant is defined at an ancestor scope.

### Child Cannot Serve Parent

A file under:

```txt
root/firstLevel/
```

Must not import a constant from:

```txt
root/firstLevel/secondLevel/constants.ts
```

This is an upward dependency on a child scope.

If a parent-level file needs a constant currently defined in a child folder, move the constant up to:

```txt
root/firstLevel/constants.ts
```

Bad:

```ts
import { ACCOUNT_DETAILS_TABS } from "@/features/identity/accounts/details/constants";
```

From:

```txt
features/identity/accounts/AccountPage.tsx
```

Good destination:

```txt
features/identity/accounts/constants.ts
```

### Sibling Folders Need Parent Scope

If two sibling folders use the same constant, move it to their nearest shared parent folder.

Example:

```txt
features/identity/accounts/list/ListPage.tsx
features/identity/accounts/details/DetailsPage.tsx
```

If both use `ACCOUNT_STATUS_OPTIONS`, it should live in:

```txt
features/identity/accounts/constants.ts
```

Not in:

```txt
features/identity/accounts/list/constants.ts
```

And not in:

```txt
features/identity/accounts/details/constants.ts
```

---

## 2. Cross-Root Constant Rule

If two or more root folders use the same constant, it must live under the root-level:

```txt
constants/
```

Root folders include:

```txt
api/
app/
auth/
componentes/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

Example:

```txt
api/web/identity/account/queries.ts
features/identity/accounts/AccountsPage.tsx
```

If both use:

```ts
ACCOUNT_QUERY_KEYS;
```

Then the constant must not live under:

```txt
features/identity/accounts/constants.ts
```

It should live under:

```txt
constants/
```

With a semantic filename, such as:

```txt
constants/account.ts
constants/account-query-keys.ts
constants/query-keys.ts
constants/identity.ts
```

Choose the filename that best describes the constant's real responsibility.

---

## 3. Root-Level Constant File Naming

When moving or recommending a constant to root-level `constants/`, do not create vague files unless the project already has a convention for them.

Avoid overly generic files like:

```txt
constants/common.ts
constants/misc.ts
constants/general.ts
constants/constants.ts
```

Prefer semantic names:

```txt
constants/routes.ts
constants/query-keys.ts
constants/storage.ts
constants/account.ts
constants/account-query-keys.ts
constants/identity.ts
constants/permissions.ts
constants/datetime.ts
constants/formatters.ts
constants/pagination.ts
constants/messages.ts
constants/statuses.ts
constants/options.ts
```

A root-level constant file should be named by the constant value's scope, domain, or concept.

Examples:

- route paths -> `constants/routes.ts`;
- account query keys -> `constants/account-query-keys.ts` or `constants/query-keys.ts`;
- local storage keys -> `constants/storage.ts`;
- permission names -> `constants/permissions.ts`;
- date format strings -> `constants/datetime.ts`;
- pagination defaults -> `constants/pagination.ts`;
- reusable messages -> `constants/messages.ts`;
- status options -> `constants/statuses.ts` or `constants/options.ts`.

---

## 4. Local Constant File Naming

For scoped constants, use a local file named:

```txt
constants.ts
```

Examples:

```txt
features/identity/accounts/constants.ts
features/identity/accounts/details/constants.ts
componentes/table/constants.ts
hooks/features/academic/constants.ts
api/web/identity/account/constants.ts
```

Do not create local files like:

```txt
account-constants.ts
page-constants.ts
misc-constants.ts
```

unless the project already has a strong convention requiring that shape.

For local scoped content, prefer:

```txt
constants.ts
```

---

## 5. Misplacement Patterns to Find

Look for the following issues.

### A. Cross-Root Import from Local Constants

A file in one root folder imports from another root folder's local `constants.ts`.

Example:

```ts
import { ACCOUNT_QUERY_KEYS } from "@/features/identity/accounts/constants";
```

From:

```txt
api/web/identity/account/queries.ts
```

This is likely misplaced if the imported symbol is constant content.

Recommendation:

```txt
Move the constant to root-level constants/.
```

### B. Parent Imports Constant from Child

A parent folder imports a constant from a nested child folder.

Example:

```txt
features/identity/accounts/AccountPage.tsx
```

imports from:

```txt
features/identity/accounts/details/constants.ts
```

Recommendation:

```txt
Move the constant to features/identity/accounts/constants.ts.
```

### C. Sibling Imports Constant from Sibling

One sibling folder imports a constant from another sibling folder.

Example:

```txt
features/identity/accounts/list/ListPage.tsx
```

imports from:

```txt
features/identity/accounts/details/constants.ts
```

Recommendation:

```txt
Move the constant to features/identity/accounts/constants.ts.
```

### D. Constant Defined Too High

A constant is placed higher than necessary.

Example:

```txt
constants/query-keys.ts
```

But it is only used by files under:

```txt
features/identity/accounts/
```

Recommendation:

```txt
Move it down to features/identity/accounts/constants.ts.
```

Do not keep constants at root level unless they are used by two or more root folders.

### E. Constant Defined Inside Component File

A reusable constant is defined inside a `.tsx` component file and used or duplicated elsewhere.

Recommendation:

- move to local `constants.ts` if used only within the local scope;
- move to root `constants/` if used by multiple root folders.

### F. Constant Defined Inside API File but Used Outside API

A constant is defined inside an API module and imported by feature/client code.

Recommendation:

- if it is a true API implementation detail used only by API code, keep it in `api/`;
- if it is a generic query key, endpoint fragment, status, label, option, default value, or configuration value used outside `api/`, move it to root `constants/` or the nearest shared scope.

### G. Feature Constant Used by API

A constant under `features/` is used by `api/`.

This is usually a strong signal that the constant is misplaced.

Feature folders should not serve API modules with generic constants.

Recommendation:

```txt
Move the constant to root-level constants/.
```

### H. Constant in Root `constants/` Used by Only One Root Folder

A root-level constant that is only used inside one root folder is probably too high.

Recommendation:

```txt
Move it down to the lowest common local scope.
```

### I. Constants File Contains Utility Methods

If a `constants.ts` file contains exported functions or non-static helper logic, recommend moving those functions to `utils.ts` or root `utils/` according to their usage scope.

### J. Constants File Contains Types

If a `constants.ts` file contains exported reusable types or interfaces, recommend moving them to `types/client/` according to the existing type placement rule.

Do not touch `types/api/`.

### K. Constants File Contains Schemas

If a `constants.ts` file contains reusable schemas, recommend moving them to `schemas/client/` according to the existing schema placement rule.

Do not touch `schemas/api/`.

### L. Repeated Literal Values Not Extracted

If the same literal or same static object/array appears in three or more files and represents the same concept, report it as a missing constant.

Examples:

```ts
const pageSize = 10;
```

```ts
"accounts";
```

```ts
"ACTIVE";
```

```ts
"dd/MM/yyyy";
```

```ts
["accounts", "list"];
```

Recommendation:

- local `constants.ts` if all usages are under one local scope;
- root `constants/` if usages cross two or more root folders.

Do not extract repeated literals that only coincidentally have the same value but represent different concepts.

---

## 6. Import Direction Checks

For each constant import, determine:

1. the importing file path;
2. the imported constant file path;
3. the root folder of the importer;
4. the root folder of the imported constant;
5. the nearest common folder between importer and all other usages;
6. whether the import direction is valid.

Valid direction:

```txt
ancestor constants.ts -> descendant file
same folder constants.ts -> sibling file
root constants/ -> any root folder
```

Potentially invalid direction:

```txt
child constants.ts -> parent file
sibling constants.ts -> sibling file
feature constants.ts -> api file
component constant -> api file
root constants/ -> only one local root folder usage
```

---

## 7. Suggested Search Strategy

Use ripgrep and repository-aware search.

### Find Constant Files

```sh
find api app auth componentes constants contexts features hooks i18n schemas store types utils \
  -type f \( -name "constants.ts" -o -name "constants.tsx" -o -path "constants/*.ts" -o -path "constants/*.tsx" \)
```

### Find Imports from Constant Files

```sh
rg "from [\"']@/.*/constants[\"']|from [\"']@/.*/constants\.tsx?[\"']|from [\"']@/constants" \
  api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Relative Imports from Constant Files

```sh
rg "from [\"']\.\.?/.*/constants[\"']|from [\"']\.\.?/.*/constants\.tsx?[\"']|from [\"']\.\.?/constants[\"']" \
  api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Exported Constants

```sh
rg "export const|export enum|export \{" \
  api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Uppercase Constant-Like Declarations

```sh
rg "const [A-Z][A-Z0-9_]+|export const [A-Z][A-Z0-9_]+" \
  api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Potential Constants Inside TSX Files

```sh
rg "const [A-Z][A-Z0-9_]+|const [a-zA-Z0-9_]+ = \[|const [a-zA-Z0-9_]+ = \{" \
  app componentes features
```

### Find Feature Constants Imported by API

```sh
rg "from [\"']@/features/.*/constants" api
```

### Find API Constants Imported by Features

```sh
rg "from [\"']@/api/.*/constants" features componentes app hooks contexts store
```

### Find Root Constants Usage

```sh
rg "from [\"']@/constants" \
  api app auth componentes constants contexts features hooks i18n schemas store types utils
```

### Find Common Repeated Literal Candidates

```sh
rg "\"[A-Z_]{3,}\"|'[A-Z_]{3,}'|\"[a-z0-9-_/]{3,}\"|'[a-z0-9-_/]{3,}'" \
  api app auth componentes contexts features hooks i18n schemas store utils
```

These commands are suggestions. Adapt them to the repository structure, alias configuration, and package manager.

---

## 8. Classification Categories

Classify every finding into one of these categories:

```txt
cross-root-constant
parent-imports-child-constant
sibling-imports-sibling-constant
constant-defined-too-high
constant-defined-too-low
constant-inside-component
constant-inside-api-but-used-outside
feature-constant-used-by-api
root-constant-used-by-single-root
constants-file-contains-utilities
constants-file-contains-types
constants-file-contains-schemas
repeated-literal-missing-constant
no-action
```

Use `no-action` when the constant is correctly placed or when moving it would make the code worse.

---

## 9. Priority Levels

Use these priority levels.

### P0 — Critical

Use when the misplaced constant creates architectural boundary violations or likely circular dependency risks.

Examples:

- `api/` imports constants from `features/`;
- `store/` imports constants from `features/`;
- `types/client/` imports runtime constants from feature folders;
- root infrastructure code depends on route-facing feature constants.

### P1 — High

Use when the constant is clearly reused across multiple scopes and should be moved.

Examples:

- constant under one feature used by multiple features;
- constant under one root folder used by another root folder;
- sibling folders importing from each other's local `constants.ts`;
- repeated literal used in three or more files and representing the same concept.

### P2 — Medium

Use when placement is suboptimal but not actively harmful.

Examples:

- root `constants/` value used only by one root folder;
- constant defined one folder too high;
- constant inside component file duplicated elsewhere.

### P3 — Low

Use when the constant is slightly misplaced, but the benefit of moving it is small.

Examples:

- small local constant in component file used only once;
- naming issue in root `constants/`;
- constant could move lower but current placement is acceptable.

---

## 10. Risk Levels

Use these risk levels.

### Low Risk

- moving a static literal or static object;
- no behavior change;
- imports are easy to update;
- constant has no runtime dependencies.

### Medium Risk

- constant depends on domain types;
- constant has several consumers;
- constant is coupled to feature naming;
- moving requires index/barrel updates;
- some call sites may need import path updates.

### High Risk

- constant influences API payloads, auth, permissions, routing, validation, or global state;
- constant is imported by many files across many root folders;
- constant is not truly static;
- constant initialization has side effects;
- moving may create circular dependencies.

---

## 11. Required Finding Format

For each misplaced constant finding, report:

```md
#### Finding N: <short descriptive name>

- Category:
- Priority:
- Risk:
- Constant symbol(s):
- Current constant location:
- Current consumers:
- Problem:
- Recommended destination:
- Recommended filename:
- Required import updates:
- Notes:
```

Example:

```md
#### Finding 1: Account query keys live under features but are used by API

- Category: feature-constant-used-by-api
- Priority: P0
- Risk: Medium
- Constant symbol(s): `ACCOUNT_QUERY_KEYS`
- Current constant location: `features/identity/accounts/constants.ts`
- Current consumers:
  - `api/web/identity/account/queries.ts`
  - `features/identity/accounts/...`
- Problem: The constant is defined under `features/`, but it is consumed by both `features/` and `api/`. This creates an architectural dependency from API code to feature code.
- Recommended destination: `constants/`
- Recommended filename: `account-query-keys.ts` or `query-keys.ts`
- Required import updates:
  - Replace imports from `@/features/identity/accounts/constants` with `@/constants/<direct-child>` according to the project export-boundary rule.
- Notes: Choose the final filename based on nearby root constant naming conventions.
```

---

## 12. Required Final Report Structure

Produce a Markdown report with this structure:

```md
## Misplaced Constant Values Report

### Summary

Briefly summarize the number of findings by category and priority.

### Target Folders Inspected

- `api/`
- `app/`
- `auth/`
- `componentes/`
- `constants/`
- `contexts/`
- `features/`
- `hooks/`
- `i18n/`
- `schemas/`
- `store/`
- `types/`
- `utils/`

### P0 / P1 Findings

List the most important findings first.

### Detailed Findings

#### Finding 1: <name>

- Category:
- Priority:
- Risk:
- Constant symbol(s):
- Current constant location:
- Current consumers:
- Problem:
- Recommended destination:
- Recommended filename:
- Required import updates:
- Notes:

### Correctly Placed Constants Worth Keeping

List important constants that were inspected and appear correctly scoped.

### No-Action Duplicates or Borderline Cases

List cases where the constant may look misplaced but should stay where it is.

### Potential Circular Dependency Risks

List any recommended moves that may require careful barrel export handling.

### Recommended Refactor Order

Give a safe order for applying the recommended moves.

### Validation Commands

List the commands that should be run after applying changes.
```

---

## 13. Recommended Refactor Order

When later applying changes, use this order:

1. Move P0 cross-root constants first.
2. Move feature constants imported by API or infrastructure code.
3. Move sibling-shared constants to their nearest parent folder.
4. Move child constants used by parents up to the parent scope.
5. Move root-level constants down if they are used by only one root folder.
6. Split utility functions, types, and schemas out of constants files if found.
7. Extract repeated literal values into the proper constants file when they represent the same concept.
8. Update barrel exports.
9. Update imports to use the highest available allowed `@/` path.
10. Run validation.

---

## 14. Validation Commands

After applying any future refactor, inspect `package.json` and run the available validation commands.

Prefer the repository's package manager.

Possible commands:

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

If the project uses `pnpm`, use `pnpm`.

If the project uses `yarn`, use `yarn`.

If the project uses `bun`, use `bun`.

Do not invent scripts that do not exist.

---

## 15. Acceptance Criteria

The analysis is complete when:

- all target root folders were inspected recursively;
- every local `constants.ts` and `constants.tsx` file was checked for usage scope;
- root-level `constants/` files were checked for whether they are truly cross-root;
- constant imports between root folders were identified;
- parent-to-child constant imports were identified;
- sibling-to-sibling constant imports were identified;
- feature constants imported by API were identified;
- constants defined too high or too low were identified;
- constants files containing utilities, types, or schemas were reported;
- repeated literal values used in three or more files were evaluated;
- every finding has a recommended destination;
- every finding has priority and risk;
- no code changes were made unless explicitly requested;
- no changes were made to `types/api/` or `schemas/api/`.

---

## 16. Final Instruction to Codex

Act as a senior frontend architecture reviewer.

The main architectural question is:

> Is this constant declared at the lowest correct scope that contains all of its consumers?

If yes, leave it alone.

If no, report where it should move and why.

Prioritize architectural boundary violations first, especially cases where:

```txt
api/ imports from features/
store/ imports from features/
contexts/ imports from features/
root infrastructure imports from route-facing feature code
```

Do not recommend moving constants to root-level `constants/` just because they might be reusable someday.

Only recommend root-level `constants/` when actual usage crosses two or more root folders.

Do not extract repeated literals unless they clearly represent the same concept.

---

# Part 4: Repeated Code and Reusable Abstractions Rules

## Find Repeated Code and Logic for Reusable Abstractions

### Objective

Inspect the following root folders and identify repeated code, repeated React logic, duplicated state patterns, duplicated provider patterns, duplicated Zustand-like state logic, and duplicated UI/component structures that should be refactored into reusable abstractions.

Target folders:

```txt
api/
app/
auth/
componentes/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

The goal is not to refactor everything immediately. The goal is to produce a clear, actionable report describing what duplicated code exists, where it appears, what abstraction it should become, where that abstraction should live, and why.

Potential abstraction targets:

- custom hooks;
- React contexts;
- Zustand stores;
- shared components;
- composite components;
- utilities;
- constants.

This task is primarily an analysis and recommendation task. Only make code changes if explicitly instructed after the report is reviewed.

---

### Core Rule

Whenever repeated logic is found in three or more places, evaluate whether it should be extracted.

Do not blindly extract every duplicated line. Prefer extraction when it improves maintainability, reduces bugs, improves naming, or centralizes a meaningful concept.

Repeated code should be classified by intent, not only by exact text similarity.

For example, these may represent the same repeated logic even if the code is not identical:

- repeated table filtering state;
- repeated pagination state;
- repeated drawer open/close state;
- repeated modal management;
- repeated form submit handling;
- repeated query parameter synchronization;
- repeated permission checks;
- repeated loading/error/empty UI handling;
- repeated API mutation flows;
- repeated toast handling;
- repeated selected-row state;
- repeated auth/session checks;
- repeated context provider setup;
- repeated Zustand selectors/actions;
- repeated page headers or filter bars.

---

### Do Not Modify Frozen API Type/Schema Contracts

Do not modify anything under:

```txt
types/api/
schemas/api/
```

These folders are considered correct and should not be changed as part of this task.

You may inspect them only if needed to understand usage, but do not edit, move, rename, or re-export anything inside them.

---

### Abstraction Decision Guide

Use the following guide when deciding what duplicated logic should become.

#### 1. Custom Hook

Recommend a custom hook when the repeated logic is React-specific and component-local.

Good candidates:

- repeated `useState` logic;
- repeated `useEffect` logic;
- repeated `useMemo` / `useCallback` patterns;
- repeated form state logic;
- repeated filtering/sorting/pagination state;
- repeated URL query-param synchronization;
- repeated data transformation tied to rendering;
- repeated media query or responsive behavior;
- repeated keyboard/mouse event handling;
- repeated table selection behavior;
- repeated loading/error orchestration;
- repeated API query/mutation handling used by components.

Examples:

```tsx
const [open, setOpen] = useState(false);

function handleOpen() {
	setOpen(true);
}

function handleClose() {
	setOpen(false);
}
```

If this modal/drawer behavior appears in three or more components, recommend a hook such as:

```txt
hooks/<scope>/useDisclosure.ts
```

Another example:

```tsx
const [filters, setFilters] = useState(defaultFilters);
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
```

If repeated in feature tables, recommend something like:

```txt
hooks/features/<scope>/useTableFilters.ts
```

#### 2. React Context

Recommend a React context when repeated logic represents shared state or behavior that must be available to a subtree without prop drilling.

Good candidates:

- state used by many nested components in the same screen or feature;
- repeated provider/consumer setup;
- current selected entity shared across nested components;
- wizard/stepper state shared across nested components;
- feature-level configuration shared by many descendants;
- UI state shared across a route subtree;
- permissions or session-derived data consumed deeply;
- duplicated prop drilling across multiple levels.

Do not recommend a context for simple local state used by only one or two nearby components.

If the same state can stay local and be passed directly without complexity, prefer local state or a hook.

Example recommendation:

```txt
contexts/features/academic/AcademicSelectionContext.tsx
```

Use context when the state belongs to a React subtree. Use Zustand when the state is global, cross-route, or not naturally tied to a provider boundary.

#### 3. Zustand Store

Recommend a Zustand store when repeated logic represents client-side state that is shared across distant components, routes, or features, and does not naturally belong to a single React subtree.

Good candidates:

- global UI preferences;
- shared filters used across routes;
- current organization/school/tenant selection;
- cross-feature entity selection;
- authenticated user client state that is not already handled by auth/session tooling;
- state read/written by distant parts of the app;
- state that should survive route transitions;
- state that is currently copied across multiple features;
- repeated Zustand store patterns that can be merged or standardized.

Prefer Zustand over Context when:

- consumers are spread across unrelated trees;
- state is updated frequently and would cause provider re-render concerns;
- state is not tied to one route subtree;
- the same state is needed across multiple root areas or feature groups.

Example recommendation:

```txt
store/features/academic/useAcademicStore.ts
```

or, for cross-feature usage:

```txt
store/features/useFeatureSelectionStore.ts
```

#### 4. Shared Component

Recommend a shared component when repeated JSX or repeated UI structure appears in three or more places.

Good candidates:

- repeated page header layout;
- repeated filter bar;
- repeated table action menu;
- repeated empty state;
- repeated error state;
- repeated loading state;
- repeated confirmation dialog;
- repeated drawer content layout;
- repeated form section layout;
- repeated card/list item structure;
- repeated toolbar;
- repeated breadcrumb/header pairing.

If it is generic and reusable across the application, recommend placing it under:

```txt
componentes/
```

If it is a composition shared specifically across feature areas, recommend placing it under:

```txt
componentes/composite/
```

If it is shared by multiple feature paths, use:

```txt
componentes/composite/features/
```

If it is only used by one feature path, keep it inside that feature's local `components/` folder.

Example:

```txt
features/geo/cities/components/Filters.tsx
```

Only promote to `componentes/composite/` when it is reused outside that local feature scope.

#### 5. Utility Function

Recommend a utility when repeated non-React logic appears in multiple places.

Good candidates:

- formatting;
- parsing;
- sorting;
- mapping;
- normalization;
- object transformations;
- string transformations;
- date transformations;
- route building;
- query object building;
- validation helpers that are not schemas.

If used only inside one folder scope, recommend a local:

```txt
utils.ts
```

If used across multiple root folders, recommend root-level:

```txt
utils/
```

#### 6. Constant

Recommend a constant when repeated literal values appear in multiple places and represent the same concept.

Good candidates:

- repeated route paths;
- repeated query keys;
- repeated status strings;
- repeated enum-like options;
- repeated page sizes;
- repeated labels;
- repeated local storage keys;
- repeated magic numbers;
- repeated configuration arrays.

If used only inside one folder scope, recommend local:

```txt
constants.ts
```

If used across multiple root folders, recommend root-level:

```txt
constants/
```

---

### Scope Placement Rules

When recommending where to place a new abstraction, use the lowest common scope that covers all usages.

Do not place abstractions higher than necessary.

#### Hook Placement

If used across multiple feature groups:

```txt
hooks/features/
```

If used only under one feature group:

```txt
hooks/features/<feature>/
```

If used across multiple root folders:

```txt
hooks/
```

#### Context Placement

If used across multiple feature groups:

```txt
contexts/features/
```

If used only under one feature group:

```txt
contexts/features/<feature>/
```

If used across the whole app:

```txt
contexts/
```

#### Zustand Store Placement

If used by multiple feature groups:

```txt
store/features/
```

If used only under one feature group:

```txt
store/features/<feature>/
```

If truly global:

```txt
store/
```

#### Shared Component Placement

If generic and reusable app-wide:

```txt
componentes/
```

If it is a composite shared between features:

```txt
componentes/composite/features/
```

If shared only inside one feature path:

```txt
features/<feature-path>/components/
```

#### Utility Placement

If used by one local folder:

```txt
<local-scope>/utils.ts
```

If used by multiple root folders:

```txt
utils/
```

#### Constant Placement

If used by one local folder:

```txt
<local-scope>/constants.ts
```

If used by multiple root folders:

```txt
constants/
```

---

### Folder Inspection Requirements

Inspect these folders recursively:

```txt
api/
app/
auth/
componentes/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

For each folder, look for:

- exact duplicated code blocks;
- similar duplicated logic with different names;
- repeated React state patterns;
- repeated `useEffect` patterns;
- repeated handlers;
- repeated API/query/mutation patterns;
- repeated Zustand stores or store slices;
- repeated React context/provider patterns;
- repeated UI layouts;
- repeated component structures;
- repeated table/filter/form patterns;
- repeated constants;
- repeated utility functions;
- duplicated type-like object shapes;
- duplicated schema-like validation logic;
- duplicated file organization patterns.

Do not limit the search to exact text matches. Look for semantic duplication.

---

### Suggested Search Strategy

Use a combination of structural and text search.

Search for repeated React patterns:

```sh
rg "useState|useEffect|useMemo|useCallback|useReducer" api app auth componentes contexts features hooks store
```

Search for modal/drawer state:

```sh
rg "open|setOpen|isOpen|onOpen|onClose|handleOpen|handleClose" app componentes features contexts hooks store
```

Search for repeated table logic:

```sh
rg "page|pageSize|pagination|sorting|filters|setFilters|columns|rows" app componentes features hooks store
```

Search for repeated form logic:

```sh
rg "useForm|handleSubmit|defaultValues|resolver|zodResolver|formSchema" app componentes features hooks schemas
```

Search for repeated API mutation/query patterns:

```sh
rg "useQuery|useMutation|queryKey|invalidateQueries|mutate|mutateAsync" api app features hooks store
```

Search for Zustand usage:

```sh
rg "create\(|zustand|StateCreator|set\(|get\(" store app features hooks contexts
```

Search for repeated contexts:

```sh
rg "createContext|useContext|Provider" app componentes contexts features hooks
```

Search for repeated UI states:

```sh
rg "Loading|Error|Empty|Skeleton|Spinner|No results|Nenhum|Erro|Carregando" app componentes features
```

Search for repeated literals:

```sh
rg "'[^']{3,}'|\"[^\"]{3,}\"" app auth componentes features hooks i18n store utils constants
```

These commands are only suggestions. Adapt them based on the repository conventions and available tooling.

---

### What to Ignore

Do not recommend extraction for:

- duplicated code generated by tools;
- trivial one-line expressions with no meaningful domain concept;
- test mocks unless the task is expanded to tests;
- code that is duplicated because of framework requirements;
- code where abstraction would make readability worse;
- code used only twice, unless the duplication is large, risky, or clearly about to spread;
- code in `types/api/` or `schemas/api/`.

When choosing not to recommend extraction for an obvious duplicate, mention why.

---

### Classification Rules

Classify every finding into one of these categories:

```txt
custom-hook
react-context
zustand-store
shared-component
composite-component
utility
constant
no-action
```

Use `no-action` when duplication exists but should not be abstracted.

Each finding must include:

- category;
- current locations;
- duplicated pattern summary;
- why it should or should not be extracted;
- recommended destination path;
- expected benefit;
- risk level;
- suggested priority.

---

### Priority Levels

Use these priority levels:

#### P0 — Critical

Use when duplication is causing or likely causing bugs, inconsistent behavior, or broken state.

Examples:

- duplicated auth/session logic with different behavior;
- duplicated permission logic;
- duplicated API mutation invalidation with inconsistencies;
- duplicated validation logic producing different results.

#### P1 — High

Use when duplication is significant and refactoring would clearly improve maintainability.

Examples:

- repeated table/filter/pagination logic across many features;
- repeated form handling in many screens;
- repeated drawer/modal state patterns across many components;
- repeated composite UI blocks across features.

#### P2 — Medium

Use when duplication is noticeable but not urgent.

Examples:

- repeated empty/loading/error states;
- repeated formatting utilities;
- repeated simple constants;
- repeated layout fragments.

#### P3 — Low

Use when duplication is minor or extraction may not be worth doing immediately.

Examples:

- small repeated handlers;
- repeated literals with limited impact;
- duplicated logic used only twice but likely to grow.

---

### Risk Levels

Use these risk levels:

#### Low Risk

- isolated extraction;
- easy to test visually;
- no behavior change expected;
- mostly moving code.

#### Medium Risk

- several imports need to change;
- shared logic has small behavioral differences;
- needs careful prop or API design.

#### High Risk

- affects auth, permissions, API calls, validation, routing, or global state;
- requires changing data flow;
- may affect many features at once.

---

### Required Final Report Format

Produce a Markdown report with the following structure:

```md
## Repeated Code and Logic Refactor Report

### Summary

Briefly summarize the number and type of findings.

### Target Folders Inspected

List all inspected root folders.

### High Priority Recommendations

List P0 and P1 items first.

### Detailed Findings

#### Finding 1: <short name>

- Category:
- Priority:
- Risk:
- Current locations:
- Repeated pattern:
- Recommendation:
- Recommended destination:
- Expected benefit:
- Notes:

#### Finding 2: <short name>

...
```

For current locations, include concrete file paths.

For recommendation, be specific.

Avoid vague recommendations like:

```txt
Make a shared hook.
```

Prefer:

```txt
Create hooks/features/academic/useAcademicTableFilters.ts to centralize repeated filter, sorting, and pagination state currently duplicated in AcademicCoursesPage.tsx, AcademicTeachersPage.tsx, and AcademicSubjectsPage.tsx.
```

---

### Required Analysis Checklist

Before finishing, verify that the report answers these questions:

- Which repeated logic should become a hook?
- Which repeated state should become a context?
- Which repeated state should become a Zustand store?
- Which repeated JSX should become a shared component?
- Which repeated JSX should become a composite component?
- Which repeated non-React logic should become a utility?
- Which repeated values should become constants?
- Which duplicated code should intentionally remain duplicated?
- Where should each new abstraction live?
- What is the risk and priority of each recommendation?
- Are there any likely circular dependency concerns?
- Are there any abstractions that would require moving types or schemas?
- Are any recommendations blocked by missing context?

---

### Acceptance Criteria

The task is complete when:

- all target root folders were inspected recursively;
- repeated code and repeated logic were identified semantically, not only by exact text;
- each finding was classified;
- each finding has a recommended destination path;
- each finding has priority and risk;
- high-impact duplicated logic is clearly separated from minor duplication;
- no edits were made to `types/api/` or `schemas/api/`;
- no code changes were made unless explicitly requested;
- the final report is actionable enough for a follow-up refactoring task.

---

### Final Instruction to Codex

Act as a senior frontend architecture reviewer.

Prioritize correctness, maintainability, and clear ownership boundaries over aggressive deduplication.

Recommend abstractions only when they reduce real complexity.

Do not create abstractions for their own sake.

When in doubt, document the duplication as `no-action` and explain why it should remain local for now.

---

# Part 5: Legacy Base Rules: Refactoring Internal Coherence

## Refactoring Internal Coherence

### Objective

Refactor the codebase to improve internal coherence, consistency, maintainability, and discoverability across the main project root folders.

The refactor must enforce consistent import/export patterns, proper placement of utilities, constants, types, interfaces, schemas, hooks, contexts, stores, components, and feature files.

The final goal is to make the project structure predictable:

- imports should come from the highest available barrel path;
- exports should be centralized through `index.ts`;
- utilities and constants should live at the lowest common scope where they are needed;
- types, interfaces, and schemas should live under the proper centralized folders;
- React-specific repeated patterns should be abstracted into hooks, contexts, or stores when appropriate;
- component and feature files should remain focused, small, and free from unrelated declarations.

### Target Root Folders

Apply this refactor to the following root folders:

```txt
api/
app/
auth/
components/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

### Global Enforcement Rule

If a piece of code cannot comply with one of the rules in this document for a valid technical reason, add a block comment immediately above its declaration explaining why.

Use only the following comment format:

```ts
/*
 * Explanation of why this declaration cannot follow the internal coherence rule.
 */
```

Do not use `//` comments for these exceptions.

The explanation must be specific. Avoid vague comments like:

```ts
/*
 * Needed for now.
 */
```

Prefer:

```ts
/*
 * This import must remain relative because importing it through the barrel creates
 * a circular dependency between the feature index and this local implementation file.
 */
```

---

## 1. Imports

### Applies To

Apply this rule to every target root folder:

```txt
api/
app/
auth/
components/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

### Required Rule

Always prefer barrel imports using the `@/` alias.

Relative imports should only be used when strictly necessary.

Use the highest importable path available.

Prefer this:

```ts
import { users } from "@/api";
```

Instead of this:

```ts
import { users } from "@/api/web/users";
```

And especially instead of this:

```ts
import { users } from "../../../api/web/users";
```

### Highest Importable Path Rule

When a symbol is exported from a higher-level barrel file, import it from that higher-level path.

Example:

```ts
// Good
import { users } from "@/api";

// Avoid if users is already exported from "@/api"
import { users } from "@/api/web";

// Avoid if users is already exported from "@/api" or "@/api/web"
import { users } from "@/api/web/users";
```

### Destructuring Rule

If only part of an imported object is needed, import the object from the highest available barrel path and destructure after the import.

Example:

```ts
import { users } from "@/api";

const { list, search, get, getMe, userKeys } = users;
```

Do not attempt nested destructuring inside the import statement.

Do not write:

```ts
import { { list, search } = users } from "@/api";
```

Do not bypass the highest available path just to import nested members directly.

Prefer this:

```ts
import { users } from "@/api";

const { list, search } = users;
```

Over this, if `users` is available from `@/api`:

```ts
import { list, search } from "@/api/web/users";
```

### Relative Import Exception

Use relative imports only when necessary, such as when using the barrel import would create a circular dependency or when the file is intentionally private and not exported.

When a relative import is unavoidable, add an explanatory block comment immediately above the import.

Example:

```ts
/*
 * This relative import is required because exporting this file through the local
 * barrel would create a circular dependency with the parent feature index.
 */
import { normalizePayload } from "./utils";
```

---

## 2. Exports

### Applies To

Apply this rule to every target root folder except:

```txt
features/
app/
```

So this rule applies to:

```txt
api/
auth/
components/
constants/
contexts/
hooks/
i18n/
schemas/
store/
types/
utils/
```

### Required Rule

Every folder must have its own `index.ts` file.

Each `index.ts` file must export sibling files and sibling folders.

Example:

```txt
api/
  index.ts
  web/
    index.ts
    users/
      index.ts
      users.ts
```

Expected exports:

```ts
// api/web/users/index.ts
export * from "./users";
```

```ts
// api/web/index.ts
export * from "./users";
```

```ts
// api/index.ts
export * from "./web";
```

### Export Visibility

Only export what is meant to be consumed outside the folder.

Private implementation details should not be exported unless they are required by other folders.

If something cannot be exported through an `index.ts` due to a circular dependency or architectural limitation, add an explanatory block comment above the declaration or import that requires the exception.

---

## 3. Utilities and Constants

### Applies To

Apply this rule to every target root folder except:

```txt
utils/
constants/
```

The folders `utils/` and `constants/` are part of the rule and serve as the root-level shared locations.

### Required Rule

Utility methods must be defined in files named:

```txt
utils.ts
```

Constants must be defined in files named:

```txt
constants.ts
```

Do not define reusable utilities or constants inside component files, feature files, hooks, contexts, stores, or arbitrary implementation files.

### Lowest Necessary Declaration Rule

Utilities and constants must live at the lowest common scope where all consumers can access them.

Use this decision process:

1. If only one file uses a utility or constant, place it beside that file.
2. If multiple files in the same folder use it, place it in that folder.
3. If files in multiple child folders under the same parent use it, place it in the parent folder.
4. If files from two or more root folders use it, place it under the root-level `utils/` or `constants/` folder.

### Example Structure

```txt
path/
  anotherPath/
    anotherFile.ts
    utils.ts
    constants.ts

  yetAnotherPath/
    yetAnotherFile.ts
    utils.ts
    constants.ts

  file.ts
  utils.ts
  constants.ts
```

Use:

```txt
anotherPath/utils.ts
```

For utility methods used only by files inside `anotherPath/`.

Use:

```txt
yetAnotherPath/constants.ts
```

For constants used only by files inside `yetAnotherPath/`.

Use:

```txt
path/utils.ts
```

For utility methods used by:

- `path/file.ts`;
- multiple files directly under `path/`;
- multiple child folders under `path/`;
- a combination of `path/file.ts` and one or more child folders.

### Cross-Root Utilities

If a utility is used by two or more root folders, it must live under:

```txt
utils/
```

Example:

```txt
utils/
  formatters.ts
  index.ts
```

### Cross-Root Constants

If a constant is used by two or more root folders, it must live under:

```txt
constants/
```

Example:

```txt
constants/
  routes.ts
  index.ts
```

### TSX Utility Exception

If a utility file must declare or return JSX, promote it from:

```txt
utils.ts
```

To:

```txt
utils.tsx
```

Only do this when JSX is truly required.

---

## 4. Types, Interfaces, and Schemas

### Applies To

Apply this rule to every target root folder except:

```txt
types/
schemas/
```

The folders `types/` and `schemas/` are part of the rule and serve as the centralized locations.

### Required Rule

Types and interfaces must always be defined under:

```txt
types/
```

Schemas must always be defined under:

```txt
schemas/
```

Do not define reusable types, interfaces, or schemas directly inside:

```txt
api/
app/
auth/
components/
constants/
contexts/
features/
hooks/
i18n/
store/
utils/
```

### API vs Client Split

Both `types/` and `schemas/` are divided into:

```txt
types/api/
types/client/

schemas/api/
schemas/client/
```

### API Folders Are Frozen

Do not modify anything under:

```txt
types/api/
schemas/api/
```

These folders are considered correct as-is.

Do not move, rename, rewrite, re-export, or restructure files inside these folders.

All type/schema refactoring work must happen under:

```txt
types/client/
schemas/client/
```

### Client Path Matching Rule

Client-side types, interfaces, and schemas must match the path of the scope where they are used.

Example source file:

```txt
features/somePath/component.tsx
```

Corresponding type file:

```txt
types/client/features/somePath.ts
```

Corresponding schema file:

```txt
schemas/client/features/somePath.ts
```

### Lowest Used Pattern

Types and schemas should live at the lowest common path where they are needed.

Example:

```txt
features/academic/courses/CoursePage.tsx
features/academic/courses/CourseForm.tsx
```

If both files use the same type, place it in:

```txt
types/client/features/academic/courses.ts
```

If only `CourseForm.tsx` uses it, still place it according to the closest matching client type scope for that file, such as:

```txt
types/client/features/academic/courses.ts
```

or, when the project structure requires deeper matching:

```txt
types/client/features/academic/courses/course-form.ts
```

Use the existing project conventions where possible, but keep the type outside the feature folder.

### Global Client Types

If a type or interface is used by two or more root folders, define it in:

```txt
types/client/global.ts
```

If a schema is used by two or more root folders, define it in:

```txt
schemas/client/global.ts
```

### Component Props

Component prop types must also live under `types/client/`.

Do not define inline exported interfaces in `.tsx` files.

Avoid:

```tsx
interface UserCardProps {
	name: string;
}

export function UserCard(props: UserCardProps) {
	return <div>{props.name}</div>;
}
```

Prefer:

```ts
// types/client/components/user-card.ts
export interface UserCardProps {
	name: string;
}
```

```tsx
// components/UserCard.tsx
import type { UserCardProps } from "@/types";

export function UserCard(props: UserCardProps) {
	return <div>{props.name}</div>;
}
```

Inline anonymous prop types should also be avoided when they are reusable or make the component harder to read.

---

## 5. Hooks, Contexts, and Stores

### Applies To

Apply this rule to any target folder containing a `*.tsx` file.

Relevant root folders include, but are not limited to:

```txt
app/
components/
contexts/
features/
hooks/
store/
```

### Required Rule

When a repeated React pattern is found across three or more components, evaluate whether it should be extracted into one of the following:

```txt
hooks/
contexts/
store/
```

Use the most appropriate abstraction:

- use `hooks/` for reusable component logic;
- use `contexts/` for React Context providers and consumers;
- use `store/` for shared state management stores.

### Extraction Criteria

A repeated pattern should be considered for extraction when it appears in three or more components and includes one or more of the following:

- repeated `useState` or `useReducer` logic;
- repeated `useEffect` logic;
- repeated data-fetching state logic;
- repeated form state logic;
- repeated URL/query-param synchronization;
- repeated selection, filtering, sorting, pagination, or table state;
- repeated permission or auth checks;
- repeated provider/consumer patterns;
- repeated global or cross-feature state access.

Do not extract trivial one-line expressions unless extraction improves clarity.

### Highest Used Path Rule

Hooks, contexts, and stores must be defined at the highest path where they are used, but no higher.

Example:

If a hook is used across multiple features:

```txt
hooks/features/
```

If a hook is used only by files under:

```txt
features/academic/
```

Then define it under:

```txt
hooks/features/academic/
```

Apply the same structure to:

```txt
contexts/
store/
```

### Examples

A hook used by multiple academic feature files:

```txt
hooks/features/academic/useAcademicFilters.ts
```

A hook used across many unrelated features:

```txt
hooks/features/useFeatureNavigation.ts
```

A context used only by identity feature files:

```txt
contexts/features/identity/IdentityContext.tsx
```

A store used across multiple features:

```txt
store/features/useFeatureStore.ts
```

### Export Requirements

The `hooks/`, `contexts/`, and `store/` folders must follow the export rules.

Every folder must contain an `index.ts` file exporting sibling files and folders.

---

## 6. Components and Features

### Applies To

Apply this rule specifically to:

```txt
components/
features/
```

### Component File Responsibility

`.tsx` files inside `components/` and `features/` must only declare React components.

They must not contain:

- reusable utility methods;
- reusable constants;
- reusable types;
- interfaces;
- schemas;
- stores;
- contexts, unless the file itself is a context component/provider file in the appropriate `contexts/` folder;
- unrelated helper declarations.

Move these to the appropriate files:

```txt
utils.ts
constants.ts
types/client/
schemas/client/
hooks/
contexts/
store/
```

### Auxiliary Methods

Internal auxiliary methods should be moved to `utils.ts`.

Example:

Avoid:

```tsx
function formatUserName(name: string) {
	return name.trim().toUpperCase();
}

export function UserCard() {
	return <div>{formatUserName("John")}</div>;
}
```

Prefer:

```ts
// utils.ts
export function formatUserName(name: string) {
	return name.trim().toUpperCase();
}
```

```tsx
// UserCard.tsx
import { formatUserName } from "./utils";

export function UserCard() {
	return <div>{formatUserName("John")}</div>;
}
```

If importing through `@/` is possible without circular dependency, use the barrel import instead of a relative import.

### Constants

Move constants to `constants.ts`.

Avoid:

```tsx
const PAGE_SIZE = 20;

export function UsersPage() {
	// ...
}
```

Prefer:

```ts
// constants.ts
export const PAGE_SIZE = 20;
```

### Types and Interfaces

Move component types and interfaces to `types/client/`.

Avoid:

```tsx
interface FiltersProps {
	value: string;
}
```

Prefer:

```ts
// types/client/features/geo/cities.ts
export interface FiltersProps {
	value: string;
}
```

### Schemas

Move schemas to `schemas/client/`.

Avoid:

```tsx
const formSchema = z.object({
	name: z.string(),
});
```

Prefer:

```ts
// schemas/client/features/geo/cities.ts
export const cityFormSchema = z.object({
	name: z.string(),
});
```

### Maximum File Size

Every `.tsx` file in `components/` and `features/` must have a maximum of 500 lines.

If a component exceeds 500 lines, split it into smaller components.

Splitting is required even when the smaller components are only used by that specific file.

### Splitting Large Feature Files

When a new `.tsx` file must be created only to reduce file size under 500 lines, place the new component under a local `components/` folder within that feature path.

Example current structure:

```txt
features/geo/cities/
  CitiesPage.tsx
  CitiesFilters.tsx
  CitiesFiltersDrawer.tsx
  CitiesRowsActions.tsx
```

Refactored structure:

```txt
features/geo/cities/
  CitiesPage.tsx
  city/
    CityPage.tsx
  components/
    Filters.tsx
    FiltersDrawer.tsx
    RowsActions.tsx
```

Note the names were shortened because they are already scoped by their folder.

Use:

```txt
Filters.tsx
```

Instead of:

```txt
CitiesFilters.tsx
```

Use:

```txt
RowsActions.tsx
```

Instead of:

```txt
CitiesRowsActions.tsx
```

### TSX File Naming Rule

The name of a `.tsx` file must match the name of the component it exports.

Example:

```txt
UserCard.tsx
```

Should export:

```tsx
export function UserCard() {
	// ...
}
```

Avoid:

```txt
Card.tsx
```

Exporting:

```tsx
export function UserCard() {
	// ...
}
```

Exception:

```txt
utils.tsx
```

This file may export JSX helpers or JSX-returning utility functions when required.

### Feature Placement Rule

A feature `.tsx` file should be defined where it is used.

If a feature `.tsx` file is used in more than one feature path, promote it to a composite component under:

```txt
components/composite/
```

Example:

If a component is used by both:

```txt
features/academics/
features/identity/
```

It should be moved to:

```txt
components/composite/features/
```

### Composite Components

The `components/composite/` structure should reflect where the components are used.

Example:

```txt
components/composite/features/
```

For components shared across multiple feature paths.

If a composite component is shared across a more specific scope, place it at the lowest matching composite path.

### No Shared Folder Under Features

There must not be a `shared/` folder under:

```txt
features/
```

Any component currently inside `features/shared/` must be evaluated and moved.

Most likely destinations:

```txt
components/composite/
components/composite/features/
```

Small feature-specific differences should be handled at the feature component declaration level through props, composition, or configuration.

Do not keep shared reusable components inside `features/`.

### Features Root Index Rule

The `features/` folder is an exception to the general export rule.

It should have a single root-level `index.ts` file.

That file should export only the `.tsx` files that are used directly by `app/`.

Example:

```txt
features/
  index.ts
  academic/
    AcademicPage.tsx
    components/
      AcademicFilters.tsx
```

Allowed root export:

```ts
export * from "./academic/AcademicPage";
```

Do not export internal composition components from the root `features/index.ts`.

Do not expose feature-local components outside their level.

If an internal feature component needs to be consumed outside its feature scope, promote it to a composite component under `components/composite/`.

---

## 7. App Folder

### Applies To

```txt
app/
```

### Required Rule

The `app/` folder is mostly acceptable in its current structure.

Do not perform unnecessary restructuring in `app/`.

Only enforce the general rules that apply to it:

- use `@/` imports where possible;
- avoid relative imports unless strictly necessary;
- use the highest available import path;
- move reusable utilities to the appropriate `utils.ts`;
- move constants to the appropriate `constants.ts`;
- move client types to `types/client/`;
- move client schemas to `schemas/client/`;
- extract repeated React patterns used by three or more components into hooks, contexts, or stores when appropriate.

Do not force every `app/` subfolder to have an `index.ts`.

The export rule does not apply to `app/`.

---

## 8. Root Folder Responsibilities

### api/

Responsibilities:

- API clients;
- API modules;
- API request helpers;
- API resource groupings;
- API-related composition that is not schema/type definition.

Required actions:

- enforce `@/` barrel imports;
- export through `index.ts` at every folder level;
- move reusable constants to local `constants.ts` or root `constants/`;
- move reusable utilities to local `utils.ts` or root `utils/`;
- do not define client types here;
- do not modify `types/api/` or `schemas/api/`;
- if API contract types or schemas already exist under `types/api/` or `schemas/api/`, leave them unchanged;
- if a new client-only type is found here, move it to `types/client/api/...`;
- if a new client-only schema is found here, move it to `schemas/client/api/...`.

### app/

Responsibilities:

- application routing;
- route layouts;
- route pages;
- framework-specific app structure.

Required actions:

- preserve the current structure unless a rule requires a change;
- enforce `@/` imports;
- avoid unnecessary export barrels;
- move route-specific utilities/constants to the lowest local scope;
- move shared utilities/constants to root `utils/` or `constants/`;
- move types/interfaces to `types/client/app/...`;
- move schemas to `schemas/client/app/...`;
- extract repeated React logic used by three or more components.

### auth/

Responsibilities:

- authentication helpers;
- authentication flows;
- authentication services;
- auth-specific constants and utilities.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- move auth-only utilities to the lowest local `utils.ts`;
- move auth-only constants to the lowest local `constants.ts`;
- move cross-root utilities/constants to root `utils/` or `constants/`;
- move auth client types to `types/client/auth/...`;
- move auth client schemas to `schemas/client/auth/...`.

### components/

Responsibilities:

- reusable UI components;
- base components;
- composite components;
- components shared across multiple root or feature scopes.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- keep `.tsx` files focused on component declarations only;
- move auxiliary methods to `utils.ts`;
- move constants to `constants.ts`;
- move types/interfaces to `types/client/components/...`;
- move schemas to `schemas/client/components/...`;
- keep every `.tsx` file under 500 lines;
- ensure `.tsx` filenames match exported component names;
- organize shared feature components under `components/composite/`;
- update `components/composite/` structure based on where components are used.

### constants/

Responsibilities:

- constants shared by two or more root folders.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- keep only constants that are actually shared across multiple root folders;
- move root-specific constants back down to their lowest necessary local `constants.ts`.

### contexts/

Responsibilities:

- React contexts;
- context providers;
- context consumers;
- context-specific hooks only when tightly coupled to the context.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- organize contexts by highest used path;
- move context types to `types/client/contexts/...` or the matching consumer scope;
- move context schemas to `schemas/client/contexts/...` if applicable;
- avoid defining unrelated utilities/constants inside context files.

### features/

Responsibilities:

- feature pages;
- feature-level components;
- feature-specific composition;
- route-facing feature exports consumed by `app/`.

Required actions:

- enforce `@/` imports;
- maintain only one root-level `features/index.ts`;
- export from `features/index.ts` only `.tsx` files consumed directly by `app/`;
- do not add `index.ts` files in every feature subfolder unless already required by the project and not conflicting with this rule;
- keep feature-local implementation files private to their folder;
- remove any `features/shared/` folder;
- promote shared feature components to `components/composite/`;
- move utilities to local `utils.ts`;
- move constants to local `constants.ts`;
- move types/interfaces to `types/client/features/...`;
- move schemas to `schemas/client/features/...`;
- keep `.tsx` files under 500 lines;
- ensure `.tsx` filenames match component names;
- split large files into local `components/` folders when needed;
- promote cross-feature components to `components/composite/features/...`.

### hooks/

Responsibilities:

- reusable custom React hooks.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- organize hooks by highest used path;
- place feature-wide hooks under `hooks/features/`;
- place feature-specific hooks under paths like `hooks/features/academic/`;
- move hook types to `types/client/hooks/...` or the matching consumer scope;
- move hook schemas to `schemas/client/hooks/...` if applicable;
- avoid keeping hooks beside components if they are reused by three or more components.

### i18n/

Responsibilities:

- localization setup;
- translation helpers;
- locale resources;
- i18n configuration.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- move i18n-only utilities to local `utils.ts`;
- move i18n-only constants to local `constants.ts`;
- move cross-root constants to root `constants/`;
- move cross-root utilities to root `utils/`;
- move client types to `types/client/i18n/...`;
- move schemas to `schemas/client/i18n/...` if applicable.

### schemas/

Responsibilities:

- centralized schema definitions.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- do not modify `schemas/api/`;
- apply refactoring only to `schemas/client/`;
- ensure `schemas/client/` mirrors the scope where schemas are used;
- place schemas used by two or more root folders in `schemas/client/global.ts`;
- remove schemas from feature/component/app files and place them here.

### store/

Responsibilities:

- shared state stores;
- state management modules.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- organize stores by highest used path;
- move store types to `types/client/store/...` or the matching consumer scope;
- move schemas to `schemas/client/store/...` if applicable;
- extract repeated state patterns used by three or more components into stores when appropriate.

### types/

Responsibilities:

- centralized type and interface definitions.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- do not modify `types/api/`;
- apply refactoring only to `types/client/`;
- ensure `types/client/` mirrors the scope where types/interfaces are used;
- place types/interfaces used by two or more root folders in `types/client/global.ts`;
- remove types/interfaces from feature/component/app files and place them here.

### utils/

Responsibilities:

- utility methods shared by two or more root folders.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- keep only utilities that are actually shared across multiple root folders;
- move root-specific utilities back down to their lowest necessary local `utils.ts`;
- use `utils.tsx` only when JSX is required.

---

## 9. Refactoring Procedure for the Codex Agent

Follow this procedure carefully.

### Step 1: Inspect the Target Folders

Inspect each target root folder:

```txt
api/
app/
auth/
components/
constants/
contexts/
features/
hooks/
i18n/
schemas/
store/
types/
utils/
```

Identify:

- relative imports;
- deep `@/` imports that can be replaced by higher barrel imports;
- missing `index.ts` files;
- reusable utilities declared in the wrong place;
- constants declared in the wrong place;
- types and interfaces declared outside `types/client/`;
- schemas declared outside `schemas/client/`;
- `.tsx` files with auxiliary methods, constants, types, interfaces, or schemas;
- `.tsx` files over 500 lines;
- shared feature components;
- `features/shared/`;
- repeated React logic used by three or more components;
- hooks, contexts, and stores placed too high or too low.

### Step 2: Protect Frozen API Type and Schema Folders

Before making changes, explicitly exclude:

```txt
types/api/
schemas/api/
```

Do not edit these folders.

Do not reformat these folders.

Do not update imports in these folders unless absolutely required by a build failure and explicitly justified with a block comment.

### Step 3: Normalize Exports

For every folder where the export rule applies, ensure an `index.ts` file exists.

Each `index.ts` should export sibling files and folders.

Use:

```ts
export * from "./sibling";
```

Do not export private implementation files unless they must be consumed from outside the folder.

Special handling:

- `features/` should only have a single root-level `index.ts`;
- `features/index.ts` should export only `.tsx` files used directly by `app/`;
- `app/` does not need index files.

### Step 4: Normalize Imports

Replace relative imports with `@/` barrel imports wherever possible.

Replace deep imports with the highest available barrel path.

When a lower-level member is needed from an imported object, destructure after importing.

Example:

```ts
import { users } from "@/api";

const { list, search, get, getMe, userKeys } = users;
```

If a relative import must remain, add a block comment explaining why.

### Step 5: Move Utilities and Constants

For every utility method:

1. Determine all usages.
2. Find the lowest common folder containing all usages.
3. Move the utility to `utils.ts` in that folder.
4. If usages span multiple root folders, move it to root `utils/`.
5. Update imports.

For every constant:

1. Determine all usages.
2. Find the lowest common folder containing all usages.
3. Move the constant to `constants.ts` in that folder.
4. If usages span multiple root folders, move it to root `constants/`.
5. Update imports.

If a utility needs JSX, use `utils.tsx`.

### Step 6: Move Types, Interfaces, and Schemas

For every type or interface outside `types/client/`:

1. Determine its usage scope.
2. Move it to the matching path under `types/client/`.
3. If used by two or more root folders, move it to `types/client/global.ts`.
4. Update imports with `import type` where appropriate.

For every schema outside `schemas/client/`:

1. Determine its usage scope.
2. Move it to the matching path under `schemas/client/`.
3. If used by two or more root folders, move it to `schemas/client/global.ts`.
4. Update imports.

Do not modify:

```txt
types/api/
schemas/api/
```

### Step 7: Refactor TSX Files

For each `.tsx` file in `components/` and `features/`:

1. Ensure the file only declares component logic.
2. Move utilities to `utils.ts`.
3. Move constants to `constants.ts`.
4. Move types/interfaces to `types/client/`.
5. Move schemas to `schemas/client/`.
6. Check the file line count.
7. If it exceeds 500 lines, split it into smaller components.
8. Ensure the filename matches the exported component name.

When splitting feature files only to reduce size, create local components under:

```txt
features/<path>/components/
```

### Step 8: Remove Feature Shared Folder

If `features/shared/` exists:

1. Inspect every file inside it.
2. Determine where each component is used.
3. Move shared components to the appropriate path under `components/composite/`.
4. Handle small feature differences via props or feature-level composition.
5. Update imports.
6. Remove `features/shared/` when empty.

### Step 9: Promote Cross-Feature Components

If a feature `.tsx` component is used by more than one feature path, move it to:

```txt
components/composite/
```

Use a path that reflects its usage scope.

Example:

```txt
components/composite/features/
```

Update imports to consume it from the highest available barrel path.

### Step 10: Extract Repeated React Patterns

For any repeated React pattern used by three or more components:

1. Determine whether the pattern should become a hook, context, or store.
2. Place it at the highest used path under:
   - `hooks/`
   - `contexts/`
   - `store/`

3. Move associated types to `types/client/`.
4. Move associated schemas to `schemas/client/`.
5. Move associated constants/utilities to the correct local or root location.
6. Update imports.

Do not over-abstract trivial logic.

### Step 11: Validate Naming

Ensure:

- `.tsx` filenames match exported component names;
- `utils.tsx` is only used for JSX utilities;
- constants are in `constants.ts`;
- utilities are in `utils.ts`;
- types/interfaces are in `types/client/`;
- schemas are in `schemas/client/`;
- root shared constants are in `constants/`;
- root shared utilities are in `utils/`.

### Step 12: Run Validation

After refactoring, run the project validation commands available in the repository.

Prefer the existing package manager and scripts.

Check, in this order when available:

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

Or the equivalent commands for the project package manager.

If the project uses `pnpm`, use `pnpm`.

If the project uses `yarn`, use `yarn`.

If the project uses `bun`, use `bun`.

Do not invent scripts that do not exist.

Inspect `package.json` before choosing commands.

### Step 13: Fix Regressions

Fix all regressions caused by the refactor.

Prioritize:

1. TypeScript errors;
2. broken imports;
3. circular dependencies;
4. lint errors;
5. test failures;
6. build failures.

If a rule must be violated to fix a regression, add the required explanatory block comment.

---

## 10. Acceptance Criteria

The refactor is complete when all of the following are true:

- all target folders have been inspected;
- imports use `@/` barrels wherever possible;
- imports use the highest available path;
- unavoidable relative imports have explanatory `/* */` comments;
- every required folder has an `index.ts`;
- folders under `features/` do not receive unnecessary local index files;
- `features/index.ts` exports only `.tsx` files used directly by `app/`;
- utilities are placed in the correct `utils.ts`, `utils.tsx`, or root `utils/` location;
- constants are placed in the correct `constants.ts` or root `constants/` location;
- types and interfaces are under `types/client/`;
- schemas are under `schemas/client/`;
- `types/api/` is unchanged;
- `schemas/api/` is unchanged;
- `.tsx` files in `components/` and `features/` only declare components;
- `.tsx` files in `components/` and `features/` are under 500 lines;
- `.tsx` filenames match their exported component names;
- shared feature components are promoted to `components/composite/`;
- there is no `features/shared/` folder;
- repeated React patterns used by three or more components have been evaluated for hooks, contexts, or stores;
- hooks, contexts, and stores are placed at the highest used path and no higher;
- validation commands pass or remaining failures are documented as unrelated pre-existing issues.

---

## 11. Important Constraints

Do not make broad unrelated formatting changes.

Do not rename public APIs unless necessary.

Do not modify generated files unless required.

Do not modify:

```txt
types/api/
schemas/api/
```

Do not move code higher than necessary.

Do not create abstractions only for theoretical reuse.

Do not expose feature-local composition components from `features/index.ts`.

Do not keep reusable components in `features/shared/`.

Do not leave unexplained rule violations.

Do not use `//` comments for rule exceptions.

Do not silently ignore files that cannot be refactored.

When uncertain, prefer the lowest valid scope and add a clear comment only when a rule cannot be enforced.

---

## 12. Expected Final Report

After completing the refactor, provide a concise final report containing:

1. Summary of structural changes.
2. Import/export normalization performed.
3. Utilities/constants moved.
4. Types/interfaces/schemas moved.
5. Components/features split or promoted.
6. Hooks/contexts/stores extracted or reorganized.
7. Any rule exceptions and their justification.
8. Validation commands executed and their results.
9. Any remaining issues or recommended follow-up work.

Do not include massive diffs in the final report unless specifically requested.

---
