# PUG Web Admin Context

## Core rules

- Use `@/` for internal imports.
- Keep raw constant values under `constants/`.
- Keep types and interfaces under `types/`.
- Keep Zod schemas under `schemas/`.
- Keep React provider contexts under `contexts/`.
- Keep reusable component helper functions in `components/utils.ts`.

## Component structure

- Primitives live in `components/` and are grouped by context:
  - `actions`
  - `display`
  - `forms`
  - `navigation`
  - `overlays`
  - `structure`
- Public primitive exports go through `components/index.ts`.
- When adding a primitive, keep the same folder pattern already used by the other components.

## Styling system

- Standardize styling under `app/styles/`.
- Reusable component styling belongs in `app/styles/utilities/*.css`.
- Components should consume utility classes instead of carrying long visual class contracts inline.
- Toasts are the special case: keep their Sonner-specific styling in the dedicated toast utility file and wrapper component.
- App-shell specific styling belongs in `app/styles/utilities/app-shell.css`.
- The three surface levels should be used to communicate depth: darker surfaces stay farther back, lighter surfaces come closer to the user.
- Default to separating first-layer and second-layer content with surface contrast rather than leaving everything on the same plane.
- Sections do not always need their own contrasting surface, but cards should at least contrast against their immediate background.
- The third surface level is optional and should be used only when another visible step in depth actually helps.
- Use shadows to reinforce depth or draw attention when something should feel closer to the user.
- Shadows are commonly appropriate as a default supporting cue, but they are not mandatory on every surface and should not be applied mechanically.

## Data and validation

- API-layer schemas stay under `schemas/api`.
- Client-only schemas stay under `schemas/client`.
- UI and app types stay under `types/client`.
- API route bases are centralized in `constants/api.ts`.

## Primitive conventions

- Support disabled visuals and logic whenever the primitive exposes `disabled`.
- Prefer controlled/uncontrolled APIs that mirror Radix or native behavior cleanly.
- Keep helper logic out of component files when it is reusable or non-trivial.
- Keep public primitive APIs exported from the shared barrels.

## Docs conventions

- Every primitive should have a matching docs particle under `features/docs/particles`.
- New primitives should be exported from `features/docs/index.ts` and rendered on the docs page.
- Particles should demonstrate meaningful states, including disabled variants when relevant.

## Page patterns

- The default application page grammar is `Section Stack`.
- `Section Stack` means: centered app shell, optional breadcrumb, one clear page header with title/description/actions, then stacked `Section` surfaces below it.
- Use `Section Stack` for module home pages, dashboards, calmer overview pages, and lighter reference collections such as `schools`, `courses`, `admins`, and `cities`.
- Use `Operations Workspace` for collection pages with frequent search, filters, triage, status changes, and queue-like behavior.
- Preferred `Operations Workspace` targets include `students`, `projects`, `enrollments`, `attendances`, and `staff`. `partner entities` can use it too if the page becomes operationally dense.
- Use `Split Detail` for important single-record pages that need persistent context while the user reads or edits related information.
- Preferred `Split Detail` targets include `student/:id`, `project/:id`, and `partner-entity/:id`. `school/:id` should only use it if the page grows beyond simple reference detail.
- Do not force every heavy workflow into overlays while keeping all pages as `Section Stack`. Some records deserve full detail pages.
- Overlays support pages; they do not replace page architecture.
- Use `Popover` for filters, row actions, and tiny decisions.
- Use `Modal` for confirmations and short one-shot actions.
- Use `Drawer` for subordinate create, edit, approve, or review flows that belong to the current page context.
- Prefer shared route-level breadcrumbs owned by the app shell when the path can be derived from routing.
- Only fall back to page-specific breadcrumb assembly when labels depend on runtime entity data or page-only context.
- Recommended rule set:
  - Default to `Section Stack`.
  - Use `Operations Workspace` for operational collection screens.
  - Use `Split Detail` for major single-record pages.
  - Use overlays for mutations and supporting flows, not as a replacement for real record pages.

## Current patterns to preserve

- `sonner` is wrapped by the local toast primitive instead of being used directly in feature code.
- `Select` context is centralized in `contexts/select.tsx`.
- Login/auth page visuals use the shared app-shell utility classes.
- Navbar and sidebar visuals should keep using the shared shell utility classes instead of ad hoc inline styling.

## When extending the project

- Reuse existing utility classes before introducing new one-off class strings.
- If a new visual pattern repeats, promote it into `app/styles/utilities`.
- If a new static config appears, move it into `constants/` instead of leaving it in a feature or component file.
- If a new schema or type appears outside its folder, move it before building on top of it.
