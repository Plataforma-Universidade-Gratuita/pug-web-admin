# Refactoring Internal Coherence

## Objective

Refactor the codebase to improve internal coherence, consistency, maintainability, and discoverability across the main project root folders.

The refactor must enforce consistent import/export patterns, proper placement of utilities, constants, types, interfaces, schemas, hooks, contexts, stores, components, and feature files.

The final goal is to make the project structure predictable:

- imports should come from the highest available barrel path;
- exports should be centralized through `index.ts`;
- utilities and constants should live at the lowest common scope where they are needed;
- types, interfaces, and schemas should live under the proper centralized folders;
- React-specific repeated patterns should be abstracted into hooks, contexts, or stores when appropriate;
- component and feature files should remain focused, small, and free from unrelated declarations.

## Target Root Folders

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

## Global Enforcement Rule

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

# 1. Imports

## Applies To

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

## Required Rule

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

## Highest Importable Path Rule

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

## Destructuring Rule

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

## Relative Import Exception

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

# 2. Exports

## Applies To

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

## Required Rule

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

## Export Visibility

Only export what is meant to be consumed outside the folder.

Private implementation details should not be exported unless they are required by other folders.

If something cannot be exported through an `index.ts` due to a circular dependency or architectural limitation, add an explanatory block comment above the declaration or import that requires the exception.

---

# 3. Utilities and Constants

## Applies To

Apply this rule to every target root folder except:

```txt
utils/
constants/
```

The folders `utils/` and `constants/` are part of the rule and serve as the root-level shared locations.

## Required Rule

Utility methods must be defined in files named:

```txt
utils.ts
```

Constants must be defined in files named:

```txt
constants.ts
```

Do not define reusable utilities or constants inside component files, feature files, hooks, contexts, stores, or arbitrary implementation files.

## Lowest Necessary Declaration Rule

Utilities and constants must live at the lowest common scope where all consumers can access them.

Use this decision process:

1. If only one file uses a utility or constant, place it beside that file.
2. If multiple files in the same folder use it, place it in that folder.
3. If files in multiple child folders under the same parent use it, place it in the parent folder.
4. If files from two or more root folders use it, place it under the root-level `utils/` or `constants/` folder.

## Example Structure

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

## Cross-Root Utilities

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

## Cross-Root Constants

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

## TSX Utility Exception

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

# 4. Types, Interfaces, and Schemas

## Applies To

Apply this rule to every target root folder except:

```txt
types/
schemas/
```

The folders `types/` and `schemas/` are part of the rule and serve as the centralized locations.

## Required Rule

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

## API vs Client Split

Both `types/` and `schemas/` are divided into:

```txt
types/api/
types/client/

schemas/api/
schemas/client/
```

## API Folders Are Frozen

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

## Client Path Matching Rule

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

## Lowest Used Pattern

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

## Global Client Types

If a type or interface is used by two or more root folders, define it in:

```txt
types/client/global.ts
```

If a schema is used by two or more root folders, define it in:

```txt
schemas/client/global.ts
```

## Component Props

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

# 5. Hooks, Contexts, and Stores

## Applies To

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

## Required Rule

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

## Extraction Criteria

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

## Highest Used Path Rule

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

## Examples

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

## Export Requirements

The `hooks/`, `contexts/`, and `store/` folders must follow the export rules.

Every folder must contain an `index.ts` file exporting sibling files and folders.

---

# 6. Components and Features

## Applies To

Apply this rule specifically to:

```txt
components/
features/
```

## Component File Responsibility

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

## Auxiliary Methods

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

## Constants

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

## Types and Interfaces

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

## Schemas

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

## Maximum File Size

Every `.tsx` file in `components/` and `features/` must have a maximum of 500 lines.

If a component exceeds 500 lines, split it into smaller components.

Splitting is required even when the smaller components are only used by that specific file.

## Splitting Large Feature Files

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

## TSX File Naming Rule

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

## Feature Placement Rule

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

## Composite Components

The `components/composite/` structure should reflect where the components are used.

Example:

```txt
components/composite/features/
```

For components shared across multiple feature paths.

If a composite component is shared across a more specific scope, place it at the lowest matching composite path.

## No Shared Folder Under Features

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

## Features Root Index Rule

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

# 7. App Folder

## Applies To

```txt
app/
```

## Required Rule

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

# 8. Root Folder Responsibilities

## api/

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

## app/

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

## auth/

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

## components/

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

## constants/

Responsibilities:

- constants shared by two or more root folders.

Required actions:

- enforce `@/` imports;
- ensure every folder has an `index.ts`;
- export sibling files/folders through index files;
- keep only constants that are actually shared across multiple root folders;
- move root-specific constants back down to their lowest necessary local `constants.ts`.

## contexts/

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

## features/

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

## hooks/

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

## i18n/

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

## schemas/

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

## store/

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

## types/

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

## utils/

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

# 9. Refactoring Procedure for the Codex Agent

Follow this procedure carefully.

## Step 1: Inspect the Target Folders

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

## Step 2: Protect Frozen API Type and Schema Folders

Before making changes, explicitly exclude:

```txt
types/api/
schemas/api/
```

Do not edit these folders.

Do not reformat these folders.

Do not update imports in these folders unless absolutely required by a build failure and explicitly justified with a block comment.

## Step 3: Normalize Exports

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

## Step 4: Normalize Imports

Replace relative imports with `@/` barrel imports wherever possible.

Replace deep imports with the highest available barrel path.

When a lower-level member is needed from an imported object, destructure after importing.

Example:

```ts
import { users } from "@/api";

const { list, search, get, getMe, userKeys } = users;
```

If a relative import must remain, add a block comment explaining why.

## Step 5: Move Utilities and Constants

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

## Step 6: Move Types, Interfaces, and Schemas

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

## Step 7: Refactor TSX Files

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

## Step 8: Remove Feature Shared Folder

If `features/shared/` exists:

1. Inspect every file inside it.
2. Determine where each component is used.
3. Move shared components to the appropriate path under `components/composite/`.
4. Handle small feature differences via props or feature-level composition.
5. Update imports.
6. Remove `features/shared/` when empty.

## Step 9: Promote Cross-Feature Components

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

## Step 10: Extract Repeated React Patterns

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

## Step 11: Validate Naming

Ensure:

- `.tsx` filenames match exported component names;
- `utils.tsx` is only used for JSX utilities;
- constants are in `constants.ts`;
- utilities are in `utils.ts`;
- types/interfaces are in `types/client/`;
- schemas are in `schemas/client/`;
- root shared constants are in `constants/`;
- root shared utilities are in `utils/`.

## Step 12: Run Validation

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

## Step 13: Fix Regressions

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

# 10. Acceptance Criteria

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

# 11. Important Constraints

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

# 12. Expected Final Report

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
